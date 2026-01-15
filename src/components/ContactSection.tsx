import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Calendar, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import AnimatedCounter from "./AnimatedCounter";

const services = [
  { id: "web", label: "Diseño Web" },
  { id: "ecommerce", label: "Tienda Online" },
  { id: "seo", label: "SEO" },
  { id: "ads", label: "Publicidad Digital" },
  { id: "design", label: "Diseño Gráfico" },
  { id: "automation-ia", label: "Automatización IA" },
  { id: "automation-crm", label: "CRM y Seguimiento" },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    challenge: "",
    selectedServices: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.challenge) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "¡Solicitud enviada!",
      description: "Nos pondremos en contacto contigo en menos de 24 horas.",
    });

    setFormData({ name: "", email: "", website: "", challenge: "", selectedServices: [] });
    setIsSubmitting(false);
  };

  const benefits = [
    { icon: Calendar, text: "Primera llamada sin coste" },
    { icon: Zap, text: "Te respondemos hoy" },
    { icon: Shield, text: "Cero spam, prometido" },
  ];

  return (
    <section id="contacto" className="py-20 md:py-28 bg-secondary">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                ¿Listo para dar el{" "}
                <span className="text-gradient-warm">siguiente paso</span>?
              </h2>

              <p className="text-lg text-muted-foreground">
                Cuéntanos sobre tu negocio y te diremos honestamente si podemos 
                ayudarte. Sin compromiso, sin presión. Solo una conversación 
                para conocernos.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
                      <benefit.icon size={20} className="text-primary" />
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-dashboard p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre Completo *</label>
                  <Input
                    type="text"
                    placeholder="Juan García"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Corporativo *</label>
                  <Input
                    type="email"
                    placeholder="juan@tuempresa.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Sitio Web Actual{" "}
                    <span className="text-muted-foreground">(Opcional)</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://tuempresa.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                {/* Services Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Servicios de interés{" "}
                    <span className="text-muted-foreground">(Opcional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.selectedServices.includes(service.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          checked={formData.selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <span className="text-sm">{service.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    ¿Cuál es tu mayor reto de ventas hoy? *
                  </label>
                  <Select
                    value={formData.challenge}
                    onValueChange={(value) =>
                      setFormData({ ...formData, challenge: value })
                    }
                  >
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="leads">Generar más leads</SelectItem>
                      <SelectItem value="quality">
                        Mejorar la calidad de los leads
                      </SelectItem>
                      <SelectItem value="automation">
                        Falta de seguimiento/automatización
                      </SelectItem>
                      <SelectItem value="visibility">
                        Poca visibilidad online
                      </SelectItem>
                      <SelectItem value="conversion">
                        Baja tasa de conversión
                      </SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send size={20} />
                      Quiero que me contactéis
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Al enviar, aceptas nuestra{" "}
                  <Link to="/politica-privacidad" className="text-primary hover:underline">
                    política de privacidad
                  </Link>.
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
