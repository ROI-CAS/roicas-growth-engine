import net from "node:net";
import dgram from "node:dgram";
import { publicAddress, PolicyError } from "../runner/policy";

// Only the fixed owned-site security suite calls this. No LAN/metadata probe.
export async function nativeNetworkProbe(
  ip: string,
): Promise<{ tcp: boolean; udp: boolean }> {
  if (!publicAddress(ip)) throw new PolicyError("probe_non_public");
  const tcp = await new Promise<boolean>((resolve) => {
    let done = false;
    const finish = (value: boolean) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(value);
    };
    const socket = net.connect(443, ip, () => finish(true));
    socket.setTimeout(2000);
    socket.on("error", () => finish(false));
    socket.on("timeout", () => finish(false));
  });
  const udp = await new Promise<boolean>((resolve) => {
    const socket = dgram.createSocket("udp4");
    let done = false;
    const finish = (value: boolean) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try {
        socket.close();
      } catch {
        /* Already closed after a denied bind. */
      }
      resolve(value);
    };
    const timer = setTimeout(() => finish(false), 2000);
    // Ordinary DNS A query for doctor.roicas.com to Cloudflare's public resolver.
    const id = crypto.getRandomValues(new Uint8Array(2));
    const labels = "doctor.roicas.com"
      .split(".")
      .flatMap((s) => [s.length, ...Buffer.from(s)]);
    const query = Buffer.from([
      ...id,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      ...labels,
      0,
      0,
      1,
      0,
      1,
    ]);
    socket.on("message", (message) =>
      finish(message[0] === id[0] && message[1] === id[1]),
    );
    socket.on("error", () => finish(false));
    socket.send(query, 53, "1.1.1.1", (error) => {
      if (error) finish(false);
    });
  });
  return { tcp, udp };
}
