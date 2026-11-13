import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
import type { Env, Role } from "./env";
import { HttpError } from "./http";
const resolvers = new Map<string, JWTVerifyGetKey>();
export async function authenticate(
  request: Request,
  env: Env,
  testResolver?: JWTVerifyGetKey,
): Promise<{ id: string; role: Role; email: string }> {
  if (
    !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_TEAM_DOMAIN ?? "") ||
    !env.ACCESS_AUD
  )
    throw new HttpError(
      503,
      "access_unconfigured",
      "Access aún no está configurado.",
    );
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || token.length > 16384)
    throw new HttpError(
      401,
      "access_required",
      "Inicia sesión mediante Cloudflare Access.",
    );
  const issuer = `https://${env.ACCESS_TEAM_DOMAIN}`;
  if (!resolvers.has(issuer))
    resolvers.set(
      issuer,
      createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`)),
    );
  let email: string;
  try {
    const { payload } = await jwtVerify(
      token,
      testResolver ?? resolvers.get(issuer)!,
      {
        issuer,
        audience: env.ACCESS_AUD,
        algorithms: ["RS256"],
        requiredClaims: ["exp", "iat", "sub"],
      },
    );
    if (typeof payload.email !== "string") throw new Error("Missing email");
    email = payload.email.toLowerCase();
  } catch {
    throw new HttpError(
      401,
      "access_invalid",
      "La sesión no es válida o ha vencido.",
    );
  }
  const user = await env.DB.prepare(
    "SELECT id,role,email FROM users WHERE email=? AND active=1",
  )
    .bind(email)
    .first<{ id: string; role: Role; email: string }>();
  if (!user)
    throw new HttpError(
      403,
      "role_required",
      "Tu cuenta no tiene permisos en este panel.",
    );
  return user;
}
export function requireCommercial(role: Role): void {
  if (!["owner", "commercial"].includes(role))
    throw new HttpError(
      403,
      "forbidden",
      "Esta acción requiere permisos comerciales.",
    );
}
