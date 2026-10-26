import { BriefLeadRecord, NotificationStatus } from "@/types/brief";

const STORAGE_KEY = "roicas_brief_leads_v1";

export function getStoredLeads(): BriefLeadRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Error reading stored leads from localStorage:", err);
    return [];
  }
}

export function saveLeadLocally(lead: BriefLeadRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredLeads();
    const existingIndex = current.findIndex((l) => l.lead_id === lead.lead_id);
    if (existingIndex >= 0) {
      current[existingIndex] = lead;
    } else {
      current.unshift(lead);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Error saving lead to localStorage:", err);
  }
}

export function updateLeadStatus(
  leadId: string,
  status: NotificationStatus,
  channel?: string
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredLeads();
    const target = current.find((l) => l.lead_id === leadId);
    if (target) {
      target.internal.notification_status = status;
      target.internal.notification_attempts = (target.internal.notification_attempts || 0) + 1;
      target.internal.last_notification_attempt_at = new Date().toISOString();
      if (channel) {
        target.internal.notification_channel = channel;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch (err) {
    console.error("Error updating lead status:", err);
  }
}

export function getLeadById(id: string): BriefLeadRecord | undefined {
  const current = getStoredLeads();
  return current.find((l) => l.lead_id === id);
}

// ── Export leads to CSV ───────────────────────────────────────────────────────

export function exportLeadsToCsv(leads: BriefLeadRecord[]): string {
  const headers = [
    "ID",
    "Fecha",
    "Marca",
    "Contacto",
    "Email",
    "WhatsApp",
    "Etapa",
    "Plataforma Preferida",
    "Catálogo Total",
    "Carga Inicial ROICAS",
    "Complejidad",
    "Estado Notificación",
    "Plazo",
    "Presupuesto",
    "Alertas Esfuerzo",
  ];

  const rows = leads.map((l) => [
    `"${l.lead_id}"`,
    `"${l.created_at}"`,
    `"${l.business.business_name.replace(/"/g, '""')}"`,
    `"${l.contact.contact_name.replace(/"/g, '""')}"`,
    `"${l.contact.contact_email}"`,
    `"${l.contact.full_whatsapp}"`,
    `"${l.business.project_stage}"`,
    `"${l.business.platform_preference}"`,
    `"${l.catalog.catalog_size}"`,
    `"${l.catalog.initial_upload}"`,
    `"${l.internal.complexity_hint}"`,
    `"${l.internal.notification_status}"`,
    `"${l.contact.launch_target}"`,
    `"${l.contact.budget_range}"`,
    `"${(l.internal.effort_flags || []).join("; ")}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function triggerDownload(content: string, filename: string, mimeType: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
