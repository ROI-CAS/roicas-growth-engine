import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/modules/diagnostico/components/ui/button";
import { buildWhatsAppUrl, scrollToId } from "@/modules/diagnostico/lib/contact";
import { trackContact, trackAgendaClick } from "@/modules/diagnostico/lib/pixel";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-primary p-10 text-primary-foreground shadow-brand md:p-16">
            {/* Decoration */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-primary-glow/40 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-ink/30 blur-3xl" />
              <div className="absolute right-10 top-10 h-24 w-24 rounded-full border-4 border-cream/20" />
              <div className="absolute bottom-12 right-24 h-16 w-16 rotate-12 rounded-2xl bg-accent/40" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <h2 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-cream md:text-6xl text-balance">
                  Aclaremos el siguiente paso para tu negocio
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/90 md:text-xl">
                  Web Onepage desde <strong className="text-cream">$350.000</strong>. Web completa desde <strong className="text-cream">$650.000</strong>.{" "}
                  Proceso claro, sin sorpresas, sin permanencia.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  size="xl"
                  variant="inverse"
                  onClick={() => { trackAgendaClick("final_cta"); scrollToId("agenda"); }}
                >
                  Agendar mi llamada gratis
                  <ArrowRight className="group-hover:translate-x-1" />
                </Button>
                <Button size="xl" variant="inverse-outline" asChild>
                  <a
                    href={buildWhatsAppUrl("Hola Roicas, quiero orientación sobre el siguiente paso para mi negocio.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackContact}
                  >
                    <MessageCircle />
                    WhatsApp directo
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
