import { ArrowRight } from "lucide-react";
import { OfferProvider } from "@/modules/web-express/components/OfferProvider";
import { PremiumCampaign } from "@/modules/web-express/components/PremiumCampaign";
import { useCampaignWindow } from "@/modules/web-express/hooks/use-campaign-window";
import { getWhatsAppUrl } from "@/modules/web-express/lib/site";
import { BLACK_NOVEMBER, formatCOP } from "@/modules/web-express/lib/campaign";


type CampaignState = { serverNow: number; checkoutUrl: string | null };
export function CampaignNotice({ serverNow }: { serverNow: number }) {
  const status = useCampaignWindow(serverNow);
  if (status !== "active") return null;
  return (
    <a className="campaign-notice" href="/web-express/black-november">
      <span>Black November</span> One Page por {formatCOP(BLACK_NOVEMBER.totalCOP)} durante
      noviembre <ArrowRight aria-hidden="true" />
    </a>
  );
}
export function BlackNovemberLanding({ state }: { state: CampaignState }) {
  const status = useCampaignWindow(state.serverNow);
  if (status !== "active")
    return (
      <main className="campaign-ended">
        <span className="plan-eyebrow">Web Express · Black November</span>
        <h1>
          {status === "upcoming"
            ? "Conoce las opciones para tu próxima web"
            : "La campaña de noviembre ha terminado"}
        </h1>
        <p>
          Consulta la oferta vigente de Web Express. Te ayudamos a elegir una página acorde a tu
          negocio.
        </p>
        <a
          className="plan-button plan-whatsapp"
          href={getWhatsAppUrl(
            "general",
            "Hola Roicas, quiero consultar las opciones disponibles para mi página web tras visitar Black November.",
          )}
        >
          Consultar disponibilidad <ArrowRight aria-hidden="true" />
        </a>
      </main>
    );
  return (
    <OfferProvider
      offer={{
        campaign: true,
        id: BLACK_NOVEMBER.id,
        totalCOP: BLACK_NOVEMBER.totalCOP,
        checkoutUrl: state.checkoutUrl,
        termsHref: "#condiciones",
      }}
    >
      <PremiumCampaign serverNow={state.serverNow} />
    </OfferProvider>
  );
}
