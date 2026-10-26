import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { BriefFormData, BriefLeadRecord } from "@/types/brief";
import { submitBriefForm } from "@/lib/brief/briefSubmission";
import { validateSimpleStep } from "@/lib/brief/simpleBrief";
import { useToast } from "@/hooks/use-toast";
import { BriefProgressBar } from "@/components/brief/BriefProgressBar";
import { SimpleBriefSteps } from "@/components/brief/SimpleBriefSteps";
import { BriefSuccessView } from "@/components/brief/BriefSuccessView";
import { BriefAdminView } from "@/components/brief/BriefAdminView";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Send } from "lucide-react";
import { trackBriefStarted, trackBriefStepCompleted } from "@/lib/analytics";

const STEP_TITLES = ["Tu negocio", "Tu idea", "Tus datos"];
const INITIAL_FORM_DATA: BriefFormData = {
  // Step 1
  business_name: "",
  project_stage: "",
  current_store_url: "",
  no_store_url_now: false,
  product_type: [],
  sales_regions: "por_definir",
  target_countries: "",
  platform_preference: "necesito_recomendacion",
  other_platform_name: "",

  // Step 2
  catalog_size: "sin_definir",
  initial_upload: "sin_definir",
  has_variations: "no_se",
  content_readiness: "",
  stock_management: "por_definir",
  existing_catalog_format: "no_se",

  // Step 3
  payment_methods: ["necesito_asesoria"],
  gateway_status: "no_se",
  gateway_provider: "sin_preferencia",
  delivery_coverage: [],
  shipping_pricing: "por_definir",
  carrier_integration: "necesito_asesoria",
  billing_integration: "no_se",
  billing_system: "",
  subscription_details: "",
  booking_needed: "",

  // Step 4
  brand_assets: "",
  design_goal: "necesito_orientacion",
  reference_urls: ["", "", ""],
  requested_features: [],
  integration_details: "",
  special_requirements: "",

  // Step 5
  contact_name: "",
  contact_email: "",
  contact_phone_prefix: "+57",
  contact_whatsapp: "",
  launch_target: "sin_fecha",
  budget_range: "prefiero_no_indicar",
  privacy_consent: false,

  website_source_hp: "",
  client_rendered_at: Date.now(),
};

export const BriefCotizacion = () => {
  const { toast } = useToast();
  const [params] = useSearchParams();
  const admin = params.get("admin") === "roicas" || params.get("view") === "leads";
  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);
  const [data, setData] = useState<BriefFormData>(() => ({ ...INITIAL_FORM_DATA, client_rendered_at: Date.now() }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<BriefLeadRecord | null>(null);
  const pendingLead = useRef<BriefLeadRecord>();
  const started = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, submitted]);
  const update = (values: Partial<BriefFormData>) => {
    if (!started.current) { trackBriefStarted(1); started.current = true; }
    pendingLead.current = undefined;
    setData(previous => ({ ...previous, ...values }));
    setErrors(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => !(key in values))));
  };
  const validate = (number: number) => {
    const result = validateSimpleStep(number, data);
    setErrors(result.errors);
    if (!result.isValid) requestAnimationFrame(() => document.getElementById(Object.keys(result.errors)[0])?.focus());
    return result.isValid;
  };
  const advance = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting || !validate(step)) return;
    if (step < 3) {
      trackBriefStepCompleted(step, STEP_TITLES[step - 1]);
      setFurthest(Math.max(furthest, step + 1));
      setStep(step + 1);
      return;
    }
    for (const previous of [1, 2]) {
      if (!validateSimpleStep(previous, data).isValid) { setStep(previous); return; }
    }
    setSubmitting(true);
    try {
      const result = await submitBriefForm(data, pendingLead.current);
      if (result.success && result.lead) setSubmitted(result.lead);
      else {
        pendingLead.current = result.lead;
        toast({ title: "No pudimos confirmar el envío", description: result.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Inténtalo de nuevo", description: "Tus respuestas siguen aquí. También puedes escribirnos por WhatsApp.", variant: "destructive" });
    } finally { setSubmitting(false); }
  };
  return <main className="min-h-screen bg-background text-foreground">
    <SeoHead title="Cotiza tu tienda online | ROICAS" description="Cuéntanos tu idea en tres pasos sencillos. Sin preguntas técnicas: prepararemos una cotización según las necesidades de tu negocio." canonical="https://roicas.com/cotizar-tienda-online" />
    <Header />
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 gradient-mesh-warm">
      <div className="section-container max-w-3xl mx-auto">
        {admin ? <BriefAdminView onClose={() => window.location.assign("/cotizar-tienda-online")} /> : submitted ? <BriefSuccessView lead={submitted} /> : <>
          <div className="mb-7 text-center">
            <span className="inline-flex rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold text-brand">Tu próxima tienda empieza con una idea</span>
            <h1 ref={heading} tabIndex={-1} className="mt-4 mb-3 text-3xl md:text-4xl font-extrabold tracking-tight outline-none">Hagamos realidad tu tienda online</h1>
            <p className="text-muted-foreground leading-relaxed">Cuéntanos lo esencial. Nosotros te ayudamos con la parte técnica.</p>
            <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground"><span>3 pasos sencillos</span><span>Sin compromiso</span><span>Cotización a tu medida</span></div>
          </div>
          <form onSubmit={advance} noValidate className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-xl shadow-black/5">
            <BriefProgressBar currentStep={step} totalSteps={3} stepTitles={STEP_TITLES} furthestStepReached={furthest} onStepClick={number => { if (!submitting && number <= furthest) { setErrors({}); setStep(number); } }} />
            <h2 className="mb-6 text-xl font-bold" aria-live="polite">{["Empecemos por tu negocio", "¿Cómo imaginas tu tienda?", "¿A dónde te escribimos?"][step - 1]}</h2>
            <fieldset disabled={submitting} className="min-w-0"><SimpleBriefSteps step={step} data={data} onChange={update} errors={errors} onEdit={() => setStep(1)} /></fieldset>
            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between gap-3">
              {step > 1 ? <Button type="button" variant="outline" disabled={submitting} onClick={() => { setErrors({}); setStep(step - 1); }} className="h-12"><ArrowLeft className="w-4 h-4 mr-2" />Atrás</Button> : <span className="text-xs text-muted-foreground">Paso 1 de 3</span>}
              <Button type="submit" variant="hero" disabled={submitting} className="h-12 px-5 text-sm sm:text-base">{submitting ? "Enviando…" : step === 3 ? "Solicitar mi cotización" : "Continuar"}{step === 3 ? <Send className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}</Button>
            </div>
            {step === 3 && <p className="mt-4 text-center text-xs text-muted-foreground">Te enviaremos un correo de confirmación. El precio se define al revisar tu solicitud.</p>}
          </form>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Check className="w-4 h-4 text-brand" />No necesitas elegir plataformas ni saber de tecnología</span></div>
          <p className="mt-5 text-center text-sm"><a href="https://wa.me/573114565403" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand underline underline-offset-4"><MessageCircle className="w-4 h-4" />¿Prefieres contarnos por WhatsApp?</a></p>
        </>}
      </div>
    </section>
    <Footer />
  </main>;
};
export default BriefCotizacion;
