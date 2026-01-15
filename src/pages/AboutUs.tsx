import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Target, Users, Zap, Award, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Resultados Reales",
    description: "No vendemos humo. Cada estrategia está diseñada para que veas el impacto en tu negocio."
  },
  {
    icon: Users,
    title: "Somos Tu Equipo",
    description: "No somos solo proveedores. Nos involucramos en tu proyecto como si fuera nuestro."
  },
  {
    icon: Zap,
    title: "Agilidad",
    description: "Decisiones rápidas basadas en datos. Sin burocracia ni reuniones innecesarias."
  },
  {
    icon: Award,
    title: "Mejora Continua",
    description: "Nunca dejamos de optimizar. Lo que funciona hoy, mañana puede funcionar mejor."
  }
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
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide for clients
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % clients.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % clients.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + clients.length) % clients.length);
  };

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
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Conoce a ROICAS
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary">
              Detrás de cada estrategia hay{" "}
              <span className="text-gradient-warm">personas que se implican</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Somos un equipo pequeño pero comprometido. No tenemos cientos de clientes 
              porque preferimos hacer bien nuestro trabajo con cada uno.
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-warm/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none opacity-50" />
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Creemos en hacer las cosas{" "}
                <span className="text-gradient-warm">de otra manera</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                En ROICAS no perseguimos métricas de vanidad. No te vamos a mostrar 
                informes llenos de impresiones y alcance si eso no se traduce en 
                oportunidades reales para tu negocio.
              </p>
              <p className="text-lg text-muted-foreground">
                Nos medimos por lo que importa: leads cualificados, reuniones agendadas, 
                ventas cerradas. Y si algo no funciona, lo cambiamos. Sin egos, sin excusas.
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
              <Heart className="w-12 h-12 text-warm mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-primary">Compromiso Real</h3>
              <p className="text-muted-foreground">
                Cuando dices que sí a trabajar con nosotros, te garantizamos una cosa: 
                nos vamos a implicar como si tu negocio fuera el nuestro. Porque en parte, lo es.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Lo que nos{" "}
              <span className="text-gradient-warm">define</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No son solo palabras bonitas. Son los principios que guían cada decisión que tomamos.
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
                <h3 className="text-xl font-semibold mb-2 text-primary">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Slider Section */}
      <section ref={clientsRef} className="py-20 md:py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={clientsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Empresas que{" "}
              <span className="text-gradient-warm">confían en nosotros</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada proyecto es una historia de colaboración y resultados compartidos.
            </p>
          </motion.div>

          {/* Slider */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${currentSlide * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {clients.map((client) => (
                  <div
                    key={client.name}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <a
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block card-dashboard p-12 text-center hover:border-primary/30 transition-colors group"
                    >
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-warm/10 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary group-hover:text-warm transition-colors">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-warm transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-warm font-medium">{client.sector}</p>
                    </a>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {clients.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentSlide(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-primary" : "bg-border hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              ¿Quieres saber si podemos{" "}
              <span className="text-gradient-warm">ayudarte</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No hacemos propuestas genéricas. Cuéntanos sobre tu negocio y te diremos 
              honestamente si somos la agencia adecuada para ti. Sin compromiso, sin presión.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/contacto" className="group">
                Hablemos sin compromiso
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutUs;
