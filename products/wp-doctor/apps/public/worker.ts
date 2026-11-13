import { createHandler } from "../../packages/core/service";
import type { Env } from "../../packages/core/env";
import type { ScheduledController } from "@cloudflare/workers-types";
import { processDiagnostics } from "../../packages/core/diagnosis";
import { applyRetention } from "../../packages/core/retention";
export default {
  fetch: createHandler("public"),
  async scheduled(_event: ScheduledController, env: Env): Promise<void> {
    if (env.ENVIRONMENT === "preview" || !env.DB) return;
    await env.DB.prepare("DELETE FROM rate_limits WHERE expires_at < ?")
      .bind(Math.floor(Date.now() / 1000))
      .run();
    await processDiagnostics(env);
    await applyRetention(env);
  },
};
