/**
 * Tracking helpers — Roicas
 * Meta Pixel: 1690137862180306
 * Google Ads: AW-18158296847
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function fbq(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params ?? {});
  }
}

function ga(name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params ?? {});
  }
}

// ─── WhatsApp / Contact ───────────────────────────────────────────────────────

/** Clic en cualquier botón de WhatsApp */
export function trackContact() {
  fbq("Contact", { content_name: "WhatsApp Roicas" });
  ga("contact", { method: "whatsapp" });
}

// ─── Formulario (Quiz) ────────────────────────────────────────────────────────

/** Lead capturado — formulario Quiz enviado con éxito */
export function trackLead() {
  fbq("Lead", { content_name: "Formulario Diagnóstico" });
  ga("generate_lead", { method: "form", currency: "COP" });
}

/** Conversión Google Ads — envío de formulario de leads */
export function trackAdsConversion() {
  ga("conversion", {
    send_to: "AW-18158296847/Io9OCO_p-6scEI--diagnostico-xtJD",
    value: 1.0,
    currency: "COP",
  });
}

// ─── CTA Agenda ───────────────────────────────────────────────────────────────

/** Clic en cualquier botón "Agendar llamada" → sección #agenda */
export function trackAgendaClick(source: string) {
  ga("schedule_appointment", { event_label: source });
}

// ─── Paquetes ─────────────────────────────────────────────────────────────────

/** Clic en CTA de un paquete específico */
export function trackPackageInterest(packageName: string) {
  ga("select_item", { item_name: packageName, item_list_name: "packages" });
}

// ─── QuickCheckup ─────────────────────────────────────────────────────────────

/** Submit del diagnóstico SEO — con URL (va a WhatsApp) */
export function trackCheckupUrl() {
  fbq("ViewContent", { content_name: "Checkup con URL" });
  ga("checkup_url_submit");
}

/** Submit del diagnóstico SEO — sin URL (va al formulario) */
export function trackCheckupForm() {
  ga("checkup_form_redirect");
}

// ─── CTAs de navegación ───────────────────────────────────────────────────────

/** Clic en CTA de Navbar o Hero → #contacto */
export function trackNavCTA(label: string) {
  ga("cta_click", { event_label: label });
}

// ─── Scroll depth ─────────────────────────────────────────────────────────────

/** Milestone de scroll: 25, 50, 75, 90 */
export function trackScrollDepth(percent: number) {
  ga("scroll_depth", { percent_scrolled: percent });
}

// ─── ViewContent (legacy) ─────────────────────────────────────────────────────

export function trackViewContent(name: string) {
  fbq("ViewContent", { content_name: name });
}
