import React from "react";
import { BriefFormData } from "@/types/brief";
import { SelectionCard } from "./SelectionCard";
import { Info } from "lucide-react";

interface BriefStep2CatalogProps {
  data: BriefFormData;
  onChange: (updates: Partial<BriefFormData>) => void;
  errors: Record<string, string>;
}

export const BriefStep2Catalog: React.FC<BriefStep2CatalogProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* 2.1 Tamaño del catálogo total */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          Aproximadamente, ¿cuántos productos tendrá la tienda en total?{" "}
          <span className="text-brand">* (Obligatorio)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          El tamaño global estimado de tu inventario.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <SelectionCard
            selected={data.catalog_size === "1_10"}
            onClick={() => onChange({ catalog_size: "1_10" })}
            title="1 a 10"
            description="Catálogo boutique o producto único"
          />
          <SelectionCard
            selected={data.catalog_size === "11_30"}
            onClick={() => onChange({ catalog_size: "11_30" })}
            title="11 a 30"
            description="Pequeño catálogo seleccionado"
          />
          <SelectionCard
            selected={data.catalog_size === "31_100"}
            onClick={() => onChange({ catalog_size: "31_100" })}
            title="31 a 100"
            description="Catálogo mediano estándar"
          />
          <SelectionCard
            selected={data.catalog_size === "101_500"}
            onClick={() => onChange({ catalog_size: "101_500" })}
            title="101 a 500"
            description="Inventario amplio"
          />
          <SelectionCard
            selected={data.catalog_size === "mas_500"}
            onClick={() => onChange({ catalog_size: "mas_500" })}
            title="Más de 500"
            description="Gran catálogo / Multimarca"
          />
          <SelectionCard
            selected={data.catalog_size === "sin_definir"}
            onClick={() => onChange({ catalog_size: "sin_definir" })}
            title="Sin definir aún"
            description="Aún estamos definiendo las líneas"
          />
        </div>
        {errors.catalog_size && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.catalog_size}</p>
        )}
      </div>

      {/* 2.2 Carga inicial por parte de la agencia */}
      <div className="p-4 sm:p-5 rounded-2xl border border-brand/20 bg-card shadow-sm space-y-3">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
          <div>
            <label className="block text-sm font-semibold text-foreground">
              ¿Cuántos productos necesitas que publiquemos nosotros inicialmente?{" "}
              <span className="text-brand">* (Obligatorio)</span>
            </label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Importante: No cobramos por el catálogo que cargue tu equipo. Solo cotizamos las fichas
              que nuestra agencia redactará, optimizará y dejará listas de muestra.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <SelectionCard
            selected={data.initial_upload === "ninguno_yo_los_cargo"}
            onClick={() => onChange({ initial_upload: "ninguno_yo_los_cargo" })}
            title="Ninguno"
            description="Mi equipo o yo cargaremos todos los productos"
          />
          <SelectionCard
            selected={data.initial_upload === "1_10"}
            onClick={() => onChange({ initial_upload: "1_10" })}
            title="1 a 10 productos"
            description="Muestra inicial con diseño y plantilla lista"
          />
          <SelectionCard
            selected={data.initial_upload === "11_30"}
            onClick={() => onChange({ initial_upload: "11_30" })}
            title="11 a 30 productos"
            description="Carga de los productos principales"
          />
          <SelectionCard
            selected={data.initial_upload === "31_100"}
            onClick={() => onChange({ initial_upload: "31_100" })}
            title="31 a 100 productos"
            description="Carga masiva inicial estructurada"
          />
          <SelectionCard
            selected={data.initial_upload === "mas_100"}
            onClick={() => onChange({ initial_upload: "mas_100" })}
            title="Más de 100"
            description="Importación por CSV o migración completa"
          />
          <SelectionCard
            selected={data.initial_upload === "sin_definir"}
            onClick={() => onChange({ initial_upload: "sin_definir" })}
            title="Por definir"
            description="A convenir en la propuesta"
          />
        </div>
        {errors.initial_upload && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.initial_upload}</p>
        )}
      </div>

      {/* 2.3 Variaciones de producto */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Tus productos tienen variaciones? <span className="text-brand">* (Obligatorio)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Ejemplo: talla, color, presentación, sabor, peso o material.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectionCard
            selected={data.has_variations === "si"}
            onClick={() => onChange({ has_variations: "si" })}
            title="Sí, tienen variaciones"
            description="Tallas, colores o atributos seleccionables con stock propio"
          />
          <SelectionCard
            selected={data.has_variations === "no"}
            onClick={() => onChange({ has_variations: "no" })}
            title="No, son productos simples"
            description="Cada producto es único o estándar, sin opciones"
          />
          <SelectionCard
            selected={data.has_variations === "no_se"}
            onClick={() => onChange({ has_variations: "no_se" })}
            title="No estoy seguro / Algunas cosas sí"
            description="Lo definiremos durante la estructuración"
          />
        </div>
        {errors.has_variations && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.has_variations}</p>
        )}
      </div>

      {/* 2.4 Estado del contenido */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Ya cuentas con fotos, precios y descripciones? <span className="text-brand">* (Obligatorio)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Ayuda a proyectar los tiempos de entrega y necesidad de redacción o retoque.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectionCard
            selected={data.content_readiness === "todo_listo"}
            onClick={() => onChange({ content_readiness: "todo_listo" })}
            title="Todo listo"
            description="Fotos de calidad, precios actualizados y descripciones redactadas"
          />
          <SelectionCard
            selected={data.content_readiness === "parcial"}
            onClick={() => onChange({ content_readiness: "parcial" })}
            title="Parcial"
            description="Tengo fotos o listas de precios, pero falta organizar y redactar"
          />
          <SelectionCard
            selected={data.content_readiness === "necesito_ayuda"}
            onClick={() => onChange({ content_readiness: "necesito_ayuda" })}
            title="Necesito ayuda"
            description="Requiero apoyo con copywriting, optimización de fotos o creación"
          />
        </div>
        {errors.content_readiness && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.content_readiness}</p>
        )}
      </div>

      {/* 2.5 Control de inventario en tienda */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Necesitas controlar inventario dentro de la tienda?{" "}
          <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Descuento automático de unidades disponibles con cada compra.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectionCard
            selected={data.stock_management === "si"}
            onClick={() => onChange({ stock_management: "si" })}
            title="Sí, con control de stock"
            description="Avisos de 'agotado' y descuento automático por venta"
          />
          <SelectionCard
            selected={data.stock_management === "no"}
            onClick={() => onChange({ stock_management: "no" })}
            title="No requiero control de stock"
            description="Vendo bajo pedido, stock ilimitado o servicio"
          />
          <SelectionCard
            selected={data.stock_management === "por_definir"}
            onClick={() => onChange({ stock_management: "por_definir" })}
            title="Por definir"
            description="Aún evaluando la gestión de bodega"
          />
        </div>
      </div>

      {/* 2.6 Formato de catálogo existente */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Tienes catálogo en Excel/CSV o en otro sistema?{" "}
          <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Facilita la importación automatizada de productos.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            selected={data.existing_catalog_format === "excel_csv"}
            onClick={() => onChange({ existing_catalog_format: "excel_csv" })}
            title="Sí, en Excel o CSV"
            description="Tengo una hoja de cálculo con referencias y precios"
          />
          <SelectionCard
            selected={data.existing_catalog_format === "otra_plataforma"}
            onClick={() => onChange({ existing_catalog_format: "otra_plataforma" })}
            title="Sí, en otro software o tienda"
            description="Exportable desde software POS, Shopify, WooCommerce u otro"
          />
          <SelectionCard
            selected={data.existing_catalog_format === "no"}
            onClick={() => onChange({ existing_catalog_format: "no" })}
            title="No, todo desde cero"
            description="Crearemos el inventario por primera vez"
          />
          <SelectionCard
            selected={data.existing_catalog_format === "no_se"}
            onClick={() => onChange({ existing_catalog_format: "no_se" })}
            title="No estoy seguro"
            description="Verificaremos qué archivos tenemos disponibles"
          />
        </div>
      </div>
    </div>
  );
};

export default BriefStep2Catalog;
