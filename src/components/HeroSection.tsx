import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 gradient-mesh-warm overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-warm/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="section-container py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm/10 text-warm text-sm font-medium"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={16} />
              </motion.span>
              Agencia de Crecimiento Digital B2B
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Dejamos de contar{" "}
              <motion.span 
                className="text-gradient-warm inline-block"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                'Likes'
              </motion.span>
              <br />
              Empezamos a contar{" "}
              <motion.span 
                className="text-gradient-warm inline-block"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              >
                Ventas
              </motion.span>.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl"
            >
              Construimos sistemas de generación de leads B2B que no mueren en un
              formulario. Acompañamos tu proceso desde la primera visita hasta el
              cierre definitivo mediante automatización inteligente.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="hero" size="xl" asChild className="animate-glow">
                  <a href="#contacto" className="group">
                    Agendar Consultoría de Estrategia
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={20} />
                    </motion.span>
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-sm text-muted-foreground"
            >
              ✓ Enfoque 100% orientado a ROI, sin ataduras.
            </motion.p>
          </motion.div>

          {/* Right Content - Dashboard Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative perspective-1000"
          >
            {/* Main Dashboard Card */}
            <motion.div 
              className="card-dashboard p-6 lg:p-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Panel de Resultados</h3>
                <motion.span 
                  className="text-xs text-success font-medium px-2 py-1 bg-success/10 rounded-full flex items-center gap-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.span
                    className="w-2 h-2 rounded-full bg-success"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  En Vivo
                </motion.span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { value: "247", label: "Leads Generados" },
                  { value: "68%", label: "Tasa Conversión" },
                  { value: "$84K", label: "Ingresos", highlight: true }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-3 rounded-lg bg-secondary"
                  >
                    <p className={`text-2xl lg:text-3xl font-bold ${stat.highlight ? 'text-gradient-warm' : 'text-foreground'}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Chart Visualization */}
              <div className="relative h-32 bg-secondary rounded-lg p-4 overflow-hidden">
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 h-20">
                  {[40, 55, 35, 70, 50, 85, 65, 90, 75, 95, 80, 100].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${height}%`, opacity: 1 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 1 + i * 0.08,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      whileHover={{ scaleY: 1.1 }}
                      className="flex-1 bg-gradient-to-t from-warm to-warm/60 rounded-t cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-6 space-y-3">
                {[
                  { icon: TrendingUp, iconBg: "bg-success/20", iconColor: "text-success", title: "Nuevo lead cualificado", subtitle: "Tech Solutions S.L. - hace 2 min" },
                  { icon: Users, iconBg: "bg-warm/20", iconColor: "text-warm", title: "Reunión agendada automáticamente", subtitle: "Innovatech Corp - hace 15 min" }
                ].map((activity, index) => (
                  <motion.div
                    key={activity.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + index * 0.2 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center`}>
                      <activity.icon size={16} className={activity.iconColor} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="absolute -top-4 -right-4 card-dashboard p-4 shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-success"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm font-bold text-gradient-warm">+324% ROI</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="absolute -bottom-4 -left-4 card-dashboard p-4 shadow-lg cursor-pointer"
            >
              <p className="text-xs text-muted-foreground">Tiempo de respuesta</p>
              <p className="text-lg font-bold text-warm">&lt;5 min</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
