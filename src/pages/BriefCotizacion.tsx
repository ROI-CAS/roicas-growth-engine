import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { BriefFormData, BriefLeadRecord } from "@/types/brief";
import { submitBriefForm } from "@/lib/brief/briefSubmission";
import { BRIEF_STEPS, validateDetailedStep } from "@/lib/brief/detailedBrief";
import { useToast } from "@/hooks/use-toast";
import { BriefProgressBar } from "@/components/brief/BriefProgressBar";
import { DetailedBriefSteps } from "@/components/brief/DetailedBriefSteps";
import { BriefSuccessView } from "@/components/brief/BriefSuccessView";
import { BriefAdminView } from "@/components/brief/BriefAdminView";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle, Send } from "lucide-react";
import { trackBriefStarted, trackBriefStepCompleted } from "@/lib/analytics";
import "./editorial.css";

const STEP_TITLES = BRIEF_STEPS;
const INITIAL_FORM_DATA: BriefFormData = {
  additional_answers: {},
  // Step 1
  business_name: "",
  project_stage: "",
  current_store_url: "",
  no_store_url_now: false,
  product_type: [],
  sales_regions: "",
  target_countries: "",
  platform_preference: "necesito_recomendacion",
  other_platform_name: "",

  // Step 2
  catalog_size: "",
  initial_upload: "",
  has_variations: "",
  content_readiness: "",
  stock_management: "por_definir",
  existing_catalog_format: "no_se",

  // Step 3
  payment_methods: [],
  gateway_status: "",
  gateway_provider: "sin_preferencia",
  delivery_coverage: [],
  shipping_pricing: "",
  carrier_integration: "necesito_asesoria",
  billing_integration: "no_se",
  billing_system: "",
  subscription_details: "",
  booking_needed: "",

  // Step 4
  brand_assets: "",
  design_goal: "",
  reference_urls: ["", "", ""],
  requested_features: [],
  integration_details: "",
  special_requirements: "",

  // Step 5
  contact_name: "",
  contact_email: "",
  contact_phone_prefix: "+57",
  contact_whatsapp: "",
  launch_target: "",
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
  const inFlight = useRef(false);
  const [submissionError, setSubmissionError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const previousView = useRef<number | "confirmation">(1);
  const pendingErrorField = useRef<string>();
  useEffect(() => {
    const view = submitted ? "confirmation" : step;
    if (previousView.current === view) return;
    previousView.current = view;
    const field = pendingErrorField.current ? document.getElementById(pendingErrorField.current) : null;
    pendingErrorField.current = undefined;
    const target = field ?? (submitted ? confirmation.current : heading.current);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [step, submitted]);
  const update = (values: Partial<BriefFormData>) => {
    if (!started.current) { trackBriefStarted(1); started.current = true; }
    pendingLead.current = undefined;
    setData(previous => ({ ...previous, ...values }));
    setErrors(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => !(key in values))));
  };
  const validate = (number: number) => {
    const result = validateDetailedStep(number, data);
    setErrors(result.errors);
    if (!result.isValid) {
      const field = Object.keys(result.errors)[0];
      if (number === step) requestAnimationFrame(() => document.getElementById(field)?.focus());
      else pendingErrorField.current = field;
    }
    return result.isValid;
  };
  const advance = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inFlight.current || submitting || !validate(step)) return;
    if (step < 5) {
      trackBriefStepCompleted(step, STEP_TITLES[step - 1]);
      setFurthest(Math.max(furthest, step + 1));
      setStep(step + 1);
      return;
    }
    for (const previous of [1, 2, 3, 4]) {
      if (!validate(previous)) { setStep(previous); return; }
    }
    inFlight.current = true;
    setSubmissionError("");
    setSubmitting(true);
    try {
      const result = await submitBriefForm(data, pendingLead.current);
      if (result.success && result.lead) setSubmitted(result.lead);
      else {
        pendingLead.current = result.lead;
        setSubmissionError(result.error || "No pudimos confirmar el envío. Tus respuestas siguen aquí; puedes volver a intentarlo.");
        toast({ title: "No pudimos confirmar el envío", description: result.error, variant: "destructive" });
      }
    } catch {
      setSubmissionError("No pudimos confirmar el envío. Tus respuestas siguen aquí. Vuelve a intentarlo o escríbenos por WhatsApp.");
      toast({ title: "Inténtalo de nuevo", description: "Tus respuestas siguen aquí. También puedes escribirnos por WhatsApp.", variant: "destructive" });
    } finally { inFlight.current = false; setSubmitting(false); }
  };
  return (
    <div className="roicas-editorial">
      <SeoHead title="Cotiza tu tienda online | ROICAS" description="Cuéntanos tu negocio, tus productos y la imagen que buscas. Preparamos una cotización personalizada con toda la información de tu proyecto." canonical="https://roicas.com/cotizar-tienda-online" />
      <Header />
      <main id="contenido-principal" tabIndex={-1}>
        <header className="red-hero red-hero-compact">
          <ParticlesBackground particleCount={20} speed={0.16} />
          <div className="section-container red-hero-content">
            <h1>Cotiza tu tienda online</h1>
            {!admin && !submitted && <p>Cuéntanos en cinco pasos qué vendes y cómo quieres operar. Revisaremos tus respuestas para preparar una propuesta a la medida, sin compromiso.</p>}
          </div>
        </header>

        <div className="section-container red-brief">
          {admin ? <BriefAdminView onClose={() => window.location.assign("/cotizar-tienda-online")} /> : submitted ? (
            <div ref={confirmation} tabIndex={-1} aria-label="Confirmación de la solicitud" className="scroll-mt-28">
              <BriefSuccessView lead={submitted} />
            </div>
          ) : (
            <>
              <form onSubmit={advance} noValidate aria-busy={submitting} className="red-brief-form">
                <BriefProgressBar currentStep={step} totalSteps={5} stepTitles={STEP_TITLES} furthestStepReached={furthest} onStepClick={number => {
                  if (!submitting && number <= furthest) {
                    setErrors({});
                    setStep(number);
                  }
                }} />
                <h2 ref={heading} tabIndex={-1} className="mb-5">{["Conozcamos tu negocio", "Productos y contenidos", "Pagos, entregas y operación", "Imagen corporativa y funciones", "Contacto y revisión final"][step - 1]}</h2>
                <fieldset disabled={submitting} className="min-w-0">
                  <DetailedBriefSteps step={step} data={data} onChange={update} errors={errors} onEdit={number => setStep(number)} />
                </fieldset>
                {Object.keys(errors).length > 0 && <p role="alert" className="mt-5 text-sm text-destructive">Revisa los campos señalados de este paso para continuar.</p>}
                {submissionError && <p role="alert" className="mt-5 text-sm text-destructive">{submissionError}</p>}
                <p role="status" className="sr-only">{submitting ? "Enviando tu solicitud. Espera la confirmación." : ""}</p>
                <div className="red-brief-controls">
                  {step > 1 && <Button type="button" variant="outline" disabled={submitting} onClick={() => { setErrors({}); setStep(step - 1); }} className="min-h-12"><ArrowLeft size={16} aria-hidden="true" />Paso anterior</Button>}
                  <Button type="submit" variant="hero" disabled={submitting} className="min-h-12 h-auto whitespace-normal px-5 py-3 text-sm sm:text-base">
                    {submitting ? "Enviando…" : step === 5 ? "Solicitar propuesta" : "Continuar"}
                    {step === 5 ? <Send size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
                  </Button>
                </div>
                {step === 5 && <p className="red-brief-help text-sm">Te enviaremos una confirmación por correo. El precio se define al revisar tu solicitud.</p>}
              </form>
              <p className="red-brief-help">Si algo aún no está definido, puedes indicarlo en el formulario.</p>
              <a href="https://wa.me/573114565403" target="_blank" rel="noopener noreferrer" className="red-text-link"><MessageCircle size={17} aria-hidden="true" />Hablar por WhatsApp</a>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default BriefCotizacion;
