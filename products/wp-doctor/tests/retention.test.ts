import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { fixture, validRequest } from "./helpers";
import {
  applyRetention,
  eraseLead,
  retentionPreview,
} from "../packages/core/retention";
describe("Conservación y supresión", () => {
  let f: Awaited<ReturnType<typeof fixture>>;
  beforeAll(async () => {
    f = await fixture();
  });
  afterAll(async () => {
    await f.mf.dispose();
  });
  const create = async () =>
    (
      (await (
        await f.publicRequest("/api/v1/requests", validRequest())
      ).json()) as { request_id: string }
    ).request_id;
  it("exige owner y confirmación exacta; elimina datos vinculados sin dejar contacto en auditoría", async () => {
    const id = await create();
    const req = (value: string) =>
      new Request("https://admin.example.com/erase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm_id: value }),
      });
    await expect(
      eraseLead(req(id), f.env, { id: "commercial", role: "commercial" }, id),
    ).rejects.toMatchObject({ status: 403 });
    await expect(
      eraseLead(req("wrong"), f.env, { id: "owner", role: "owner" }, id),
    ).rejects.toMatchObject({ status: 422 });
    expect(
      (await eraseLead(req(id), f.env, { id: "owner", role: "owner" }, id))
        .status,
    ).toBe(200);
    expect(
      await f.db.prepare("SELECT id FROM leads WHERE id=?").bind(id).first(),
    ).toBeNull();
    expect(
      await f.db
        .prepare("SELECT lead_id FROM lead_consents WHERE lead_id=?")
        .bind(id)
        .first(),
    ).toBeNull();
    const log = await f.db
      .prepare(
        "SELECT metadata_json FROM audit_log WHERE action='privacy.erased'",
      )
      .first<{ metadata_json: string }>();
    expect(log!.metadata_json).not.toContain(id);
    expect(log!.metadata_json).not.toContain("gmail");
  });
  it("limpieza apagada por defecto; respeta contratos y casos recientes", async () => {
    const old = await create();
    const contracted = await create();
    const recent = await create();
    const ago = new Date(Date.now() - 100 * 86400000).toISOString();
    await f.db
      .prepare("UPDATE leads SET updated_at=? WHERE id IN (?,?)")
      .bind(ago, old, contracted)
      .run();
    await f.db
      .prepare("UPDATE leads SET commercial_status='ganado' WHERE id=?")
      .bind(contracted)
      .run();
    expect(
      (
        (await (await retentionPreview(f.env)).json()) as {
          inactive_uncontracted_leads: number;
        }
      ).inactive_uncontracted_leads,
    ).toBe(1);
    await applyRetention(f.env);
    expect(
      await f.db.prepare("SELECT id FROM leads WHERE id=?").bind(old).first(),
    ).not.toBeNull();
    await applyRetention({
      ...f.env,
      ENVIRONMENT: "production",
      RETENTION_ENABLED: "true",
      LEGAL_APPROVED: "true",
    });
    expect(
      await f.db.prepare("SELECT id FROM leads WHERE id=?").bind(old).first(),
    ).toBeNull();
    expect(
      await f.db
        .prepare("SELECT id FROM leads WHERE id=?")
        .bind(contracted)
        .first(),
    ).not.toBeNull();
    expect(
      await f.db
        .prepare("SELECT id FROM leads WHERE id=?")
        .bind(recent)
        .first(),
    ).not.toBeNull();
    await expect(
      eraseLead(
        new Request("https://admin.example.com/erase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirm_id: contracted }),
        }),
        f.env,
        { id: "owner", role: "owner" },
        contracted,
      ),
    ).rejects.toMatchObject({ status: 409 });
  });
});
