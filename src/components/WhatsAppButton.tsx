import { ArrowUpRight } from "lucide-react";
import { trackWhatsAppClicked } from "@/lib/analytics";

const WHATSAPP_NUMBER = "573114565403";
const WHATSAPP_MESSAGE = "Hola, estoy interesado en sus servicios. ¿Podrían darme más información?";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <aside
      className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
      aria-label="Atención por WhatsApp"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        onClick={() => trackWhatsAppClicked("button")}
        className="group relative flex min-h-14 items-center gap-2.5 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-[0_6px_22px_rgba(17,125,65,0.3)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#1fbd5b] hover:shadow-[0_10px_28px_rgba(17,125,65,0.4)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-16 sm:gap-3 sm:px-5 sm:text-base"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0 fill-current sm:h-8 sm:w-8" aria-hidden="true">
          <path d="M19.11 17.21c-.27-.13-1.6-.79-1.84-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.33-.8-.71-1.34-1.6-1.49-1.86-.16-.27-.02-.41.12-.54.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.13.18 1.91 2.92 4.62 4.09.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.29.23-.64.23-1.18.16-1.29-.07-.11-.25-.18-.52-.31zM16.02 5.33c-5.9 0-10.69 4.79-10.69 10.69 0 1.88.49 3.72 1.43 5.34l-1.52 5.55 5.69-1.49a10.62 10.62 0 0 0 5.09 1.3h.01c5.9 0 10.69-4.79 10.69-10.69 0-2.86-1.11-5.55-3.13-7.57a10.62 10.62 0 0 0-7.57-3.13zm0 19.49h-.01a8.81 8.81 0 0 1-4.49-1.23l-.32-.19-3.37.88.9-3.29-.21-.34a8.84 8.84 0 0 1-1.36-4.69c0-4.89 3.98-8.87 8.87-8.87 2.37 0 4.6.92 6.27 2.6a8.81 8.81 0 0 1 2.6 6.27c0 4.89-3.98 8.87-8.88 8.87z" />
        </svg>
        <span>Hablemos por WhatsApp</span>
        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
      </a>
    </aside>
  );
}
