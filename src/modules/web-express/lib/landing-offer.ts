import { createContext, useContext } from "react";
import { PRICE_TOTAL_COP, PRICE_DEPOSIT_COP, WOMPI_CHECKOUT_URL, getWhatsAppUrl } from "@/modules/web-express/lib/site";
import { formatCOP } from "@/modules/web-express/lib/campaign";

export type LandingOffer = {
  campaign: boolean;
  id: string;
  totalCOP: number;
  checkoutUrl: string | null;
  termsHref: string;
};
const regularOffer: LandingOffer = {
  campaign: false,
  id: "standard",
  totalCOP: PRICE_TOTAL_COP,
  checkoutUrl: WOMPI_CHECKOUT_URL,
  termsHref: "/web-express/terminos",
};
export const OfferContext = createContext<LandingOffer>(regularOffer);
export function useLandingOffer() {
  const offer = useContext(OfferContext);
  const depositCOP = offer.campaign ? offer.totalCOP / 2 : PRICE_DEPOSIT_COP;
  const totalLabel = formatCOP(offer.totalCOP);
  const depositLabel = formatCOP(depositCOP);
  const whatsappUrl = (
    placement: "hero" | "pricing" | "general" | "brief" | "payment" = "general",
  ) => {
    if (!offer.campaign) return getWhatsAppUrl(placement === "payment" ? "pricing" : placement);
    const message =
      placement === "payment"
        ? `Hola Roicas, me interesa la One Page de Black November por ${totalLabel}. Quiero solicitar el enlace de Wompi para el anticipo de ${depositLabel} y conocer las condiciones antes de pagar.`
        : `Hola Roicas, vi la One Page de Black November por ${totalLabel} durante noviembre. Quiero una página para mi negocio. ¿Cómo empezamos?`;
    return getWhatsAppUrl("general", message);
  };
  return { ...offer, totalLabel, depositLabel, depositCOP, whatsappUrl };
}
