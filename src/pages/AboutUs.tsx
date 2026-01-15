import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Users, Zap, Award, TrendingUp, Heart, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";

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
  { value: 50, suffix: "+", label: "Clientes B2B" },
  { value: 2, prefix: "$", suffix: "M+", label: "En ventas generadas" },
  { value: 95, suffix: "%", label: "Retención de clientes" },
  { value: 3, suffix: "x", label: "ROI promedio" }
];

const clients = [
  { name: "Grupo Ecosfera", url: "https://www.grupoecosfera.com/", sector: "Servicios Ambientales" },
  { name: "Proware", url: "https://www.proware.com.co/", sector: "Tecnología" },
  { name: "Componente Legal", url: "https://www.componentelegal.com/", sector: "Legal Tech" },
  { name: "FinDolor", url: "https://www.findolor.com/", sector: "Salud" },
  { name: "Aeroambulancias SAS", url: "https://aeroambulanciassas.com/", sector: "Salud & Emergencias" },
];

const AboutUs = () => {
  const heroRef = useRef(null);
  const valuesRef = useRef(null);
  const clientsRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const clientsInView = useInView(clientsRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 gradient-mesh-warm relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-warm/10 text-warm text-sm font-medium mb-6">
              Conoce a ROICAS
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transformamos empresas B2B en{" "}
              <span className="text-gradient-warm">máquinas de ventas</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Somos una agencia de growth marketing especializada en convertir tráfico en clientes reales mediante estrategias de captación y automatización inteligente.
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-warm/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none opacity-50" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient-warm mb-2">
                  <AnimatedCounter 
                    end={stat.value} 
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card-dashboard p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warm/20 to-transparent rounded-bl-full" />
              <TrendingUp className="w-12 h-12 text-warm mb-4" />
              <h3 className="text-2xl font-bold mb-2">Crecimiento Sostenible</h3>
              <p className="text-muted-foreground">
                No buscamos picos de tráfico efímeros. Construimos sistemas que generan leads cualificados de forma predecible y escalable.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <motion.div
            ref={valuesRef}
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
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
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="card-dashboard text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-warm/10 to-accent flex items-center justify-center group-hover:from-warm/20 transition-colors">
                  <value.icon className="w-7 h-7 text-warm" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section ref={clientsRef} className="py-20 md:py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={clientsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Clientes que <span className="text-gradient-warm">Confían en Nosotros</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empresas líderes en sus sectores que han transformado su proceso comercial con ROICAS.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, index) => (
              <motion.a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={clientsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="card-dashboard flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-warm transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{client.sector}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-warm transition-colors" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Por qué <span className="text-gradient-warm">elegirnos</span>?
            </h2>
            <div className="card-dashboard p-8 md:p-12">
              <div className="flex justify-center mb-6">
                <Heart className="w-12 h-12 text-warm" />
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
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutUs;
