import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { readFile } from "node:fs/promises";
import { generateKeyPair, exportJWK, createLocalJWKSet, SignJWT } from "jose";
import type { Env } from "../packages/core/env";
import { createHandler } from "../packages/core/service";
import { FORM_VERSION, POLICY_VERSION } from "../packages/contracts";

export async function fixture(
  origin = "https://public.example.com",
  adminOrigin = "https://admin.example.com",
) {
  const mf = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      script: 'export default {fetch(){return new Response("fixture")}}',
      compatibilityDate: "2026-10-15",
      d1Databases: ["DB"],
    }),
  );
  const db = await mf.getD1Database("DB");
  for (const file of [
    "0001_commercial.sql",
    "0002_diagnostics.sql",
    "0003_n8n_dispatch.sql",
    "0004_payments.sql",
    "0005_private_delivery.sql",
  ]) {
    const migration = await readFile(`infra/migrations/${file}`, "utf8");
    for (const statement of migration.split(";").filter((s) => s.trim()))
      await db.prepare(statement).run();
  }
  await db
    .prepare("INSERT INTO users(id,email,role) VALUES (?,?,?)")
    .bind("owner", "owner@example.com", "owner")
    .run();
  await db
    .prepare("INSERT INTO users(id,email,role) VALUES (?,?,?)")
    .bind("tech", "tech@example.com", "technician")
    .run();
  const keys = await generateKeyPair("RS256");
  const jwk = {
    ...(await exportJWK(keys.publicKey)),
    kid: "test-key",
    alg: "RS256",
  };
  const resolver = createLocalJWKSet({ keys: [jwk] });
  const sign = (
    email = "owner@example.com",
    audience = "test-audience",
    expiration = "1h",
  ) =>
    new SignJWT({ email })
      .setProtectedHeader({ alg: "RS256", kid: "test-key" })
      .setIssuer("https://fixture.cloudflareaccess.com")
      .setAudience(audience)
      .setSubject("test-user")
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(keys.privateKey);
  const env: Env = {
    DB: db as unknown as Env["DB"],
    ASSETS: {
      fetch: async (request) => {
        const path = new URL(request.url).pathname;
        if (
          !/^\/assets\/((?:style|landing)\.css|public\/(?:client|payment)\.js|admin\/client\.js|fonts\/(inter-latin|bricolage-grotesque-latin)\.woff2|brand\/(roicas|favicon)\.png|illustrations\/(hero-laptop|servicio-velocidad|servicio-errores|servicio-seguridad|servicio-formularios|diagnostico-informe)(?:-[0-9]+)?\.(png|webp))$/.test(
            path,
          )
        )
          return new Response("Not found", { status: 404 });
        return new Response(await readFile(`dist/site${path}`), {
          headers: {
            "Content-Type": path.endsWith(".css")
              ? "text/css"
              : path.endsWith(".png")
                ? "image/png"
                : path.endsWith(".webp")
                  ? "image/webp"
                  : path.endsWith(".woff2")
                    ? "font/woff2"
                    : "text/javascript",
          },
        });
      },
    },
    ENVIRONMENT: "test",
    APP_BASE_URL: origin,
    ADMIN_BASE_URL: adminOrigin,
    PUBLIC_DIAGNOSIS_ENABLED: "false",
    TURNSTILE_SITE_KEY: "test-site-key",
    TURNSTILE_SECRET: "test-secret",
    DATA_ENCRYPTION_KEY: btoa("01234567890123456789012345678901"),
    HASH_SECRET: "fixture-hash-key-at-least-32-characters",
    ACCESS_TEAM_DOMAIN: "fixture.cloudflareaccess.com",
    ACCESS_AUD: "test-audience",
    WHATSAPP_PUBLIC_NUMBER: "573001234567",
  };
  let verifications = 0;
  const upstream: typeof fetch = async (_input, init) => {
    verifications++;
    const body = JSON.parse(String(init?.body)) as { response: string };
    return Response.json({
      success: body.response === "test-valid",
      hostname: new URL(env.APP_BASE_URL).hostname,
      action: "request_lead",
    });
  };
  const publicHandler = createHandler("public", { fetch: upstream });
  const adminHandler = createHandler("admin", { accessKey: resolver });
  const token = await sign();
  return {
    mf,
    db,
    env,
    sign,
    token,
    publicHandler,
    adminHandler,
    verifications: () => verifications,
    publicRequest: (
      path: string,
      payload?: unknown,
      extraHeaders: Record<string, string> = {},
    ) =>
      publicHandler(
        new Request(`${origin}${path}`, {
          method: payload === undefined ? "GET" : "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: origin,
            ...extraHeaders,
          },
          body: payload === undefined ? undefined : JSON.stringify(payload),
        }),
        env,
      ),
    adminRequest: (
      path: string,
      method = "GET",
      payload?: unknown,
      authToken: string | null = token,
      extraHeaders: Record<string, string> = {},
    ) =>
      adminHandler(
        new Request(`${adminOrigin}${path}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Origin: adminOrigin,
            ...(authToken ? { "Cf-Access-Jwt-Assertion": authToken } : {}),
            ...extraHeaders,
          },
          body: payload === undefined ? undefined : JSON.stringify(payload),
        }),
        env,
      ),
  };
}
export function validRequest(overrides: Record<string, unknown> = {}) {
  return {
    website_url: "https://empresa.com/servicio?source=test",
    issue_type: "errores_caidas",
    contact: { email: "cliente@gmail.com", whatsapp_phone: "+573001234567" },
    privacy_accepted: true,
    authorization_confirmed: true,
    marketing_opt_in: false,
    privacy_policy_version: POLICY_VERSION,
    authorization_text_version: POLICY_VERSION,
    form_version: FORM_VERSION,
    idempotency_key: crypto.randomUUID(),
    turnstile_token: "test-valid",
    ...overrides,
  };
}
