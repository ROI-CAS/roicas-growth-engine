import { useEffect, useState } from "react";
import { BLACK_NOVEMBER, getCampaignStatus } from "@/modules/web-express/lib/campaign";
import { getCampaignClock } from "@/modules/web-express/lib/campaign-server";

export function useCampaignWindow(serverNow: number) {
  const [status, setStatus] = useState(() => getCampaignStatus(serverNow));
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let anchorNow = serverNow;
    let anchorTick = performance.now();
    const schedule = (sample: number) => {
      if (cancelled) return;
      const current = getCampaignStatus(sample);
      setStatus(current);
      if (current === "expired") return;
      const boundary = Date.parse(
        current === "upcoming" ? BLACK_NOVEMBER.startsAt : BLACK_NOVEMBER.endsAt,
      );
      // Bounded timers: recompute from server at least hourly, and at campaign boundaries.
      timer = setTimeout(refresh, Math.max(1, Math.min(boundary - sample, 3600000)));
    };
    const refresh = () => {
      clearTimeout(timer);
      // Expire immediately at the server-anchored deadline, even if revalidation is slow.
      setStatus(getCampaignStatus(anchorNow + performance.now() - anchorTick));
      void getCampaignClock()
        .then(({ serverNow: fresh }) => {
          anchorNow = fresh;
          anchorTick = performance.now();
          schedule(fresh);
        })
        .catch(() => {
          // Keep counting from the server sample using elapsed time, not the device clock.
          if (!cancelled) schedule(anchorNow + performance.now() - anchorTick);
        });
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    schedule(serverNow);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [serverNow]);
  return status;
}
