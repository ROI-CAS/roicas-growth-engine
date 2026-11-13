import { productRequest } from "./request";


/**
 * Envío del brief por correo (server function). El cliente llama a esto al
 * enviar el paso 2; el envío real ocurre en el servidor (email-core.ts), donde
 * vive la API key de Resend. Best-effort: no bloquea el flujo de WhatsApp.
 */
export interface BriefData {
  nombre: string;
  whatsapp: string;
  email: string;
  empresa: string;
  ciudad: string;
  sector: string;
  descripcion: string;
  servicios: string;
  tieneLogo: "si" | "no" | "baja";
  tieneFotos: "si" | "no";
  secciones: string[];
  instagram?: string;
  facebook?: string;
  referencia?: string;
  notas?: string;
}

export function submitBrief({ data }: { data: BriefData }): Promise<{ skipped?: boolean; ok?: boolean; notified?: boolean; confirmed?: boolean }> {
 return productRequest("brief", data);
}
