"use client";

import { useState } from "react";
import { Reveal } from "@/modules/web-express/components/Reveal";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Baby,
  BookOpen,
  HeartPulse,
  Scale,
  Stethoscope,
  PawPrint,
  ZoomIn,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/modules/web-express/components/ui/dialog";


const designs = [
  {
    title: "Kindy",
    description: "Eventos y entretenimiento infantil",
    image: "/products/web-express/images/projects/kindy.webp",
    url: "https://kindydemo.roicas.com/",
    icon: Baby,
  },
  {
    title: "NEXUS520",
    description: "Plataforma educativa",
    image: "/products/web-express/images/projects/nexus520.webp",
    url: "https://www.nexus520.com/",
    icon: BookOpen,
  },
  {
    title: "Representación legal",
    description: "Servicios jurídicos",
    image: "/products/web-express/images/projects/legal.webp",
    url: "https://representacionlegal-roicas.vercel.app/",
    icon: Scale,
  },
  {
    title: "Findolor",
    description: "Centro médico",
    image: "/products/web-express/images/projects/findolor.webp",
    url: "https://citas.findolor.com/",
    icon: HeartPulse,
  },
  {
    title: "Odontología",
    description: "Servicios odontológicos",
    image: "/products/web-express/images/projects/odonto.webp",
    url: "https://odonto.roicas.com/",
    icon: Stethoscope,
  },
  {
    title: "Roicas Vet",
    description: "Servicios veterinarios",
    image: "/products/web-express/images/projects/vet.webp",
    url: "https://vet.roicas.com/",
    icon: PawPrint,
  },
];

export function DesignShowcase({
  onCta,
  variant = "default",
}: {
  onCta: () => void;
  variant?: "default" | "campaign";
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const active = selected === null ? null : designs[selected];

  return (
    <section id="disenos" className="design-showcase" aria-labelledby="design-showcase-title">
      <div className="design-showcase__inner">
        <Reveal className="design-showcase__intro">
          <p className="design-showcase__eyebrow">
            <span aria-hidden="true" />
            WEBS QUE PUEDES EXPLORAR
          </p>
          <h2 id="design-showcase-title">
            {variant === "campaign" ? (
              <>
                Mira lo que podemos
                <br />
                crear para tu negocio.
              </>
            ) : (
              <>
                Páginas diseñadas <br />
                para vender
              </>
            )}
          </h2>
          <p className="design-showcase__description">
            {variant === "campaign"
              ? "Explora seis proyectos y abre sus páginas para conocerlos en detalle."
              : "Conoce nuestros ejemplos y visita cada web para explorar su diseño."}
          </p>
          <button type="button" onClick={() => setSelected(0)} className="design-showcase__explore">
            Explorar ejemplos <ArrowRight aria-hidden="true" />
          </button>
          <span className="design-showcase__note">
            Proyectos y demos disponibles para explorar.
          </span>
        </Reveal>
        <div className="design-showcase__grid">
          {designs.map((design, index) => {
            const Icon = design.icon;
            return (
              <Reveal
                key={design.title}
                delay={Math.min(index * 30, 120)}
                className="design-showcase__reveal"
              >
                <button
                  type="button"
                  className="design-showcase__card"
                  onClick={() => setSelected(index)}
                  aria-label={`Ampliar ejemplo: ${design.title}`}
                >
                  <div className="design-showcase__image">
                    <img
                      src={design.image}
                      alt={`Ejemplo de página web para ${design.title.toLowerCase()}`}
                      width="1536"
                      height="1024"
                      loading="lazy"
                      decoding="async"
                    />
                    {variant === "campaign" && (
                      <>
                        <span className="premium-project-number" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")} / 06
                        </span>
                        <span className="premium-project-reveal" aria-hidden="true">
                          Ampliar proyecto
                          <ArrowUpRight />
                        </span>
                      </>
                    )}
                    <span className="design-showcase__zoom" aria-hidden="true">
                      <ZoomIn />
                    </span>
                  </div>
                  <div className="design-showcase__info">
                    <span className="design-showcase__icon">
                      <Icon aria-hidden="true" strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3>{design.title}</h3>
                      <p>{design.description}</p>
                    </div>
                  </div>
                </button>
                <a
                  className="design-showcase__live-link"
                  href={design.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visitar sitio: ${design.title}`}
                >
                  Visitar sitio
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="design-showcase__dialog">
          {active && (
            <>
              <div className="pr-6">
                <DialogTitle>{active.title}</DialogTitle>
                <DialogDescription className="mt-2">
                  {active.description}. Explora la imagen o visita la página enlazada.
                </DialogDescription>
              </div>
              <img
                className="design-showcase__preview"
                src={active.image}
                alt={`Diseño ampliado: ${active.title}`}
                width="1536"
                height="1024"
              />
              <div className="design-showcase__dialog-actions">
                <div className="design-showcase__pagination">
                  <button
                    type="button"
                    aria-label="Ejemplo anterior"
                    onClick={() =>
                      setSelected(((selected ?? 0) + designs.length - 1) % designs.length)
                    }
                  >
                    <ArrowLeft aria-hidden="true" />
                  </button>
                  <span>
                    {(selected ?? 0) + 1} / {designs.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Ejemplo siguiente"
                    onClick={() => setSelected(((selected ?? 0) + 1) % designs.length)}
                  >
                    <ArrowRight aria-hidden="true" />
                  </button>
                </div>
                <a
                  className="design-showcase__visit"
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visitar sitio
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <button
                  type="button"
                  className="design-showcase__request"
                  onClick={() => {
                    setSelected(null);
                    onCta();
                  }}
                >
                  Quiero una web así <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
