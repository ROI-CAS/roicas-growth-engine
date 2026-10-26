import { describe, expect, it } from "vitest";
import { validateSimpleStep } from "@/lib/brief/simpleBrief";
import { BriefFormData } from "@/types/brief";

const data = {
  business_name: "Tienda", project_stage: "nuevo", product_type: ["fisicos"],
  special_requirements: "", contact_name: "Ana", contact_email: "ana@example.com",
  contact_phone_prefix: "+57", contact_whatsapp: "3114565403", privacy_consent: true, launch_target: "sin_fecha",
} as BriefFormData;

describe("Brief sencillo sin decisiones técnicas", () => {
  it("permite avanzar sin plataforma, pagos, envíos ni presupuesto", () => {
    expect(validateSimpleStep(1, data).isValid).toBe(true);
    expect(validateSimpleStep(2, data).isValid).toBe(true);
    expect(validateSimpleStep(3, data).isValid).toBe(true);
  });
  it("permite omitir todas las preguntas del segundo paso", () => {
    expect(validateSimpleStep(2, { ...data, special_requirements: "" }).errors).toEqual({});
  });
  it("impide enviar sin consentimiento", () => {
    expect(validateSimpleStep(3, { ...data, privacy_consent: false }).errors.privacy_consent).toBeTruthy();
  });
  it("explica cómo corregir un celular colombiano con indicativo duplicado", () => {
    expect(validateSimpleStep(3, { ...data, contact_whatsapp: "573114565403" }).errors.contact_whatsapp).toContain("sin el +57");
  });
  it("pide elegir el tipo de producto", () => {
    expect(validateSimpleStep(1, { ...data, product_type: [] }).errors.product_type).toBeTruthy();
  });
});
