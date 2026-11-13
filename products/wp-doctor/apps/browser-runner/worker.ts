import { WorkerEntrypoint } from "cloudflare:workers";
import { launch, type BrowserWorker } from "@cloudflare/playwright";
import {
  approvedHosts,
  PolicyError,
  resolvePublicDns,
  runnerInput,
  targetHomepage,
} from "../../packages/runner/policy";
import { executeBrowser } from "../../packages/runner/execute";
export interface BrowserRunnerEnv {
  BROWSER: BrowserWorker;
  ADMISSION: {
    claim(job_id: string): Promise<{ token: string } | null>;
    release(token: string): Promise<boolean>;
  };
  RUNNER_MODE: string;
  RUNNER_APPROVED_HOSTS: string;
}
export class BrowserRunner extends WorkerEntrypoint<BrowserRunnerEnv> {
  async run(input: unknown) {
    const parsed = runnerInput.safeParse(input);
    if (!parsed.success)
      return { status: "rejected", reason: "invalid_contract" } as const;
    // This release is a laboratory runner. It cannot enable arbitrary public scans.
    if (this.env.RUNNER_MODE !== "laboratory")
      return { status: "rejected", reason: "security_release_gate" } as const;
    let target: string;
    try {
      target = targetHomepage(
        parsed.data.target,
        approvedHosts(this.env.RUNNER_APPROVED_HOSTS),
      );
    } catch {
      return { status: "rejected", reason: "target_not_approved" } as const;
    }
    const lease = await this.env.ADMISSION.claim(parsed.data.job_id);
    if (!lease) return { status: "rejected", reason: "runner_busy" } as const;
    let launchAttempted = false,
      browserClosed = false;
    try {
      const result = await executeBrowser(
        target,
        resolvePublicDns,
        async (hostname) => {
          launchAttempted = true;
          return launch(this.env.BROWSER, {
            guardrails: { allowedDomains: [hostname] },
            keep_alive: 10000,
            recording: false,
          });
        },
        async (browser) => {
          // Fixed owned-site negative control, sharing the guarded session.
          // No caller-controlled destination and no additional acquisition.
          const page = await browser.newPage();
          try {
            const response = await page.goto(
              "https://wpdoctor-public-staging.casinmiedo.workers.dev/",
              { waitUntil: "domcontentloaded", timeout: 15000 },
            );
            const headers = response?.headers() ?? {};
            return {
              passed:
                response?.status() === 403 &&
                headers["cf-mitigated"] === "guardrails" &&
                headers["cf-brapi-guardrails-reason"] === "not-in-allowlist",
              status: response?.status(),
              mitigated: headers["cf-mitigated"],
              reason: headers["cf-brapi-guardrails-reason"],
            };
          } finally {
            await page.close();
          }
        },
      );
      browserClosed = result.browser_closed;
      return { ...result, public_launch_eligible: false };
    } catch (error) {
      return {
        status: "failed",
        reason:
          error instanceof PolicyError ? error.code : "runner_unavailable",
        public_launch_eligible: false,
      } as const;
    } finally {
      if (!launchAttempted || browserClosed)
        await this.env.ADMISSION.release(lease.token);
    }
  }
}
export default {
  fetch() {
    return new Response("Not found", { status: 404 });
  },
};
