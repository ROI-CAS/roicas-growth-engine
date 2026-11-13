/** Configuración central del sitio — un solo lugar para datos que se repiten. */
export const SITE_URL = "https://www.roicas.com/web-express";
export const SITE_NAME = "Web Express 24H";
export const WHATSAPP_NUMBER = "573114565403";
export const WHATSAPP_DISPLAY = "+57 311 456 5403";

/** Mensajes de WhatsApp predefinidos según el punto de contacto */
export const WHATSAPP_MESSAGES = {
  hero: "Hola Roicas, vi Web Express 24H y quiero cotizar la página web para mi negocio.",
  pricing: "Hola Roicas, me interesa el plan de Web Express de $490.000 COP. ¿Cómo empezamos?",
  garantia: "Hola Roicas, tengo una consulta sobre la entrega en 24 horas y la garantía de mi página web.",
  brief: "Hola Roicas, prefiero enviar los datos de mi negocio directamente por WhatsApp para mi página web.",
  general: "Hola Web Express 24H, quiero información para tener mi página web profesional en 24 horas.",
};

export function getWhatsAppUrl(messageKey: keyof typeof WHATSAPP_MESSAGES = "general", customText?: string): string {
  const text = customText || WHATSAPP_MESSAGES[messageKey] || WHATSAPP_MESSAGES.general;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Fuente única de verdad del precio — cámbialo aquí y se propaga a toda la web. */
export const PRICE_TOTAL_COP = 490000;
/** Anticipo del 50% para iniciar el proyecto. */
export const PRICE_DEPOSIT_COP = PRICE_TOTAL_COP / 2;

const copFormatter = new Intl.NumberFormat("es-CO");
/** "$490.000" */
export const PRICE_TOTAL_LABEL = `$${copFormatter.format(PRICE_TOTAL_COP)}`;
/** "$245.000" */
export const PRICE_DEPOSIT_LABEL = `$${copFormatter.format(PRICE_DEPOSIT_COP)}`;
export const WOMPI_CHECKOUT_URL = "https://checkout.wompi.co/l/VPOS_iMyq6G";
export const DEMO_URL = "https://vet.roicas.com/";

/** IDs de Analítica y Pauta */
export const META_PIXEL_ID =
  (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || "1945796449447211";
export const GOOGLE_TAG_ID =
  (import.meta.env.VITE_GOOGLE_TAG_ID as string | undefined) || "";
export const CLARITY_PROJECT_ID =
  (import.meta.env.VITE_CLARITY_ID as string | undefined) || "";

