import { useRef, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { trackWhatsAppClicked } from "@/lib/analytics";

const WHATSAPP_NUMBER = "573114565403";
const WHATSAPP_MESSAGE = "Hola, estoy interesado en sus servicios. ¿Podrían darme más información?";

export default function WhatsAppButton() {
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const contactLink = useRef<HTMLAnchorElement>(null);
  const { pathname } = useLocation();
  const showSuggestion = pathname !== "/" && bubbleOpen;

  const dismissBubble = () => {
    setBubbleOpen(false);
    contactLink.current?.focus();
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <aside
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 sm:gap-3.5 transition-all duration-300 pointer-events-auto select-none"
      aria-label="Atención por WhatsApp"
    >
      {/* Tooltip / Cápsula ¿Necesitas ayuda? */}
      {showSuggestion && (
        <div className="hidden items-center rounded-full border border-neutral-100 bg-white pr-1 text-neutral-900 shadow-lg lg:flex">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClicked("button")}
            aria-label="¿Necesitas ayuda? Escribir por WhatsApp"
            className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            ¿Necesitas ayuda? <MessageSquare size={16} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={dismissBubble}
            aria-label="Cerrar sugerencia de ayuda"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Botón circular verde con aura difusa y badge rojo 1 */}
      <div className="relative flex items-center justify-center">
        {/* Halo difuso verde ambiental idéntico a la captura */}
        <span
          aria-hidden="true"
          className="absolute -inset-3 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(37, 211, 102, 0.35) 0%, rgba(37, 211, 102, 0.18) 55%, rgba(37, 211, 102, 0) 75%)"
          }}
        />

        {/* Enlace circular principal */}
        <a
          ref={contactLink}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          onClick={() => trackWhatsAppClicked("button")}
          className="relative z-10 group flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
        >
          {/* Icono oficial contorno WhatsApp (path idéntico a la referencia 32x32) */}
          <svg
            viewBox="0 0 32 32"
            className="h-7 w-7 sm:h-8 sm:w-8 fill-white"
            aria-hidden="true"
          >
            <path d="M19.11 17.21c-.27-.13-1.6-.79-1.84-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.33-.8-.71-1.34-1.6-1.49-1.86-.16-.27-.02-.41.12-.54.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.13.18 1.91 2.92 4.62 4.09.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.29.23-.64.23-1.18.16-1.29-.07-.11-.25-.18-.52-.31zM16.02 5.33c-5.9 0-10.69 4.79-10.69 10.69 0 1.88.49 3.72 1.43 5.34l-1.52 5.55 5.69-1.49a10.62 10.62 0 0 0 5.09 1.3h.01c5.9 0 10.69-4.79 10.69-10.69 0-2.86-1.11-5.55-3.13-7.57a10.62 10.62 0 0 0-7.57-3.13zm0 19.49h-.01a8.81 8.81 0 0 1-4.49-1.23l-.32-.19-3.37.88.9-3.29-.21-.34a8.84 8.84 0 0 1-1.36-4.69c0-4.89 3.98-8.87 8.87-8.87 2.37 0 4.6.92 6.27 2.6a8.81 8.81 0 0 1 2.6 6.27c0 4.89-3.98 8.87-8.88 8.87z" />
          </svg>
        </a>

        {/* Badge contador '1' no leído */}
        {showSuggestion && <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 z-20 hidden h-5 w-5 items-center justify-center rounded-full bg-[#ef4444] text-[11px] font-bold text-white shadow-sm border-2 border-white pointer-events-none lg:flex"
        >
          1
        </span>}
      </div>
    </aside>
  );
}
