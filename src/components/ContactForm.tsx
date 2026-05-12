import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { trackFormStarted, trackFormSubmitted, trackLeadCaptured } from "@/lib/analytics";

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/OSpBlSon5j5uMQmR9X5h/webhook-trigger/FZ5I63gzmjGXLvgpeArr";

interface ContactFormProps {
  variant?: "full" | "compact";
  showTitle?: boolean;
  title?: string;
  className?: string;
}

const ContactForm = ({
  showTitle = true,
  title = "Cuéntanos sobre tu negocio",
  className = "",
}: ContactFormProps) => {
  const { toast } = useToast();
  const hasStarted = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    company: "",
    acceptPrivacy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.whatsapp.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa tu nombre y WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.acceptPrivacy) {
      toast({
        title: "Acepta la política de privacidad",
        description: "Debes aceptarla para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.whatsapp.trim(),
          company: formData.company.trim() || null,
          source: window.location.pathname,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // fail silently — submission logged client-side
    }
    setIsSubmitting(false);
    setIsSuccess(true);
    trackFormSubmitted(!!formData.company.trim(), window.location.pathname);
    trackLeadCaptured("form");
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`card-dashboard p-12 text-center ${className}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-5" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">¡Recibido!</h3>
        <p className="text-muted-foreground">
          Te escribimos por WhatsApp en menos de 2 horas.
        </p>
      </motion.div>
    );
  }

  const handleFirstFocus = () => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      trackFormStarted(window.location.pathname);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`card-dashboard p-8 ${className}`}>
      {showTitle && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium mb-2">
            Nombre *
          </label>
          <Input
            id="cf-name"
            required
            placeholder="Tu nombre"
            value={formData.name}
            onFocus={handleFirstFocus}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            className="h-12"
          />
        </div>

        <div>
          <label htmlFor="cf-whatsapp" className="block text-sm font-medium mb-2">
            WhatsApp *
          </label>
          <Input
            id="cf-whatsapp"
            required
            type="tel"
            placeholder="+57 300 123 4567"
            value={formData.whatsapp}
            onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
            className="h-12"
          />
        </div>

        <div>
          <label htmlFor="cf-company" className="block text-sm font-medium mb-2">
            Empresa
          </label>
          <Input
            id="cf-company"
            placeholder="Nombre de tu empresa"
            value={formData.company}
            onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
            className="h-12"
          />
        </div>
      </div>

      <div className="flex items-start gap-3 mb-6">
        <Checkbox
          id="privacy-form"
          checked={formData.acceptPrivacy}
          onCheckedChange={(checked) =>
            setFormData((p) => ({ ...p, acceptPrivacy: checked as boolean }))
          }
        />
        <label htmlFor="privacy-form" className="text-sm text-muted-foreground leading-snug">
          Acepto la{" "}
          <Link to="/politica-privacidad" className="text-brand hover:underline">
            política de privacidad
          </Link>{" "}
          y autorizo el tratamiento de mis datos.
        </label>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Enviar mensaje
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-3">
        Te respondemos hoy por WhatsApp
      </p>
    </form>
  );
};

export default ContactForm;
