import { describe, expect, it } from "vitest";
import { resolveMenu } from "../packages/bot/menu-routing";

const now = Date.parse("2026-10-20T18:00:00.000Z");
const main = {menu_contexto: "service_menu", menu_fecha: new Date(now - 1000).toISOString()};
const web = {...main, menu_contexto: "web_menu"};

describe("Menú WhatsApp: elección según el último menú", () => {
  it.each([["1", "wp_doctor"], ["2", "web_basica"], ["3", "web_express"], ["4", "crm_automatizaciones"]])("%s enlaza con %s", (text, offer) => {
    expect(resolveMenu(text, "unknown", main, now)).toMatchObject({offer, selectedByNumber: true, mode: "conversation"});
  });
  it.each([["1", "web_express"], ["2", "web_basica"]])("el submenú web interpreta %s como %s", (text, offer) => {
    expect(resolveMenu(text, "unknown", web, now)).toMatchObject({offer, selectedByNumber: true});
  });
  it("acepta emojis y formatos breves de selección", () => {
    for (const text of ["1️⃣", "opción 1", "1.", "1)"]) expect(resolveMenu(text, "unknown", main, now).offer).toBe("wp_doctor");
  });
  it("la elección numérica prevalece sobre el origen del anuncio", () => {
    expect(resolveMenu("4", "wp_doctor", main, now).offer).toBe("crm_automatizaciones");
  });
  it("no interpreta un número aislado como menú si no lo mostró o caducó", () => {
    expect(resolveMenu("1", "unknown", {}, now)).toMatchObject({mode: "service_menu", selectedByNumber: false});
    expect(resolveMenu("1", "unknown", {...main,menu_fecha:new Date(now - 25 * 3600000).toISOString()}, now).mode).toBe("service_menu");
    expect(resolveMenu("4", "unknown", {oferta_confirmada:"web_basica"}, now)).toMatchObject({offer:"web_basica", selectedByNumber:false});
  });
  it("una opción inválida repite solo el menú vigente", () => {
    expect(resolveMenu("4", "unknown", web, now)).toMatchObject({mode:"web_menu",offer:"web_sin_formato"});
    expect(resolveMenu("9", "unknown", main, now).text).toContain("Esa opción no aparece");
  });
  it("admite texto libre y cambios de producto", () => {
    expect(resolveMenu("Necesito un CRM", "crm_automatizaciones", {...main,oferta_confirmada:"wp_doctor"}, now).offer).toBe("crm_automatizaciones");
    expect(resolveMenu("Necesito una web con 4 páginas", "web_basica", main, now)).toMatchObject({offer:"web_basica",selectedByNumber:false});
  });
  it("no muestra menú si el origen o servicio ya están confirmados", () => {
    expect(resolveMenu("Quiero más información", "wp_doctor", {}, now).mode).toBe("conversation");
    expect(resolveMenu("¿Cuánto cuesta?", "unknown", {oferta_confirmada:"crm_automatizaciones"}, now).offer).toBe("crm_automatizaciones");
  });
  it("permite volver al menú o precisar el formato web", () => {
    expect(resolveMenu("menú", "unknown", {oferta_confirmada:"wp_doctor"}, now).mode).toBe("service_menu");
    expect(resolveMenu("0", "unknown", main, now).mode).toBe("service_menu");
    expect(resolveMenu("Quiero una web", "web_sin_formato", {}, now).mode).toBe("web_menu");
  });
});
