import React from "react";
import { BriefFormData, RequestedFeature } from "@/types/brief";
import { SelectionCard } from "./SelectionCard";
import { toggleRequestedFeature } from "@/lib/brief/briefLogic";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Sparkles, HelpCircle, Link as LinkIcon, MessageSquare, Percent, Star, SlidersHorizontal, Users, Languages, Mail, ShoppingCart, Database, Calendar } from "lucide-react";

interface BriefStep4DesignProps {
  data: BriefFormData;
  onChange: (updates: Partial<BriefFormData>) => void;
  errors: Record<string, string>;
}

export const BriefStep4Design: React.FC<BriefStep4DesignProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleFeatureToggle = (feature: RequestedFeature) => {
    const updated = toggleRequestedFeature(data.requested_features || [], feature);
    onChange({ requested_features: updated });
  };

  const handleUrlChange = (index: number, value: string) => {
    const urls = [...(data.reference_urls || ["", "", ""])];
    while (urls.length < 3) urls.push("");
    urls[index] = value;
    onChange({ reference_urls: urls });
  };

  const referenceUrls = data.reference_urls?.length ? data.reference_urls : ["", "", ""];

  const needsIntegrationDetail =
    data.requested_features?.includes("integracion_erp_pos") ||
    data.requested_features?.includes("otra");

  return (
    <div className="space-y-8 animate-fade-up">
      {/* 4.1 Identidad de marca */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Ya tienes logo, colores y estilo de marca? <span className="text-brand">* (Obligatorio)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Necesario para aplicar la identidad visual a los banners y tipografías.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectionCard
            selected={data.brand_assets === "si_completo"}
            onClick={() => onChange({ brand_assets: "si_completo" })}
            title="Sí, completo"
            description="Tengo manual de marca, logo en alta calidad (SVG/PNG) y paleta definida"
            icon={<Palette className="w-5 h-5" />}
          />
          <SelectionCard
            selected={data.brand_assets === "parcial"}
            onClick={() => onChange({ brand_assets: "parcial" })}
            title="Parcial"
            description="Tengo un logo básico o imágenes de referencia, pero sin manual"
          />
          <SelectionCard
            selected={data.brand_assets === "no"}
            onClick={() => onChange({ brand_assets: "no" })}
            title="No tengo todavía"
            description="Necesito que me ayuden a diseñar o refrescar la identidad visual"
          />
        </div>
        {errors.brand_assets && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.brand_assets}</p>
        )}
      </div>

      {/* 4.2 Nivel de diseño */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Qué nivel de diseño te gustaría? <span className="text-brand">* (Obligatorio)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Ambas opciones son 100% profesionales y adaptadas a móviles.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectionCard
            selected={data.design_goal === "practico_y_funcional"}
            onClick={() => onChange({ design_goal: "practico_y_funcional" })}
            title="Práctico y funcional"
            description="Limpio, ágil, sin distracciones, optimizado para vender rápido"
          />
          <SelectionCard
            selected={data.design_goal === "diferenciado_premium"}
            onClick={() => onChange({ design_goal: "diferenciado_premium" })}
            title="Diferenciado y premium"
            badge="Alto Impacto"
            description="Animaciones sutiles, estética personalizada y experiencia de marca de alto nivel"
            icon={<Sparkles className="w-5 h-5" />}
          />
          <SelectionCard
            selected={data.design_goal === "necesito_orientacion"}
            onClick={() => onChange({ design_goal: "necesito_orientacion" })}
            title="Necesito orientación"
            description="Aconséjenme según mi tipo de producto y el mercado de mi nicho"
            icon={<HelpCircle className="w-5 h-5" />}
          />
        </div>
        {errors.design_goal && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.design_goal}</p>
        )}
      </div>

      {/* 4.3 URLs de referencia */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Qué tiendas online te gustan como referencia?{" "}
          <span className="text-xs text-muted-foreground font-normal">(Opcional, hasta 3 enlaces)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Tiendas de competidores o marcas que admires en diseño, navegación o estilo.
        </p>
        <div className="space-y-2.5">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <LinkIcon className="h-4 w-4" />
              </div>
              <Input
                placeholder={`Enlace de referencia #${idx + 1} (ej: https://ejemplo.com)`}
                value={referenceUrls[idx] || ""}
                onChange={(e) => handleUrlChange(idx, e.target.value)}
                className={`pl-9 h-11 ${errors[`reference_urls_${idx}`] ? "border-destructive" : ""}`}
              />
              {errors[`reference_urls_${idx}`] && (
                <p className="mt-1 text-xs text-destructive font-medium">
                  {errors[`reference_urls_${idx}`]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4.4 Funciones adicionales (Regla: no_se excluyente) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-foreground">
            ¿Qué funciones adicionales te gustaría incluir?{" "}
            <span className="text-xs text-muted-foreground font-normal">(Selección múltiple)</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Marcaremos las funciones viables y te explicaremos qué requiere cada una.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("whatsapp")}
            onClick={() => handleFeatureToggle("whatsapp")}
            title="Chat de WhatsApp flotante"
            description="Atención y ventas rápidas"
            icon={<MessageSquare className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("cupones_promociones")}
            onClick={() => handleFeatureToggle("cupones_promociones")}
            title="Cupones y promociones"
            description="Códigos de descuento y banners de oferta"
            icon={<Percent className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("resenas")}
            onClick={() => handleFeatureToggle("resenas")}
            title="Reseñas y valoraciones"
            description="Calificaciones con estrellas y fotos de clientes"
            icon={<Star className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("filtros_avanzados")}
            onClick={() => handleFeatureToggle("filtros_avanzados")}
            title="Filtros avanzados"
            description="Por talla, color, precio y categoría"
            icon={<SlidersHorizontal className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("venta_mayorista")}
            onClick={() => handleFeatureToggle("venta_mayorista")}
            title="Venta mayorista / B2B"
            description="Precios por volumen y roles de cliente"
            icon={<Users className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("multiidioma_moneda")}
            onClick={() => handleFeatureToggle("multiidioma_moneda")}
            title="Multiidioma y multimoneda"
            description="COP, USD, EUR y selector de idioma"
            icon={<Languages className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("email_automatizado")}
            onClick={() => handleFeatureToggle("email_automatizado")}
            title="Emails post-venta"
            description="Confirmación y seguimiento de pedido"
            icon={<Mail className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("recuperar_carritos")}
            onClick={() => handleFeatureToggle("recuperar_carritos")}
            title="Recuperar carritos"
            description="Recordatorios automáticos por email o WhatsApp"
            icon={<ShoppingCart className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("integracion_erp_pos")}
            onClick={() => handleFeatureToggle("integracion_erp_pos")}
            title="Integración ERP / POS"
            description="Sincronización con software externo"
            icon={<Database className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("reservas")}
            onClick={() => handleFeatureToggle("reservas")}
            title="Módulo de reservas"
            description="Calendario de turnos o citas"
            icon={<Calendar className="w-4 h-4" />}
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("otra")}
            onClick={() => handleFeatureToggle("otra")}
            title="Otra función especial"
            description="Requerimiento técnico específico"
          />
          <SelectionCard
            multiSelect
            selected={data.requested_features?.includes("no_se")}
            onClick={() => handleFeatureToggle("no_se")}
            title="No lo sé aún, asesórenme"
            badge="Excluyente"
            description="Recomiéndenme lo esencial para arrancar"
          />
        </div>

        {/* Detalle de integración condicional */}
        {needsIntegrationDetail && (
          <div className="mt-4 p-4 rounded-xl border border-brand/20 bg-brand/5 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="integration_details" className="text-xs font-semibold text-foreground">
                ¿Con qué sistema necesitas conectar la tienda? <span className="text-brand">* (Obligatorio)</span>
              </label>
              <button
                type="button"
                onClick={() => onChange({ integration_details: "Aún no conozco el sistema" })}
                className="text-xs text-brand hover:underline font-medium cursor-pointer"
              >
                Aún no conozco el sistema
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Indica el nombre del ERP, sistema contable, software de bodega o integración deseada.
            </p>
            <Input
              id="integration_details"
              placeholder="Ej: SAP, Siigo nube, Positivo, software propio o 'Aún no conozco el sistema'..."
              value={data.integration_details}
              onChange={(e) => onChange({ integration_details: e.target.value })}
              className={`h-11 bg-card ${errors.integration_details ? "border-destructive" : ""}`}
            />
            {errors.integration_details && (
              <p className="text-xs text-destructive font-medium">{errors.integration_details}</p>
            )}
          </div>
        )}
      </div>

      {/* 4.5 Requerimientos especiales */}
      <div>
        <label htmlFor="special_requirements" className="block text-sm font-semibold text-foreground mb-1">
          ¿Hay algo especial que necesites?{" "}
          <span className="text-xs text-muted-foreground font-normal">(Opcional, máximo 1000 caracteres)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Reglas de negocio atípicas, cotizaciones personalizadas, múltiples sedes, franquicias o dudas puntuales.
        </p>
        <Textarea
          id="special_requirements"
          rows={3}
          maxLength={1000}
          placeholder="Escribe cualquier detalle adicional que debamos tener en cuenta para tu propuesta..."
          value={data.special_requirements}
          onChange={(e) => onChange({ special_requirements: e.target.value })}
          className="resize-y text-sm bg-card"
        />
        <div className="mt-1 flex justify-end">
          <span className="text-[11px] text-muted-foreground">
            {data.special_requirements?.length || 0} / 1000 caracteres
          </span>
        </div>
      </div>
    </div>
  );
};

export default BriefStep4Design;
