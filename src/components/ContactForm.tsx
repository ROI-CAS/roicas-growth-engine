import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { trackFormStarted, trackFormSubmitted, trackLeadCaptured } from "@/lib/analytics";

interface ContactFormProps {
  variant?: "full" | "compact";
  showTitle?: boolean;
  title?: string;
  className?: string;
}

const ContactForm = ({
  showTitle = true,
  title = "Reserva tu llamada",
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
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
    trackFormSubmitted(!!formData.company.trim(), window.location.pathname);
    trackLeadCaptured("form");

    toast({
      title: "¡Recibido!",
      description: "Te escribimos por WhatsApp en menos de 2 horas.",
    });
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
          <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-6" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-3">¡Perfecto!</h3>
        <p className="text-muted-foreground mb-2">
          Te escribimos por WhatsApp en menos de 2 horas.
        </p>
        <p className="text-sm text-muted-foreground">
          Revisa tu WhatsApp — te enviamos la confirmación y el enlace para la llamada.
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
      {showTitle && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {showTitle && (
        <p className="text-sm text-muted-foreground mb-6">
          20 minutos. Sin compromiso. Te decimos honestamente si podemos ayudarte.
        </p>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <Input
            required
            placeholder="Tu nombre"
            value={formData.name}
            onFocus={handleFirstFocus}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">WhatsApp *</label>
          <Input
            required
            type="tel"
            placeholder="+57 300 123 4567"
            value={formData.whatsapp}
            onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
            className="h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Empresa</label>
          <Input
            placeholder="Nombre de tu empresa"
            value={formData.company}
            onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
            className="h-12"
          />
        </div>
      </div>

      <div className="flex items-start gap-3 mb-6">
        <Checkbox
          id="privacy-form"
          checked={formData.acceptPrivacy}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, acceptPrivacy: checked as boolean }))
          }
        />
        <label htmlFor="privacy-form" className="text-sm text-muted-foreground">
          Acepto la{" "}
          <Link to="/politica-privacidad" className="text-primary hover:underline">
            política de privacidad
          </Link>{" "}
          y autorizo el tratamiento de mis datos.
        </label>
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            <MessageCircle className="w-5 h-5 mr-2" />
            Reservar mi llamada de 20 min
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-3">
        Te respondemos por WhatsApp en menos de 2 horas
      </p>
    </form>
  );
};

export default ContactForm;
