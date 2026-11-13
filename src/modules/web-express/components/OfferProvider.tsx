import type { ReactNode } from "react";
import { OfferContext, type LandingOffer } from "@/modules/web-express/lib/landing-offer";

export function OfferProvider({ offer, children }: { offer: LandingOffer; children: ReactNode }) {
  return <OfferContext.Provider value={offer}>{children}</OfferContext.Provider>;
}
