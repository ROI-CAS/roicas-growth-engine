import React, { useState, useEffect } from "react";
import { BriefLeadRecord, ComplexityHint, NotificationStatus } from "@/types/brief";
import { getStoredLeads, exportLeadsToCsv, triggerDownload } from "@/lib/brief/briefStorage";
import { retryNotification } from "@/lib/brief/briefSubmission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert,
  Download,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Mail,
  X,
  FileSpreadsheet,
} from "lucide-react";

const ADMIN_PASSCODE = "roicas2026";

export const BriefAdminView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [leads, setLeads] = useState<BriefLeadRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [complexityFilter, setComplexityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<BriefLeadRecord | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  useEffect(() => {
    // Check if session authenticated
    if (sessionStorage.getItem("roicas_admin_auth") === "true") {
      setIsAuthenticated(true);
      setLeads(getStoredLeads());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPasscode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem("roicas_admin_auth", "true");
      setLeads(getStoredLeads());
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleRefresh = () => {
    setLeads(getStoredLeads());
  };

  const handleExportCsv = () => {
    const csv = exportLeadsToCsv(filteredLeads);
    triggerDownload(csv, `leads_brief_roicas_${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8;");
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(filteredLeads, null, 2);
    triggerDownload(jsonStr, `leads_brief_roicas_${new Date().toISOString().slice(0, 10)}.json`, "application/json");
  };

  const handleRetry = async (leadId: string) => {
    setRetryingId(leadId);
    await retryNotification(leadId);
    setLeads(getStoredLeads());
    if (selectedLead && selectedLead.lead_id === leadId) {
      const updated = getStoredLeads().find((l) => l.lead_id === leadId);
      if (updated) setSelectedLead(updated);
    }
    setRetryingId(null);
  };

  const handleCopySummary = (lead: BriefLeadRecord) => {
    if (lead.summary_text) {
      navigator.clipboard.writeText(lead.summary_text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      lead.lead_id.toLowerCase().includes(q) ||
      lead.business.business_name.toLowerCase().includes(q) ||
      lead.contact.contact_name.toLowerCase().includes(q) ||
      lead.contact.contact_email.toLowerCase().includes(q) ||
      lead.contact.full_whatsapp.includes(q);

    const matchesComplexity =
      complexityFilter === "all" || lead.internal.complexity_hint === complexityFilter;

    const matchesStatus =
      statusFilter === "all" || lead.internal.notification_status === statusFilter;

    return matchesQuery && matchesComplexity && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-8 card-dashboard my-12 text-center animate-fade-up">
        <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold mb-2">Panel Interno ROICAS</h2>
        <p className="text-xs text-muted-foreground mb-6">
          Ingresa la clave de acceso autorizada del equipo para consultar las solicitudes de brief.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="password"
            placeholder="Clave de acceso"
            value={enteredPasscode}
            onChange={(e) => setEnteredPasscode(e.target.value)}
            className="h-11 text-center"
          />
          {passcodeError && (
            <p className="text-xs text-destructive font-medium">Clave incorrecta. Inténtalo de nuevo.</p>
          )}
          <Button type="submit" variant="hero" className="w-full">
            Acceder
          </Button>
          {onClose && (
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="w-full text-xs">
              Cancelar
            </Button>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Solicitudes de Brief E-commerce</h2>
            <span className="rounded-full bg-brand/10 text-brand text-xs font-bold px-2.5 py-0.5">
              {leads.length} guardadas
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Registro local persistente con trazabilidad de notificaciones a ventas@roicas.com / herebus_cas@hotmail.com.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} title="Recargar">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCsv} title="Descargar CSV">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJson} title="Descargar JSON">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            JSON
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters and search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Buscar por negocio, nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        <select
          value={complexityFilter}
          onChange={(e) => setComplexityFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <option value="all">Todas las complejidades</option>
          <option value="alta">Alta</option>
          <option value="intermedia">Intermedia</option>
          <option value="basica">Básica</option>
          <option value="requiere_revision">Requiere revisión</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <option value="all">Todos los estados de notificación</option>
          <option value="sent">Enviado por correo/webhook</option>
          <option value="notification_pending">Pendiente de notificación</option>
          <option value="failed">Fallido</option>
        </select>
      </div>

      {/* Table / List */}
      {filteredLeads.length === 0 ? (
        <div className="card-dashboard p-12 text-center text-muted-foreground text-sm">
          No se encontraron solicitudes con los filtros aplicados.
        </div>
      ) : (
        <div className="card-dashboard p-0 overflow-hidden shadow-sm border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">Fecha / ID</th>
                  <th className="py-3 px-4">Negocio / Cliente</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Catálogo / Carga</th>
                  <th className="py-3 px-4">Complejidad</th>
                  <th className="py-3 px-4">Notificación</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeads.map((lead) => {
                  const isPending = lead.internal.notification_status === "notification_pending";
                  const isSent = lead.internal.notification_status === "sent";

                  const complexityColor =
                    lead.internal.complexity_hint === "alta"
                      ? "bg-red-500/10 text-red-600 border-red-500/20"
                      : lead.internal.complexity_hint === "intermedia"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : lead.internal.complexity_hint === "requiere_revision"
                      ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";

                  return (
                    <tr key={lead.lead_id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-foreground">{lead.lead_id}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(lead.created_at).toLocaleString("es-CO")}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{lead.business.business_name}</div>
                        <div className="text-muted-foreground text-[11px]">
                          {lead.contact.contact_name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{lead.contact.contact_email}</div>
                        <div className="font-mono text-muted-foreground">{lead.contact.full_whatsapp}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>Tot: {lead.catalog.catalog_size}</div>
                        <div className="text-brand font-semibold">Carga: {lead.catalog.initial_upload}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${complexityColor}`}
                        >
                          {lead.internal.complexity_hint}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isSent ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Enviada
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5" /> Pendiente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-destructive font-semibold text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" /> Fallido
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLead(lead)}
                          className="h-7 text-xs px-2.5"
                        >
                          Ver detalle
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal / Detail View */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-dashboard max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 bg-background border-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-xs text-brand font-bold uppercase tracking-wider">
                  Detalle de Solicitud #{selectedLead.lead_id}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {selectedLead.business.business_name}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={`https://wa.me/${selectedLead.contact.full_whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chatear por WhatsApp ({selectedLead.contact.full_whatsapp})
              </a>
              <a
                href={`mailto:${selectedLead.contact.contact_email}?subject=Propuesta%20de%20tienda%20online%20para%20${encodeURIComponent(selectedLead.business.business_name)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-muted transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Enviar Correo
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopySummary(selectedLead)}
                className="text-xs"
              >
                {copySuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-success mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copySuccess ? "¡Copiado!" : "Copiar Resumen"}
              </Button>
              {selectedLead.internal.notification_status !== "sent" && (
                <Button
                  variant="hero"
                  size="sm"
                  disabled={retryingId === selectedLead.lead_id}
                  onClick={() => handleRetry(selectedLead.lead_id)}
                  className="text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1 ${retryingId === selectedLead.lead_id ? "animate-spin" : ""}`} />
                  Reintentar Notificación
                </Button>
              )}
            </div>

            {/* Effort Alerts & Pending Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-bold block uppercase mb-1">
                  Alertas de Esfuerzo ({selectedLead.internal.effort_flags.length})
                </span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {selectedLead.internal.effort_flags.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                  {selectedLead.internal.effort_flags.length === 0 && <li>Ninguna alerta atípica</li>}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-800 dark:text-purple-300">
                <span className="font-bold block uppercase mb-1">
                  Puntos por Confirmar ({selectedLead.internal.pending_points.length})
                </span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {selectedLead.internal.pending_points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                  {selectedLead.internal.pending_points.length === 0 && <li>Todo definido claramente</li>}
                </ul>
              </div>
            </div>

            {/* Full text summary */}
            <div>
              <span className="text-xs font-bold text-foreground block mb-2">Resumen Estructurado:</span>
              <pre className="p-4 rounded-xl bg-muted/40 border border-border text-xs font-mono whitespace-pre-wrap max-h-80 overflow-y-auto">
                {selectedLead.summary_text}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefAdminView;
