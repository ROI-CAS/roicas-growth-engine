import React from "react";
import { BriefFormData } from "@/types/brief";
import { SelectionCard } from "./SelectionCard";
import { BriefReviewSummary } from "./BriefReviewSummary";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Send, Clock, DollarSign, ShieldCheck, User, Mail, Phone } from "lucide-react";

interface BriefStep5ContactProps {
  data: BriefFormData;
  onChange: (updates: Partial<BriefFormData>) => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export const BriefStep5Contact: React.FC<BriefStep5ContactProps> = ({
  data,
  onChange,
  onEditStep,
  onSubmit,
  isSubmitting,
  errors,
}) => {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* 5.1 Datos de contacto */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <ShieldCheck className="w-5 h-5 text-brand" />
          <h3 className="text-base font-bold text-foreground">¿A dónde te enviamos la propuesta?</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="sm:col-span-2">
            <label htmlFor="contact_name" className="block text-sm font-semibold text-foreground mb-1">
              ¿Cuál es tu nombre? <span className="text-brand">* (Obligatorio)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <User className="h-4 w-4" />
              </div>
              <Input
                id="contact_name"
                placeholder="Nombre y apellido"
                value={data.contact_name}
                onChange={(e) => onChange({ contact_name: e.target.value })}
                className={`pl-9 h-11 ${errors.contact_name ? "border-destructive" : ""}`}
              />
            </div>
            {errors.contact_name && (
              <p className="mt-1 text-xs text-destructive font-medium">{errors.contact_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="contact_email" className="block text-sm font-semibold text-foreground mb-1">
              Correo electrónico <span className="text-brand">* (Obligatorio)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="contact_email"
                type="email"
                placeholder="tu@correo.com"
                value={data.contact_email}
                onChange={(e) => onChange({ contact_email: e.target.value })}
                className={`pl-9 h-11 ${errors.contact_email ? "border-destructive" : ""}`}
              />
            </div>
            {errors.contact_email && (
              <p className="mt-1 text-xs text-destructive font-medium">{errors.contact_email}</p>
            )}
          </div>

          {/* WhatsApp con indicativo */}
          <div>
            <label htmlFor="contact_whatsapp" className="block text-sm font-semibold text-foreground mb-1">
              WhatsApp de contacto <span className="text-brand">* (Obligatorio)</span>
            </label>
            <div className="flex gap-2">
              <select
                aria-label="Indicativo de país"
                value={data.contact_phone_prefix || "+57"}
                onChange={(e) => onChange({ contact_phone_prefix: e.target.value })}
                className="h-11 w-24 rounded-lg border border-input bg-card px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <option value="+57">🇨🇴 +57</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+52">🇲🇽 +52</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+54">🇦🇷 +54</option>
                <option value="+56">🇨🇱 +56</option>
                <option value="+51">🇵🇪 +51</option>
                <option value="+593">🇪🇨 +593</option>
                <option value="+507">🇵🇦 +507</option>
                <option value="+other">🌐 Otro</option>
              </select>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Phone className="h-4 w-4" />
                </div>
                <Input
                  id="contact_whatsapp"
                  type="tel"
                  placeholder="300 123 4567"
                  value={data.contact_whatsapp}
                  onChange={(e) => onChange({ contact_whatsapp: e.target.value })}
                  className={`pl-9 h-11 ${errors.contact_whatsapp ? "border-destructive" : ""}`}
                />
              </div>
            </div>
            {errors.contact_whatsapp && (
              <p className="mt-1 text-xs text-destructive font-medium">{errors.contact_whatsapp}</p>
            )}
          </div>
        </div>
      </div>

      {/* 5.2 Plazo de lanzamiento */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Cuándo te gustaría tener la tienda funcionando? <span className="text-brand">* (Obligatorio)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Nos permite planificar la disponibilidad del equipo de desarrollo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <SelectionCard
            selected={data.launch_target === "menos_1_mes"}
            onClick={() => onChange({ launch_target: "menos_1_mes" })}
            title="Urgente (< 1 mes)"
            description="Lanzamiento prioritario rápido"
            icon={<Clock className="w-4 h-4 text-brand" />}
          />
          <SelectionCard
            selected={data.launch_target === "1_2_meses"}
            onClick={() => onChange({ launch_target: "1_2_meses" })}
            title="1 a 2 meses"
            description="Plazo estándar de desarrollo y pruebas"
          />
          <SelectionCard
            selected={data.launch_target === "3_meses_o_mas"}
            onClick={() => onChange({ launch_target: "3_meses_o_mas" })}
            title="3 meses o más"
            description="Planificación anticipada / Escalada"
          />
          <SelectionCard
            selected={data.launch_target === "sin_fecha"}
            onClick={() => onChange({ launch_target: "sin_fecha" })}
            title="Sin fecha definida"
            description="Depende del alcance y propuesta"
          />
        </div>
        {errors.launch_target && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.launch_target}</p>
        )}
      </div>

      {/* 5.3 Presupuesto estimado (Opcional, no calcula precio) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-foreground">
            ¿Tienes un presupuesto aproximado para desarrollar la tienda?{" "}
            <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Solo sirve para saber el tipo de arquitectura que se ajusta a tu inversión.{" "}
          <strong>No genera un precio automático.</strong>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <SelectionCard
            selected={data.budget_range === "menos_2m_cop"}
            onClick={() => onChange({ budget_range: "menos_2m_cop" })}
            title="< $2M COP"
            description="Fase inicial económica"
          />
          <SelectionCard
            selected={data.budget_range === "2_a_4m_cop"}
            onClick={() => onChange({ budget_range: "2_a_4m_cop" })}
            title="$2M a $4M"
            description="Tienda estándar"
          />
          <SelectionCard
            selected={data.budget_range === "4_a_7m_cop"}
            onClick={() => onChange({ budget_range: "4_a_7m_cop" })}
            title="$4M a $7M"
            description="Avanzada / Integrada"
          />
          <SelectionCard
            selected={data.budget_range === "mas_7m_cop"}
            onClick={() => onChange({ budget_range: "mas_7m_cop" })}
            title="> $7M COP"
            description="Ecosistema a medida"
          />
          <SelectionCard
            selected={data.budget_range === "prefiero_no_indicar"}
            onClick={() => onChange({ budget_range: "prefiero_no_indicar" })}
            title="Prefiero no indicar"
            description="Espero propuesta"
          />
        </div>
      </div>

      {/* 5.4 Resumen de revisión previa al envío */}
      <BriefReviewSummary data={data} onEditStep={onEditStep} />

      {/* 5.5 Consentimiento de Privacidad */}
      <div className="p-4 rounded-xl border border-border bg-card space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy_consent"
            checked={data.privacy_consent}
            onCheckedChange={(checked) => onChange({ privacy_consent: checked as boolean })}
            className="mt-0.5 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
          />
          <label htmlFor="privacy_consent" className="text-xs text-foreground/90 leading-relaxed cursor-pointer">
            Autorizo a <strong>ROICAS</strong> para el tratamiento de mis datos personales con el fin
            de elaborar y presentarme la propuesta de cotización solicitada, conforme a la{" "}
            <Link
              to="/politica-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-semibold underline underline-offset-2 hover:text-brand-hover"
            >
              Política de Privacidad
            </Link>{" "}
            (Ley 1581 de 2012). <span className="text-brand">* (Obligatorio)</span>
          </label>
        </div>
        {errors.privacy_consent && (
          <p className="text-xs text-destructive font-medium pl-7">{errors.privacy_consent}</p>
        )}
      </div>

      {/* Honeypot invisible para protección antispam */}
      <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
        <label htmlFor="website_source_hp">Do not fill this</label>
        <input
          type="text"
          id="website_source_hp"
          name="website_source_hp"
          tabIndex={-1}
          autoComplete="off"
          value={data.website_source_hp || ""}
          onChange={(e) => onChange({ website_source_hp: e.target.value })}
        />
      </div>

      {/* CTA Final */}
      <div className="pt-2">
        <Button
          type="button"
          variant="hero"
          size="xl"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full text-base font-bold shadow-lg cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Guardando y enviando solicitud...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              <span>Enviar mi solicitud</span>
            </div>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          ✓ Sin llamadas sorpresa · ✓ Recibirás una propuesta estructurada en menos de 24 horas hábiles
        </p>
      </div>
    </div>
  );
};

export default BriefStep5Contact;
