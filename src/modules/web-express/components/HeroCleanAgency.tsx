"use client";

import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/modules/web-express/components/WhatsAppIcon";
import { useLandingOffer } from "@/modules/web-express/lib/landing-offer";


export function HeroCleanAgency({
  onCta,
  onWhatsapp,
}: {
  onCta: () => void;
  onBooking: () => void;
  onWhatsapp?: () => void;
}) {
  const offer = useLandingOffer();

  return (
    <header id="top" className={`express-hero${offer.campaign ? " campaign-hero" : " express-product-hero"}`}>
      <div className="express-hero__inner">
        <div className="express-hero__copy">
          {offer.campaign && (
            <p className="campaign-hero-notice">Black November · Solo durante noviembre</p>
          )}
          <h1>
            {offer.campaign ? (
              <>
                Este noviembre,
                <br className="express-hero__break" /> estrena tu web <strong>profesional.</strong>
              </>
            ) : (
              <>
                Una página web <strong>para tu negocio.</strong>
              </>
            )}
          </h1>
          <p className="express-hero__description">
            {offer.campaign ? (
              <>
                Una One Page para presentar tu negocio y facilitar el contacto. Dominio .com y
                hosting el primer año incluidos. Propuesta en{" "}
                <b>24 horas hábiles desde tu brief completo.</b>
              </>
            ) : (
              <>
                Presenta tus servicios en una página con{" "}
                <span className="express-hero__nowrap">dominio .com</span>, Google Maps y acceso directo
                a WhatsApp. Recibe una propuesta en <b>24 horas hábiles desde tu brief completo.</b>
              </>
            )}
          </p>
        </div>
        <div className="express-hero__conversion">
          <div className="express-hero__actions">
            <a
              href={offer.whatsappUrl("hero")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsapp}
              className="express-hero__primary"
            >
              <WhatsAppIcon aria-hidden="true" />
              <span>{offer.campaign ? "Quiero mi One Page" : "Cotizar por WhatsApp"}</span>
              <ArrowRight aria-hidden="true" />
            </a>
            <button type="button" onClick={onCta} className="express-hero__secondary">
              <FileText aria-hidden="true" />
              <span>{offer.campaign ? "Ver los dos planes" : "Llenar brief online"}</span>
            </button>
          </div>
          <p className="express-hero__price">
            {offer.campaign ? (
              <>
                <span className="campaign-hero-price">{offer.totalLabel}</span>
                <span>One Page por este mes de noviembre</span>
                <span>Empieza con {offer.depositLabel} · 50% al aprobar</span>
                <span className="campaign-hero-date">
                  Hasta el 30 de noviembre de 2026 · Hora Colombia
                </span>
              </>
            ) : (
              <>
                <span>
                  Empieza con solo <b>{offer.depositLabel}</b> (50%)
                </span>
                <span className="express-hero__dot" aria-hidden="true">
                  ·
                </span>
                <span>
                  Total: <b>{offer.totalLabel}</b>
                </span>
              </>
            )}
          </p>
          <div className="express-hero__help">
            <Sparkles aria-hidden="true" />
            <div><b>¿No tienes fotos ni textos?</b><span>Preparamos textos e imágenes de apoyo.</span></div>
          </div>
        </div>
        <div className="express-hero__visual">
          <img src="/products/web-express/banner_hero_poster.webp" alt="Presentación visual de Web Express de ROICAS" width={1280} height={720} fetchPriority="high" />
        </div>
      </div>
    </header>
  );
}
