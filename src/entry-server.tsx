import { renderToString } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import App from "./App";
export { siteRoutes, SITE_URL } from "./lib/site";
export { publishedArticles } from "./lib/blog";

export function render(url: string) {
  const context = {} as { helmet: HelmetServerState };
  const html = renderToString(<HelmetProvider context={context}><App url={url} /></HelmetProvider>);
  const { helmet } = context;
  const head = [helmet.title, helmet.meta, helmet.link, helmet.script].map(value => value.toString()).join("\n");
  return { html, head };
}
