import { META_PIXEL_ID, GOOGLE_TAG_ID, CLARITY_PROJECT_ID } from "./site";
let initialized = false;
/** Original product analytics, retained with the owner's explicit authorization. */
export function initWebExpressTracking() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const script = (src: string) => { const el = document.createElement("script"); el.src = src; el.async = true; document.head.append(el); };
  if (!window.fbq) {
    const queue: unknown[][] = [];
    const fbq = (...args: unknown[]) => {
      const current = fbq as typeof fbq & { callMethod?: (...values: unknown[]) => void };
      if (current.callMethod) current.callMethod(...args); else queue.push(args);
    };
    Object.assign(fbq, { queue, loaded: true, version: "2.0", push: fbq });
    window.fbq = fbq; window._fbq = fbq;
    script("https://connect.facebook.net/en_US/fbevents.js");
  }
  window.fbq("init", META_PIXEL_ID);
  window.fbq("trackSingle", META_PIXEL_ID, "PageView");
  if (GOOGLE_TAG_ID) { window.gtag?.("config", GOOGLE_TAG_ID); script(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_TAG_ID)}`); }
  if (CLARITY_PROJECT_ID) {
    const target = window as unknown as { clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] } };
    if (!target.clarity) { const queued = (...args: unknown[]) => { queued.q.push(args); }; queued.q = [] as unknown[][]; target.clarity = queued; }
    script(`https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_PROJECT_ID)}`);
  }
}
