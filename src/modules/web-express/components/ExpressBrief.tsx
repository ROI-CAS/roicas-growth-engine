import { useState } from "react";
import { Button } from "@/modules/web-express/components/ui/button";
import { Input } from "@/modules/web-express/components/ui/input";
import { Textarea } from "@/modules/web-express/components/ui/textarea";
import { Label } from "@/modules/web-express/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Calendar,
  CreditCard,
  Utensils,
  Stethoscope,
  Scale,
  Hotel,
  ShoppingBag,
  Briefcase,
  MapPin,
  Image,
  Link,
  Instagram,
  Check,
  FileText,
  Users,
  BookOpen,
  Phone,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { WhatsAppIcon } from "@/modules/web-express/components/WhatsAppIcon";
import { track } from "@/modules/web-express/lib/meta";
import { useLandingOffer } from "@/modules/web-express/lib/landing-offer";
import { Reveal } from "@/modules/web-express/components/Reveal";
import { submitBrief } from "@/modules/web-express/lib/brief";

const SECTORS = [
  { label: "Restaurante", icon: Utensils },
  { label: "Salud / Médico", icon: Stethoscope },
  { label: "Abogado / Legal", icon: Scale },
  { label: "Inmobiliaria / Hotel", icon: Hotel },
  { label: "Tienda / Comercio", icon: ShoppingBag },
  { label: "Servicios / Coach", icon: Briefcase },
  { label: "Otro Negocio", icon: Sparkles },
];

const SECTIONS_OPTIONS = [
  { id: "nosotros", label: "Nosotros / Quiénes somos", icon: Users },
  { id: "servicios", label: "Servicios / Productos", icon: Briefcase },
  { id: "galeria", label: "Galería / Portafolio", icon: Image },
  { id: "contacto", label: "Contacto + Mapa", icon: MapPin },
  { id: "testimonios", label: "Testimonios / Reseñas", icon: BookOpen },
];

interface ExpressBriefProps {
  onBookingClick?: () => void;
}

type Step = 1 | 2;

