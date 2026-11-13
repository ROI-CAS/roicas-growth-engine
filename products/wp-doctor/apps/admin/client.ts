import { commercialStates } from "../../packages/contracts";
import { escapeHtml as e } from "../../packages/core/http";
import type { BrowserAssessment } from "../../packages/core/browser-report";
import type { SiteEvidence } from "../../packages/core/site-evidence";
type Lead = {
  id: string;
  website_url: string;
  issue_type: string;
  commercial_status: string;
  created_at: string;
  next_action: string;
  version: number;
  email: string;
  phone: string;
  marketing_opt_in: boolean;
};
type Detail = {
  lead: Lead;
  consents: { privacy_version: string; accepted_at: string };
  notes: { note: string; created_at: string }[];
  offers: {
    id: string;
    service_type: string;
    quoted_price_cop: number;
    scope_summary: string;
    exclusions: string;
    status: string;
  }[];
};
const message = document.querySelector<HTMLElement>("#admin-message")!;
const detail = document.querySelector<HTMLElement>("#detail")!;
let offset: number | null = 0;
let selected: string | null = null;
let identityRole = "";
const date = (value: string) =>
  new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
const money = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
function renderBrowser(browser: BrowserAssessment | undefined): string {
  if (!browser) return "";
  return `<h4>Evidencias del navegador</h4><p>${e(browser.source)} · ${e(date(browser.measuredAt))}</p><p>Cobertura: ${browser.coverageLimited ? "limitada" : "portada, móvil y escritorio"}. Hallazgos observados: ${browser.findings.length}.</p>${browser.findings.map((f) => `<details><summary>${e(f.title)} · ${e(f.profiles.join(", "))}</summary><p>Recurso: ${e(f.url)}</p><p>Evidencia: ${e(f.evidence)}</p><p>Posible impacto: ${e(f.impact)}</p><p>Siguiente comprobación: ${e(f.nextCheck)}</p></details>`).join("")}${browser.findings.length ? "" : "<p>No se registraron hallazgos dentro del alcance ejecutado. Esto no acredita ausencia de fallos.</p>"}<ul>${browser.limitations.map((l) => `<li>${e(l)}</li>`).join("")}</ul>`;
}
function renderSite(site: SiteEvidence | undefined): string {
  if (!site) return "";
  return `<h4>${site.pages.length} páginas examinadas · ${site.findings.length} hallazgos</h4>${site.findings.map((f) => `<details><summary>${e(f.title)} · ${{ critical: "Crítico", warning: "Advertencia", info: "Informativo" }[f.severity]}</summary><p>${e(f.summary)}</p><p>Evidencia: ${e(f.evidence.join(" · "))}</p><p>Siguiente paso: ${e(f.recommendation)}</p></details>`).join("")}<h4>Tecnologías detectadas</h4><ul>${site.technologies.map((t) => `<li>${e(t.name)} · ${e(t.category)}${t.version ? ` · ${e(t.version)} (${t.versionBasis === "generator" ? "declarado en HTML" : "indicio en archivo"})` : " · versión interna no confirmada"}<small>${t.evidence.map(e).join(" · ")}</small></li>`).join("")}</ul>`;
}
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1/admin/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  const data = (await response.json()) as T & { message?: string };
  if (!response.ok)
    throw new Error(data.message || "No fue posible completar la operación.");
  return data;
}
function report(error: unknown) {
  message.textContent =
    error instanceof Error ? error.message : "Operación no disponible.";
}
async function loadMetrics() {
  const data = await api<{
    stages: { stage: string; count: number }[];
    events: { event_name: string; count: number }[];
  }>("funnel");
  const total = data.stages.reduce((sum, stage) => sum + stage.count, 0);
  const count = (name: string) =>
    data.stages.find((s) => s.stage === name)?.count ?? 0;
  const metrics = [
    ["Solicitudes", total],
    ["Por revisar", count("nuevo") + count("pendiente_revision")],
    ["Calificadas", count("calificado")],
    ["Ganadas", count("ganado")],
  ]
    .map(
      ([label, n]) =>
        `<article><span>${label}</span><strong>${n}</strong></article>`,
    )
    .join("");
  document.querySelector("#metrics")!.innerHTML =
    `${metrics}<p class="micro funnel-summary">Eventos con consentimiento: visitas ${data.events.find((v) => v.event_name === "landing_view")?.count ?? 0} · paso 1 ${data.events.find((v) => v.event_name === "form_step1_completed")?.count ?? 0} · WhatsApp ${data.events.find((v) => v.event_name === "whatsapp_click")?.count ?? 0}. Eventos, no visitantes únicos. CAC y margen pendientes de datos.</p>`;
}
async function list(reset = false) {
  if (reset) {
    offset = 0;
    document.querySelector("#leads")!.replaceChildren();
  }
  if (offset === null) return;
  const data = await api<{ leads: Lead[]; next_offset: number | null }>(
    `leads?offset=${offset}`,
  );
  const container = document.querySelector("#leads")!;
  if (reset && data.leads.length === 0)
    container.innerHTML = '<p class="empty">Todavía no hay solicitudes.</p>';
  for (const lead of data.leads) {
    const button = document.createElement("button");
    button.className = "lead-item";
    button.dataset.id = lead.id;
    button.innerHTML = `<strong>${e(new URL(lead.website_url).hostname)}</strong><span>${e(lead.commercial_status.replaceAll("_", " "))}</span><small>${e(date(lead.created_at))}</small>`;
    button.addEventListener("click", () => {
      void openLead(lead.id).catch(report);
    });
    container.append(button);
  }
  offset = data.next_offset;
  document.querySelector<HTMLButtonElement>("#more")!.hidden = offset === null;
}
async function openLead(id: string) {
  const data = await api<Detail>(`leads/${id}`);
  const diagnostic = await api<{
    diagnosis: {
      status: string;
      error_code: string | null;
      report: {
        performanceScore: number | null;
        desktop?: { performanceScore: number | null; measuredAt: string };
        limits: string[];
        browser?: BrowserAssessment;
        site?: SiteEvidence;
      } | null;
    } | null;
    deliveries: {
      channel: string;
      status: string;
      error_code: string | null;
    }[];
  }>(`leads/${id}/diagnosis`);
  selected = id;
  const lead = data.lead;
  document
    .querySelectorAll(".lead-item")
    .forEach((item) =>
      item.classList.toggle(
        "selected",
        (item as HTMLElement).dataset.id === id,
      ),
    );
  const noContact =
    lead.commercial_status === "solicita_no_contacto" ||
    lead.commercial_status === "spam";
  detail.innerHTML = `<div class="detail-heading"><p class="eyebrow">${e(lead.id)}</p><h2>${e(new URL(lead.website_url).hostname)}</h2><p>${e(lead.issue_type.replaceAll("_", " "))} · ${e(date(lead.created_at))}</p></div><dl><dt>Correo</dt><dd>${e(lead.email || "No solicitado")}</dd><dt>WhatsApp</dt><dd>${e(lead.phone || "No solicitado")}</dd><dt>Promociones</dt><dd>${lead.marketing_opt_in ? "Autorizadas" : "Sin autorización"}</dd><dt>Consentimiento</dt><dd>${e(data.consents.privacy_version)} · ${e(date(data.consents.accepted_at))}</dd></dl>${noContact ? '<p class="notice">No contactar: respeta la restricción registrada.</p>' : ""}<section class="summary" aria-label="Diagnóstico y entregas"><h3>Diagnóstico técnico</h3>${diagnostic.diagnosis ? `<p>Estado: ${e(diagnostic.diagnosis.status)}${diagnostic.diagnosis.error_code ? ` · ${e(diagnostic.diagnosis.error_code)}` : ""}</p>${diagnostic.diagnosis.report ? `<p>Rendimiento móvil: ${e(diagnostic.diagnosis.report.performanceScore ?? "No medido")}/100</p><p>Rendimiento PC: ${e(diagnostic.diagnosis.report.desktop?.performanceScore ?? "No medido")}${diagnostic.diagnosis.report.desktop?.performanceScore != null ? "/100" : ""}${diagnostic.diagnosis.report.desktop ? ` · ${e(diagnostic.diagnosis.report.desktop.measuredAt)}` : ""}</p><ul>${diagnostic.diagnosis.report.limits.map((text) => `<li>${e(text)}</li>`).join("")}</ul>` : ""}<ul>${diagnostic.deliveries.map((d) => `<li>${e(d.channel)}: ${e(d.status)}${d.error_code ? ` · ${e(d.error_code)}` : ""}</li>`).join("")}</ul><p class="micro">accepted indica aceptación del proveedor, no entrega confirmada. unknown requiere conciliación antes de reenviar.</p>` : "<p>Sin diagnóstico automático programado. Revisión manual.</p>"}${diagnostic.diagnosis?.report?.site ? renderSite(diagnostic.diagnosis.report.site) : renderBrowser(diagnostic.diagnosis?.report?.browser)}</section>
  <form id="update-lead"><h3>Seguimiento</h3><label for="status">Estado comercial</label><select id="status" name="commercial_status">${commercialStates.map((state) => `<option value="${state}" ${state === lead.commercial_status ? "selected" : ""}>${state.replaceAll("_", " ")}</option>`).join("")}</select><label for="next-action">Próxima acción</label><input id="next-action" name="next_action" maxlength="300" value="${e(lead.next_action)}"><label for="note">Nueva nota privada</label><textarea id="note" name="note" rows="3" maxlength="2000"></textarea><button class="button small" type="submit">Guardar seguimiento</button></form>
  <div class="history"><h3>Notas</h3>${data.notes.map((note) => `<article><small>${e(date(note.created_at))}</small><p>${e(note.note)}</p></article>`).join("") || '<p class="micro">Sin notas.</p>'}</div>
  <form id="new-offer"><h3>Registrar oferta revisada</h3><p class="micro">Esta acción registra la propuesta. No envía mensajes ni correos. Marca «Enviada» solo si ya la comunicaste por un canal autorizado.</p><label for="service">Servicio</label><select id="service" name="service_type"><option value="reparacion">Reparación puntual</option><option value="optimizacion">Optimización</option><option value="malware">Recuperación / malware</option><option value="mantenimiento">Mantenimiento</option></select><label for="scope">Alcance acordado</label><textarea id="scope" name="scope_summary" required minlength="10" maxlength="3000"></textarea><label for="exclusions">Exclusiones</label><textarea id="exclusions" name="exclusions" required minlength="5" maxlength="2000"></textarea><label for="quote">Precio final de la propuesta (COP)</label><input id="quote" name="quoted_price_cop" type="number" min="1000" max="1000000000" step="1" required><label for="offer-status">Estado de la propuesta</label><select id="offer-status" name="status"><option value="borrador">Borrador revisado</option><option value="enviada">Ya enviada por canal autorizado</option></select><button class="button small" type="submit" ${noContact ? "disabled" : ""}>Registrar oferta</button></form><div class="history"><h3>Ofertas registradas</h3>${data.offers.map((offer) => `<article><strong>${e(money(offer.quoted_price_cop))} · ${e(offer.status)}</strong><p>${e(offer.scope_summary)}</p><small>Exclusiones: ${e(offer.exclusions)}</small>${offer.status === "enviada" && !noContact ? `<p><button type="button" class="button small outline" data-payment-offer="${e(offer.id)}">Preparar enlace de pago Wompi</button></p>` : ""}</article>`).join("") || '<p class="micro">Sin ofertas.</p>'}</div>`;
  document
    .querySelector<HTMLFormElement>("#update-lead")!
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const values = new FormData(form);
      const button = form.querySelector<HTMLButtonElement>("button")!;
      button.disabled = true;
      void api(`leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          commercial_status: values.get("commercial_status"),
          next_action: values.get("next_action"),
          note: values.get("note"),
          expected_version: lead.version,
        }),
      })
        .then(async () => {
          await Promise.all([openLead(id), list(true), loadMetrics()]);
          message.textContent = "Seguimiento guardado.";
        })
        .catch(report)
        .finally(() => {
          button.disabled = false;
        });
    });
  if(identityRole === "owner") {
    const section=document.createElement("details");
    section.innerHTML=`<summary>Privacidad: suprimir esta solicitud</summary><p>Elimina los datos y el informe de un caso no contratado sin registros de pago. No se puede deshacer desde el panel. Las copias de recuperación tienen su propio plazo.</p><form id="erase-case"><label for="erase-confirm">Escribe la referencia completa para confirmar: ${e(id)}</label><input id="erase-confirm" name="confirm_id" autocomplete="off" required><button class="button outline" type="submit">Suprimir solicitud</button></form>`;
    detail.append(section);
    section.querySelector("form")!.addEventListener("submit",async event=>{
      event.preventDefault();const button=section.querySelector("button")!;button.disabled=true;
      try {const confirm_id=section.querySelector<HTMLInputElement>("input")!.value;await api(`leads/${id}/erase`,{method:"POST",body:JSON.stringify({confirm_id})});selected=null;detail.textContent="Solicitud y datos vinculados eliminados.";await Promise.all([list(true),loadMetrics()]);message.textContent="Supresión realizada.";}catch(error){report(error);button.disabled=false;}
    });
  }
  detail.querySelectorAll<HTMLButtonElement>("[data-payment-offer]").forEach(button => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        const result = await api<{payment_url:string;status:string;expires_at:string}>(`offers/${button.dataset.paymentOffer}/payment`, {method:"POST",body:"{}"});
        const link = document.createElement("a");
        link.href = result.payment_url; link.target = "_blank"; link.rel = "noopener noreferrer";
        link.textContent = `Abrir cotización y pago (${result.status})`;
        const input = document.createElement("input"); input.readOnly=true; input.value=result.payment_url; input.setAttribute("aria-label","Enlace privado de pago para compartir con el cliente");
        button.parentElement!.replaceChildren(link,input); input.select();
        message.textContent="Enlace privado preparado. Compártelo solo con el cliente; no se ha enviado ningún mensaje ni realizado un cobro.";
      } catch(error) {report(error);button.disabled=false;}
    });
  });
  const offerKey = crypto.randomUUID();
  document
    .querySelector<HTMLFormElement>("#new-offer")!
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const values = new FormData(form);
      const button = form.querySelector<HTMLButtonElement>("button")!;
      button.disabled = true;
      void api(`leads/${id}/offers`, {
        method: "POST",
        body: JSON.stringify({
          idempotency_key: offerKey,
          service_type: values.get("service_type"),
          scope_summary: values.get("scope_summary"),
          exclusions: values.get("exclusions"),
          quoted_price_cop: Number(values.get("quoted_price_cop")),
          status: values.get("status"),
        }),
      })
        .then(async () => {
          await Promise.all([openLead(id), list(true), loadMetrics()]);
          message.textContent =
            "Oferta registrada. No se envió ningún mensaje.";
        })
        .catch(report)
        .finally(() => {
          button.disabled = false;
        });
    });
}
document.querySelector("#refresh")!.addEventListener("click", () => {
  message.textContent = "";
  void Promise.all([
    list(true),
    loadMetrics(),
    selected ? openLead(selected) : Promise.resolve(),
  ]).catch(report);
});
document.querySelector("#more")!.addEventListener("click", () => {
  void list().catch(report);
});
async function initialize() {
  const identity = await api<{ email: string; role: string }>("me");
  identityRole = identity.role;
  document.querySelector("#identity")!.textContent =
    `${identity.email} · ${identity.role}`;
  await Promise.all([list(true), loadMetrics()]);
}
void initialize().catch(report);
