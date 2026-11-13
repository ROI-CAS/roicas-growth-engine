const GA_MEASUREMENT_ID = "G-4ZVPB9K4QC";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
};

let scheduled = false;

/** Queue analytics and fetch gtag only after the visitor accepts cookies and the page is idle. */
export function initializeGoogleAnalytics(): void {
  if (typeof window === "undefined" || scheduled) return;

  const analyticsWindow = window as AnalyticsWindow;
  if (window.localStorage.getItem("cookie-consent") !== "accepted") return;

  scheduled = true;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag = analyticsWindow.gtag || ((...args: unknown[]) => analyticsWindow.dataLayer?.push(args));
  analyticsWindow.gtag("js", new Date());
  analyticsWindow.gtag("config", GA_MEASUREMENT_ID);

  const loadScript = () => {
    if (window.localStorage.getItem("cookie-consent") !== "accepted") return;
    if (document.querySelector('script[data-roicas-gtag="true"]')) return;

    const script = document.createElement("script");
    script.async = true;
    script.dataset.roicasGtag = "true";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  };

  if (analyticsWindow.requestIdleCallback) analyticsWindow.requestIdleCallback(loadScript, { timeout: 2500 });
  else window.setTimeout(loadScript, 1500);
}
