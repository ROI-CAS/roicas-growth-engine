import { BriefFormData, BriefLeadRecord } from "@/types/brief";
import { getLabel, validateStep1, validateStep2, validateStep3, validateStep4, validateStep5 } from "./briefLogic";

export const BRIEF_STEPS = ["Tu negocio", "Tus productos", "Pagos y entregas", "Marca y funciones", "Contacto y revisión"];
export function validateDetailedStep(step: number, data: BriefFormData) {
  const result = [validateStep1, validateStep2, validateStep3, validateStep4, validateStep5][step - 1](data);
  if (step === 5 && data.contact_phone_prefix === "+57" && data.contact_whatsapp.replace(/\D/g, "").length !== 10) {
    result.errors.contact_whatsapp = "Escribe tu celular de 10 dígitos sin el +57.";
    result.isValid = false;
  }
  return result;
}

export function buildBriefQuestionnaire(lead: BriefLeadRecord) {
  const b = lead.business, c = lead.catalog, o = lead.operations, d = lead.design, ct = lead.contact;
  const label = getLabel;
  const list = (category: string, values?: string[] | null) => values?.length ? values.map(v => label(category, v)).join("; ") : "No indicado";
  const extra = lead.additional_answers || {};
  const row = (question: string, answer?: string | null) => ({ question, answer: answer?.trim() || "No indicado" });
  const sections = [
    { title: "1. Negocio y objetivos", answers: [
      row("¿Cómo se llama el negocio?", b.business_name), row("¿En qué etapa está?", label("project_stage", b.project_stage)),
      row("¿Cuál es la tienda actual?", b.current_store_url), row("¿Qué quiere vender?", list("product_type", b.product_type)),
      row("¿Dónde quiere vender?", label("sales_regions", b.sales_regions)), row("Países o regiones de destino", b.target_countries),
      row("¿Tiene alguna plataforma en mente?", label("platform_preference", b.platform_preference)), row("Otra plataforma", b.other_platform_name),
      row("Descripción del negocio, clientes y objetivos", extra.business),
    ] },
    { title: "2. Catálogo y contenidos", answers: [
      row("¿Cuántos productos o servicios tendrá?", label("catalog_size", c.catalog_size)), row("¿Cuántos productos necesita que cargue ROICAS?", label("initial_upload", c.initial_upload)),
      row("¿Hay tallas, colores o versiones?", label("has_variations", c.has_variations)), row("¿Están listas las fotos, descripciones y precios?", label("content_readiness", c.content_readiness)),
      row("¿Necesita controlar existencias?", label("stock_management", c.stock_management)), row("¿Dónde está organizado el catálogo?", label("existing_catalog_format", c.existing_catalog_format)),
      row("Detalles sobre productos y ayuda con contenidos", extra.catalog),
    ] },
    { title: "3. Pagos, entregas y operación", answers: [
      row("¿Cómo quiere recibir los pagos?", list("payment_methods", o.payment_methods)),
      ...(o.payment_methods.includes("tarjetas_pse") ? [row("¿Tiene una cuenta para recibir pagos en línea?", label("gateway_status", o.gateway_status)), row("Proveedor de pagos", label("gateway_provider", o.gateway_provider))] : []),
      ...(b.product_type.includes("fisicos") ? [row("¿Dónde entrega sus productos?", list("delivery_coverage", o.delivery_coverage)), row("¿Cómo cobra el envío?", label("shipping_pricing", o.shipping_pricing)), row("¿Necesita conectar una transportadora?", label("carrier_integration", o.carrier_integration))] : [row("Entregas físicas", "No aplica al tipo de producto seleccionado")]),
      row("¿Necesita facturación electrónica conectada?", label("billing_integration", o.billing_integration)), row("Sistema de facturación actual", o.billing_system),
      ...(b.product_type.includes("suscripciones") ? [row("Detalles de suscripciones o cobros periódicos", o.subscription_details)] : []),
      ...(b.product_type.includes("servicios") ? [row("¿Necesita agendar citas?", o.booking_needed === "si" ? "Sí" : o.booking_needed === "no" ? "No" : "Por definir")] : []),
      row("Reglas de venta, pagos, entregas y conexiones especiales", extra.operations),
    ] },
    { title: "4. Identidad corporativa, diseño y funciones", answers: [
      row("¿Tiene logo, colores e imagen corporativa?", label("brand_assets", d.brand_assets)), row("Enlace al logo o manual de marca", extra.brand_assets_url),
      row("Colores, estilo, materiales disponibles y ayuda con la marca", extra.brand), row("¿Cómo le gustaría que se viera la tienda?", label("design_goal", d.design_goal)),
      row("Tiendas o páginas de referencia", d.reference_urls.join("\n")), row("¿Qué funciones necesita?", list("requested_features", d.requested_features)),
      row("Programas que necesita conectar u otras funciones", d.integration_details), row("Requerimientos y respuestas personalizadas", d.special_requirements),
    ] },
    { title: "5. Contacto y próximos pasos", answers: [
      row("Nombre de contacto", ct.contact_name), row("Correo electrónico", ct.contact_email), row("WhatsApp", ct.full_whatsapp),
      row("¿Cuándo le gustaría lanzar la tienda?", label("launch_target", ct.launch_target)), row("Cómo prefiere recibir la propuesta y disponibilidad", extra.contact),
      row("Autorización de tratamiento de datos", lead.consent.accepted ? "Aceptada" : "No aceptada"),
    ] },
  ];
  return sections;
}

export function detailedBriefSummary(lead: BriefLeadRecord) {
  return `ROICAS · SOLICITUD DE COTIZACIÓN\nReferencia: ${lead.lead_id}\n\n${buildBriefQuestionnaire(lead).map(section => `${section.title}\n${section.answers.map(item => `${item.question}\n${item.answer}`).join("\n\n")}`).join("\n\n────────────────────\n\n")}\n\nEl alcance y el precio se definirán con base en este requerimiento. No se asignó un precio automático.`;
}
