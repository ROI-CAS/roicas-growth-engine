import { useEffect, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { buildWhatsAppUrl, scrollToId } from "@/modules/diagnostico/lib/contact";
import { trackContact, trackNavCTA } from "@/modules/diagnostico/lib/pixel";
import { cn } from "@/lib/utils";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY;
      // Show only when scrolled past hero AND scrolling up
      setVisible(y > 480 && !goingDown);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 md:hidden",
        "transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      aria-hidden={!visible}
      inert={!visible ? "" : undefined}
    >
      <div className="border-t border-border bg-cream/95 px-3 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { trackNavCTA("sticky_diagnostico"); scrollToId("contacto"); }}
            className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-brand active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            Diagnóstico gratis
          </button>
          <a
            href={buildWhatsAppUrl("Hola Roicas, quiero información sobre sus servicios.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackContact}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-semibold text-ink shadow-soft active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
