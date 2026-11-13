const fs = require('node:fs');
const path = require('node:path');
process.env.PLAYWRIGHT_BROWSERS_PATH = path.resolve('products/wp-doctor/.cache/playwright');
const { chromium } = require('../products/wp-doctor/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const output = process.env.ROICAS_VERIFY_OUTPUT || path.resolve('test-results/products');
  fs.mkdirSync(output, { recursive: true });
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (!['127.0.0.1','localhost'].includes(url.hostname)) return route.abort();
      if (url.pathname.endsWith('.mp4')) return route.abort();
      if (url.pathname === '/api/web-express' && url.searchParams.get('action') !== 'clock') return route.fulfill({ json: { skipped: true } });
      return route.continue();
    });
    for (const pathname of ['/', '/diagnostico-digital', '/diagnostico-digital/privacidad', '/web-express', '/web-express/black-november', '/web-express/privacidad', '/web-express/terminos', '/wp-doctor']) {
      const page = await context.newPage(); const errors = [], missing = [];
      page.on('pageerror', err => errors.push(err.message));
      page.on('response', res => { if (res.url().startsWith('http://127.0.0.1:8080') && res.status() >= 400) missing.push([res.status(), res.url()]); });
      await page.goto('http://127.0.0.1:8080' + pathname, { waitUntil: 'networkidle' });
      await page.locator('h1').first().waitFor();
      for (let i = 0; i < 25; i++) {
        const bottom = await page.evaluate(() => { window.scrollBy(0, 750); return window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2; });
        await page.waitForTimeout(60);
        if (bottom) break;
      }
      await page.waitForLoadState('networkidle', { timeout: 3500 }).catch(() => {});
      await page.waitForTimeout(200);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `${pathname.replaceAll('/','_') || 'home'}-${width}.png`) });
      const details = await page.evaluate(() => ({ title: document.title, h1: [...document.querySelectorAll('h1')].map(n=>n.textContent), overflow: document.documentElement.scrollWidth > innerWidth + 2, broken: [...document.images].filter(n=>n.src.startsWith(location.origin) && n.complete && !n.naturalWidth).map(n=>n.src) }));
      results.push({ pathname, width, ...details, errors, missing });
      console.log(JSON.stringify(results.at(-1)));
      await page.close();
    }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(output, 'resultados.json'), JSON.stringify(results, null, 2));
  if (results.some(r=>r.errors.length || r.missing.length || r.broken.length || r.overflow)) process.exitCode = 1;
})().catch(err => { console.error(err); process.exitCode = 1; });
