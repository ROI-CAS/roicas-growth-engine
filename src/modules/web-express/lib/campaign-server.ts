import { useEffect, useState } from "react";
import { productRequest } from "./request";
export type CampaignClock = { serverNow: number; checkoutUrl: string | null };
export const getCampaignClock = () => productRequest<CampaignClock>("clock");
export function useCampaignClock(): CampaignClock {
  // A closed campaign until the server provides the authoritative time and checkout.
  const [clock, setClock] = useState<CampaignClock>({ serverNow: 0, checkoutUrl: null });
  useEffect(() => {
    let cancelled = false;
    void getCampaignClock().then(value => { if (!cancelled) setClock(value); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return clock;
}
