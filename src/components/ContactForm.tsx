import { useId, useRef, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { trackFormStarted, trackFormSubmitted, trackLeadCaptured } from "@/lib/analytics";
import { sendEmailSubmission } from "@/lib/emailSubmission";

interface ContactFormProps {
  variant?: "full" | "compact";
  showTitle?: boolean;
  title?: string;
  className?: string;
}

type Field = "name" | "whatsapp" | "company" | "acceptPrivacy";

export default function ContactForm({ showTitle = true, title = "Cuéntanos sobre tu negocio", className = "" }: ContactFormProps) {
  const id = useId();
  const hasStarted = useRef(false);
  const requestId = useRef<string>();
  const inFlight = useRef(false);
  const [formData, setFormData] = useState({ name: "", whatsapp: "", company: "", acceptPrivacy: false });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const update = (field: Field, value: string | boolean) => {
    setFormData(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    setSubmissionError("");
  };
  const handleFirstFocus = () => {
    if (!hasStarted.current) { hasStarted.current = true; trackFormStarted(window.location.pathname); }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inFlight.current) return;
    const next: Partial<Record<Field, string>> = {};
    if (!formData.name.trim()) next.name = "Escribe tu nombre.";
    if (!formData.whatsapp.trim()) next.whatsapp = "Escribe tu número de WhatsApp, con indicativo de país.";
    if (!formData.acceptPrivacy) next.acceptPrivacy = "Acepta la política para autorizar el contacto y tratamiento de tus datos.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    inFlight.current = true;
    setIsSubmitting(true);
    setSubmissionError("");
    try {
      requestId.current ??= crypto.randomUUID();
      await sendEmailSubmission({ kind: "contact", requestId: requestId.current, name: formData.name.trim(), phone: formData.whatsapp.trim(), company: formData.company.trim(), privacyConsent: formData.acceptPrivacy, source: window.location.pathname });
      setIsSuccess(true);
      trackFormSubmitted(!!formData.company.trim(), window.location.pathname);
      trackLeadCaptured("form");
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "No pudimos confirmar el envío. Tus datos siguen aquí: vuelve a intentarlo o escríbenos por WhatsApp.");
    } finally { inFlight.current = false; setIsSubmitting(false); }
  };
  const errorFor = (field: Field) => errors[field] && <p id={`${id}-${field}-error`} className="mt-2 text-sm text-destructive">{errors[field]}</p>;
  const accessibility = (field: Field) => ({ id: `${id}-${field}`, "aria-invalid": !!errors[field], "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined });
  if (isSuccess) return (
    <div role="status" className={`rounded-2xl border border-border bg-card p-8 ${className}`}>
      <CheckCircle2 className="h-10 w-10 text-success mb-4" aria-hidden="true" />
      <h3 className="text-2xl font-bold mb-2">Solicitud recibida</h3>
      <p className="text-muted-foreground">Te contactaremos por WhatsApp para conocer tu proyecto.</p>
    </div>
  );
  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className={`rounded-2xl border border-border bg-card p-6 sm:p-8 ${className}`}>
      {showTitle && <h3 className="text-2xl font-bold mb-6">{title}</h3>}
      <p className="text-sm text-muted-foreground mb-6">Nombre y WhatsApp son obligatorios. Empresa es opcional.</p>
      <fieldset disabled={isSubmitting} className="space-y-5 min-w-0">
        <div><label htmlFor={`${id}-name`} className="block text-sm font-medium mb-2">Nombre</label>
          <Input {...accessibility("name")} name="name" autoComplete="name" required value={formData.name} onFocus={handleFirstFocus} onChange={e => update("name", e.target.value)} className="h-12 text-base" />{errorFor("name")}</div>
        <div><label htmlFor={`${id}-whatsapp`} className="block text-sm font-medium mb-2">WhatsApp con indicativo de país</label>
          <Input {...accessibility("whatsapp")} name="phone" autoComplete="tel" type="tel" required placeholder="+57 300 123 4567" value={formData.whatsapp} onFocus={handleFirstFocus} onChange={e => update("whatsapp", e.target.value)} className="h-12 text-base" />{errorFor("whatsapp")}</div>
        <div><label htmlFor={`${id}-company`} className="block text-sm font-medium mb-2">Empresa (opcional)</label>
          <Input {...accessibility("company")} name="organization" autoComplete="organization" value={formData.company} onFocus={handleFirstFocus} onChange={e => update("company", e.target.value)} className="h-12 text-base" /></div>
        <div><div className="flex items-start gap-3">
          <Checkbox {...accessibility("acceptPrivacy")} checked={formData.acceptPrivacy} onCheckedChange={checked => update("acceptPrivacy", checked === true)} className="mt-1" />
          <label htmlFor={`${id}-acceptPrivacy`} className="text-sm text-muted-foreground leading-relaxed">Acepto la <Link to="/politica-privacidad" className="text-brand underline underline-offset-4">política de privacidad</Link> y autorizo el tratamiento de mis datos.</label>
        </div>{errorFor("acceptPrivacy")}</div>
      </fieldset>
      {Object.values(errors).some(Boolean) && <p role="alert" className="mt-5 text-sm text-destructive">Revisa los campos señalados para enviar la solicitud.</p>}
      {submissionError && <p role="alert" className="mt-5 text-sm text-destructive">{submissionError}</p>}
      <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="mt-6 w-full min-h-12 h-auto whitespace-normal py-3">
        <Send className="w-4 h-4 mr-2 shrink-0" aria-hidden="true" />{isSubmitting ? "Enviando solicitud…" : "Enviar solicitud de contacto"}
      </Button>
      <p role="status" aria-live="polite" className="mt-3 text-sm text-muted-foreground">{isSubmitting ? "Estamos enviando tus datos. Espera la confirmación." : "Te contactaremos por WhatsApp."}</p>
    </form>
  );
}
