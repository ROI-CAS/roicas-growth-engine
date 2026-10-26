import { describe, expect, it } from "vitest";
import { buildLeadRecord } from "@/lib/brief/briefLogic";
import { buildBriefQuestionnaire, detailedBriefSummary, validateDetailedStep } from "@/lib/brief/detailedBrief";
import { BriefFormData } from "@/types/brief";

const form: BriefFormData = {
  business_name:"Tienda de prueba",project_stage:"ya_vendo_sin_tienda",current_store_url:"",no_store_url_now:false,
  product_type:["fisicos"],sales_regions:"solo_colombia",target_countries:"",platform_preference:"necesito_recomendacion",other_platform_name:"",
  catalog_size:"11_30",initial_upload:"11_30",has_variations:"si",content_readiness:"parcial",stock_management:"si",existing_catalog_format:"excel_csv",
  payment_methods:["tarjetas_pse"],gateway_status:"si",gateway_provider:"wompi",delivery_coverage:["colombia_nacional"],shipping_pricing:"por_ciudad_zona",carrier_integration:"si",billing_integration:"si",billing_system:"Alegra",subscription_details:"",booking_needed:"",
  brand_assets:"parcial",design_goal:"diferenciado_premium",reference_urls:["https://ejemplo.com"],requested_features:["whatsapp","integracion_erp_pos"],integration_details:"Conectar inventario del local",special_requirements:"Necesito una sección para regalos",
  contact_name:"Ana",contact_email:"ana@example.com",contact_phone_prefix:"+57",contact_whatsapp:"3114565403",launch_target:"1_2_meses",budget_range:"prefiero_no_indicar",privacy_consent:true,
  additional_answers:{business:"Vendemos ropa deportiva",catalog:"Faltan las fotos de 8 productos",operations:"Enviamos con Coordinadora",brand:"Conservar el logo y usar rojo oscuro",brand_assets_url:"https://ejemplo.com/manual",contact:"Enviar propuesta por correo, no puedo asistir a una reunión"},
};

describe("Requerimiento completo para cotizar sin reunión", () => {
  it("pide explícitamente el estado de la imagen corporativa", () => {
    expect(validateDetailedStep(4,{...form,brand_assets:""}).errors.brand_assets).toBeTruthy();
  });
  it("pide información del catálogo y contenido", () => {
    const result=validateDetailedStep(2,{...form,catalog_size:"",content_readiness:""});
    expect(result.errors.catalog_size).toBeTruthy();
    expect(result.errors.content_readiness).toBeTruthy();
  });
  it("conserva todas las respuestas personalizadas en el registro y el resumen", () => {
    const lead=buildLeadRecord(form);
    const summary=detailedBriefSummary(lead);
    expect(lead.additional_answers).toEqual(form.additional_answers);
    Object.values(form.additional_answers).forEach(value=>expect(summary).toContain(value));
    expect(summary).toContain("Alegra");
    expect(summary).toContain("Conectar inventario del local");
    expect(summary).toContain("Necesito una sección para regalos");
    expect(summary).not.toContain("$");
  });
  it("organiza las preguntas en cinco secciones y explica lo no aplicable", () => {
    const lead=buildLeadRecord({...form,product_type:["digitales"]});
    const sections=buildBriefQuestionnaire(lead);
    expect(sections).toHaveLength(5);
    expect(sections[3].answers.some(row=>row.question.includes("imagen corporativa"))).toBe(true);
    expect(sections[2].answers.some(row=>row.answer.includes("No aplica"))).toBe(true);
  });
  it("marca lo no respondido sin inventar una respuesta", () => {
    const lead=buildLeadRecord({...form,additional_answers:{}});
    const section=buildBriefQuestionnaire(lead)[3];
    expect(section.answers.find(row=>row.question==="Enlace al logo o manual de marca").answer).toBe("No indicado");
  });
});
