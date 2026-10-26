import React, { useState } from "react";
import { BriefFormData } from "@/types/brief";
import { getLabel } from "@/lib/brief/briefLogic";
import { Edit2, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BriefReviewSummaryProps {
  data: BriefFormData;
  onEditStep: (stepNumber: number) => void;
}

export const BriefReviewSummary: React.FC<BriefReviewSummaryProps> = ({
  data,
  onEditStep,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    business: true,
    catalog: true,
    operations: false,
    design: false,
  });

  const toggle = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span>Revisa tu solicitud</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Puedes editar cualquier respuesta antes de enviar haciendo clic en "Editar".
          </p>
        </div>
      </div>

      {/* Bloque 1: Tu negocio */}
      <div className="rounded-xl border border-border/80 bg-background overflow-hidden">
        <div
          onClick={() => toggle("business")}
          className="flex items-center justify-between p-3.5 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">
              1
            </span>
            <span className="text-sm font-semibold text-foreground">Tu negocio</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(1);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline px-2 py-1 rounded cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Editar
            </button>
            {openSections.business ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>

        {openSections.business && (
          <div className="p-4 space-y-2 text-xs border-t border-border/60">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Marca:</span>
              <span className="font-semibold text-right text-foreground">{data.business_name || "Aún no tengo nombre"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Etapa:</span>
              <span className="font-medium text-right text-foreground">{getLabel("project_stage", data.project_stage)}</span>
            </div>
            {data.current_store_url && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Tienda actual:</span>
                <span className="font-medium text-right text-foreground truncate max-w-[220px]">{data.current_store_url}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Productos a vender:</span>
              <span className="font-medium text-right text-foreground">
                {data.product_type?.map((p) => getLabel("product_type", p)).join(", ") || "No definido"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Región de ventas:</span>
              <span className="font-medium text-right text-foreground">
                {getLabel("sales_regions", data.sales_regions)}
                {data.target_countries ? ` (${data.target_countries})` : ""}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Plataforma sugerida:</span>
              <span className="font-medium text-right text-brand">
                {getLabel("platform_preference", data.platform_preference)}
                {data.other_platform_name ? ` (${data.other_platform_name})` : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bloque 2: Catálogo */}
      <div className="rounded-xl border border-border/80 bg-background overflow-hidden">
        <div
          onClick={() => toggle("catalog")}
          className="flex items-center justify-between p-3.5 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">
              2
            </span>
            <span className="text-sm font-semibold text-foreground">Productos y catálogo</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(2);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline px-2 py-1 rounded cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Editar
            </button>
            {openSections.catalog ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>

        {openSections.catalog && (
          <div className="p-4 space-y-2 text-xs border-t border-border/60">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Catálogo total estimado:</span>
              <span className="font-medium text-right text-foreground">{getLabel("catalog_size", data.catalog_size)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Carga inicial por ROICAS:</span>
              <span className="font-semibold text-right text-brand">{getLabel("initial_upload", data.initial_upload)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Variaciones (tallas/colores):</span>
              <span className="font-medium text-right text-foreground">{getLabel("has_variations", data.has_variations)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Fotos y descripciones:</span>
              <span className="font-medium text-right text-foreground">{getLabel("content_readiness", data.content_readiness)}</span>
            </div>
            {data.stock_management && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Control de inventario:</span>
                <span className="font-medium text-right text-foreground">{getLabel("stock_management", data.stock_management)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bloque 3: Pagos y entregas */}
      <div className="rounded-xl border border-border/80 bg-background overflow-hidden">
        <div
          onClick={() => toggle("operations")}
          className="flex items-center justify-between p-3.5 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">
              3
            </span>
            <span className="text-sm font-semibold text-foreground">Pagos y entregas</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(3);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline px-2 py-1 rounded cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Editar
            </button>
            {openSections.operations ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>

        {openSections.operations && (
          <div className="p-4 space-y-2 text-xs border-t border-border/60">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Métodos de cobro:</span>
              <span className="font-medium text-right text-foreground">
                {data.payment_methods?.map((m) => getLabel("payment_methods", m)).join(", ") || "No definido"}
              </span>
            </div>
            {data.gateway_status && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Pasarela activa:</span>
                <span className="font-medium text-right text-foreground">{getLabel("gateway_status", data.gateway_status)}</span>
              </div>
            )}
            {data.product_type?.includes("fisicos") && (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Cobertura envíos:</span>
                  <span className="font-medium text-right text-foreground">
                    {data.delivery_coverage?.map((dc) => getLabel("delivery_coverage", dc)).join(", ") || "No especificada"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Cálculo de envío:</span>
                  <span className="font-medium text-right text-foreground">{getLabel("shipping_pricing", data.shipping_pricing)}</span>
                </div>
              </>
            )}
            {data.billing_integration && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Facturación electrónica:</span>
                <span className="font-medium text-right text-foreground">
                  {getLabel("billing_integration", data.billing_integration)}
                  {data.billing_system ? ` (${data.billing_system})` : ""}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bloque 4: Diseño y funciones */}
      <div className="rounded-xl border border-border/80 bg-background overflow-hidden">
        <div
          onClick={() => toggle("design")}
          className="flex items-center justify-between p-3.5 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">
              4
            </span>
            <span className="text-sm font-semibold text-foreground">Diseño y funciones</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(4);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline px-2 py-1 rounded cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Editar
            </button>
            {openSections.design ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>

        {openSections.design && (
          <div className="p-4 space-y-2 text-xs border-t border-border/60">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Identidad de marca:</span>
              <span className="font-medium text-right text-foreground">{getLabel("brand_assets", data.brand_assets)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Nivel de diseño:</span>
              <span className="font-medium text-right text-foreground">{getLabel("design_goal", data.design_goal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Funciones requeridas:</span>
              <span className="font-medium text-right text-foreground">
                {data.requested_features?.length
                  ? data.requested_features.map((f) => getLabel("requested_features", f)).join(", ")
                  : "Básicas de e-commerce"}
              </span>
            </div>
            {data.integration_details && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Integración sistema:</span>
                <span className="font-medium text-right text-foreground">{data.integration_details}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BriefReviewSummary;
