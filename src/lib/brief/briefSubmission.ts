import { BriefFormData, BriefLeadRecord } from "@/types/brief";
import { buildEmailHtmlBody, buildLeadRecord } from "./briefLogic";
import { saveLeadLocally, updateLeadStatus, getLeadById } from "./briefStorage";
import {
  trackBriefSubmitted,
  trackBriefSubmitFailed,
  trackLeadCaptured,
} from "@/lib/analytics";

export interface SubmissionResult {
  success: boolean;
  leadId?: string;
  lead?: BriefLeadRecord;
  error?: string;
  notificationStatus?: "sent" | "notification_pending" | "failed";
}

// Configurable endpoints (via Vite env variables or standard fallback paths)
const WEBHOOK_URL =
  (import.meta.env?.VITE_BRIEF_WEBHOOK_URL as string) ||
  "https://services.leadconnectorhq.com/hooks/OSpBlSon5j5uMQmR9X5h/webhook-trigger/FZ5I63gzmjGXLvgpeArr";

const PHP_MAILER_ENDPOINT = "/api/send-brief.php";

/**
 * Primary brief submission workflow:
 * 1. Antispam validation (honeypot + quick submission check)
 * 2. Lead record creation and local persistent storage (Zero Lead Loss guarantee)
 * 3. Notification dispatch to email relay / webhook
 * 4. Analytics emission
 */
export async function submitBriefForm(data: BriefFormData): Promise<SubmissionResult> {
  // Antispam Honeypot check
  if (data.website_source_hp && data.website_source_hp.trim() !== "") {
    console.warn("Honeypot triggered — spam rejected");
    return {
      success: true,
      leadId: `ROI-EC-${Math.floor(1000 + Math.random() * 9000)}`,
      notificationStatus: "notification_pending",
    };
  }

  // Fast submission check (bots submitting under 2.5 seconds from render)
  if (data.client_rendered_at && Date.now() - data.client_rendered_at < 2500) {
    console.warn("Fast submission detected — flagged as suspicious bot");
  }

  // Build complete structured lead record
  const lead = buildLeadRecord(data);

  // CRITICAL STEP: Persist immediately to client storage BEFORE attempting network dispatch.
  // This guarantees the lead is safely recorded even if internet drops or server errors out.
  saveLeadLocally(lead);

  // Attempt network notification (Decoupled adapters: PHP Mailer or Webhook)
  let notificationSent = false;
  let usedChannel = "";

  const emailHtml = buildEmailHtmlBody(lead);
  const payload = {
    ...lead,
    email_notification: {
      from: "ventas@roicas.com",
      to: "herebus_cas@hotmail.com",
      subject: `[Brief E-commerce] Nueva cotización: ${lead.business.business_name} (${lead.contact.contact_name}) - Complejidad ${lead.internal.complexity_hint.toUpperCase()}`,
      html: emailHtml,
      text: lead.summary_text,
    },
  };

  // Try 1: PHP Mailer on same origin (if hosted on Apache/cPanel with PHP)
  try {
    const phpRes = await fetch(PHP_MAILER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (phpRes.ok) {
      notificationSent = true;
      usedChannel = "php_mailer";
    }
  } catch {
    // PHP endpoint not available or returned network error — fall through to webhook
  }

  // Try 2: Configured Webhook (n8n, LeadConnector, Make, etc.)
  if (!notificationSent && WEBHOOK_URL) {
    try {
      const webhookRes = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.lead_id,
          created_at: lead.created_at,
          name: lead.contact.contact_name,
          email: lead.contact.contact_email,
          phone: lead.contact.full_whatsapp,
          business_name: lead.business.business_name,
          project_stage: lead.business.project_stage,
          platform_preference: lead.business.platform_preference,
          catalog_size: lead.catalog.catalog_size,
          initial_upload: lead.catalog.initial_upload,
          complexity_hint: lead.internal.complexity_hint,
          effort_flags: lead.internal.effort_flags,
          pending_points: lead.internal.pending_points,
          launch_target: lead.contact.launch_target,
          budget_range: lead.contact.budget_range,
          recipient: "herebus_cas@hotmail.com",
          sender: "ventas@roicas.com",
          summary_text: lead.summary_text,
          full_lead: lead,
        }),
      });

      if (webhookRes.ok || webhookRes.type === "opaque") {
        notificationSent = true;
        usedChannel = "webhook";
      }
    } catch {
      // Webhook network failure
    }
  }

  // Update persistent notification status
  if (notificationSent) {
    updateLeadStatus(lead.lead_id, "sent", usedChannel);
    lead.internal.notification_status = "sent";
  } else {
    updateLeadStatus(lead.lead_id, "notification_pending", "local_queue");
    lead.internal.notification_status = "notification_pending";
  }

  // Analytics tracking without PII
  trackBriefSubmitted(
    lead.lead_id,
    lead.internal.complexity_hint,
    lead.business.platform_preference
  );
  trackLeadCaptured("brief_form");

  return {
    success: true,
    leadId: lead.lead_id,
    lead,
    notificationStatus: lead.internal.notification_status,
  };
}

/**
 * Retries dispatching a lead notification that was left as "notification_pending"
 */
export async function retryNotification(leadId: string): Promise<boolean> {
  const lead = getLeadById(leadId);
  if (!lead) return false;

  const emailHtml = buildEmailHtmlBody(lead);
  const payload = {
    ...lead,
    email_notification: {
      from: "ventas@roicas.com",
      to: "herebus_cas@hotmail.com",
      subject: `[Brief E-commerce] [REINTENTO] Nueva cotización: ${lead.business.business_name} (${lead.contact.contact_name}) - Complejidad ${lead.internal.complexity_hint.toUpperCase()}`,
      html: emailHtml,
      text: lead.summary_text,
    },
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.type === "opaque") {
      updateLeadStatus(leadId, "sent", "webhook_retry");
      return true;
    }
  } catch (err) {
    updateLeadStatus(leadId, "failed", "retry_error");
    trackBriefSubmitFailed(String(err));
  }
  return false;
}
