import { BriefFormData } from "@/types/brief";
import { validateStep5 } from "./briefLogic";

export function validateSimpleStep(step: number, data: BriefFormData) {
  const errors: Record<string, string> = {};
  if (step === 1) {
    if (!data.business_name.trim() || data.business_name.trim().length > 150) errors.business_name = "Escribe el nombre de tu negocio (máximo 150 caracteres).";
    if (!data.project_stage) errors.project_stage = "Elige la opción que mejor describa tu negocio.";
    if (!data.product_type.length) errors.product_type = "Selecciona qué te gustaría vender.";
  }
  if (step === 2 && data.special_requirements.length > 3000) errors.special_requirements = "Cuéntanos tu idea en máximo 3.000 caracteres.";
  if (step === 3) {
    Object.assign(errors, validateStep5(data).errors);
    const digits = data.contact_whatsapp.replace(/\D/g, "");
    if (data.contact_phone_prefix === "+57" && digits.length !== 10) errors.contact_whatsapp = "Escribe tu celular de 10 dígitos, sin el +57.";
    if (digits.length > 15) errors.contact_whatsapp = "Revisa el número de WhatsApp.";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function simpleBriefSummary(lead: import("@/types/brief").BriefLeadRecord) {
  const labels: Record<string, string> = {
    nuevo: "Estoy empezando", ya_vendo_sin_tienda: "Ya vendo por redes o en un local",
    ya_tengo_tienda_y_quiero_renovar: "Quiero mejorar mi tienda actual", quiero_migrar: "Quiero cambiar mi tienda actual",
    fisicos: "Productos físicos", digitales: "Productos digitales", servicios: "Servicios", suscripciones: "Suscripciones",
    "1_10": "Hasta 10", "11_30": "Entre 11 y 30", "31_100": "Entre 31 y 100", "101_500": "Entre 101 y 500", mas_500: "Más de 500", sin_definir: "Por definir",
    solo_colombia: "Colombia", colombia_y_otros_paises: "Colombia y otros países", solo_otros_paises: "Otros países", por_definir: "Por definir",
    menos_1_mes: "Lo antes posible", "1_2_meses": "En 1 o 2 meses", "3_meses_o_mas": "En 3 meses o más", sin_fecha: "Sin fecha definida",
  };
  return `SOLICITUD DE TIENDA ONLINE · ${lead.lead_id}\n\nNegocio: ${lead.business.business_name}\nEtapa: ${labels[lead.business.project_stage] || "Por definir"}\nQué venderá: ${lead.business.product_type.map(v => labels[v]).join(", ")}\nCantidad aproximada: ${labels[lead.catalog.catalog_size]}\nDónde venderá: ${labels[lead.business.sales_regions]}\nFecha deseada: ${labels[lead.contact.launch_target]}\n\nIdea y necesidades:\n${lead.design.special_requirements || "Prefiere conversar con el equipo."}\n\nCONTACTO\nNombre: ${lead.contact.contact_name}\nCorreo: ${lead.contact.contact_email}\nWhatsApp: ${lead.contact.full_whatsapp}\n\nEl alcance técnico y el precio se definirán después de revisar la solicitud. No se solicitó presupuesto ni se eligieron plataformas o integraciones.\nAutorización de tratamiento de datos: aceptada.`;
}
