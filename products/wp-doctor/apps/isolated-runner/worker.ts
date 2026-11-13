import { Container, ContainerProxy } from "@cloudflare/containers";
import { WorkerEntrypoint } from "cloudflare:workers";
import { z } from "zod";
import { normalizeWebsite } from "../../packages/contracts";
import { runnerInput, targetHomepage } from "../../packages/runner/policy";
import { readJson } from "../../packages/core/http";
export { ContainerProxy };

interface IsolatedEnv {
  RENDERERS: DurableObjectNamespace<RendererContainer>;
  EGRESS: DurableObjectNamespace<EgressContainer>;
  RUNNER_MODE: string;
  RUNNER_APPROVED_HOSTS?: string;
}
type Active = { id: string; target: string; token: string; deadline: number };
function capability(): string {
  return [...crypto.getRandomValues(new Uint8Array(32))]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
async function invoke(
  container: Container,
  path: string,
  token: string,
  body: unknown,
): Promise<Response> {
  return container.containerFetch(
    new Request(`http://container${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),
  );
}
export class EgressContainer extends Container<IsolatedEnv> {
  defaultPort = 8080;
  sleepAfter = "2m";
  enableInternet = true;
  async begin(job: Active): Promise<void> {
    const existing = await this.ctx.storage.get<Active>("active");
    if (existing) throw new Error("egress_busy");
    await this.ctx.storage.put("active", job);
    try {
      await this.startAndWaitForPorts({
        startOptions: { envVars: { ROLE: "broker", JOB_TOKEN: job.token } },
        cancellationOptions: { portReadyTimeoutMS: 20000 },
      });
      const response = await invoke(this, "/configure", job.token, {
        job_id: job.id,
        target: job.target,
      });
      if (!response.ok) throw new Error("egress_setup_failed");
    } catch (error) {
      await this.destroy().catch(() => {});
      throw error;
    }
  }
  async resource(id: string, input: unknown): Promise<Response> {
    const job = await this.ctx.storage.get<Active>("active");
    if (!job || job.id !== id || Date.now() > job.deadline)
      return new Response("Expired", { status: 403 });
    return invoke(this, "/fetch", job.token, input);
  }
  async probe(id: string): Promise<unknown> {
    const job = await this.ctx.storage.get<Active>("active");
    if (
      !job ||
      job.id !== id ||
      new URL(job.target).hostname !== "doctor.roicas.com"
    )
      throw new Error("probe_not_allowed");
    const response = await invoke(this, "/network-probe", job.token, {});
    return response.json();
  }
  async finish(id: string): Promise<boolean> {
    const job = await this.ctx.storage.get<Active>("active");
    if (job && job.id !== id) return false;
    await this.destroy();
    const state = await this.getState();
    if (!["stopped", "stopped_with_code"].includes(state.status)) return false;
    await this.ctx.storage.delete("active");
    return true;
  }
  override fetch(): Promise<Response> {
    return Promise.resolve(new Response("Not found", { status: 404 }));
  }
}
export class RendererContainer extends Container<IsolatedEnv> {
  defaultPort = 8080;
  sleepAfter = "2m";
  enableInternet = false;
  allowedHosts = ["egress.wpdoctor.internal"];
  async egress(request: Request): Promise<Response> {
    const job = await this.ctx.storage.get<Active>("active");
    if (
      !job ||
      Date.now() > job.deadline ||
      request.headers.get("Authorization") !== `Bearer ${job.token}` ||
      new URL(request.url).pathname !== "/fetch" ||
      request.method !== "POST"
    )
      return new Response("Denied", { status: 403 });
    const parsed = z
      .object({
        job_id: z.string(),
        url: z.string().max(2048),
        method: z.enum(["GET", "HEAD"]),
      })
      .strict()
      .safeParse(await readJson(request));
    if (!parsed.success || parsed.data.job_id !== job.id)
      return new Response("Denied", { status: 403 });
    return this.env.EGRESS.getByName("global").resource(job.id, parsed.data);
  }
  async run(input: {
    job_id: string;
    target: string;
    security_probe?: boolean;
    fault_test?: boolean;
  }): Promise<unknown> {
    const job: Active = {
      id: input.job_id,
      target: input.target,
      token: capability(),
      deadline: Date.now() + 115000,
    };
    const claimed = await this.ctx.storage.transaction(async (tx) => {
      if (await tx.get("active")) return false;
      await tx.put("active", job);
      return true;
    });
    if (!claimed) return { status: "rejected", reason: "runner_busy" };
    const broker = this.env.EGRESS.getByName("global");
    let result: Record<string, unknown> = {
      status: "failed",
      reason: "isolated_runner_unavailable",
    };
    let rendererClosed = false,
      egressClosed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await broker.begin(job);
      await this.startAndWaitForPorts({
        startOptions: {
          enableInternet: false,
          envVars: {
            ROLE: "renderer",
            JOB_TOKEN: job.token,
            JOB_ID: job.id,
            JOB_TARGET: job.target,
            ...(input.fault_test ? { SECURITY_TEST: "1" } : {}),
          },
        },
        cancellationOptions: { portReadyTimeoutMS: 20000 },
      });
      const response = await Promise.race([
        invoke(this, "/run", job.token, {
          target: job.target,
          security_probe: input.security_probe === true,
          force_crash: input.fault_test === true,
        }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error("job_deadline")),
            Math.max(1, job.deadline - Date.now()),
          );
        }),
      ]);
      if (response.ok)
        result = (await response.json()) as Record<string, unknown>;
      if (input.security_probe === true)
        result.positive_network_probe = await broker.probe(job.id);
    } catch {
      /* Failure remains explicit; no empty clean report. */
    } finally {
      if (timer) clearTimeout(timer);
      try {
        await this.destroy();
        const state = await this.getState();
        rendererClosed = ["stopped", "stopped_with_code"].includes(
          state.status,
        );
      } catch {
        /* Keep lease until verified stop. */
      }
      try {
        egressClosed = await broker.finish(job.id);
      } catch {
        /* Keep lease until verified stop. */
      }
      if (rendererClosed && egressClosed)
        await this.ctx.storage.delete("active");
    }
    return {
      ...result,
      browser_closed: rendererClosed && egressClosed,
      isolation: {
        renderer_internet: false,
        transport: "dns-pinned-tcp",
        renderer_closed: rendererClosed,
        egress_closed: egressClosed,
      },
      public_launch_eligible: false,
    };
  }
  async reconcile(): Promise<boolean> {
    const active = await this.ctx.storage.get<Active>("active");
    if (!active) return true;
    if (Date.now() < active.deadline + 10000) return false;
    await this.destroy();
    const stopped = ["stopped", "stopped_with_code"].includes(
      (await this.getState()).status,
    );
    const brokerStopped = await this.env.EGRESS.getByName("global").finish(
      active.id,
    );
    if (stopped && brokerStopped) await this.ctx.storage.delete("active");
    return stopped && brokerStopped;
  }
  override fetch(): Promise<Response> {
    return Promise.resolve(new Response("Not found", { status: 404 }));
  }
}
RendererContainer.outboundByHost = {
  "egress.wpdoctor.internal": async (request, env: IsolatedEnv, context) =>
    env.RENDERERS.get(env.RENDERERS.idFromString(context.containerId)).egress(
      request,
    ),
};
// No external site, admin, database, email key or WordPress credential is bound here.
export class IsolatedRunner extends WorkerEntrypoint<IsolatedEnv> {
  async faultSuite(): Promise<unknown> {
    if (this.env.RUNNER_MODE !== "isolated-laboratory")
      return { status: "rejected", reason: "security_release_gate" };
    return this.env.RENDERERS.getByName("global").run({
      job_id: crypto.randomUUID(),
      target: "https://doctor.roicas.com/",
      fault_test: true,
    });
  }
  async securitySuite(): Promise<unknown> {
    if (this.env.RUNNER_MODE !== "isolated-laboratory")
      return { status: "rejected", reason: "security_release_gate" };
    return this.env.RENDERERS.getByName("global").run({
      job_id: crypto.randomUUID(),
      target: "https://doctor.roicas.com/",
      security_probe: true,
    });
  }
  async run(input: unknown): Promise<unknown> {
    const parsed = runnerInput.safeParse(input);
    if (!parsed.success)
      return { status: "rejected", reason: "invalid_contract" };
    if (this.env.RUNNER_MODE !== "isolated-laboratory")
      return { status: "rejected", reason: "security_release_gate" };
    let target: string;
    try {
      target = normalizeWebsite(parsed.data.target);
      targetHomepage(
        parsed.data.target,
        JSON.parse(this.env.RUNNER_APPROVED_HOSTS ?? "[]") as string[],
      );
    } catch {
      return { status: "rejected", reason: "target_not_approved" };
    }
    return this.env.RENDERERS.getByName("global").run({
      job_id: parsed.data.job_id,
      target,
    });
  }
  async reconcile(): Promise<boolean> {
    return this.env.RENDERERS.getByName("global").reconcile();
  }
}
export default {
  fetch() {
    return new Response("Not found", { status: 404 });
  },
};
