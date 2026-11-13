import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/modules/diagnostico/components/ui/button";
import { useToast } from "@/modules/diagnostico/hooks/use-toast";
import { Input } from "@/modules/diagnostico/components/ui/input";
import { Label } from "@/modules/diagnostico/components/ui/label";
import { buildWhatsAppUrl, scrollToId } from "@/modules/diagnostico/lib/contact";
import { submitLead } from "@/modules/diagnostico/lib/leads";
import { trackContact, trackLead, trackAdsConversion, trackAgendaClick } from "@/modules/diagnostico/lib/pixel";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type Answers = {
  tiene_web: string;
  objetivo: string;
  urgencia: string;
};

const steps = [
  {
    key: "tiene_web" as const,
    title: "¿Tu negocio tiene página web actualmente?",
    options: [
      "No tengo web",
      "Sí, pero no funciona bien",
      "Sí y quiero llevarla al siguiente nivel",
    ],
  },
  {
    key: "objetivo" as const,
    title: "¿Qué resultado quieres lograr primero?",
    options: [
      "Tener presencia profesional en internet",
      "Conseguir más clientes",
      "Automatizar mi seguimiento de ventas",
      "No sé por dónde empezar",
    ],
  },
  {
    key: "urgencia" as const,
    title: "¿Cuándo quieres arrancar?",
    options: ["Esta semana", "Este mes", "Solo estoy explorando"],
  },
];

const formSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, { message: "Tu nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" }),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{7,20}$/, { message: "Ingresa un WhatsApp válido (solo números)" }),
  negocio: z
    .string()
    .trim()
    .min(2, { message: "Cuéntanos brevemente tu negocio" })
    .max(200, { message: "Máximo 200 caracteres" }),
});

type FormValues = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