export function ExpressBrief({ onBookingClick }: ExpressBriefProps = {}) {
  const offer = useLandingOffer();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Contacto
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [sector, setSector] = useState("Servicios / Coach");

  // Step 2 — Brief
  const [descripcion, setDescripcion] = useState("");
  const [servicios, setServicios] = useState("");
  const [tieneLogo, setTieneLogo] = useState<"si" | "no" | "baja">("no");
  const [tieneFotos, setTieneFotos] = useState<"si" | "no">("no");
  const [secciones, setSecciones] = useState<string[]>(["nosotros", "servicios", "contacto"]);
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [referencia, setReferencia] = useState("");
  const [notas, setNotas] = useState("");

  const toggleSeccion = (id: string) => {
    setSecciones((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 5 ? [...prev, id] : prev,
    );
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !whatsapp.trim() || !email.trim() || !empresa.trim() || !ciudad.trim()) {
      toast.error("Por favor completa los campos obligatorios (*)");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Ingresa un correo electrónico válido");
      return;
    }
    // Paso 1 completado: ya tenemos contacto → Lead.
    track("Lead", { phone: whatsapp });

    setStep(2);
    window.scrollTo({
      top: document.getElementById("solicitar")?.offsetTop ?? 0,
      behavior: "smooth",
    });
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim() || !servicios.trim()) {
      toast.error("Por favor describe tu negocio y tus servicios principales (*)");
      return;
    }

    const seccionesNombres = secciones
      .map((id) => SECTIONS_OPTIONS.find((s) => s.id === id)?.label ?? id)
      .join(", ");

    const redesStr = [
      instagram ? `Instagram: ${instagram}` : "",
      facebook ? `Facebook: ${facebook}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const text = encodeURIComponent(
      `🌐 *BRIEF WEB EXPRESS${offer.campaign ? "" : " 24H"}*\n\n` +
        (offer.campaign
          ? `Campaña: Black November · One Page ${offer.totalLabel} · Anticipo ${offer.depositLabel}\n\n`
          : "") +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Contacto*\n` +
        `• Nombre: ${nombre}\n` +
        `• WhatsApp: ${whatsapp}\n` +
        `• Email: ${email}\n` +
        `• Ciudad: ${ciudad}\n\n` +
        `🏢 *Negocio*\n` +
        `• Empresa: ${empresa}\n` +
        `• Sector: ${sector}\n` +
        `• Descripción: ${descripcion}\n\n` +
        `📋 *Contenido*\n` +
        `• Servicios principales: ${servicios}\n` +
        `• Secciones deseadas: ${seccionesNombres}\n` +
        `• Tiene logo: ${tieneLogo === "si" ? "Sí ✅" : tieneLogo === "baja" ? "Sí, pero baja resolución ⚠️" : "No ❌"}\n` +
        `• Tiene fotos del negocio: ${tieneFotos === "si" ? "Sí ✅" : "No ❌"}\n` +
        (redesStr ? `• Redes sociales: ${redesStr}\n` : "") +
        (referencia ? `• Referencia / Estilo: ${referencia}\n` : "") +
        (notas ? `\n📝 *Notas adicionales*\n${notas}` : "") +
        `\n━━━━━━━━━━━━━━━━━━`,
    );

    // Paso 2 completado: brief entero enviado → CompleteRegistration.
    track("CompleteRegistration", { phone: whatsapp });

    // Envía el brief por correo (best-effort). No bloquea el flujo de WhatsApp:
    // aunque falle, el lead sigue capturado abajo.
    void submitBrief({
      data: {
        nombre,
        whatsapp,
        email,
        empresa,
        ciudad,
        sector,
        descripcion,
        servicios,
        tieneLogo,
        tieneFotos,
        secciones: secciones.map((id) => SECTIONS_OPTIONS.find((s) => s.id === id)?.label ?? id),
        instagram,
        facebook,
        referencia,
        notas: offer.campaign
          ? `[Campaña ${offer.id} · One Page ${offer.totalLabel} · Anticipo ${offer.depositLabel}]\n${notas}`
          : notas,
      },
    }).catch(() => {
      /* best-effort */
    });

    setSubmitted(true);
    toast.success("¡Brief enviado! Revisaremos los datos de tu negocio.", {
      description: "Revisa tu correo y tu WhatsApp.",
    });

    window.open(`https://wa.me/573114565403?text=${text}`, "_blank");
  };

  const handleDirectWhatsapp = () => {
    track("Contact");
    window.open(offer.whatsappUrl("brief"), "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="solicitar"
      className="express-brief py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background border-t border-border relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <Reveal className="express-brief-header text-center space-y-4 mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest">
            <Zap className="size-3.5 fill-current" />
            Tu web empieza aquí · 2 pasos
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-balance">
            {submitted ? (
              "¡Brief recibido!"
            ) : step === 1 ? (
              <>
                Cuéntanos sobre <span className="text-brand">tu negocio</span>
              </>
            ) : (
              <>
                Ahora el brief <span className="text-brand">de tu web</span>
              </>
            )}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Completa los datos de tu negocio y cuéntanos qué necesitas. Revisamos tu información y
            coordinamos contigo el inicio del proyecto por WhatsApp.
          </p>
        </Reveal>

        {/* Progress bar */}
        {!submitted && (
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${step === 1 ? "bg-brand text-brand-foreground" : "bg-brand/10 text-brand"}`}
              >
                {step > 1 ? <Check className="size-3" strokeWidth={3} /> : <span>1</span>}
                Contacto
              </div>
              <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full bg-brand transition-all duration-500 ${step === 2 ? "w-full" : "w-0"}`}
                />
              </div>
              <div
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${step === 2 ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <span>2</span>
                Brief
              </div>
            </div>
          </div>
        )}

        {/* ══ SUCCESS STATE ══ */}
        {submitted ? (
          <div className="rounded-3xl border border-brand/30 bg-card p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <div className="size-16 rounded-full bg-brand/10 text-brand grid place-items-center mx-auto">
              <CheckCircle2 className="size-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                ¡Brief enviado correctamente!
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tenemos toda la información para empezar. Te enviamos la confirmación a{" "}
                <span className="font-semibold text-foreground">{email}</span> y te escribimos al
                WhatsApp <span className="font-semibold text-foreground">{whatsapp}</span> para
                coordinar el siguiente paso.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                onClick={handleDirectWhatsapp}
                size="lg"
                className="h-13 px-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2 shadow-lg cursor-pointer"
              >
                <WhatsAppIcon className="size-5" /> Abrir WhatsApp Directo
              </Button>
              <a
                href={offer.checkoutUrl ?? offer.whatsappUrl("payment")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track(offer.checkoutUrl ? "InitiateCheckout" : "Contact", {
                    ...(offer.checkoutUrl ? { value: offer.depositCOP, currency: "COP" } : {}),
                    params: { campaign: offer.id, placement: "brief", intent: "payment" },
                  })
                }
              >
                <Button
                  size="lg"
                  className="h-13 px-8 rounded-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold gap-2 shadow-lg cursor-pointer"
                >
                  <CreditCard className="size-5" />{" "}
                  {offer.checkoutUrl ? "Pagar anticipo con Wompi" : "Solicitar enlace Wompi"}
                </Button>
              </a>
            </div>
          </div>
        ) : step === 1 ? (
          /* ══ STEP 1: CONTACTO ══ */
          <form
            onSubmit={handleStep1}
            className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-2xl space-y-6"
          >
            {/* Fast-Track WhatsApp Option */}
            <div className="p-4 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <WhatsAppIcon className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-xs text-foreground font-medium">
                  ¿Prefieres no escribir?{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    También puedes contarnos sobre tu negocio por WhatsApp.
                  </strong>
                </p>
              </div>
              <Button
                type="button"
                onClick={handleDirectWhatsapp}
                size="sm"
                className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shrink-0 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <WhatsAppIcon className="size-3.5" /> Enviar por WhatsApp
              </Button>
            </div>

            {/* Nombre + WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="nombre"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Tu Nombre *
                </Label>
                <Input
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Carlos Mendoza"
                  className="h-12 text-base rounded-xl bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  WhatsApp *
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="h-12 text-base rounded-xl bg-background"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Correo electrónico *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="h-12 text-base rounded-xl bg-background"
              />
              <p className="text-[11px] text-muted-foreground">
                Te enviaremos la confirmación de tu solicitud aquí.
              </p>
            </div>

            {/* Empresa + Ciudad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="empresa"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Nombre de tu Negocio *
                </Label>
                <Input
                  id="empresa"
                  required
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Ej: Clínica Dental San José"
                  className="h-12 text-base rounded-xl bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="ciudad"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Ciudad / Municipio *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="ciudad"
                    required
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Ej: Bogotá, Medellín..."
                    className="h-12 text-base rounded-xl bg-background pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Sector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tipo de Negocio
              </Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {SECTORS.map(({ label, icon: Icon }) => {
                  const active = sector === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSector(label)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        active
                          ? "bg-brand/10 border-brand text-brand shadow-sm"
                          : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next button */}
            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                size="lg"
                className="sheen group w-full h-14 rounded-2xl bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-base shadow-xl shadow-brand/30 gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
              >
                Continuar al Brief{" "}
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-2 border-t border-border/40">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  Tus datos están seguros · 0 spam
                </span>
                <div className="flex items-center gap-4">
                  {onBookingClick && (
                    <button
                      type="button"
                      onClick={onBookingClick}
                      className="flex items-center gap-1.5 text-brand hover:underline font-semibold cursor-pointer"
                    >
                      <Calendar className="size-3.5" />
                      Agendar Cita (20 min)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDirectWhatsapp}
                    className="flex items-center gap-1.5 text-foreground hover:text-brand font-semibold underline underline-offset-4 cursor-pointer"
                  >
                    <WhatsAppIcon className="size-3.5 text-emerald-500" />
                    Hablar por WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* ══ STEP 2: BRIEF ══ */
          <form
            onSubmit={handleStep2}
            className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-2xl space-y-7"
          >
            {/* Resumen paso 1 */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand/5 border border-brand/20 text-sm">
              <CheckCircle2 className="size-4 text-brand shrink-0" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{nombre}</span> · {empresa} ·{" "}
                {ciudad} · {sector}
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="ml-auto text-xs text-brand hover:underline font-semibold cursor-pointer shrink-0"
              >
                Editar
              </button>
            </div>

            {/* Descripción del negocio */}
            <div className="space-y-2">
              <Label
                htmlFor="descripcion"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                ¿A qué se dedica tu negocio? *{" "}
                <span className="normal-case font-normal text-muted-foreground/70">
                  (1-2 líneas)
                </span>
              </Label>
              <Textarea
                id="descripcion"
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Somos una clínica dental en Bogotá que ofrece ortodoncia, blanqueamiento y limpieza dental. Atendemos familias y adultos..."
                className="min-h-20 resize-none rounded-xl bg-background text-sm"
              />
            </div>

            {/* Servicios principales */}
            <div className="space-y-2">
              <Label
                htmlFor="servicios"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Servicios o productos principales *{" "}
                <span className="normal-case font-normal text-muted-foreground/70">(hasta 5)</span>
              </Label>
              <Textarea
                id="servicios"
                required
                value={servicios}
                onChange={(e) => setServicios(e.target.value)}
                placeholder="Ej: 1. Ortodoncia, 2. Blanqueamiento dental, 3. Limpieza, 4. Implantes, 5. Urgencias 24h"
                className="min-h-20 resize-none rounded-xl bg-background text-sm"
              />
            </div>

            {/* Secciones */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Secciones que quieres en tu web{" "}
                <span className="normal-case font-normal text-muted-foreground/70">
                  (máx. 5 — selecciona las que apliquen)
                </span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {SECTIONS_OPTIONS.map(({ id, label, icon: Icon }) => {
                  const active = secciones.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleSeccion(id)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer text-left ${
                        active
                          ? "bg-brand/10 border-brand text-brand"
                          : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`size-7 rounded-lg grid place-items-center shrink-0 ${active ? "bg-brand/20" : "bg-background"}`}
                      >
                        {active ? (
                          <Check className="size-3.5 text-brand" strokeWidth={3} />
                        ) : (
                          <Icon className="size-3.5" />
                        )}
                      </div>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo + Fotos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  ¿Tienes logo?
                </Label>
                <div className="flex gap-2">
                  {(
                    [
                      ["si", "Sí, en buena calidad"],
                      ["baja", "Sí, pero baja resolución"],
                      ["no", "No tengo logo"],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTieneLogo(val)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        tieneLogo === val
                          ? "bg-brand/10 border-brand text-brand"
                          : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  ¿Tienes fotos del negocio?
                </Label>
                <div className="flex gap-2">
                  {(
                    [
                      ["si", "Sí, tengo fotos"],
                      ["no", "No, necesito imágenes"],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTieneFotos(val)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        tieneFotos === val
                          ? "bg-brand/10 border-brand text-brand"
                          : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Redes sociales + referencia */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="instagram"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Instagram <span className="normal-case font-normal">(opcional)</span>
                </Label>
                <div className="relative">
                  <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@tuclinica"
                    className="h-11 rounded-xl bg-background pl-10 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="facebook"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Facebook <span className="normal-case font-normal">(opcional)</span>
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="facebook.com/tuclinica"
                    className="h-11 rounded-xl bg-background pl-10 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Referencia + Notas */}
            <div className="space-y-2">
              <Label
                htmlFor="referencia"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Web de referencia o estilo que te gusta{" "}
                <span className="normal-case font-normal">(opcional)</span>
              </Label>
              <div className="relative">
                <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="referencia"
                  type="url"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="https://ejemplo.com"
                  className="h-11 rounded-xl bg-background pl-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="notas"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                ¿Algo más que debamos saber?{" "}
                <span className="normal-case font-normal">(opcional)</span>
              </Label>
              <Textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej: Quiero colores azul y blanco, tengo un video de presentación, abro los domingos..."
                className="min-h-20 resize-none rounded-xl bg-background text-sm"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                size="lg"
                className="sheen group w-full h-14 rounded-2xl bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-base shadow-xl shadow-brand/30 gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
              >
                Enviar datos de mi negocio{" "}
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  Volver al paso anterior
                </button>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    {offer.campaign
                      ? "Plazo de entrega confirmado en tu cotización"
                      : "Propuesta en 24h hábiles desde tu brief completo"}
                  </span>
                  <button
                    type="button"
                    onClick={handleDirectWhatsapp}
                    className="flex items-center gap-1.5 text-foreground hover:text-brand font-semibold underline underline-offset-4 cursor-pointer"
                  >
                    <WhatsAppIcon className="size-3.5 text-emerald-500" />
                    WhatsApp directo
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
