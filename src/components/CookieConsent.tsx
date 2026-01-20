import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show after a small delay
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-4 right-4 md:left-6 md:right-auto md:max-w-sm z-40"
        >
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-4">
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Usamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra{" "}
              <a 
                href="/politica-privacidad" 
                className="text-primary hover:underline"
              >
                política de privacidad
              </a>.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 text-xs font-medium bg-primary text-primary-foreground py-2 px-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Aceptar
              </button>
              <button
                onClick={handleDecline}
                className="text-xs text-muted-foreground hover:text-foreground py-2 px-3 transition-colors"
              >
                Rechazar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
