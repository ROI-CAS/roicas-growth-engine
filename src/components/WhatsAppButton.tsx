import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import {
  trackWhatsAppPopupShown,
  trackWhatsAppPopupDismissed,
  trackWhatsAppClicked,
  trackLeadCaptured,
} from "@/lib/analytics";

const WHATSAPP_NUMBER = "573114565403";
const WHATSAPP_MESSAGE = "Hola, estoy interesado en sus servicios. ¿Podrían darme más información?";

const WhatsAppButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  useEffect(() => {
    if (dismissed) return;
    
    const timer = setTimeout(() => {
      setShowPopup(true);
      trackWhatsAppPopupShown();
    }, 10000);

    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPopup(false);
    setDismissed(true);
    trackWhatsAppPopupDismissed();
  };

  const handlePopupClick = () => {
    setShowPopup(false);
    setDismissed(true);
    trackWhatsAppClicked("popup");
    trackLeadCaptured("whatsapp");
  };

  const handleButtonClick = () => {
    setShowPopup(false);
    setDismissed(true);
    trackWhatsAppClicked("button");
    trackLeadCaptured("whatsapp");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup Message */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-background border border-border rounded-2xl shadow-xl p-4 max-w-[280px] mr-2"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 bg-muted hover:bg-muted-foreground/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="Cerrar mensaje"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
            
            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-background border-r border-b border-border rotate-45" />
            
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                👋 ¿Listo para escalar tu negocio?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Agenda una <span className="font-medium text-primary">consultoría gratuita</span> y descubre cómo podemos duplicar tus leads cualificados.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePopupClick}
                className="inline-block mt-1 text-xs font-medium text-[#25D366] hover:underline"
              >
                Escríbenos ahora →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleButtonClick}
        className="flex items-center gap-3 group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Contactar por WhatsApp"
      >
        {/* Tooltip on hover */}
        <motion.span
          className="hidden md:block bg-background text-foreground text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: 10, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
        >
          ¿Necesitas ayuda?
        </motion.span>

        {/* Button */}
        <div className="relative">
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
          
          {/* Main button */}
          <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <MessageCircle className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" />
          </div>
        </div>
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
