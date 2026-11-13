import { sendCapiEvent } from "./capi";
import { META_PIXEL_ID } from "./site";

export { META_PIXEL_ID };

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type StandardEvent =
  | "ViewContent"
  | "Lead"
  | "CompleteRegistration"
  | "Contact"
  | "InitiateCheckout"
  | "Purchase";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Registra un evento estándar de Meta por partida doble:
 *  1. Pixel del navegador (window.fbq)
 *  2. Conversions API (server) con el MISMO eventID → Meta deduplica.
 * Es best-effort: si el Pixel no está cargado o el servidor falla, no interrumpe
 * la acción real del usuario (WhatsApp, pago, envío de brief).
 */
export function track(
  event: StandardEvent,
  opts: {
    phone?: string;
    value?: number;
    currency?: string;
    params?: Record<string, unknown>;
  } = {}
): void {
  if (typeof window === "undefined") return;

  const eventId =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  // 1) Pixel del navegador — el valor viaja también aquí, no solo por CAPI:
  // sin él Meta no puede optimizar por valor ni cuadrar el evento deduplicado.
  const pixelParams: Record<string, unknown> = { ...(opts.params ?? {}) };
  if (opts.value != null) {
    pixelParams.value = opts.value;
    pixelParams.currency = opts.currency ?? "COP";
  }

  try {
    window.fbq?.("track", event, pixelParams, { eventID: eventId });
  } catch {
    /* noop */
  }

  // 2) Conversions API (server-side, deduplicado por eventID)
  try {
    void sendCapiEvent({
      data: {
        pixelId: META_PIXEL_ID,
        eventName: event,
        eventId,
        eventSourceUrl: window.location.href,
        userAgent: navigator.userAgent,
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
        phone: opts.phone,
        value: opts.value,
        currency: opts.currency,
      },
    }).catch(() => {
      /* best-effort */
    });
  } catch {
    /* noop */
  }
}

/**
 * Dispara ViewContent una sola vez cuando el visitante ha recorrido `ratio` de
 * la página (0.5 = 50%). Señal de interés real, no de simple aterrizaje.
 * Devuelve la función de limpieza para usar desde un useEffect.
 */
export function trackScrollDepth(ratio = 0.5): () => void {
  if (typeof window === "undefined") return () => {};

  let fired = false;
  const onScroll = () => {
    if (fired) return;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    // Página demasiado corta para medir scroll: no forzamos el evento.
    if (scrollable <= 0) return;
    if (window.scrollY / scrollable >= ratio) {
      fired = true;
      track("ViewContent");
      window.removeEventListener("scroll", onScroll);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
