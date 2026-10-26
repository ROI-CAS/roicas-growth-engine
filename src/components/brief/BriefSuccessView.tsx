import React, { useState } from "react";
import { BriefLeadRecord } from "@/types/brief";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  MessageCircle,
  FileText,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface BriefSuccessViewProps {
  lead: BriefLeadRecord;
  onReset?: () => void;
}

export const BriefSuccessView: React.FC<BriefSuccessViewProps> = ({ lead }) => {
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(lead.lead_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanPhone = lead.contact.full_whatsapp.replace(/\D/g, "");
  const waContactUrl = `https://wa.me/573114565403?text=Hola%20ROICAS,%20acabo%20de%20enviar%20mi%20solicitud%20de%20cotizaci%C3%B3n%20con%20ID%20${lead.lead_id}%20para%20${encodeURIComponent(lead.business.business_name)}.`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto py-8 text-center animate-fade-up"
    >
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-500/20">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
        ¡Recibimos tu solicitud!
      </h2>
      <p className="text-base text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
        Revisaremos los requisitos de tu negocio y te contactaremos con una propuesta ajustada
        a tu medida.
      </p>

      {/* Reference ID Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-sm mb-8">
        <span className="text-xs text-muted-foreground font-medium">Número de referencia:</span>
        <span className="text-sm font-bold text-foreground font-mono">{lead.lead_id}</span>
        <button
          type="button"
          onClick={handleCopyId}
          aria-label="Copiar número de referencia"
          className="ml-1 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Next Steps Timeline Card */}
      <div className="card-dashboard p-6 text-left mb-8 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          ¿Qué pasará ahora?
        </h3>

        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-xs mt-0.5">
              1
            </span>
            <div>
              <p className="font-semibold text-foreground">Evaluación técnica sin costo</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Analizamos si tu tienda se adapta mejor a WooCommerce o Shopify y calculamos
                el esfuerzo de catálogo e integraciones.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-xs mt-0.5">
              2
            </span>
            <div>
              <p className="font-semibold text-foreground">Propuesta clara y transparente</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Te enviamos alcance detallado, tiempos de entrega y recomendaciones de pasarelas
                de pago (PSE, Wompi, etc.).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-xs mt-0.5">
              3
            </span>
            <div>
              <p className="font-semibold text-foreground">Contacto personalizado</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Te escribiremos a <strong>{lead.contact.contact_email}</strong> y por WhatsApp en menos de 24 horas hábiles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Full Summary */}
      <div className="mb-8 text-left">
        <button
          type="button"
          onClick={() => setShowSummary(!showSummary)}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand" />
            <span>Ver resumen de las respuestas que enviaste</span>
          </span>
          {showSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSummary && (
          <div className="mt-2 p-4 rounded-xl border border-border bg-muted/20 font-mono text-xs whitespace-pre-wrap max-h-72 overflow-y-auto">
            {lead.summary_text}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="default" size="lg" asChild className="w-full sm:w-auto">
          <Link to="/">
            Volver al inicio
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="w-full sm:w-auto border-brand/30 hover:border-brand">
          <Link to="/servicios/tiendas-online">
            Conocer más sobre Tiendas Online
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default BriefSuccessView;
