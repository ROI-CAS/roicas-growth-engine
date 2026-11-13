import type { BriefData } from "../../src/modules/web-express/lib/brief";

/**
 * Envío de los correos del brief vía Resend (SOLO servidor).
 * - Notificación interna estructurada → BRIEF_NOTIFY_TO
 * - Confirmación corporativa al cliente ← BRIEF_FROM_EMAIL
 * La API key nunca sale de aquí. Si no está configurada, no-op silencioso.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const BRAND = "#DC2626";

function esc(value: string | undefined): string {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(value: string | undefined): string {
  return esc(value).replace(/\n/g, "<br>");
}

function logoLabel(v: BriefData["tieneLogo"]): string {
  return v === "si"
    ? "Sí, en buena calidad"
    : v === "baja"
      ? "Sí, pero baja resolución"
      : "No tiene";
}

function row(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:8px 0;vertical-align:top;width:170px;color:#64748b;font-size:13px;font-weight:600;">${esc(label)}</td>
    <td style="padding:8px 0;vertical-align:top;color:#0f172a;font-size:14px;">${valueHtml}</td>
  </tr>`;
}

function sectionTitle(text: string): string {
  return `<tr><td colspan="2" style="padding:20px 0 6px;border-top:1px solid #e2e8f0;color:${BRAND};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">${esc(text)}</td></tr>`;
}

function shell(inner: string): string {
  return `<div style="background:#f1f5f9;padding:24px 12px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0f172a;padding:20px 28px;">
        <span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:-.02em;">Web Express <span style="color:${BRAND};">24H</span></span>
      </div>
      <div style="padding:28px;">${inner}</div>
      <div style="padding:16px 28px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;">
        Web Express 24H · Un producto de Roicas · ventas@roicas.com
      </div>
    </div>
  </div>`;
}

function notificationHtml(d: BriefData): string {
  const wa = d.whatsapp.replace(/\D/g, "");
  const redes = [
    d.instagram ? `Instagram: ${esc(d.instagram)}` : "",
    d.facebook ? `Facebook: ${esc(d.facebook)}` : "",
  ]
    .filter(Boolean)
    .join(" &nbsp;·&nbsp; ");

  const inner = `
    <h1 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Nuevo brief recibido</h1>
    <p style="margin:0 0 20px;color:#64748b;font-size:14px;">${esc(d.empresa)} — ${esc(d.sector)}</p>
    <table style="width:100%;border-collapse:collapse;">
      ${sectionTitle("Contacto")}
      ${row("Nombre", esc(d.nombre))}
      ${row("WhatsApp", `<a href="https://wa.me/${wa}" style="color:${BRAND};text-decoration:none;">${esc(d.whatsapp)}</a>`)}
      ${row("Email", `<a href="mailto:${esc(d.email)}" style="color:${BRAND};text-decoration:none;">${esc(d.email)}</a>`)}
      ${row("Ciudad", esc(d.ciudad))}
      ${sectionTitle("Negocio")}
      ${row("Empresa", esc(d.empresa))}
      ${row("Sector", esc(d.sector))}
      ${row("Descripción", nl2br(d.descripcion))}
      ${sectionTitle("Contenido")}
      ${row("Servicios", nl2br(d.servicios))}
      ${row("Secciones", esc(d.secciones.join(", ") || "—"))}
      ${row("Logo", esc(logoLabel(d.tieneLogo)))}
      ${row("Fotos del negocio", d.tieneFotos === "si" ? "Sí" : "No, necesita imágenes")}
      ${redes ? row("Redes sociales", redes) : ""}
      ${d.referencia ? row("Referencia", `<a href="${esc(d.referencia)}" style="color:${BRAND};">${esc(d.referencia)}</a>`) : ""}
      ${d.notas ? row("Notas", nl2br(d.notas)) : ""}
    </table>`;
  return shell(inner);
}

function confirmationHtml(d: BriefData): string {
  const inner = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#0f172a;">¡Recibimos tu información, ${esc(d.nombre)}! 🎉</h1>
    <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
      Gracias por confiar en <strong>Web Express 24H</strong>. Ya tenemos el brief de
      <strong>${esc(d.empresa)}</strong> y nuestro equipo lo está revisando.
    </p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;margin:0 0 16px;">
      <p style="margin:0;color:#0f172a;font-size:14px;line-height:1.6;">
        <strong>¿Qué sigue?</strong><br>
        Te contactaremos <strong>por WhatsApp</strong> (${esc(d.whatsapp)}) para
        afinar los últimos detalles y confirmar el alcance, la fecha de inicio y el
        <strong>plazo de entrega acordado en tu cotización</strong>.
      </p>
    </div>
    <p style="margin:0 0 6px;color:#334155;font-size:15px;line-height:1.6;">
      Si necesitas algo antes, respóndenos este correo o escríbenos por WhatsApp.
    </p>
    <p style="margin:20px 0 0;color:#64748b;font-size:14px;">
      Un saludo,<br><strong style="color:#0f172a;">Equipo Web Express 24H</strong> · Roicas
    </p>`;
  return shell(inner);
}

async function sendViaResend(apiKey: string, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("Resend error", res.status, err);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend request failed", error);
    return false;
  }
}

const TARGET_NOTIFY_EMAIL = "herebus_cas@hotmail.com";

function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY;
}

export async function sendBriefEmails(data: BriefData) {
  const apiKey = getResendApiKey();
  const from = process.env.BRIEF_FROM_EMAIL || "Web Express 24H <ventas@roicas.com>";
  const notifyRecipients = Array.from(
    new Set([
      TARGET_NOTIFY_EMAIL,
      ...(process.env.BRIEF_NOTIFY_TO ? [process.env.BRIEF_NOTIFY_TO] : []),
    ]),
  );

  // Sin API key: no-op (útil en local sin configurar). El flujo de WhatsApp sigue.
  if (!apiKey) return { skipped: true as const };

  // 1) Notificación interna (responder va directo al cliente).
  const notified = await sendViaResend(apiKey, {
    from,
    to: notifyRecipients,
    reply_to: data.email,
    subject: `Nuevo brief: ${data.empresa} — ${data.nombre}`,
    html: notificationHtml(data),
  });

  // 2) Confirmación corporativa al cliente.
  let confirmed = false;
  if (data.email) {
    confirmed = await sendViaResend(apiKey, {
      from,
      to: [data.email],
      subject: "Recibimos tu información — Web Express 24H",
      html: confirmationHtml(data),
    });
  }

  return { ok: notified, notified, confirmed };
}

/** Email-only quotation request. A success requires acceptance of the internal notification. */
export async function sendQuotationEmails(data: import("../../src/modules/web-express/lib/quotation").QuotationData) {
  const apiKey = getResendApiKey();
  if (!apiKey) return { status: "unconfigured" as const };
  const from = process.env.BRIEF_FROM_EMAIL || "Web Express <ventas@roicas.com>";
  const toRecipients = Array.from(
    new Set([
      TARGET_NOTIFY_EMAIL,
      ...(process.env.BRIEF_NOTIFY_TO ? [process.env.BRIEF_NOTIFY_TO] : []),
    ]),
  );
  const notified = await sendViaResend(apiKey, {
    from,
    to: toRecipients,
    reply_to: data.email,
    subject: "Solicitud de cotización por correo — Web Express",
    html: shell(
      `<h1>Solicitud de cotización</h1><p><strong>Campaña:</strong> Black November 2026 · One Page $399.000 COP</p><p><strong>Nombre:</strong> ${esc(data.nombre)}</p><p><strong>Correo:</strong> ${esc(data.email)}</p><p><strong>Negocio:</strong> ${esc(data.negocio)}</p><p><strong>Necesidad:</strong><br>${nl2br(data.mensaje)}</p><p>El cliente solicita recibir la cotización por correo. Responde a este mensaje para contactarlo.</p>`,
    ),
  });
  if (!notified) return { status: "error" as const };
  const confirmed = await sendViaResend(apiKey, {
    from,
    to: [data.email],
    subject: "Recibimos tu solicitud de cotización — Web Express",
    html: shell(
      `<h1>Gracias, ${esc(data.nombre)}</h1><p>Recibimos tu solicitud de cotización. Revisaremos lo que necesitas y te responderemos a este correo con el alcance, el precio y el plazo de tu proyecto.</p><p>Esta confirmación no es una cotización ni una reserva. No necesitas tener WhatsApp.</p>`,
    ),
  });
  return { status: "sent" as const, confirmed };
}
