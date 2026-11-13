import { WorkerEntrypoint } from "cloudflare:workers";
import { sessions, type BrowserWorker } from "@cloudflare/playwright";
import type { DurableObjectNamespace } from "@cloudflare/workers-types";
import { z } from "zod";
import { RunnerLease } from "./lease";
export { RunnerLease };
export interface AdmissionEnv {
  GATE: DurableObjectNamespace<RunnerLease>;
  BROWSER: BrowserWorker;
}
export class Admission extends WorkerEntrypoint<AdmissionEnv> {
  private gate() {
    return this.env.GATE.get(this.env.GATE.idFromName("global-browser-runner"));
  }
  async claim(job_id: string) {
    return this.gate().claim(z.uuid().parse(job_id));
  }
  async release(token: string) {
    return this.gate().release(z.uuid().parse(token));
  }
  async reconcile() {
    const old = await this.gate().stale();
    if (!old) return { released: false };
    // Never expire a lease blindly: an interrupted invocation may leave a session.
    if ((await sessions(this.env.BROWSER)).length) return { released: false };
    return { released: await this.gate().release(old.token) };
  }
  async status() {
    return this.gate().status();
  }
}
export default {
  fetch() {
    return new Response("Not found", { status: 404 });
  },
};
