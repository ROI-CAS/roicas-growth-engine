export type MenuState = {
  menu_contexto?: string | null;
  menu_fecha?: string | null;
  oferta_confirmada?: string | null;
};

/** Pure routing shared by the n8n expression and its regression tests. */
export function resolveMenu(message: string, signal: string, state: MenuState, now: number) {
  const offers = ["wp_doctor", "web_basica", "web_express", "crm_automatizaciones"];
  const mainMenu = "¡Hola! 👋 ¿En qué podemos ayudarte?\n\n1️⃣ Mantenimiento y reparación WordPress\n2️⃣ Web de 4 páginas o más\n3️⃣ Onepage (una sola página)\n4️⃣ CRM y automatizaciones\n\nResponde con el número o cuéntanos qué necesitas.";
  const webMenu = "Para orientarte mejor 👇\n\n1️⃣ Onepage: una página con secciones\n2️⃣ Web de varias páginas: desde 4 páginas\n\nResponde 1 o 2. También puedes describir lo que necesitas.";
  const text = String(message || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f\ufe0f\u20e3]/g, "").trim();
  const previous = offers.includes(state.oferta_confirmada || "") ? state.oferta_confirmada! : "";
  const age = now - Date.parse(state.menu_fecha || "");
  const active = age >= 0 && age <= 24 * 3600000 ? state.menu_contexto : "";
  const number = text.match(/^(?:opcion\s*)?([0-9])\s*[.)]?$/)?.[1];
  const makeMenu = (mode: "service_menu" | "web_menu", invalid = false) => ({
    offer: mode === "web_menu" ? "web_sin_formato" : "unknown",
    mode, selectedByNumber: false,
    note: invalid ? "La opción no pertenece al menú vigente; no cambies el servicio." : "Muestra el menú y permite responder con número o texto.",
    text: (invalid ? "Esa opción no aparece en este menú.\n\n" : "") + (mode === "web_menu" ? webMenu : mainMenu),
  });
  const selected = (offer: string, byNumber = false, note = "") => ({offer, mode: "conversation", selectedByNumber: byNumber, note, text: ""});
  if (/^(menu|opciones|inicio|volver al menu|ver servicios)$/.test(text) || number === "0") return makeMenu("service_menu");
  if (number && ["service_menu", "web_menu"].includes(active || "")) {
    const mapping: Record<string, string> = active === "web_menu"
      ? {"1": "web_express", "2": "web_basica"}
      : {"1": "wp_doctor", "2": "web_basica", "3": "web_express", "4": "crm_automatizaciones"};
    return mapping[number] ? selected(mapping[number], true, "La persona eligió este servicio en el menú vigente. Atiéndelo directamente y no repitas la clasificación.") : makeMenu(active as "service_menu" | "web_menu", true);
  }
  // A bare number outside an active menu may answer a different question.
  if (number) return previous ? selected(previous, false, "No hay un menú vigente: este número no elige un servicio. Interprétalo según la última pregunta; si no es claro, pide aclaración.") : makeMenu("service_menu");
  if (offers.includes(signal)) return selected(signal);
  if (signal === "web_sin_formato") return ["web_basica", "web_express"].includes(previous) ? selected(previous) : makeMenu("web_menu");
  if (["necesita_aclaracion", "other_campaign"].includes(signal)) return selected(signal);
  if (previous) return selected(previous, false, "Usa el servicio ya confirmado, salvo que la persona cambie explícitamente de necesidad.");
  if (active === "web_menu") return makeMenu("web_menu");
  return makeMenu("service_menu");
}
