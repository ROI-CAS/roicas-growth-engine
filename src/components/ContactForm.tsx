import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const services = [
  { id: "web", label: "Diseño Web" },
  { id: "ecommerce", label: "Tienda Online" },
  { id: "seo", label: "SEO" },
  { id: "ads", label: "Publicidad Digital" },
  { id: "email", label: "Email Marketing" },
  { id: "automation", label: "Automatización IA" },
];

interface ContactFormProps {
  variant?: "full" | "compact";
  showTitle?: boolean;
  title?: string;
  className?: string;
}

const ContactForm = ({ 
  variant = "full", 
  showTitle = true, 
  title = "Envíanos un mensaje",
  className = ""
}: ContactFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    services: [] as string[],
    acceptPrivacy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.acceptPrivacy) {
      toast({
        title: "Acepta la política de privacidad",
        description: "Debes aceptar nuestra política de privacidad para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: "¡Mensaje enviado!",
      description: "Nos pondremos en contacto contigo en menos de 24 horas."
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
        <h3 className="text-2xl font-bold mb-4">¡Mensaje Enviado!</h3>
        <p className="text-muted-foreground mb-6">
          Gracias por contactarnos. Nuestro equipo revisará tu mensaje y te responderá en menos de 24 horas.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Enviar otro mensaje
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`card-dashboard p-8 ${className}`}>
      {showTitle && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <Input
            required
            placeholder="Tu nombre"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="h-12"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <Input
            required
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="h-12"
          />
        </div>
      </div>

      {variant === "full" && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Teléfono</label>
              <Input
                placeholder="+57 300 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Empresa</label>
              <Input
                placeholder="Nombre de tu empresa"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="h-12"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-3">Servicios de interés</label>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <motion.button
                  key={service.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServiceToggle(service.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                    formData.services.includes(service.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {service.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Mensaje</label>
            <Textarea
              rows={4}
              placeholder="Cuéntanos sobre tu proyecto y objetivos..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>
        </>
      )}

      <div className="flex items-start gap-3 mb-6">
        <Checkbox
          id="privacy-form"
          checked={formData.acceptPrivacy}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, acceptPrivacy: checked as boolean }))
          }
        />
        <label htmlFor="privacy-form" className="text-sm text-muted-foreground">
          Acepto la{" "}
          <Link to="/politica-privacidad" className="text-primary hover:underline">
            política de privacidad
          </Link>{" "}
          y autorizo el tratamiento de mis datos personales.
        </label>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full"
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
            <Send className="w-5 h-5 mr-2" />
            Enviar Mensaje
          </>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;
