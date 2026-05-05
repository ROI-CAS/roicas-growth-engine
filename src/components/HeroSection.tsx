import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import crmDashboard from "@/assets/crm-dashboard.png";
import { trackCtaClicked } from "@/lib/analytics";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 bg-[#080808] overflow-hidden">

      {/* Red glow — top-left */}
      <div className="absolute -top-60 -left-60 w-[800px] h-[800px] rounded-full bg-brand/25 blur-[180px] pointer-events-none" />
      {/* Red glow — bottom-right */}
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-brand/12 blur-[140px] pointer-events-none" />

      {/* Decorative arcs — brand red */}
      <motion.div
        className="absolute top-0 left-0 h-full w-[420px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <svg viewBox="0 0 420 900" fill="none" className="h-full w-auto opacity-20">
          <path d="M 210 -50 Q 420 200 210 450 Q 0 700 210 950" stroke="hsl(2 88% 44%)" strokeWidth="2.5" fill="none" />
          <path d="M 130 -50 Q 340 200 130 450 Q -80 700 130 950" stroke="hsl(2 88% 44%)" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M 50 -50 Q 260 200 50 450 Q -160 700 50 950" stroke="hsl(2 88% 44%)" strokeWidth="0.6" fill="none" opacity="0.25" />
        </svg>
      </motion.div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="section-container py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.25fr] gap-12 lg:gap-16 items-center">

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/20 text-brand text-sm font-semibold border border-brand/30"
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white"
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
              className="text-lg md:text-xl text-white/55 max-w-xl leading-relaxed"
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
              {[
                { label: "Automatización", desc: "Procesos que trabajan solos" },
                { label: "Más eficiencia", desc: "Resultados, no actividad" },
                { label: "Mejor experiencia", desc: "Leads que quieren comprar" },
                { label: "Datos que deciden", desc: "ROI medible desde el día 1" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white/90">{item.label}</p>
                    <p className="text-xs text-white/40">{item.desc}</p>
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
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/20 text-white hover:bg-white/8 hover:border-white/35 hover:text-white bg-transparent"
                  asChild
                >
                  <a
                    href="#como-funciona"
                    className="group"
                    onClick={() => trackCtaClicked("Ver cómo funciona", "hero")}
                  >
                    <Play size={16} className="mr-2 fill-white/70" />
                    Ver cómo funciona
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Social proof chip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <p className="text-xs text-white/65 font-medium">
                Resultado real:&nbsp;
                <strong className="text-white font-semibold">342 keywords top 3</strong>
                &nbsp;·&nbsp;
                <strong className="text-white font-semibold">85K impresiones</strong>
                &nbsp;en 7 meses
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-xs text-white/30"
            >
              ✓ Sin permanencias · ✓ Adaptado a tu negocio · ✓ Respuesta hoy
            </motion.p>
          </motion.div>

          {/* ── Right — CRM Dashboard ── */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Red glow behind image */}
            <div className="absolute inset-0 bg-brand/15 rounded-3xl blur-[50px] scale-90 pointer-events-none" />

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden border border-white/10"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06), 0 30px 70px -15px rgba(0,0,0,0.95), 0 0 90px -20px hsl(2 88% 44% / 0.3)",
              }}
            >
              <img
                src={crmDashboard}
                alt="Pipeline de ventas automatizado — Panel CRM ROICAS"
                className="w-full h-auto block"
              />
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.08 }}
              className="absolute -top-4 -right-4 backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl p-4 shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm font-bold text-white">295 oportunidades</span>
              </div>
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.08 }}
              className="absolute -bottom-4 -left-4 backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl p-4 shadow-2xl cursor-pointer"
            >
              <p className="text-xs text-white/50">Respuesta automática</p>
              <p className="text-lg font-bold text-white">&lt;5 min</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
