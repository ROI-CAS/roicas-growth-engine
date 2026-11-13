import { DurableObject } from "cloudflare:workers";
type Lease = { token: string; job_id: string; claimed_at: number };
export class RunnerLease extends DurableObject {
  async claim(job_id: string): Promise<Lease | null> {
    return this.ctx.storage.transaction(async (tx) => {
      if (await tx.get("lease")) return null;
      const lease = {
        token: crypto.randomUUID(),
        job_id,
        claimed_at: Date.now(),
      };
      await tx.put("lease", lease);
      return lease;
    });
  }
  async release(token: string): Promise<boolean> {
    return this.ctx.storage.transaction(async (tx) => {
      const existing = await tx.get<Lease>("lease");
      if (existing?.token !== token) return false;
      await tx.delete("lease");
      return true;
    });
  }
  async stale(): Promise<Lease | null> {
    const lease = await this.ctx.storage.get<Lease>("lease");
    return lease && lease.claimed_at < Date.now() - 240000 ? lease : null;
  }
  async status() {
    const lease = await this.ctx.storage.get<Lease>("lease");
    return {
      busy: !!lease,
      retry_after_ms: lease
        ? Math.max(0, 240001 - (Date.now() - lease.claimed_at))
        : 0,
    };
  }
}
