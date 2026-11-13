import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/modules/web-express/components/ui/dialog";
import { Calendar, ExternalLink } from "lucide-react";

const BOOKING_URL = "https://api.leadconnectorhq.com/widget/bookings/calendario-3-1";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-4 sm:p-6 rounded-3xl gap-0 overflow-hidden max-h-[92vh] flex flex-col">
        <DialogHeader className="pb-3 space-y-1">
          <div className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-wider">
            <Calendar className="size-4" />
            Reunión Opcional de 20 Minutos
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-display font-bold tracking-tight">
            Agenda tu Cita
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pr-8">
            Elige la fecha y hora que mejor se acomode a tu agenda para resolver cualquier duda.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 w-full bg-background rounded-2xl overflow-auto border border-border relative min-h-0">
          <iframe
            src={BOOKING_URL}
            title="Agendar Cita - Web Express 24H"
            className="w-full h-full min-h-[550px] border-0 rounded-2xl"
          />
        </div>

        <div className="pt-3 flex flex-wrap gap-3 items-center justify-between text-sm text-muted-foreground">
          <span>Si no carga, abre el calendario aparte.</span>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
          >
            Abrir calendario en ventana nueva <ExternalLink className="size-3" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
