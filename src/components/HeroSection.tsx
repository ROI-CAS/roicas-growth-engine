import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import crmDashboard from "@/assets/crm-dashboard.png";
import { trackCtaClicked } from "@/lib/analytics";

const stats = [
  { value: "+1.882", label: "Leads generados" },
  { value: "342", label: "Keywords top 3" },
  { value: "85K", label: "Impresiones/mes" },
];

const features = [
  { label: "Automatización", desc: "Procesos que trabajan solos" },
  { label: "Más eficiencia", desc: "Resultados, no actividad" },
  { label: "Mejor experiencia", desc: "Leads que quieren comprar" },
  { label: "Datos que deciden", desc: "ROI medible desde el día 1" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 bg-background overflow-hidden">

      {/* Warm radial gradient — top */}
      <div className="absolute inset-0 gradient-mesh-warm pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.055) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="section-container py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">

          {/* ── Left Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-semibold border border-brand/20"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-brand"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              CRM & Automatización · Sin permanencias
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.08] text-foreground tracking-tight"
            >
              Automatizamos procesos,{" "}
              <motion.span
                className="text-brand"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                impulsamos tu crecimiento.
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              Diseñamos el sistema completo: captación, nutrición y
              cualificación automática. Tu equipo solo habla con quienes
              tienen intención real de compra.
            </motion.p>

            {/* Features strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-2 gap-3 pt-1"
            >
              {features.map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-[7px] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Dual CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="hero" size="xl" asChild>
                  <a
                    href="/contacto"
                    className="group"
                    onClick={() => trackCtaClicked("Solicita tu demo", "hero")}
                  >
                    Solicita tu demo
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="xl" asChild>
                  <a
                    href="#como-funciona"
                    className="group"
                    onClick={() => trackCtaClicked("Ver cómo funciona", "hero")}
                  >
                    <Play size={16} className="mr-2 fill-brand text-brand" />
                    Ver cómo funciona
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="flex items-center gap-0 pt-4 border-t border-border"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex-1 ${i > 0 ? "pl-5 border-l border-border" : "pr-5"}`}
                >
                  <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-xs text-muted-foreground/60"
            >
              ✓ Sin permanencias · ✓ Adaptado a tu negocio · ✓ Respuesta hoy
            </motion.p>
          </motion.div>

          {/* ── Right — CRM Dashboard ── */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Subtle brand glow behind image */}
            <div className="absolute inset-0 bg-brand/6 rounded-3xl blur-[50px] scale-90 pointer-events-none" />

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden border border-border/60"
              style={{
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.04), 0 20px 64px -12px rgba(0,0,0,0.20), 0 0 40px -8px hsl(354 70% 40% / 0.10)",
              }}
            >
              <img
                src={crmDashboard}
                alt="Pipeline de ventas automatizado — Panel CRM ROICAS"
                className="w-full h-auto block"
                fetchPriority="high"
                width={800}
                height={520}
              />
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 220 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -top-4 -right-4 bg-white border border-border rounded-2xl px-4 py-3 shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="text-sm font-bold text-foreground">295 oportunidades</span>
              </div>
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 220 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-4 -left-4 bg-white border border-border rounded-2xl px-4 py-3 shadow-lg cursor-pointer"
            >
              <p className="text-[11px] text-muted-foreground font-medium">Respuesta automática</p>
              <p className="text-xl font-bold text-foreground leading-tight">&lt;5 min</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
