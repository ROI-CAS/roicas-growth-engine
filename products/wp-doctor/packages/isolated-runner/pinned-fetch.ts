import { lookup } from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import ipaddr from "ipaddr.js";
import {
  NetworkPolicy,
  PolicyError,
  publicAddress,
  type Resolver,
} from "../runner/policy";

export type TransferBudget = {
  remaining: number;
  requests: number;
  deadline: number;
};
export type PinnedResponse = {
  status: number;
  headers: Record<string, string>;
  body: string;
  bytes: number;
  selected_ip: string;
  connected_ip: string;
};
export const systemResolver: Resolver = async (hostname) =>
  (await lookup(hostname, { all: true, verbatim: true })).map((x) => x.address);
function canonical(ip: string): string {
  return ipaddr.process(ip).toString();
}

// DNS is resolved once. Node's transport receives only the checked numeric address;
// TLS SNI/certificate verification and HTTP Host retain the original hostname.
export async function pinnedFetch(
  raw: string,
  method: string,
  hostname: string,
  budget: TransferBudget,
  resolve: Resolver = systemResolver,
): Promise<PinnedResponse> {
  if (++budget.requests > 80) throw new PolicyError("request_budget");
  let selected: string | undefined;
  const policy = new NetworkPolicy(
    hostname,
    async (host) => {
      const addresses = await resolve(host);
      if (!addresses.length || addresses.some((ip) => !publicAddress(ip)))
        throw new PolicyError("dns_non_public");
      selected =
        addresses.find((ip) => ipaddr.parse(ip).kind() === "ipv4") ??
        addresses[0];
      return addresses;
    },
    budget.deadline,
  );
  const url = await policy.check(raw, method);
  if (!selected) throw new PolicyError("dns_unresolved");
  const selectedIP = selected;
  if (budget.remaining <= 0) throw new PolicyError("transfer_budget");
  return new Promise((resolveResult, reject) => {
    let connected = "";
    let settled = false;
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      request.destroy();
      reject(
        error instanceof PolicyError
          ? error
          : new PolicyError("origin_unavailable"),
      );
    };
    const remaining = Math.max(
      1,
      Math.min(10000, budget.deadline - Date.now()),
    );
    const timer = setTimeout(
      () => fail(new PolicyError("origin_timeout")),
      remaining,
    );
    const options: https.RequestOptions = {
      method,
      agent: false,
      servername: url.hostname,
      rejectUnauthorized: true,
      headers: {
        Host: url.hostname,
        Accept: "*/*",
        "Accept-Encoding": "identity",
        "User-Agent": "WPDoctor/1.0 (external diagnostic; GET/HEAD only)",
        Connection: "close",
      },
      lookup: (_name, options, callback) => {
        const address = {
          address: selectedIP,
          family: ipaddr.parse(selectedIP).kind() === "ipv4" ? 4 : 6,
        };
        if (options.all) callback(null, [address]);
        else callback(null, address.address, address.family);
      },
      maxHeaderSize: 16384,
    };
    const request = (url.protocol === "https:" ? https : http).request(
      url,
      options,
      (response) => {
        const status = response.statusCode ?? 0;
        if (status >= 300 && status < 400) {
          response.destroy();
          fail(new PolicyError("redirect_blocked"));
          return;
        }
        const declared = Number(response.headers["content-length"] ?? 0);
        if (declared > budget.remaining || declared > 2 * 1024 * 1024) {
          response.destroy();
          fail(new PolicyError("transfer_budget"));
          return;
        }
        const chunks: Buffer[] = [];
        let bytes = 0;
        response.on("data", (chunk: Buffer) => {
          bytes += chunk.length;
          budget.remaining -= chunk.length;
          if (budget.remaining < 0 || bytes > 2 * 1024 * 1024) {
            response.destroy();
            fail(new PolicyError("transfer_budget"));
            return;
          }
          chunks.push(chunk);
        });
        response.on("error", fail);
        response.on("end", () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          const headers: Record<string, string> = {};
          for (const [key, value] of Object.entries(response.headers)) {
            if (
              value !== undefined &&
              ![
                "set-cookie",
                "connection",
                "transfer-encoding",
                "content-length",
                "alt-svc",
                "report-to",
                "nel",
                "refresh",
              ].includes(key)
            )
              headers[key] = Array.isArray(value) ? value.join(", ") : value;
          }
          headers["content-length"] = String(bytes);
          resolveResult({
            status,
            headers,
            body: Buffer.concat(chunks).toString("base64"),
            bytes,
            selected_ip: selectedIP,
            connected_ip: connected,
          });
        });
      },
    );
    request.on("error", fail);
    request.on("close", () => clearTimeout(timer));
    request.on("socket", (socket) => {
      const event = url.protocol === "https:" ? "secureConnect" : "connect";
      socket.once(event, () => {
        connected = socket.remoteAddress ?? "";
        if (!connected || canonical(connected) !== canonical(selectedIP)) {
          fail(new PolicyError("connected_ip_mismatch"));
          return;
        }
        request.end();
      });
    });
  });
}
