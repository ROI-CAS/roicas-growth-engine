import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { getCampaignAvailability } from "@/modules/web-express/lib/campaign";

/** Scheduled weekly countdown anchored to the server clock, in Colombia time. */
export function CampaignAvailability({
  serverNow,
  compact = false,
}: {
  serverNow: number;
  compact?: boolean;
}) {
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    const started = performance.now();
    const sync = () => setNow(serverNow + performance.now() - started);
    const timer = window.setInterval(sync, 30000);
    const visible = () => {
      if (!document.hidden) sync();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [serverNow]);
  const available = getCampaignAvailability(now);
  if (available === null) return null;
  return (
    <div className={`premium-availability${compact ? " premium-availability--web-express-compact" : ""}`}>
      <CalendarDays aria-hidden="true" />
      <div>
        <strong>
          <b>{available}</b> {available === 1 ? "espacio disponible" : "espacios disponibles"} esta
          semana
        </strong>
        <span>Reserva en noviembre · Inicio según cotización</span>
      </div>
    </div>
  );
}
