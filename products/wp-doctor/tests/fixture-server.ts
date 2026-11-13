// Solo fixtures locales: nunca es un entrypoint de Wrangler ni un método de autenticación productivo.
import { createServer } from "node:http";
import { fixture } from "./helpers";
const publicOrigin = "http://127.0.0.1:4173";
const adminOrigin = "http://127.0.0.1:4174";
const f = await fixture(publicOrigin, adminOrigin);
const servers = [false, true].map((admin) =>
  createServer(async (req, res) => {
    try {
      if (!admin && req.url === "/__fixture__/turnstile.js") {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.end(
          `window.turnstile={render:(target,options)=>{document.querySelector(target).textContent='Verificación simulada · Solo fixtures';setTimeout(()=>options.callback('test-valid'),10);return 'fixture-widget'},reset:()=>{}};window.onTurnstileReady();`,
        );
        return;
      }
      if (admin && req.url === "/__fixture__/login") {
        const token = await f.sign();
        res.writeHead(200, {
          "Set-Cookie": `fixture-access=${token}; HttpOnly; SameSite=Strict; Path=/`,
        });
        res.end("Fixture signed in");
        return;
      }
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers))
        if (value)
          headers.set(key, Array.isArray(value) ? value.join(",") : value);
      if (admin) {
        const token = headers
          .get("cookie")
          ?.match(/(?:^|; )fixture-access=([^;]+)/)?.[1];
        if (token) headers.set("Cf-Access-Jwt-Assertion", token);
      }
      const method = req.method ?? "GET";
      const request = new Request(
        `${admin ? adminOrigin : publicOrigin}${req.url ?? "/"}`,
        {
          method,
          headers,
          ...(!["GET", "HEAD"].includes(method)
            ? { body: Buffer.concat(chunks) }
            : {}),
        },
      );
      let response = await (admin ? f.adminHandler : f.publicHandler)(
        request,
        !admin &&
          /(?:^|; )fixture-email=1(?:;|$)/.test(headers.get("cookie") ?? "")
          ? { ...f.env, DELIVERY_MODE: "resend_email" }
          : f.env,
      );
      if (!admin && req.url === "/assets/public/client.js") {
        response = new Response(
          (await response.text()).replace(
            "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileReady&render=explicit",
            "/__fixture__/turnstile.js",
          ),
          { status: response.status, headers: response.headers },
        );
      }
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch {
      res.writeHead(500);
      res.end("Fixture server failed");
    }
  }).listen(admin ? 4174 : 4173, "127.0.0.1"),
);
async function close() {
  for (const server of servers) server.close();
  await f.mf.dispose();
  process.exit(0);
}
process.on("SIGTERM", () => {
  void close();
});
process.on("SIGINT", () => {
  void close();
});
console.log(
  "Fixtures locales listas en 4173/4174; Siteverify simulado, JWT firmado y D1 emulado.",
);
