import { useEffect, useRef } from "react";
import { X, Clock, Calendar, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/gEm0YwOkG4AarjCYtCq9";
const SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";

const BookingModal = ({ open, onClose }: BookingModalProps) => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!open || scriptLoaded.current) return;
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) { scriptLoaded.current = true; return; }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => { scriptLoaded.current = true; };
    document.body.appendChild(script);
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-2xl max-h-[90vh] flex flex-col bg-background rounded-2xl border border-border shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Agendar consultoría de 20 minutos"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
                    <Calendar size={17} className="text-brand" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm leading-tight">
                      Agendar Consultoría
                    </p>
                    <p className="text-xs text-muted-foreground">Gratis · Sin compromiso</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      20 minutos
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={12} />
                      Sin permanencias
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Cerrar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Calendar iframe */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <iframe
                  src={BOOKING_URL}
                  id="gEm0YwOkG4AarjCYtCq9_booking"
                  style={{ width: "100%", border: "none", minHeight: "650px", display: "block" }}
                  scrolling="no"
                  title="Agendar consultoría de 20 minutos con ROICAS"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
