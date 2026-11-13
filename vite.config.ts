import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function productApi(): Plugin {
  return {
    name: "roicas-product-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/web-express") && req.url?.split("?")[0] !== "/api/wompi/webhook") return next();
        try {
          const env = loadEnv(server.config.mode, server.config.root, "");
          for (const [key, value] of Object.entries(env)) if (!(key in process.env)) process.env[key] = value;
          const url = new URL(req.url, `http://${req.headers.host}`);
          if (url.pathname === "/api/wompi/webhook") url.searchParams.set("action", "wompi");
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 32768) { res.statusCode = 413; res.end(); return; }
            chunks.push(chunk);
          }
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
          const request = new Request(url, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method || "GET") ? undefined : Buffer.concat(chunks) });
          const { handleProductRequest } = await server.ssrLoadModule("/server/web-express/handler.ts");
          const response: Response = await handleProductRequest(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch { res.statusCode = 503; res.end(JSON.stringify({ error: "service_unavailable" })); }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [react(), productApi(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
