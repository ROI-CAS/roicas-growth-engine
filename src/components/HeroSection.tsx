import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import crmDashboard from "@/assets/crm-dashboard.png";
import { trackCtaClicked } from "@/lib/analytics";

const WHATSAPP_URL = "https://wa.me/573114565403?text=Hola%2C%20quiero%20información%20sobre%20sus%20servicios";

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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-brand" />
              <span className="text-brand text-xs font-bold tracking-[0.18em] uppercase">Estudio Digital</span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] text-white"
            >
              Tu negocio merece una{" "}
              <motion.span
                className="text-brand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                presencia digital
              </motion.span>{" "}
              que venda
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-white/55 max-w-xl leading-relaxed"
            >
              Diseñamos tu web, configuramos tu CRM para gestionar citas y clientes,
              y activamos campañas en Google y Meta Ads — con métricas claras
              y entregas en tiempo.
            </motion.p>

            {/* 4-column features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1"
            >
              {[
                "Sitio web que convierte",
                "CRM para gestión de citas",
                "Google & Meta Ads",
                "Métricas y resultados reales",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                  <p className="text-sm text-white/70 font-medium">{item}</p>
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
                <Button variant="hero" size="xl" className="rounded-full" asChild>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    onClick={() => trackCtaClicked("Hablar por WhatsApp", "hero")}
                  >
                    <MessageCircle size={20} className="mr-2" />
                    Hablar por WhatsApp
                  </a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="xl"
                  className="rounded-full border-white/20 text-white hover:bg-white/8 hover:border-white/35 hover:text-white bg-transparent"
                  asChild
                >
                  <a
                    href="/servicios"
                    onClick={() => trackCtaClicked("Ver paquetes y precios", "hero")}
                  >
                    Ver paquetes y precios
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="flex items-center gap-2 text-xs text-white/35"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-brand fill-current shrink-0">
                <path d="M8 0L9.8 5.5H16L11 8.9L12.8 14.4L8 11L3.2 14.4L5 8.9L0 5.5H6.2L8 0Z" />
              </svg>
              Diagnóstico gratuito · Garantía de satisfacción
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex items-center gap-8 pt-2 border-t border-white/8"
            >
              {[
                { value: "13", label: "años de experiencia" },
                { value: "+100", label: "proyectos entregados" },
                { value: "100%", label: "trato directo" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              ))}
            </motion.div>
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
                alt="Panel CRM para gestión de citas y clientes — ROICAS"
                className="w-full h-auto block"
              />
            </motion.div>

            {/* Floating badge — RESULTADOS */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
              className="absolute -bottom-4 -right-2 md:-right-6 backdrop-blur-md bg-white rounded-2xl p-4 shadow-2xl cursor-pointer"
            >
              <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">Resultados</p>
              <p className="text-2xl font-black text-foreground leading-none">+307</p>
              <p className="text-xs text-muted-foreground mt-0.5">leads · 60 días</p>
            </motion.div>

            {/* Floating badge — citas agendadas */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
              className="absolute -top-4 -left-2 md:-left-6 backdrop-blur-md bg-white/10 border border-white/15 rounded-2xl p-3.5 shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <div>
                  <p className="text-xs font-bold text-white">Cita agendada</p>
                  <p className="text-[10px] text-white/50">CRM · hace 3 min</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
