import { readFile, writeFile, readdir, mkdir, cp } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import postcss from "postcss";
import tailwind3 from "tailwindcss";
import autoprefixer from "autoprefixer";
import { compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";

const require = createRequire(import.meta.url);
const { default: selectorParser } = await import("postcss-selector-parser");

function isolate(css, product) {
  // Separate custom properties and keyframes; loading one product cannot recolor another.
  css = css.replace(new RegExp(`--(?!${product}-)([\\w-]+)`, "g"), `--${product}-$1`);
  const ast = postcss.parse(css);
  // These styles are already compiled. Flatten layers before the site's Tailwind 3 pass.
  ast.walkAtRules("layer", rule => { if (rule.nodes) rule.replaceWith(rule.nodes); else rule.remove(); });
  const animations = new Map();
  ast.walkAtRules(/keyframes$/, rule => { animations.set(rule.params, `${product}-${rule.params}`); rule.params = `${product}-${rule.params}`; });
  ast.walkDecls(/^(animation|animation-name)$/, decl => {
    for (const [from, to] of animations) decl.value = decl.value.replace(new RegExp(`(?<![\\w-])${from}(?![\\w-])`, "g"), to);
  });
  ast.walkRules(rule => {
    // Nested selectors remain relative; keyframe steps are not document selectors.
    let parent = rule.parent;
    while (parent) {
      if (parent.type === "rule" || (parent.type === "atrule" && /keyframes$/.test(parent.name))) return;
      parent = parent.parent;
    }
    rule.selector = selectorParser(selectors => {
      selectors.each(selector => {
        let root = false;
        selector.walkClasses(node => { if (node.value === "reveal-js") { node.parent.insertBefore(node, selectorParser.className({ value: `${product}-scope` })); root = true; } });
        selector.walkPseudos(node => { if ([":root", ":host"].includes(node.value)) { node.replaceWith(selectorParser.className({ value: `${product}-scope` })); root = true; } });
        selector.walkTags(node => { if (["html", "body"].includes(node.value)) { node.replaceWith(selectorParser.className({ value: `${product}-scope` })); root = true; } });
        if (!root) { selector.prepend(selectorParser.combinator({ value: " " })); selector.prepend(selectorParser.className({ value: `${product}-scope` })); }
      });
    }).processSync(rule.selector);
  });
  return ast.toString() + `\n.${product}-scope :is(h1,h2,h3,h4,h5,h6) { color: inherit; }\n.${product}-scope > .product-home { display: block; padding: .35rem 1rem; background: white; color: #18181b; font: 500 .8rem/1.5 system-ui; }\n`;
}

const diag = resolve("src/modules/diagnostico");
const diagCss = await readFile(resolve(diag, "styles.source.css"), "utf8");
const result = await postcss([tailwind3({ config: resolve(diag, "tailwind.config.ts") }), autoprefixer]).process(diagCss, { from: resolve(diag, "styles.source.css") });
await writeFile(resolve(diag, "styles.generated.css"), isolate(result.css, "diagnostico"));

const web = resolve("src/modules/web-express");
let webCss = await readFile(resolve(web, "styles.source.css"), "utf8");
// Font files are served locally with stable URLs, including their license files.
for (const [pkg, family] of [["bricolage-grotesque", "Bricolage Grotesque Variable"], ["inter", "Inter Variable"]]) {
  const entry = require.resolve(`@fontsource-variable/${pkg}/package.json`);
  const source = resolve(dirname(entry), "files");
  const font = (await readdir(source)).find(name => name.includes("latin-wght-normal") && !name.includes("latin-ext") && name.endsWith(".woff2"));
  const output = resolve("public/products/web-express/fonts");
  await mkdir(output, { recursive: true });
  await cp(resolve(source, font), resolve(output, font));
  await cp(resolve(dirname(entry), "LICENSE"), resolve(output, `${pkg}-LICENSE.txt`));
  webCss = webCss.replace(new RegExp(`@import "@fontsource-variable/${pkg}[^";]*";`), `@font-face { font-family: "${family}"; font-style: normal; font-weight: 100 900; font-display: swap; src: url("/products/web-express/fonts/${font}") format("woff2"); }`);
}
const tw4Require = createRequire(require.resolve("@tailwindcss/node"));
const compiler = await compile(webCss, {
  base: web, onDependency() {},
  customCssResolver(id) { return id === "tailwindcss" ? tw4Require.resolve("tailwindcss/index.css") : undefined; },
});
const scanner = new Scanner({ sources: [{ base: web, pattern: "**/*.{ts,tsx}", negated: false }] });
await writeFile(resolve(web, "styles.generated.css"), isolate(compiler.build(scanner.scan()), "web-express"));
console.log("Estilos aislados de Diagnóstico y Web Express generados.");
