import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { buildWhatsAppUrl } from "@/modules/diagnostico/lib/contact";
import { trackContact } from "@/modules/diagnostico/lib/pixel";
import { cn } from "@/lib/utils";

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Show persuasive bubble shortly after the float appears
  useEffect(() => {
    if (!visible) return;
    const dismissed = sessionStorage.getItem("wa-bubble-dismissed");
    if (dismissed) return;
    const t = setTimeout(() => setBubbleOpen(true), 1200);
    return () => clearTimeout(t);
  }, [visible]);

  const dismissBubble = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBubbleOpen(false);
    sessionStorage.setItem("wa-bubble-dismissed", "1");
  };

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50",
        "hidden md:flex items-center gap-3",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Persuasive bubble */}
      <div
        className={cn(
          "relative flex items-center gap-2 rounded-full bg-background px-4 py-2.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)] ring-1 ring-border",
          "transition-all duration-300 origin-right",
          bubbleOpen
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-90 translate-x-4 pointer-events-none"
        )}
      >
        <span className="text-sm font-semibold text-ink whitespace-nowrap">
          ¿Necesitas ayuda?
        </span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-soft" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <button
          type="button"
          onClick={dismissBubble}
          aria-label="Cerrar mensaje"
          className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-ink-soft hover:bg-muted hover:text-ink transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        {/* Tail */}
        <span
          aria-hidden
          className="absolute right-[-6px] top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 bg-background ring-1 ring-border [clip-path:polygon(0_0,100%_100%,0_100%)]"
        />
      </div>

      {/* WhatsApp button */}
      <a
        href={buildWhatsAppUrl("Hola Roicas, quiero información sobre sus servicios.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        onClick={trackContact}
        className="relative group block h-14 w-14 md:h-16 md:w-16"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 motion-safe:animate-ping" aria-hidden />
        {/* Unread dot */}
        <span
          aria-hidden
          className="absolute -top-1 -right-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background"
        >
          1
        </span>
        <span className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-8px_rgba(37,211,102,0.6)] transition-transform group-hover:scale-105">
          <svg viewBox="0 0 32 32" className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" aria-hidden="true">
            <path d="M19.11 17.21c-.27-.13-1.6-.79-1.84-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.33-.8-.71-1.34-1.6-1.49-1.86-.16-.27-.02-.41.12-.54.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.13.18 1.91 2.92 4.62 4.09.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.29.23-.64.23-1.18.16-1.29-.07-.11-.25-.18-.52-.31zM16.02 5.33c-5.9 0-10.69 4.79-10.69 10.69 0 1.88.49 3.72 1.43 5.34l-1.52 5.55 5.69-1.49a10.62 10.62 0 0 0 5.09 1.3h.01c5.9 0 10.69-4.79 10.69-10.69 0-2.86-1.11-5.55-3.13-7.57a10.62 10.62 0 0 0-7.57-3.13zm0 19.49h-.01a8.81 8.81 0 0 1-4.49-1.23l-.32-.19-3.37.88.9-3.29-.21-.34a8.84 8.84 0 0 1-1.36-4.69c0-4.89 3.98-8.87 8.87-8.87 2.37 0 4.6.92 6.27 2.6a8.81 8.81 0 0 1 2.6 6.27c0 4.89-3.98 8.87-8.88 8.87z" />
          </svg>
        </span>
      </a>
    </div>
  );
}
