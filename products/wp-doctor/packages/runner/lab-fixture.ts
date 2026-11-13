export function fixtureHtml(
  receiver: string,
  privateReceiver?: string,
): string {
  return `<!doctype html><html><head><meta name="generator" content="WordPress fixture"><title>WP Doctor laboratory</title></head><body><h1>Laboratorio autorizado</h1><p>Datos ficticios de prueba.</p><script src="/wp-content/plugins/demo/fixture.js"></script><img src="/missing.png" alt="Recurso faltante de prueba"><script>
  console.error('fixture-console https://example.com/path?token=DO_NOT_STORE persona@example.com');
  for(const url of ${JSON.stringify([receiver + "/probe", ...(privateReceiver ? [privateReceiver + "/probe"] : [])])})fetch(url).catch(()=>{});
  fetch('/mutation',{method:'POST',body:'fixture'}).catch(()=>{});
  fetch('/redirect-private').catch(()=>{});
  fetch('/redirect-loop').catch(()=>{});
  fetch('/rebind-target').catch(()=>{});
  try{new WebSocket(${JSON.stringify(receiver.replace(/^http/, "ws") + "/socket")});}catch{}
  const frame=document.createElement('iframe');frame.src='/frame-probe';document.body.append(frame);
  setTimeout(()=>{throw new Error('fixture-pageerror');},50);
  </script></body></html>`;
}
