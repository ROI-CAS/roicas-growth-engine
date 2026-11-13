/**
 * Carga diferida de scripts de tracking (GA4, Google Ads, Meta Pixel, LeadConnector).
 * Se ejecutan tras `requestIdleCallback` o la primera interacción del usuario,
 * para no bloquear el render inicial.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    _fbq?: unknown;
  }
}

let loaded = false;

function injectScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.head.appendChild(s);
  return s;
}

function loadAnalytics() {
  // GA4 + Google Ads (gtag)
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) { (window.dataLayer as unknown[]).push(args); };
  window.gtag("js", new Date());
  window.gtag("config", "G-Y1H8G403Y6");
  window.gtag("config", "AW-18158296847");
  injectScript("https://www.googletagmanager.com/gtag/js?id=AW-18158296847");
}

function loadMetaPixel() {
  // Stub fbq antes de que el script cargue
  if (window.fbq) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const n: any = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args); else n.queue.push(args);
  };
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  window.fbq = n;
  window._fbq = n;
  injectScript("https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", "1690137862180306");
  window.fbq("track", "PageView");
}

function loadLeadConnector() {
  injectScript("https://link.msgsndr.com/js/external-tracking.js", {
    "data-tracking-id": "tk_5e700decad154692bf05bc25312f2fe0",
  });
}

export function loadTracking() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  loadAnalytics();
  loadMetaPixel();
  loadLeadConnector();
}

export function bootstrapTracking() {
  if (typeof window === "undefined") return;

  const arm = () => {
    let triggered = false;
    const fire = () => {
      if (triggered) return;
      triggered = true;
      cleanup();
      loadTracking();
    };

    const events: Array<keyof WindowEventMap> = [
      "scroll",
      "pointerdown",
      "keydown",
      "touchstart",
      "mousemove",
    ];
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, fire));
    };
    events.forEach((e) =>
      window.addEventListener(e, fire, { once: true, passive: true }),
    );
  };

  // Esperar a que la página termine de cargar y el navegador esté idle
  // antes incluso de registrar los listeners — así no añadimos trabajo al render.
  const schedule = () => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback;
    if (ric) ric(arm, { timeout: 4000 });
    else setTimeout(arm, 2000);
  };

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
}
