import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const services = [
  { id: "web", label: "Diseño Web" },
  { id: "seo", label: "SEO" },
  { id: "ads", label: "Publicidad Digital" },
  { id: "email", label: "Email Marketing" },
  { id: "automation", label: "Automatización" },
];

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hola@roicas.com",
    link: "mailto:hola@roicas.com"
  },
  {
    icon: Phone,
    title: "Teléfono",
    value: "+57 300 123 4567",
    link: "tel:+573001234567"
  },
  {
    icon: MapPin,
    title: "Ubicación",
    value: "Bogotá, Colombia",
    link: null
  },
  {
    icon: Clock,
    title: "Horario",
    value: "Lun - Vie: 9am - 6pm",
    link: null
  }
];

const Contact = () => {
  const { toast } = useToast();
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true });
  
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

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block px-4 py-2 rounded-full bg-warm/10 text-warm text-sm font-medium mb-6"
            >
              Hablemos de tu proyecto
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              ¿Listo para <span className="text-gradient-warm">crecer</span>?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-muted-foreground"
            >
              Cuéntanos sobre tu negocio y te mostraremos cómo podemos ayudarte a escalar tus ventas.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-warm/10 to-accent flex items-center justify-center flex-shrink-0"
                      >
                        <info.icon className="w-5 h-5 text-warm" />
                      </motion.div>
                      <div>
                        <p className="font-medium">{info.title}</p>
                        {info.link ? (
                          <a href={info.link} className="text-muted-foreground hover:text-warm transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 p-6 card-dashboard"
                >
                  <p className="text-sm text-muted-foreground mb-2">Tiempo promedio de respuesta</p>
                  <p className="text-3xl font-bold text-gradient-warm">{"< 2 horas"}</p>
                  <p className="text-sm text-muted-foreground mt-2">En horario laboral</p>
                </motion.div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, y: 30 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-dashboard p-12 text-center"
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
              ) : (
                <form onSubmit={handleSubmit} className="card-dashboard p-8">
                  <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre *</label>
                      <Input
                        required
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Teléfono</label>
                      <Input
                        placeholder="+57 300 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Empresa</label>
                      <Input
                        placeholder="Nombre de tu empresa"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
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
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleServiceToggle(service.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.services.includes(service.id)
                              ? "bg-warm text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {service.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Mensaje *</label>
                    <Textarea
                      required
                      rows={4}
                      placeholder="Cuéntanos sobre tu proyecto y objetivos..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <Checkbox
                      id="privacy"
                      checked={formData.acceptPrivacy}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, acceptPrivacy: checked as boolean }))
                      }
                    />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground">
                      Acepto la{" "}
                      <a href="/politica-privacidad" className="text-warm hover:underline">
                        política de privacidad
                      </a>{" "}
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
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
