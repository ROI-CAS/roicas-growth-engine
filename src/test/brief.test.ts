import { describe, it, expect, beforeEach } from "vitest";
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  calculateComplexityHint,
  toggleRequestedFeature,
  sanitizeFormData,
  buildLeadRecord,
  buildEmailHtmlBody,
} from "@/lib/brief/briefLogic";
import {
  saveLeadLocally,
  getStoredLeads,
  updateLeadStatus,
  exportLeadsToCsv,
} from "@/lib/brief/briefStorage";
import { BriefFormData } from "@/types/brief";

const baseMockData: BriefFormData = {
  business_name: "Moda Bogotá",
  project_stage: "nuevo",
  current_store_url: "",
  no_store_url_now: false,
  product_type: ["fisicos"],
  sales_regions: "solo_colombia",
  target_countries: "",
  platform_preference: "necesito_recomendacion",
  other_platform_name: "",

  catalog_size: "11_30",
  initial_upload: "11_30",
  has_variations: "si",
  content_readiness: "todo_listo",
  stock_management: "si",
  existing_catalog_format: "excel_csv",

  payment_methods: ["tarjetas_pse"],
  gateway_status: "si",
  gateway_provider: "wompi",
  delivery_coverage: ["colombia_nacional"],
  shipping_pricing: "tarifa_fija",
  carrier_integration: "si",
  billing_integration: "no",
  billing_system: "",
  subscription_details: "",
  booking_needed: "",

  brand_assets: "si_completo",
  design_goal: "practico_y_funcional",
  reference_urls: ["https://ejemplo.com"],
  requested_features: ["whatsapp", "cupones_promociones"],
  integration_details: "",
  special_requirements: "",

  contact_name: "Carlos Silva",
  contact_email: "carlos@example.com",
  contact_phone_prefix: "+57",
  contact_whatsapp: "3001234567",
  launch_target: "1_2_meses",
  budget_range: "2_a_4m_cop",
  privacy_consent: true,
};

describe("Brief Validation & Conditional Logic", () => {
  it("validates Step 1: fails when business name is empty", () => {
    const invalid = { ...baseMockData, business_name: "" };
    const res = validateStep1(invalid);
    expect(res.isValid).toBe(false);
    expect(res.errors.business_name).toBeDefined();
  });

  it("validates Step 1: admits 'Aún no tengo nombre'", () => {
    const valid = { ...baseMockData, business_name: "Aún no tengo nombre" };
    const res = validateStep1(valid);
    expect(res.isValid).toBe(true);
  });

  it("validates Step 1: requires store URL if renovar/migrar unless explicitly opted out", () => {
    const renovateWithoutUrl = {
      ...baseMockData,
      project_stage: "ya_tengo_tienda_y_quiero_renovar" as const,
      current_store_url: "",
      no_store_url_now: false,
    };
    const res1 = validateStep1(renovateWithoutUrl);
    expect(res1.isValid).toBe(false);
    expect(res1.errors.current_store_url).toBeDefined();

    const renovateWithOptOut = {
      ...renovateWithoutUrl,
      no_store_url_now: true,
    };
    const res2 = validateStep1(renovateWithOptOut);
    expect(res2.isValid).toBe(true);
  });

  it("validates Step 2: requires catalog size, initial upload, variations, and content readiness", () => {
    const emptyStep2 = {
      ...baseMockData,
      catalog_size: "",
      initial_upload: "",
      has_variations: "",
      content_readiness: "",
    } as BriefFormData;
    const res = validateStep2(emptyStep2);
    expect(res.isValid).toBe(false);
    expect(res.errors.catalog_size).toBeDefined();
    expect(res.errors.initial_upload).toBeDefined();
    expect(res.errors.has_variations).toBeDefined();
    expect(res.errors.content_readiness).toBeDefined();
  });

  it("validates Step 3: skips shipping questions if only digital products are sold", () => {
    const digitalStore: BriefFormData = {
      ...baseMockData,
      product_type: ["digitales"],
      delivery_coverage: [],
      shipping_pricing: "",
      carrier_integration: "",
    };
    const res = validateStep3(digitalStore);
    expect(res.isValid).toBe(true);
    expect(res.errors.delivery_coverage).toBeUndefined();
    expect(res.errors.shipping_pricing).toBeUndefined();
  });

  it("validates Step 3: requires delivery coverage and shipping pricing if selling physical products", () => {
    const physicalWithoutShipping: BriefFormData = {
      ...baseMockData,
      product_type: ["fisicos"],
      delivery_coverage: [],
      shipping_pricing: "",
    };
    const res = validateStep3(physicalWithoutShipping);
    expect(res.isValid).toBe(false);
    expect(res.errors.delivery_coverage).toBeDefined();
    expect(res.errors.shipping_pricing).toBeDefined();
  });

  it("validates Step 3: requires gateway status when PSE/cards is selected", () => {
    const withoutGatewayStatus: BriefFormData = {
      ...baseMockData,
      payment_methods: ["tarjetas_pse"],
      gateway_status: "",
    };
    const res = validateStep3(withoutGatewayStatus);
    expect(res.isValid).toBe(false);
    expect(res.errors.gateway_status).toBeDefined();
  });

  it("validates Step 4: handles mutually exclusive 'no_se' in requested features", () => {
    let features = toggleRequestedFeature(["whatsapp", "cupones_promociones"], "no_se");
    expect(features).toEqual(["no_se"]);

    features = toggleRequestedFeature(features, "whatsapp");
    expect(features).toEqual(["whatsapp"]);
    expect(features.includes("no_se")).toBe(false);
  });

  it("validates Step 4: requires integration details if integracion_erp_pos is selected", () => {
    const withErpWithoutDetails: BriefFormData = {
      ...baseMockData,
      requested_features: ["integracion_erp_pos"],
      integration_details: "",
    };
    const res = validateStep4(withErpWithoutDetails);
    expect(res.isValid).toBe(false);
    expect(res.errors.integration_details).toBeDefined();

    const withErpWithDetails: BriefFormData = {
      ...baseMockData,
      requested_features: ["integracion_erp_pos"],
      integration_details: "Aún no conozco el sistema",
    };
    const res2 = validateStep4(withErpWithDetails);
    expect(res2.isValid).toBe(true);
  });

  it("validates Step 5: fails if consent is not accepted", () => {
    const withoutConsent: BriefFormData = {
      ...baseMockData,
      privacy_consent: false,
    };
    const res = validateStep5(withoutConsent);
    expect(res.isValid).toBe(false);
    expect(res.errors.privacy_consent).toBeDefined();
  });
});

