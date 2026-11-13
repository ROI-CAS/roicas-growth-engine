import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, ScanSearch } from "lucide-react";
import { z } from "zod";
import { buildWhatsAppUrl, scrollToId } from "@/modules/diagnostico/lib/contact";
import { trackContact, trackCheckupUrl, trackCheckupForm } from "@/modules/diagnostico/lib/pixel";
import { Reveal } from "./Reveal";

const DOMAIN_REGEX =
  /^(https?:\/\/)?(www\.)?([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(\/[^\s]*)?$/i;

const siteSchema = z
  .string()
  .trim()
  .max(120, { message: "Máximo 120 caracteres." })
  .regex(DOMAIN_REGEX, {
    message: "Ingresa un dominio válido (ej: minegocio.com).",
  });

export function QuickCheckup() {
  const [site, setSite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = site.trim();

    if (clean) {
      const parsed = siteSchema.safeParse(clean);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Dominio inválido.");
        setSent(false);
        return;
      }
    }

    setError(null);
    setSent(true);

    if (clean) {
      // Ya tiene sitio → WhatsApp con contexto del URL para conversación directa
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("roicas-site", clean);
      }
      const msg = `Hola Roicas! Quiero saber cómo está mi web: ${clean} — me interesa el diagnóstico gratuito.`;
      setTimeout(() => {
        trackContact();
        trackCheckupUrl();
        window.open(buildWhatsAppUrl(msg), "_blank", "noopener,noreferrer");
      }, 450);
    } else {
      // No tiene sitio → llevar al formulario para capturar el lead
      trackCheckupForm();
      setTimeout(() => scrollToId("contacto"), 500);
    }
  };

  const handleChange = (value: string) => {
    setSite(value);
    if (error) setError(null);
    if (sent) setSent(false);
  };

  const hasSite = site.trim().length > 0;

  return (
    <section id="checkup" className="relative py-8 md:py-10" aria-label="Solicitar diagnóstico digital gratuito">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            {/* Eyebrow — contextualiza el input antes de que lean el placeholder */}
            <h2 className="mb-3 text-center font-display text-2xl font-semibold text-ink">¿Ya tienes una web? Empecemos por ella.</h2>
            <p className="mb-5 text-center text-base text-ink-soft">Comparte tu dominio por WhatsApp para solicitar la revisión. Si aún no tienes web, continúa con las preguntas de abajo.</p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-stretch gap-2 rounded-2xl border hairline bg-card p-2 shadow-soft sm:flex-row sm:items-center"
            >
              <label htmlFor="quick-site" className="sr-only">
                Tu sitio web actual
              </label>
              <div
                className={`flex flex-1 items-center gap-2.5 rounded-xl bg-cream-deep/40 px-4 transition-all ${
                  error ? "ring-1 ring-destructive" : "focus-within:bg-cream-deep/60"
                }`}
              >
                <ScanSearch className="h-4 w-4 shrink-0 text-primary/60" />
                <input
                  id="quick-site"
                  type="text"
                  inputMode="url"
                  value={site}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Tu dominio actual (ej: minegocio.com)"
                  className="h-12 w-full bg-transparent text-base text-ink placeholder:text-ink-soft focus:outline-none"
                  maxLength={120}
                  aria-invalid={!!error}
                  aria-describedby={error ? "quick-site-error" : undefined}
                />
              </div>
              <button
                type="submit"
                className={`group inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-cream transition-all duration-200 hover:-translate-y-0.5 ${
                  hasSite
                    ? "bg-[#25D366] hover:bg-[#1da851]"
                    : "bg-primary hover:bg-[hsl(354,75%,32%)]"
                }`}
              >
                {hasSite ? (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    Solicitar por WhatsApp
                  </>
                ) : (
                  <>
                    Quiero mi diagnóstico
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <p
                id="quick-site-error"
                role="alert"
                className="mt-3 text-center text-sm font-medium text-destructive"
              >
                {error}
              </p>
            )}

            {sent && !error && (
              <div
                role="status"
                className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-primary/8 px-4 py-3 text-sm font-semibold text-primary animate-fade-in-up"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {hasSite
                  ? "¡Listo! Abriendo WhatsApp para revisar tu sitio…"
                  : "¡Perfecto! Completa tus datos abajo para recibir el diagnóstico."}
              </div>
            )}

            {!sent && !error && (
              <p className="mt-3 text-center text-xs text-ink-soft/60">
                {hasSite
                  ? "Abrirá WhatsApp con tu dominio. El diagnóstico no se genera automáticamente."
                  : "No necesitas una web para solicitar orientación. Sin compromiso."}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
