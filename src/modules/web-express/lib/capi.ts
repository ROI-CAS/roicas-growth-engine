import { productRequest } from "./request";


/**
 * Puente cliente → Conversions API. El navegador llama a este server function y
 * el envío real ocurre en el servidor (ver capi-core.ts), donde vive el token.
 * Cada evento lleva el mismo `eventId` que el Pixel para que Meta lo deduplique.
 */
export interface CapiPayload {
  pixelId?: string;
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  phone?: string;
  value?: number;
  currency?: string;
}

export function sendCapiEvent({ data }: { data: CapiPayload }): Promise<{ skipped?: boolean; ok?: boolean }> {
 return productRequest("capi", data);
}
