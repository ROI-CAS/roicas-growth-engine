import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { trackExitIntentShown, trackExitIntentConverted, trackExitIntentDismissed } from "@/lib/analytics";

const ExitIntentPopup = () => {
  const { openBooking } = useBooking();
  const [showPopup, setShowPopup] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setShowPopup(true);
        setHasTriggered(true);
        trackExitIntentShown();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasTriggered]);

  const handleClose = () => {
    setShowPopup(false);
    trackExitIntentDismissed();
  };

  const handleConvert = () => {
    trackExitIntentConverted();
    setShowPopup(false);
    openBooking();
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-md"
          >
            <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className="bg-brand px-6 py-5 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80 font-medium">Antes de irte</p>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      ¿Hablamos 20 minutos?
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sin compromiso. Analizamos tu negocio y te decimos honestamente
                  si podemos ayudarte a crecer.
                </p>

                <ul className="space-y-2.5 text-sm text-foreground">
                  {[
                    "Diagnóstico de tu embudo de ventas",
                    "Oportunidades de automatización",
                    "Plan de acción concreto",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-brand" strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3 pt-1">
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full group cursor-pointer"
                    onClick={handleConvert}
                  >
                    Agendar mi llamada gratuita
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <button
                    onClick={handleClose}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    No gracias, seguiré explorando
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
