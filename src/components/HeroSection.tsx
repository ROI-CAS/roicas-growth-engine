import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import crmDashboard from "@/assets/crm-dashboard.png";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const PAPER_PLANE_URL = "https://assets3.lottiefiles.com/packages/lf20_x62chJ.json";

const HeroSection = () => {
  const [planeAnim, setPlaneAnim] = useState<object | null>(null);

  useEffect(() => {
    fetch(PAPER_PLANE_URL)
      .then((r) => r.json())
      .then(setPlaneAnim)
      .catch(() => null);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 gradient-mesh-warm overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-brand/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
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
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-semibold border border-brand/20"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-brand"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Sin permanencias · Equipo dedicado a tu crecimiento
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight"
            >
              No necesitas más leads.{" "}
              <motion.span
                className="text-primary inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Necesitas mejores leads.
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl"
            >
              Diseñamos sistemas que atraen, nutren y califican prospectos
              automáticamente, para que tu equipo solo hable con quienes
              realmente tienen intención de compra.
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg font-semibold text-foreground"
            >
              Menos esfuerzo.{" "}
              <span className="text-primary">Más cierres.</span>
            </motion.p>

            {/* Dual CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="hero" size="xl" asChild>
                  <a href="/contacto" className="group">
                    Agendar llamada gratis
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="heroOutline" size="xl" asChild>
                  <a href="#como-funciona" className="group">
                    Ver cómo funciona
                    <ChevronDown size={20} className="ml-2 group-hover:translate-y-1 transition-transform duration-200" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Social proof — real result */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-xs text-emerald-800 font-medium">
                  Resultado real: <strong>342 keywords en top 3</strong> · <strong>85K impresiones</strong> en 7 meses
                </p>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-sm text-muted-foreground"
            >
              ✓ Sin permanencias · ✓ Adaptado a tu negocio · ✓ Respuesta hoy
            </motion.p>
          </motion.div>

          {/* Right — Real CRM Dashboard Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-2xl border border-border/60"
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
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="absolute -top-4 -right-4 card-dashboard p-4 shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-success"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm font-bold text-primary">295 oportunidades</span>
              </div>
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="absolute -bottom-4 -left-4 card-dashboard p-4 shadow-lg cursor-pointer"
            >
              <p className="text-xs text-muted-foreground">Respuesta automática</p>
              <p className="text-lg font-bold text-primary">&lt;5 min</p>
            </motion.div>

            {/* Lottie paper plane — decorative top-left corner */}
            {planeAnim && (
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
                className="absolute -top-10 left-6 pointer-events-none"
              >
                <Lottie
                  animationData={planeAnim}
                  loop
                  style={{ width: 80, height: 80 }}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
