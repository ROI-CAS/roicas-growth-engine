// GA4 event tracking utility — ROICAS
// gtag is loaded globally via index.html script tag

type EventParams = Record<string, string | number | boolean | undefined>;

function trackEvent(eventName: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = (window as any).gtag;
  if (typeof g !== "function") return;
  g("event", eventName, params);
}

// ── Acquisition ──────────────────────────────────────────────────────────────

/** CTA button clicked anywhere on the site */
export const trackCtaClicked = (label: string, location: string) =>
  trackEvent("cta_clicked", { cta_label: label, page_location: location });

// ── Activation ───────────────────────────────────────────────────────────────

/** User interacts with a form field for the first time */
export const trackFormStarted = (form_location: string) =>
  trackEvent("contact_form_started", { form_location });

/** Form submitted successfully — primary conversion */
export const trackFormSubmitted = (has_company: boolean, form_location: string) =>
  trackEvent("contact_form_submitted", { has_company, form_location });

/**
 * Lead captured — North Star conversion event.
 * Fires on every confirmed lead: form submit or direct WhatsApp click.
 *
 * North Star: leads_captured / week
 * GA4 goal: mark this as a key event in GA4 > Admin > Events
 */
export const trackLeadCaptured = (source: "form" | "whatsapp" | "exit_popup" | "brief_form") =>
  trackEvent("lead_captured", { source });

// ── Brief E-commerce Analytics (without PII) ─────────────────────────────────

export const trackBriefStarted = (step = 1) =>
  trackEvent("brief_started", { step });

export const trackBriefStepCompleted = (step: number, step_name: string) =>
  trackEvent("brief_step_completed", { step, step_name });

export const trackBriefValidationFailed = (step: number, failed_fields_count: number) =>
  trackEvent("brief_validation_failed", { step, failed_fields_count });

export const trackBriefSubmitted = (
  lead_id: string,
  complexity_hint: string,
  platform_preference: string
) =>
  trackEvent("brief_submitted", {
    lead_id,
    complexity_hint,
    platform_preference,
  });

export const trackBriefSubmitFailed = (reason: string) =>
  trackEvent("brief_submit_failed", { error_reason: reason.slice(0, 100) });

// ── Engagement ────────────────────────────────────────────────────────────────

/** WhatsApp button or popup link clicked */
export const trackWhatsAppClicked = (trigger: "button" | "popup") =>
  trackEvent("whatsapp_clicked", { trigger });

/** WhatsApp notification popup appeared (10 s timer) */
export const trackWhatsAppPopupShown = () =>
  trackEvent("whatsapp_popup_shown", {});

/** User dismissed the WhatsApp popup */
export const trackWhatsAppPopupDismissed = () =>
  trackEvent("whatsapp_popup_dismissed", {});

/** Exit intent modal triggered (mouse leaves viewport) */
export const trackExitIntentShown = () =>
  trackEvent("exit_intent_shown", {});

/** User clicked CTA inside exit intent modal */
export const trackExitIntentConverted = () =>
  trackEvent("exit_intent_converted", {});

/** User dismissed exit intent without converting */
export const trackExitIntentDismissed = () =>
  trackEvent("exit_intent_dismissed", {});

/** FAQ accordion item opened */
export const trackFaqOpened = (question: string, index: number) =>
  trackEvent("faq_opened", { question, question_index: index });

/** User opened the SEO evidence lightbox */
export const trackEvidenceLightboxOpened = (image_index: number) =>
  trackEvent("evidence_lightbox_opened", { image_index });
