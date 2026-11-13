import { productRequest } from "./request";

import { z } from "zod";

export const quotationSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(100),
  email: z.string().trim().email("Revisa tu correo electrónico").max(254),
  negocio: z.string().trim().max(150),
  mensaje: z.string().trim().min(10, "Cuéntanos un poco más sobre tu web").max(2000),
  consent: z.literal(true),
  website: z.string().max(0),
});
export type QuotationData = z.infer<typeof quotationSchema>;

export function submitQuotation({ data }: { data: QuotationData }): Promise<{ status: "unconfigured" | "error" | "sent"; confirmed?: boolean }> {
 return productRequest("quotation", data);
}
