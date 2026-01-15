import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const LeadMagnetSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "¡Descarga en camino!",
      description: "Revisa tu bandeja de entrada para acceder a la guía.",
    });
    
    setFormData({ name: "", email: "" });
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-accent border-2 border-primary/20 p-8 md:p-12"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
                <FileText size={18} />
                Recurso Gratuito
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                Te regalamos lo que nos ha llevado años aprender
              </h2>

              <p className="text-muted-foreground text-lg">
                Descarga gratis:{" "}
                <span className="font-semibold text-foreground">
                  "La Hoja de Ruta Lead-to-Sale"
                </span>
                . Los 5 pasos que usamos con nuestros clientes para convertir leads en ventas reales.
              </p>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Diagnóstico de embudo de ventas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Checklist de automatización esencial
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Plantilla de seguimiento de leads
                </li>
              </ul>
            </div>

            {/* Right Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Tu Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-background"
                />
                <Input
                  type="email"
                  placeholder="Email Empresarial"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-background"
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Download size={20} />
                    Descargar Guía PDF Ahora
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                No spam. Respetamos tu privacidad.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
