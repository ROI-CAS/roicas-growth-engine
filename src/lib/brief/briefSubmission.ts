import { BriefFormData, BriefLeadRecord } from "@/types/brief";
import { buildLeadRecord } from "./briefLogic";
import { simpleBriefSummary } from "./simpleBrief";
import { saveLeadLocally, updateLeadStatus, getLeadById } from "./briefStorage";
import { sendEmailSubmission } from "@/lib/emailSubmission";
import { trackBriefSubmitted, trackBriefSubmitFailed, trackLeadCaptured } from "@/lib/analytics";

export interface SubmissionResult {
  success: boolean;
  leadId?: string;
  lead?: BriefLeadRecord;
  error?: string;
  notificationStatus?: "sent" | "notification_pending" | "failed";
}

export async function submitBriefForm(data: BriefFormData, previousLead?: BriefLeadRecord): Promise<SubmissionResult> {
  if (data.website_source_hp?.trim()) {
    return { success: false, error: "No pudimos procesar la solicitud." };
  }
  const lead = previousLead || buildLeadRecord(data);
  lead.summary_text = simpleBriefSummary(lead);
  // Recovery copy in this browser; this is not a server-side record or confirmed delivery.
  saveLeadLocally(lead);
  try {
    await sendEmailSubmission({ kind: "brief", lead });
    updateLeadStatus(lead.lead_id, "sent", "resend");
    lead.internal.notification_status = "sent";
    trackBriefSubmitted(lead.lead_id, lead.internal.complexity_hint, lead.business.platform_preference);
    trackLeadCaptured("brief_form");
    return { success: true, leadId: lead.lead_id, lead, notificationStatus: "sent" };
  } catch (error) {
    updateLeadStatus(lead.lead_id, "notification_pending", "resend");
    trackBriefSubmitFailed("email_dispatch_failed");
    return {
      success: false, leadId: lead.lead_id, lead, notificationStatus: "notification_pending",
      error: error instanceof Error ? error.message : "No pudimos enviar tu solicitud. Inténtalo de nuevo.",
    };
  }
}

export async function retryNotification(leadId: string): Promise<boolean> {
  const lead = getLeadById(leadId);
  if (!lead) return false;
  try {
    await sendEmailSubmission({ kind: "brief", lead });
    updateLeadStatus(leadId, "sent", "resend");
    return true;
  } catch {
    updateLeadStatus(leadId, "notification_pending", "resend");
    return false;
  }
}
