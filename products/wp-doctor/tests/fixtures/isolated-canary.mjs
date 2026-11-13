import http from "node:http";
import https from "node:https";
import dgram from "node:dgram";
import { readFileSync } from "node:fs";
let httpHits = 0,
  udpHits = 0,
  mutations = 0,
  privateHits = 0;
const publicIP = "11.44.0.2";
http
  .createServer((request, response) => {
    if (request.url === "/reset") {
      httpHits = 0;
      udpHits = 0;
      mutations = 0;
      privateHits = 0;
      response.end("ok");
      return;
    }
    if (request.url === "/counts") {
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({ httpHits, udpHits, mutations, privateHits }),
      );
      return;
    }
    httpHits++;
    response.end("controlled-positive");
  })
  .listen(8081, "0.0.0.0");
const udp = dgram.createSocket("udp4");
udp.on("message", (message, peer) => {
  udpHits++;
  udp.send(message, peer.port, peer.address);
});
udp.bind(8082, "0.0.0.0");
https
  .createServer(
    { key: readFileSync("/lab/key.pem"), cert: readFileSync("/lab/ca.pem") },
    (request, response) => {
      if (request.socket.localAddress !== publicIP) privateHits++;
      if (request.method !== "GET") mutations++;
      if (request.url === "/") {
        response.setHeader("Content-Type", "text/html");
        response.end(
          `<!doctype html><meta name="generator" content="WordPress 6.8"><h1>Controlled fixture</h1><script src="/wp-content/plugins/demo/frontend.js"></script><img src="/missing.png"><script>fetch('/mutate',{method:'POST'}).catch(()=>{});let f=document.createElement('iframe');f.src='/frame';document.body.append(f);new WebSocket('ws://11.44.0.2:8081');if(document.cookie.includes('isolationProbe'))console.error('fixture-cookie-leak');document.cookie='isolationProbe=1; path=/';console.error('fixture-console');</script>`,
        );
      } else if (request.url === "/wp-content/plugins/demo/frontend.js") {
        response.setHeader("Content-Type", "text/javascript");
        response.end('throw new TypeError("fixture-plugin-exception");');
      } else if (request.url === "/redirect") {
        response.writeHead(302, { Location: "https://127.0.0.1/" });
        response.end();
      } else if (request.url === "/large") {
        response.writeHead(200, { "Content-Length": String(6 * 1024 * 1024) });
        response.end("small payload, invalid declared size");
      } else {
        response.writeHead(404);
        response.end("not found");
      }
    },
  )
  .listen(443, "0.0.0.0");
