import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SeoHead from "@/components/SeoHead";
import { BriefFormData, BriefLeadRecord } from "@/types/brief";
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
} from "@/lib/brief/briefLogic";
import { submitBriefForm } from "@/lib/brief/briefSubmission";
import { useToast } from "@/hooks/use-toast";
import {
  trackBriefStarted,
  trackBriefStepCompleted,
  trackBriefValidationFailed,
} from "@/lib/analytics";

import { BriefProgressBar } from "@/components/brief/BriefProgressBar";
import { BriefStep1Business } from "@/components/brief/BriefStep1Business";
import { BriefStep2Catalog } from "@/components/brief/BriefStep2Catalog";
import { BriefStep3Operations } from "@/components/brief/BriefStep3Operations";
import { BriefStep4Design } from "@/components/brief/BriefStep4Design";
import { BriefStep5Contact } from "@/components/brief/BriefStep5Contact";
import { BriefSuccessView } from "@/components/brief/BriefSuccessView";
import { BriefAdminView } from "@/components/brief/BriefAdminView";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEP_TITLES = [
  "Tu negocio",
  "Catálogo",
  "Pagos y entregas",
  "Diseño y funciones",
  "Contacto y envío",
];

const INITIAL_FORM_DATA: BriefFormData = {
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
  stock_management: "",
  existing_catalog_format: "",

  // Step 3
  payment_methods: [],
  gateway_status: "",
  gateway_provider: "",
  delivery_coverage: [],
  shipping_pricing: "",
  carrier_integration: "",
  billing_integration: "",
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
  budget_range: "",
  privacy_consent: false,

  website_source_hp: "",
  client_rendered_at: Date.now(),
};

const briefSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cotización de Tiendas Online WooCommerce y Shopify",
  provider: { "@type": "Organization", name: "ROICAS", url: "https://roicas.com" },
  description: "Formulario de levantamiento de requerimientos y cotización de tiendas online WooCommerce y Shopify para pymes y emprendedores.",
  url: "https://roicas.com/cotizar-tienda-online",
};

export const BriefCotizacion: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isAdminParam = searchParams.get("admin") === "roicas" || searchParams.get("view") === "leads";

  const [showAdmin, setShowAdmin] = useState(isAdminParam);
  const [currentStep, setCurrentStep] = useState(1);
  const [furthestStepReached, setFurthestStepReached] = useState(1);
  const [formData, setFormData] = useState<BriefFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<BriefLeadRecord | null>(null);

  const hasTrackedStart = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, submittedLead]);

  const handleUpdate = (updates: Partial<BriefFormData>) => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackBriefStarted(1);
    }
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear field-level error when updated
    const updatedKeys = Object.keys(updates);
    if (Object.keys(errors).length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        updatedKeys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const validateCurrentStep = (step: number): boolean => {
    let result = { isValid: true, errors: {} as Record<string, string> };

    if (step === 1) result = validateStep1(formData);
    else if (step === 2) result = validateStep2(formData);
    else if (step === 3) result = validateStep3(formData);
    else if (step === 4) result = validateStep4(formData);
    else if (step === 5) result = validateStep5(formData);

    setErrors(result.errors);

    if (!result.isValid) {
      trackBriefValidationFailed(step, Object.keys(result.errors).length);
      // Focus first error field if any
      const firstErrorKey = Object.keys(result.errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
    }

    return result.isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      trackBriefStepCompleted(currentStep, STEP_TITLES[currentStep - 1]);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep > furthestStepReached) {
        setFurthestStepReached(nextStep);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepJump = (stepNumber: number) => {
    if (stepNumber <= furthestStepReached) {
      setErrors({});
      setCurrentStep(stepNumber);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep(5)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitBriefForm(formData);
      if (result.success && result.lead) {
        setSubmittedLead(result.lead);
      } else {
        toast({ title: "No se pudo enviar", description: result.error, variant: "destructive" });
      }
    } catch (err) {
      console.error("Submission failed:", err);
      toast({ title: "No se pudo enviar", description: "Tus datos siguen en el formulario. Inténtalo de nuevo o escríbenos por WhatsApp.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <SeoHead
        title="Cotizar Tienda Online | Brief Interactivo WooCommerce & Shopify | ROICAS"
        description="Solicita la cotización de tu tienda online con WooCommerce o Shopify. Completa nuestro brief en 5 minutos y recibe una propuesta adaptada a tu negocio."
        canonical="https://roicas.com/cotizar-tienda-online"
        schemaJson={briefSchema}
      />

      <Header />

      <div ref={topRef} className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28 gradient-mesh-warm">
        <div className="section-container max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Migas de pan" className="mb-4 text-xs text-muted-foreground flex items-center gap-1.5">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/servicios" className="hover:text-foreground transition-colors">Servicios</Link>
            <span>/</span>
            <Link to="/servicios/tiendas-online" className="hover:text-foreground transition-colors">Tiendas Online</Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Cotizar</span>
          </nav>

          {/* Admin toggle if opened */}
          {showAdmin ? (
            <div className="relative">
              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={() => setShowAdmin(false)}>
                  Cerrar Panel Interno
                </Button>
              </div>
              <BriefAdminView onClose={() => setShowAdmin(false)} />
            </div>
          ) : submittedLead ? (
            <BriefSuccessView lead={submittedLead} />
          ) : (
            <div className="card-dashboard p-6 sm:p-10 shadow-xl border border-border bg-card">
              {/* Header section */}
              <div className="mb-8 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold mb-3 border border-brand/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Brief E-commerce sin compromiso</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
                  Cuéntanos cómo será tu tienda online
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  Responde unas preguntas y prepararemos una propuesta ajustada a tu negocio.{" "}
                  <strong>No necesitas conocimientos técnicos.</strong>
                </p>
              </div>

              {/* Progress Bar */}
              <BriefProgressBar
                currentStep={currentStep}
                totalSteps={5}
                stepTitles={STEP_TITLES}
                onStepClick={handleStepJump}
                furthestStepReached={furthestStepReached}
              />

              {/* Step Forms */}
              <div className="min-h-[380px]">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BriefStep1Business
                        data={formData}
                        onChange={handleUpdate}
                        errors={errors}
                      />
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BriefStep2Catalog
                        data={formData}
                        onChange={handleUpdate}
                        errors={errors}
                      />
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BriefStep3Operations
                        data={formData}
                        onChange={handleUpdate}
                        errors={errors}
                      />
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BriefStep4Design
                        data={formData}
                        onChange={handleUpdate}
                        errors={errors}
                      />
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BriefStep5Contact
                        data={formData}
                        onChange={handleUpdate}
                        onEditStep={handleStepJump}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        errors={errors}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Footer (Back / Continue) */}
              {currentStep < 5 && (
                <div className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-4">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                      className="cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Atrás
                    </Button>
                  ) : (
                    <div />
                  )}

                  <Button
                    type="button"
                    variant="hero"
                    size="lg"
                    onClick={handleNext}
                    className="cursor-pointer min-w-[140px]"
                  >
                    <span>{currentStep === 1 ? "Comenzar" : "Continuar"}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand" />
                  100% Confidencial
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand" />
                  Respuesta en &lt; 24h hábiles
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand" />
                  Sin llamadas obligatorias
                </span>
              </div>
            </div>
          )}

          {/* Discreet link for ROICAS admin team to open internal leads dashboard */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowAdmin(!showAdmin)}
              className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground underline cursor-pointer"
            >
              {showAdmin ? "Ocultar panel interno de solicitudes" : "Acceso equipo ROICAS (Panel de leads)"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default BriefCotizacion;
