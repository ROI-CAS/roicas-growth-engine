import { isIP } from "node:net";

const paths = new Set([
  "requests",
  "diagnosis/start",
  "diagnosis/status",
  "public/config",
  "public/pricing",
  "payments/checkout",
  "payments/status",
]);
export async function proxyRequest(
  request: Request,
  secret: string | undefined,
  upstream: typeof fetch = fetch,
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.searchParams.get("wpdoctor_path") ?? "";
  if (!paths.has(path) || !["GET", "POST"].includes(request.method))
    return Response.json({ message: "No encontrado." }, { status: 404 });
  if (!secret || secret.length < 32)
    return Response.json(
      { message: "Servicio en preparación." },
      { status: 503 },
    );
  if (
    request.method === "POST" &&
    request.headers.get("origin") !== "https://doctor.roicas.com"
  )
    return Response.json({ message: "Origen no permitido." }, { status: 403 });
  // Vercel overwrites this header; never forward a caller-supplied x-real-ip.
  const ip = request.headers.get("x-vercel-forwarded-for") ?? "";
  if (!isIP(ip))
    return Response.json({ message: "Origen no disponible." }, { status: 403 });
  const headers = new Headers({ "x-wpdoctor-proxy": secret, "x-real-ip": ip });
  for (const name of ["origin", "content-type", "sec-fetch-site"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  let body: Uint8Array | undefined;
  if (request.method === "POST") {
    const reader = request.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader)
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        size += next.value.byteLength;
        if (size > 16384) {
          await reader.cancel();
          return Response.json(
            { message: "Solicitud demasiado grande." },
            { status: 413 },
          );
        }
        chunks.push(next.value);
      }
    body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
  }
  try {
    const result = await upstream(
      `https://webexpress-wp-doctor.casinmiedo.workers.dev/api/v1/${path}`,
      {
        method: request.method,
        headers,
        body: body as BodyInit | undefined,
        redirect: "manual",
        signal: AbortSignal.timeout(110000),
      },
    );
    const outgoing = new Headers({
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    });
    for (const name of ["content-type", "retry-after"]) {
      const value = result.headers.get(name);
      if (value) outgoing.set(name, value);
    }
    return new Response(result.body, {
      status: result.status,
      headers: outgoing,
    });
  } catch {
    return Response.json(
      {
        message:
          "No pudimos confirmar la operación. Conserva tu solicitud y consulta el estado antes de repetirla.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
export const config = { maxDuration: 120 };
export default {
  fetch(request: Request) {
    return proxyRequest(request, process.env.PROXY_ORIGIN_SECRET);
  },
};
