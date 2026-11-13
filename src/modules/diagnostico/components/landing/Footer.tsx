import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { buildWhatsAppUrl, scrollToId, WHATSAPP_NUMBER } from "@/modules/diagnostico/lib/contact";
import { trackContact } from "@/modules/diagnostico/lib/pixel";

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream-deep/50">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <img src="/products/diagnostico/logo-roicas.webp" alt="ROICAS logo" className="h-10 w-auto" />
            <p className="mt-4 max-w-sm text-sm text-ink-soft">
              Estudio digital. Páginas web, campañas y CRM automatizado con IA para negocios que quieren crecer en serio.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              Navegación
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              {[
                { label: "Servicios", id: "servicios" },
                { label: "Paquetes", id: "paquetes" },
                { label: "Resultados", id: "resultados" },
                { label: "Contacto", id: "contacto" },
              ].map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollToId(l.id)}
                    className="story-link hover:text-ink"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              Contacto
            </h4>
            <a
              href={buildWhatsAppUrl("Hola Roicas, quiero información.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackContact}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-primary"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              +57 311 456 5403
            </a>
            <p className="mt-3 text-sm text-ink-soft">Trabajamos con clientes en cualquier parte del mundo.</p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackContact}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-deep"
            >
              <MessageCircle className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
            <p className="sr-only">{WHATSAPP_NUMBER}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-ink-soft sm:flex-row sm:items-center">
          <p>© 2026 Roicas. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/diagnostico-digital/privacidad" className="hover:text-ink hover:underline">
              Política de privacidad
            </Link>
            <span aria-hidden>·</span>
            <p>Diseñado y desarrollado por Roicas.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
