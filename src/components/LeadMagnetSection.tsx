import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
const LeadMagnetSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "¡Descarga en camino!",
      description: "Revisa tu bandeja de entrada para acceder a la guía."
    });
    setFormData({
      name: "",
      email: ""
    });
    setIsSubmitting(false);
  };
  return (
    <section className="py-20 md:py-28 gradient-mesh">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card-dashboard p-8 md:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
            >
              <FileText className="w-10 h-10 text-primary" />
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Guía Gratuita: <span className="text-gradient">7 Claves para Escalar tu Negocio B2B</span>
            </h2>

            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Descubre las estrategias que usan nuestros clientes más exitosos para duplicar sus ventas en 6 meses.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12"
                />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12"
                />
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg"
                  disabled={isSubmitting}
                  className="whitespace-nowrap"
                >
                  {isSubmitting ? "Enviando..." : (
                    <>
                      <Download className="w-5 h-5" />
                      Descargar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Sin spam. Puedes darte de baja cuando quieras.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default LeadMagnetSection;