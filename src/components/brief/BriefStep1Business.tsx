import React from "react";
import { BriefFormData, ProductType, ProjectStage, SalesRegion, PlatformPreference } from "@/types/brief";
import { SelectionCard } from "./SelectionCard";
import { Input } from "@/components/ui/input";
import { Sparkles, Globe, RefreshCw, ArrowRightLeft, Store, Package, Laptop, Calendar, Repeat } from "lucide-react";

interface BriefStep1BusinessProps {
  data: BriefFormData;
  onChange: (updates: Partial<BriefFormData>) => void;
  errors: Record<string, string>;
}

export const BriefStep1Business: React.FC<BriefStep1BusinessProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleToggleProductType = (type: ProductType) => {
    const current = data.product_type || [];
    const exists = current.includes(type);
    const updated = exists ? current.filter((t) => t !== type) : [...current, type];
    onChange({ product_type: updated });
  };

  const isRenovateOrMigrate =
    data.project_stage === "ya_tengo_tienda_y_quiero_renovar" ||
    data.project_stage === "quiero_migrar";

  const isInternational =
    data.sales_regions === "colombia_y_otros_paises" ||
    data.sales_regions === "solo_otros_paises";

  return (
    <div className="space-y-8 animate-fade-up">
      {/* 1.1 Nombre del negocio */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="business_name" className="text-sm font-semibold text-foreground">
            ¿Cómo se llama tu negocio o marca? <span className="text-brand">* (Obligatorio)</span>
          </label>
          <button
            type="button"
            onClick={() => onChange({ business_name: "Aún no tengo nombre" })}
            className="text-xs text-brand hover:underline font-medium cursor-pointer"
          >
            Aún no tengo nombre
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          El nombre comercial o provisional que usarás para tu tienda.
        </p>
        <Input
          id="business_name"
          placeholder="Ej: Tienda Aurora, Moda Express o Tu Marca..."
          value={data.business_name}
          onChange={(e) => onChange({ business_name: e.target.value })}
          className={`h-12 bg-card ${errors.business_name ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {errors.business_name && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.business_name}</p>
        )}
      </div>

      {/* 1.2 Etapa del negocio */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿En qué etapa está tu negocio? <span className="text-brand">* (Obligatorio)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Nos ayuda a dimensionar el punto de partida técnico y gráfico.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            selected={data.project_stage === "nuevo"}
            onClick={() => onChange({ project_stage: "nuevo" })}
            title="Idea o proyecto nuevo"
            description="Empezando desde cero, aún sin ventas activas"
            icon={<Sparkles className="w-5 h-5" />}
          />
          <SelectionCard
            selected={data.project_stage === "ya_vendo_sin_tienda"}
            onClick={() => onChange({ project_stage: "ya_vendo_sin_tienda" })}
            title="Ya vendo sin tienda web"
            description="Por WhatsApp, Instagram o punto físico, y quiero digitalizar"
            icon={<Store className="w-5 h-5" />}
          />
          <SelectionCard
            selected={data.project_stage === "ya_tengo_tienda_y_quiero_renovar"}
            onClick={() => onChange({ project_stage: "ya_tengo_tienda_y_quiero_renovar" })}
            title="Tengo tienda y quiero renovarla"
            description="Mejorar diseño, velocidad, conversión y experiencia"
            icon={<RefreshCw className="w-5 h-5" />}
          />
          <SelectionCard
            selected={data.project_stage === "quiero_migrar"}
            onClick={() => onChange({ project_stage: "quiero_migrar" })}
            title="Quiero migrar a otra plataforma"
            description="Cambiar de sistema (ej. Shopify a WooCommerce o viceversa)"
            icon={<ArrowRightLeft className="w-5 h-5" />}
          />
        </div>
        {errors.project_stage && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.project_stage}</p>
        )}
      </div>

      {/* 1.3 URL Tienda actual (Condicional si renovar o migrar) */}
      {isRenovateOrMigrate && (
        <div className="p-4 rounded-xl border border-brand/20 bg-brand/5 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="current_store_url" className="text-sm font-semibold text-foreground">
              ¿Cuál es la dirección de tu tienda actual?{" "}
              {!data.no_store_url_now && <span className="text-brand">* (Obligatorio)</span>}
            </label>
            <button
              type="button"
              onClick={() =>
                onChange({
                  no_store_url_now: !data.no_store_url_now,
                  current_store_url: !data.no_store_url_now ? "" : data.current_store_url,
                })
              }
              className="text-xs text-brand hover:underline font-medium cursor-pointer"
            >
              {data.no_store_url_now ? "Ingresar URL" : "No tengo el enlace ahora"}
            </button>
          </div>
          {!data.no_store_url_now ? (
            <>
              <Input
                id="current_store_url"
                placeholder="Ej: https://mitiendaactual.com"
                value={data.current_store_url}
                onChange={(e) => onChange({ current_store_url: e.target.value })}
                className={`h-11 bg-card ${errors.current_store_url ? "border-destructive" : ""}`}
              />
              {errors.current_store_url && (
                <p className="text-xs text-destructive font-medium">{errors.current_store_url}</p>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Registrado: "No tengo el enlace disponible en este momento". Lo revisaremos en la llamada.
            </p>
          )}
        </div>
      )}

      {/* 1.4 Tipo de producto */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Qué vas a vender? <span className="text-brand">* (Obligatorio - Selecciona al menos 1)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Puedes seleccionar más de una opción si tu catálogo es mixto.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            multiSelect
            selected={data.product_type?.includes("fisicos")}
            onClick={() => handleToggleProductType("fisicos")}
            title="Productos físicos"
            description="Ropa, accesorios, alimentos, tecnología (requieren envíos)"
            icon={<Package className="w-5 h-5" />}
          />
          <SelectionCard
            multiSelect
            selected={data.product_type?.includes("digitales")}
            onClick={() => handleToggleProductType("digitales")}
            title="Productos digitales"
            description="Ebooks, archivos descargables, plantillas, cursos online"
            icon={<Laptop className="w-5 h-5" />}
          />
          <SelectionCard
            multiSelect
            selected={data.product_type?.includes("servicios")}
            onClick={() => handleToggleProductType("servicios")}
            title="Servicios o asesorías"
            description="Consultoría, paquetes profesionales, agendamiento de citas"
            icon={<Calendar className="w-5 h-5" />}
          />
          <SelectionCard
            multiSelect
            selected={data.product_type?.includes("suscripciones")}
            onClick={() => handleToggleProductType("suscripciones")}
            title="Suscripciones o membresías"
            description="Cobros recurrentes mensuales, bimensuales o anuales"
            icon={<Repeat className="w-5 h-5" />}
          />
        </div>
        {errors.product_type && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.product_type}</p>
        )}
      </div>

      {/* 1.5 Región de ventas */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Dónde quieres vender? <span className="text-brand">* (Obligatorio)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Determina la moneda principal, impuestos y pasarelas sugeridas.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            selected={data.sales_regions === "solo_colombia"}
            onClick={() => onChange({ sales_regions: "solo_colombia" })}
            title="Solo en Colombia"
            description="Ventas en pesos colombianos (COP), PSE y transportadoras locales"
          />
          <SelectionCard
            selected={data.sales_regions === "colombia_y_otros_paises"}
            onClick={() => onChange({ sales_regions: "colombia_y_otros_paises" })}
            title="Colombia y otros países"
            description="Ventas en Colombia + exportaciones o clientes en el exterior"
          />
          <SelectionCard
            selected={data.sales_regions === "solo_otros_paises"}
            onClick={() => onChange({ sales_regions: "solo_otros_paises" })}
            title="Solo otros países"
            description="Enfoque 100% internacional (USD u otra divisa)"
          />
          <SelectionCard
            selected={data.sales_regions === "por_definir"}
            onClick={() => onChange({ sales_regions: "por_definir" })}
            title="Por definir todavía"
            description="Aún no tengo clara la estrategia de cobertura geográfica"
          />
        </div>
        {errors.sales_regions && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.sales_regions}</p>
        )}

        {/* Condicional países destino */}
        {isInternational && (
          <div className="mt-3 p-3.5 rounded-xl border border-border bg-card">
            <label htmlFor="target_countries" className="block text-xs font-semibold text-foreground mb-1">
              ¿A qué países o regiones te gustaría vender? (Opcional)
            </label>
            <Input
              id="target_countries"
              placeholder="Ej: Estados Unidos, México, España, Latinoamérica..."
              value={data.target_countries}
              onChange={(e) => onChange({ target_countries: e.target.value })}
              className="h-10 text-sm"
            />
          </div>
        )}
      </div>

      {/* 1.6 Preferencia de plataforma */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Tienes alguna plataforma en mente? <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Te asesoraremos con honestidad según tu modelo y presupuesto.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            selected={data.platform_preference === "necesito_recomendacion"}
            onClick={() => onChange({ platform_preference: "necesito_recomendacion" })}
            title="Necesito recomendación"
            badge="Recomendado"
            description="Evaluaremos si te conviene WooCommerce o Shopify según tu caso"
          />
          <SelectionCard
            selected={data.platform_preference === "woocommerce"}
            onClick={() => onChange({ platform_preference: "woocommerce" })}
            title="WooCommerce"
            description="WordPress, control total de tu tienda y sin comisiones por venta"
          />
          <SelectionCard
            selected={data.platform_preference === "shopify"}
            onClick={() => onChange({ platform_preference: "shopify" })}
            title="Shopify"
            description="Rápida de operar, plataforma cerrada con mensualidad fija"
          />
          <SelectionCard
            selected={data.platform_preference === "otra"}
            onClick={() => onChange({ platform_preference: "otra" })}
            title="Otra plataforma"
            description="VTEX, Magento u otro desarrollo a medida"
          />
        </div>

        {data.platform_preference === "otra" && (
          <div className="mt-3 p-3.5 rounded-xl border border-border bg-card">
            <label htmlFor="other_platform_name" className="block text-xs font-semibold text-foreground mb-1">
              ¿Cuál plataforma tienes en mente? (Opcional)
            </label>
            <Input
              id="other_platform_name"
              placeholder="Ej: Prestashop, Magento, VTEX..."
              value={data.other_platform_name}
              onChange={(e) => onChange({ other_platform_name: e.target.value })}
              className="h-10 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BriefStep1Business;
