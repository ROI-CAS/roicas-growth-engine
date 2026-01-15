import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Users, Zap, Award, TrendingUp, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Resultados Reales",
    description: "No vendemos humo. Cada estrategia está diseñada para generar ROI medible."
  },
  {
    icon: Users,
    title: "Aliados Estratégicos",
    description: "Somos una extensión de tu equipo, no solo proveedores."
  },
  {
    icon: Zap,
    title: "Agilidad",
    description: "Decisiones rápidas basadas en datos. Sin burocracia."
  },
  {
    icon: Award,
    title: "Excelencia",
    description: "Mejora continua en cada campaña, cada día."
  }
];

const stats = [
  { value: "50+", label: "Clientes B2B" },
  { value: "$2M+", label: "En ventas generadas" },
  { value: "95%", label: "Retención de clientes" },
  { value: "3x", label: "ROI promedio" }
];

const AboutUs = () => {
  const heroRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 rounded-full bg-warm/10 text-warm text-sm font-medium mb-6"
            >
              Conoce a ROICAS
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Transformamos empresas B2B en{" "}
              <span className="text-gradient-warm">máquinas de ventas</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Somos una agencia de growth marketing especializada en convertir tráfico en clientes reales mediante estrategias de captación y automatización inteligente.
            </motion.p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={heroInView ? { opacity: 0.5, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-warm/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"
        />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  className="text-4xl md:text-5xl font-bold text-gradient-warm mb-2"
                >
                  {stat.value}
                </motion.div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nuestra <span className="text-gradient-warm">Misión</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Ayudar a empresas B2B a escalar sus ventas mediante estrategias digitales que realmente funcionan. Sin métricas de vanidad, solo resultados tangibles.
              </p>
              <p className="text-lg text-muted-foreground">
                Creemos que cada lead es una oportunidad de negocio que merece ser nutrida y acompañada hasta su cierre. Por eso, no nos conformamos con generar tráfico: construimos sistemas completos de adquisición y conversión.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="card-dashboard p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warm/20 to-transparent rounded-bl-full" />
                <TrendingUp className="w-12 h-12 text-warm mb-4" />
                <h3 className="text-2xl font-bold mb-2">Crecimiento Sostenible</h3>
                <p className="text-muted-foreground">
                  No buscamos picos de tráfico efímeros. Construimos sistemas que generan leads cualificados de forma predecible y escalable.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <motion.div
            ref={valuesRef}
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros <span className="text-gradient-warm">Valores</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los principios que guían cada decisión y estrategia que implementamos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={valuesInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ 
                  delay: index * 0.15, 
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="card-dashboard text-center group cursor-pointer"
              >
                <motion.div 
                  className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-warm/10 to-accent flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon className="w-7 h-7 text-warm" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section ref={teamRef} className="py-20 md:py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Por qué <span className="text-gradient-warm">elegirnos</span>?
            </h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={teamInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="card-dashboard p-8 md:p-12"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-12 h-12 text-warm" />
                </motion.div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Porque entendemos que tu negocio no necesita más "likes" o "impresiones". Necesita clientes que paguen, contratos que se cierren y un pipeline predecible.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Nuestro equipo combina experiencia en marketing digital, automatización y ventas B2B para crear sistemas que funcionan mientras tú te enfocas en lo que mejor sabes hacer: entregar valor a tus clientes.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a href="/#contacto">Agenda una Consultoría</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutUs;
