import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import App from "./App";
export { siteRoutes, SITE_URL } from "./lib/site";
export { publishedArticles } from "./lib/blog";

export function render(url: string): Promise<{ html: string; head: string }> {
  const context = {} as { helmet: HelmetServerState };
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks: string[] = [];
    let renderError: unknown;
    let stream: ReturnType<typeof renderToPipeableStream>;

    output.on("data", chunk => chunks.push(Buffer.from(chunk).toString("utf8")));
    output.on("error", reject);
    output.on("end", () => {
      if (renderError) {
        reject(renderError);
        return;
      }
      const { helmet } = context;
      const head = [helmet.title, helmet.meta, helmet.link, helmet.script].map(value => value.toString()).join("\n");
      resolve({ html: chunks.join(""), head });
    });

    stream = renderToPipeableStream(
      <HelmetProvider context={context}><App url={url} /></HelmetProvider>,
      {
        onAllReady: () => stream.pipe(output),
        onShellError: reject,
        onError: error => { renderError = error; },
      },
    );
  });
}
