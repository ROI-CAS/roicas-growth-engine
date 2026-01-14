import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 gradient-mesh overflow-hidden">
      <div className="section-container py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <Zap size={16} />
              Agencia de Crecimiento Digital B2B
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Dejamos de contar{" "}
              <span className="text-gradient">'Likes'</span>
              <br />
              Empezamos a contar{" "}
              <span className="text-gradient">Ventas</span>.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Construimos sistemas de generación de leads B2B que no mueren en un
              formulario. Acompañamos tu proceso desde la primera visita hasta el
              cierre definitivo mediante automatización inteligente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="xl" asChild>
                <a href="#contacto" className="group">
                  Agendar Consultoría de Estrategia
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              ✓ Enfoque 100% orientado a ROI, sin ataduras.
            </p>
          </motion.div>

          {/* Right Content - Dashboard Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="card-dashboard p-6 lg:p-8 animate-float">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Panel de Resultados</h3>
                <span className="text-xs text-success font-medium px-2 py-1 bg-success/10 rounded-full">
                  En Vivo
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">247</p>
                  <p className="text-xs text-muted-foreground">Leads Generados</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">68%</p>
                  <p className="text-xs text-muted-foreground">Tasa Conversión</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-2xl lg:text-3xl font-bold text-primary">$84K</p>
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="relative h-32 bg-secondary rounded-lg p-4">
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 h-20">
                  {[40, 55, 35, 70, 50, 85, 65, 90, 75, 95, 80, 100].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                      className="flex-1 bg-primary rounded-t opacity-80 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                    <TrendingUp size={16} className="text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo lead cualificado</p>
                    <p className="text-xs text-muted-foreground">Tech Solutions S.L. - hace 2 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reunión agendada automáticamente</p>
                    <p className="text-xs text-muted-foreground">Innovatech Corp - hace 15 min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="absolute -top-4 -right-4 card-dashboard p-4 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse-soft" />
                <span className="text-sm font-medium">+324% ROI</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
              className="absolute -bottom-4 -left-4 card-dashboard p-4 shadow-lg"
            >
              <p className="text-xs text-muted-foreground">Tiempo de respuesta</p>
              <p className="text-lg font-bold text-primary">&lt;5 min</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