describe("Complexity Classification & Internal Intelligence", () => {
  it("classifies high complexity (ALTA) on migration + ERP or >100 upload", () => {
    const highCase: BriefFormData = {
      ...baseMockData,
      project_stage: "quiero_migrar",
      initial_upload: "mas_100",
      requested_features: ["integracion_erp_pos"],
    };
    const result = calculateComplexityHint(highCase);
    expect(result.complexity_hint).toBe("alta");
    expect(result.effort_flags).toContain("mas_100_productos_carga");
    expect(result.effort_flags).toContain("integracion_erp_pos");
  });

  it("classifies intermediate complexity (INTERMEDIA) for medium catalog & variations", () => {
    const mediumCase: BriefFormData = {
      ...baseMockData,
      initial_upload: "31_100",
      has_variations: "si",
      requested_features: ["cupones_promociones"],
    };
    const result = calculateComplexityHint(mediumCase);
    expect(result.complexity_hint).toBe("intermedia");
  });

  it("classifies basic complexity (BASICA) for simple standard store", () => {
    const basicCase: BriefFormData = {
      ...baseMockData,
      catalog_size: "1_10",
      initial_upload: "1_10",
      has_variations: "no",
      requested_features: ["whatsapp"],
      sales_regions: "solo_colombia",
      billing_integration: "no",
    };
    const result = calculateComplexityHint(basicCase);
    expect(result.complexity_hint).toBe("basica");
  });

  it("classifies REQUIERE_REVISIÓN when too many unknowns are answered", () => {
    const unknownCase: BriefFormData = {
      ...baseMockData,
      business_name: "Aún no tengo nombre",
      platform_preference: "necesito_recomendacion",
      catalog_size: "sin_definir",
      initial_upload: "sin_definir",
      has_variations: "no_se",
      content_readiness: "parcial",
      stock_management: "por_definir",
      design_goal: "necesito_orientacion",
      requested_features: ["no_se"],
      launch_target: "sin_fecha",
    };
    const result = calculateComplexityHint(unknownCase);
    expect(result.complexity_hint).toBe("requiere_revision");
    expect(result.pending_points.length).toBeGreaterThanOrEqual(5);
  });
});

describe("Sanitization & Email Payload Generation", () => {
  it("cleans inactive conditional fields when switching to digital only", () => {
    const mixed: BriefFormData = {
      ...baseMockData,
      product_type: ["digitales"], // Only digital now
      delivery_coverage: ["colombia_nacional"],
      shipping_pricing: "tarifa_fija",
    };
    const clean = sanitizeFormData(mixed);
    expect(clean.delivery_coverage).toEqual([]);
    expect(clean.shipping_pricing).toBe("");
  });

  it("generates structured lead record with correct recipient and sender", () => {
    const lead = buildLeadRecord(baseMockData);
    expect(lead.lead_id).toMatch(/^ROI-EC-/);
    expect(lead.internal.recipient_email).toBe("herebus_cas@hotmail.com");
    expect(lead.internal.sender_email).toBe("ventas@roicas.com");
    expect(lead.summary_text).toContain("Moda Bogotá");
    expect(lead.summary_text).toContain("carlos@example.com");
  });

  it("generates valid HTML email with sender/recipient references and whatsapp chat link", () => {
    const lead = buildLeadRecord(baseMockData);
    const html = buildEmailHtmlBody(lead);
    expect(html).toContain("Moda Bogotá");
    expect(html).toContain("herebus_cas@hotmail.com");
    expect(html).toContain("ventas@roicas.com");
    expect(html).toContain("wa.me");
  });
});

describe("Local Persistence & CSV Export", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves lead locally, retrieves it, and updates status", () => {
    const lead = buildLeadRecord(baseMockData);
    saveLeadLocally(lead);

    const stored = getStoredLeads();
    expect(stored.length).toBe(1);
    expect(stored[0].lead_id).toBe(lead.lead_id);
    expect(stored[0].internal.notification_status).toBe("notification_pending");

    updateLeadStatus(lead.lead_id, "sent", "test_channel");
    const updated = getStoredLeads();
    expect(updated[0].internal.notification_status).toBe("sent");
    expect(updated[0].internal.notification_channel).toBe("test_channel");
  });

  it("exports stored leads to CSV formatted text", () => {
    const lead = buildLeadRecord(baseMockData);
    const csv = exportLeadsToCsv([lead]);
    expect(csv).toContain("ID,Fecha,Marca,Contacto,Email");
    expect(csv).toContain("Moda Bogotá");
    expect(csv).toContain("carlos@example.com");
  });
});
