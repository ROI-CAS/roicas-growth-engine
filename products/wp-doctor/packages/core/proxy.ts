import type { Env } from "./env";
import { HttpError } from "./http";

export async function visitorIp(request: Request, env: Env): Promise<string> {
  if (env.TRUSTED_PROXY_REQUIRED !== "true")
    return request.headers.get("CF-Connecting-IP") ?? "local";
  const expected = env.PROXY_ORIGIN_SECRET ?? "";
  const provided = request.headers.get("x-wpdoctor-proxy") ?? "";
  if (expected.length < 32 || provided.length > 256)
    throw new HttpError(403, "proxy_required", "Origen no permitido.");
  const digest = async (s: string) =>
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
    );
  const [a, b] = await Promise.all([digest(expected), digest(provided)]);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i]! ^ b[i]!;
  if (difference)
    throw new HttpError(403, "proxy_required", "Origen no permitido.");
  const ip = request.headers.get("x-real-ip");
  if (!ip || !/^[a-fA-F0-9:.]{3,45}$/.test(ip))
    throw new HttpError(403, "proxy_ip_missing", "Origen no permitido.");
  return ip;
}
