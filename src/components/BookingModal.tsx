import { useEffect, useState } from "react";
import { AccessibleDialog } from "./AccessibleDialog";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}
const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/gEm0YwOkG4AarjCYtCq9";

const BookingModal = ({ open, onClose }: BookingModalProps) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "slow" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!open) return;
    setStatus("loading");
    const timeout = window.setTimeout(() => setStatus((current) => current === "loading" ? "slow" : current), 15000);
    return () => window.clearTimeout(timeout);
  }, [open, attempt]);

  return (
    <AccessibleDialog open={open} onClose={onClose} title="Agendar consultoría" description="Una conversación de 20 minutos para revisar tu negocio. Sin compromiso." className="max-w-2xl">
      <div className="border-b border-border px-5 py-3 text-sm">
        <p role="status" aria-live="polite">
          {status === "loading" ? "Cargando los horarios disponibles…" : status === "loaded" ? "Selecciona un horario en la agenda." : status === "slow" ? "La agenda está tardando más de lo esperado. Puedes abrirla en otra pestaña o volver a cargarla." : "No pudimos cargar la agenda. Inténtalo de nuevo o ábrela en otra pestaña."}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Abrir agenda en otra pestaña</a>
          {(status === "slow" || status === "error") && <button type="button" onClick={() => setAttempt((value) => value + 1)} className="min-h-11 rounded-lg px-3 font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Volver a cargar</button>}
        </div>
      </div>
      {open && <iframe
        key={attempt}
        src={BOOKING_URL}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        className="block h-[min(740px,65dvh)] min-h-80 w-full border-0"
        title="Horarios para agendar una consultoría con ROICAS"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />}
    </AccessibleDialog>
  );
};
export default BookingModal;