export function Quiz() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0); // 0..2 = quiz, 3 = form, 4 = success
  const [answers, setAnswers] = useState<Answers>({ tiene_web: "", objetivo: "", urgencia: "" });
  const [form, setForm] = useState<FormValues>({ nombre: "", whatsapp: "", negocio: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    if (step > 0) contentRef.current?.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true });
  }, [step]);

  const totalSteps = 4;
  const progress = ((Math.min(step, totalSteps - 1) + 1) / totalSteps) * 100;

  const handleSelect = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // bloquea doble disparo (evita conversiones duplicadas en Ads)
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      parsed.error.issues.forEach((iss) => {
        const k = iss.path[0] as keyof FormValues;
        if (!fieldErrors[k]) fieldErrors[k] = iss.message;
      });
      setErrors(fieldErrors);
      requestAnimationFrame(() => document.getElementById(Object.keys(fieldErrors)[0])?.focus());
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = {
      nombre: parsed.data.nombre as string,
      whatsapp: parsed.data.whatsapp as string,
      negocio: parsed.data.negocio as string,
      tiene_web: answers.tiene_web,
      objetivo: answers.objetivo,
      urgencia: answers.urgencia,
      source: "landing",
    };

    try {
      await submitLead(payload);
      trackLead();
      trackAdsConversion();
      setStep(4);
    } catch (err) {
      console.error(err);
      toast({
        title: "Algo falló",
        description: "Inténtalo de nuevo o escríbenos por WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({ tiene_web: "", objetivo: "", urgencia: "" });
    setForm({ nombre: "", whatsapp: "", negocio: "" });
    setErrors({});
  };

  return (
    <section id="contacto" className="relative py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container max-w-3xl">
        <Reveal>
          <div className="text-center">
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
              Cuéntanos sobre tu negocio
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Responde 3 preguntas y deja tus datos para que revisemos tu solicitud. No genera un análisis automático ni una cotización.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div ref={contentRef} className="mt-8 overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-10">
            {/* Progress */}
            {step < 4 && (
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                  <span className="text-primary">
                    Paso {Math.min(step, totalSteps - 1) + 1} de {totalSteps}
                  </span>
                  <span className="text-ink-soft">
                    {step < 3 ? "Quiz" : "Datos de contacto"}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-warm transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Quiz steps */}
            {step < 3 && (
              <div key={step} className="animate-fade-in-up">
                <h3 tabIndex={-1} className="font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
                  {steps[step].title}
                </h3>
                <div className="mt-6 grid gap-3">
                  {steps[step].options.map((opt) => {
                    const selected = answers[steps[step].key] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelect(steps[step].key, opt)}
                        className={cn(
                          "group flex items-center justify-between gap-4 rounded-2xl border-2 p-5 text-left transition-all",
                          "border-border bg-cream hover:border-primary hover:bg-primary/5",
                          selected && "border-primary bg-primary/5"
                        )}
                      >
                        <span className="text-base font-medium text-ink md:text-lg">{opt}</span>
                        <ArrowRight className="h-5 w-5 text-ink-soft transition-all group-hover:translate-x-1 group-hover:text-primary" />
                      </button>
                    );
                  })}
                </div>

                {step > 0 && (
                  <button
                    onClick={handleBack}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Atrás
                  </button>
                )}
              </div>
            )}

            {/* Form */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-5">
                <h3 tabIndex={-1} className="font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
                  Último paso: ¿cómo te contactamos?
                </h3>

                <div>
                  <Label htmlFor="nombre" className="text-sm font-semibold text-ink">
                    Nombre completo
                  </Label>
                  <Input
                    id="nombre"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.nombre)}
                    aria-describedby={errors.nombre ? "nombre-error" : undefined}
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="María Pérez"
                    className="mt-1.5 h-12 rounded-xl border-border bg-cream text-base"
                    maxLength={100}
                    required
                  />
                  {errors.nombre && (
                    <p id="nombre-error" role="alert" className="mt-1 text-sm text-destructive">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="text-sm font-semibold text-ink">
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.whatsapp)}
                    aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
                    type="tel"
                    inputMode="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="+57 300 123 4567"
                    className="mt-1.5 h-12 rounded-xl border-border bg-cream text-base"
                    maxLength={20}
                    required
                  />
                  {errors.whatsapp && (
                    <p id="whatsapp-error" role="alert" className="mt-1 text-sm text-destructive">{errors.whatsapp}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="negocio" className="text-sm font-semibold text-ink">
                    ¿Cuál es tu negocio?
                  </Label>
                  <Input
                    id="negocio"
                    autoComplete="organization"
                    aria-invalid={Boolean(errors.negocio)}
                    aria-describedby={errors.negocio ? "negocio-error" : undefined}
                    value={form.negocio}
                    onChange={(e) => setForm({ ...form, negocio: e.target.value })}
                    placeholder="Restaurante, clínica, taller, e-commerce…"
                    className="mt-1.5 h-12 rounded-xl border-border bg-cream text-base"
                    maxLength={200}
                    required
                  />
                  {errors.negocio && (
                    <p id="negocio-error" role="alert" className="mt-1 text-sm text-destructive">{errors.negocio}</p>
                  )}
                </div>

                {/* Hidden context fields (for reference) */}
                <input type="hidden" name="tiene_web" value={answers.tiene_web} />
                <input type="hidden" name="objetivo" value={answers.objetivo} />
                <input type="hidden" name="urgencia" value={answers.urgencia} />

                <Button
                  type="submit"
                  size="xl"
                  variant="brand"
                  disabled={submitting}
                  className="w-full"
                >
                  <Sparkles />
                  {submitting ? "Enviando…" : "Quiero mi diagnóstico gratuito"}
                </Button>

                <p className="text-center text-sm text-ink-soft">
                  Te contactamos en menos de 24 horas. Sin spam, sin presión.
                </p>

                <button
                  type="button"
                  onClick={handleBack}
                  className="mx-auto flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </button>
              </form>
            )}

            {/* Success */}
            {step === 4 && (
              <div className="animate-scale-in py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 tabIndex={-1} className="mt-5 font-display text-3xl font-bold text-ink">
                  ¡Recibido! Te contactamos pronto.
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">
                  Te escribimos por WhatsApp en menos de 24 h. Si prefieres elegir tú el horario, agenda ahora mismo:
                </p>
                <Button
                  size="lg"
                  onClick={() => { trackAgendaClick("quiz_success"); scrollToId("agenda"); }}
                  className="mt-6 gap-2"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Agendar mi llamada ahora
                </Button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 block mx-auto text-sm text-ink-soft hover:text-ink underline-offset-4 hover:underline"
                >
                  Hacer otra consulta
                </button>
              </div>
            )}
          </div>
        </Reveal>

        {/* WhatsApp alternative */}
        {step < 4 && (
          <Reveal delay={200}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
              <p className="text-sm text-ink-soft">¿Prefieres hablar directo?</p>
              <a
                href={buildWhatsAppUrl("Hola, quiero información sobre sus servicios")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackContact}
                className="group inline-flex h-11 items-center gap-2 rounded-xl border border-ink/12 bg-card px-5 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/30"
              >
                <MessageCircle className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                Escribir por WhatsApp
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
