"use client";

import { ArrowRight, BarChart3, Check, ChevronRight, X } from "lucide-react";
import { Reveal } from "@/modules/web-express/components/Reveal";


const withoutWebsite = [
  "Tu información se pierde en redes",
  "Cuesta conocer todos tus servicios",
  "No tienes un enlace web propio",
  "El contacto requiere más pasos",
];
const withWebsite = [
  "Tu marca en un dominio propio",
  "Tus servicios, claros y organizados",
  "Tu ubicación con Google Maps",
  "Contacto directo por WhatsApp",
  "Información disponible 24/7",
];

export function BusinessPresence() {
  return (
    <section
      id="presencia"
      className="business-presence"
      aria-label="Tu negocio sin página web y con Web Express"
    >
      <div className="business-presence__inner">
        <Reveal className="business-presence__comparison">
          <article className="business-presence__panel business-presence__panel--web-express-before">
            <img
              src="/products/web-express/images/business-without-website.webp"
              alt=""
              aria-hidden="true"
              width="1280"
              height="720"
              loading="lazy"
              decoding="async"
            />
            <div className="business-presence__shade" aria-hidden="true" />
            <div className="business-presence__content">
              <p className="business-presence__eyebrow">SIN PÁGINA WEB</p>
              <h2>
                Tu negocio puede
                <br />
                pasar desapercibido
              </h2>
              <ul>
                {withoutWebsite.map((text) => (
                  <li key={text}>
                    <span className="business-presence__status" aria-hidden="true">
                      <X strokeWidth={2.5} />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
          <span className="business-presence__bridge" aria-hidden="true">
            <ChevronRight strokeWidth={1.8} />
          </span>
          <article className="business-presence__panel business-presence__panel--web-express-after">
            <img
              src="/products/web-express/images/business-with-website.webp"
              alt=""
              aria-hidden="true"
              width="1280"
              height="720"
              loading="lazy"
              decoding="async"
            />
            <div className="business-presence__shade" aria-hidden="true" />
            <div className="business-presence__content">
              <p className="business-presence__eyebrow">CON WEB EXPRESS</p>
              <h2>
                Tu negocio visible,
                <br />
                fácil de contactar
              </h2>
              <ul>
                {withWebsite.map((text) => (
                  <li key={text}>
                    <span className="business-presence__status" aria-hidden="true">
                      <Check strokeWidth={2.5} />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="business-presence__badge">
              <BarChart3 aria-hidden="true" strokeWidth={2} />
              <span>
                Más presencia.
                <br />
                <strong>Más oportunidades.</strong>
              </span>
            </div>
          </article>
        </Reveal>
        <Reveal className="business-presence__footer" delay={80}>
          <p>Una presencia digital clara. Un camino más sencillo para llegar a tu negocio.</p>
          <a href="#incluye">
            Conoce qué incluye <ArrowRight aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
