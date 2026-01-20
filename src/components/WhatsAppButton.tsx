import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "573114565403";
const WHATSAPP_MESSAGE = "Hola, estoy interesado en sus servicios. ¿Podrían darme más información?";

const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contactar por WhatsApp"
    >
      {/* Tooltip */}
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
  );
};

export default WhatsAppButton;
