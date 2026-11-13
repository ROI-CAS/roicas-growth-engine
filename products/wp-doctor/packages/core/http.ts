export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}
export function json(value: unknown, status = 200): Response {
  return Response.json(value, { status });
}
export async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new HttpError(415, "content_type", "Se requiere JSON.");
  if (!request.body)
    throw new HttpError(400, "empty_body", "La solicitud está vacía.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) {
      await reader.cancel();
      throw new HttpError(
        413,
        "body_too_large",
        "La solicitud es demasiado grande.",
      );
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new HttpError(400, "invalid_json", "JSON inválido.");
  }
}
export function sameOrigin(request: Request, expected: string): void {
  if (
    request.headers.get("origin") !== new URL(expected).origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new HttpError(403, "origin", "Origen de solicitud no permitido.");
}
export function secure(response: Response, admin = false): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self'; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  );
  headers.set("Strict-Transport-Security", "max-age=31536000");
  headers.set("Cache-Control", "no-store");
  if (admin) headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(response.body, { status: response.status, headers });
}
export const escapeHtml = (value: unknown): string =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
