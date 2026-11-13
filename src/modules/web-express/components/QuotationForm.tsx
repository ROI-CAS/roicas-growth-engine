import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, LoaderCircle, Mail } from "lucide-react";
import { quotationSchema, submitQuotation } from "@/modules/web-express/lib/quotation";
import { Reveal } from "@/modules/web-express/components/Reveal";

export function QuotationForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "unconfigured" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const parsed = quotationSchema.safeParse({
      nombre: form.get("nombre"),
      email: form.get("email"),
      negocio: form.get("negocio"),
      mensaje: form.get("mensaje"),
      consent: form.get("consent") === "on",
      website: form.get("website"),
    });
    if (!parsed.success) {
      setFeedback(parsed.error.issues[0]?.message || "Revisa los datos de tu solicitud.");
      return;
    }
    const d = parsed.data;
    setEmailDraft(
      `mailto:herebus_cas@hotmail.com?subject=${encodeURIComponent("Cotización Web Express · Black November")}&body=${encodeURIComponent(`Nombre: ${d.nombre}\nCorreo: ${d.email}\nNegocio: ${d.negocio}\n\n${d.mensaje}\n\nQuiero recibir la cotización por correo.`)}`,
    );
    setBusy(true);
    setFeedback("");
    try {
      const result = await submitQuotation({ data: d });
      setStatus(result.status);
      if (result.status === "sent") setConfirmed(result.confirmed);
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Reveal className="premium-quote-panel">
      <div className="premium-quote-intro">
        <span className="premium-eyebrow">TAMBIÉN POR CORREO</span>
        <h2>Cuéntanos qué web necesitas.</h2>
        <p>
          Déjanos tu correo y te enviaremos una cotización con el alcance, el precio y el plazo. No
          necesitas WhatsApp.
        </p>
        <p className="premium-quote-note">
          Enviar esta solicitud no confirma una reserva ni requiere un pago.
        </p>
      </div>
      {status === "sent" ? (
        <div className="premium-quote-success" role="status" tabIndex={-1}>
          <Check aria-hidden="true" />
          <h3>Recibimos tu solicitud.</h3>
          <p>Revisaremos lo que necesitas y te responderemos por correo con la cotización.</p>
          <p>
            {confirmed
              ? "También te enviamos un correo de confirmación. Revisa tu bandeja y spam."
              : "Tu solicitud quedó recibida. El correo automático de confirmación no pudo enviarse."}
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="premium-quote-form" aria-busy={busy}>
          <div className="premium-quote-fields">
            <label htmlFor="quote-name">
              Tu nombre
              <input
                id="quote-name"
                name="nombre"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
              />
            </label>
            <label htmlFor="quote-email">
              Correo electrónico
              <input
                id="quote-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
          </div>
          <label htmlFor="quote-business">
            Nombre del negocio <span>(opcional)</span>
            <input id="quote-business" name="negocio" autoComplete="organization" maxLength={150} />
          </label>
          <label htmlFor="quote-message">
            ¿Qué necesitas para tu web?
            <textarea
              id="quote-message"
              name="mensaje"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              placeholder="Qué hace tu negocio, qué servicios quieres mostrar y qué te gustaría conseguir con tu web."
            />
          </label>
          <div className="premium-quote-trap" aria-hidden="true">
            <label>
              Sitio web
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="premium-quote-consent">
            <input type="checkbox" name="consent" required />
            <span>
              Autorizo el uso de estos datos para responder mi solicitud, de acuerdo con la{" "}
              <a href="/web-express/privacidad?from=black-november" target="_blank" rel="noopener noreferrer">
                política de privacidad
              </a>
              .
            </span>
          </label>
          {feedback && <p role="alert">{feedback}</p>}
          {(status === "error" || status === "unconfigured") && (
            <div className="premium-quote-error" role="alert">
              <p>
                {status === "unconfigured"
                  ? "El envío desde este formulario todavía no está disponible. Tu solicitud no se ha enviado."
                  : "No pudimos confirmar el envío. Tus datos siguen aquí para que puedas intentarlo de nuevo."}
              </p>
              <a href={emailDraft}>
                Abrir mi correo para enviar la solicitud <ArrowUpRight aria-hidden="true" />
              </a>
              <small>
                Se abrirá tu aplicación de correo con los datos preparados. Revisa el mensaje y
                envíalo tú.
              </small>
            </div>
          )}
          <button className="premium-button premium-quote-submit" type="submit" disabled={busy}>
            {busy ? (
              <LoaderCircle aria-hidden="true" className="premium-quote-spinner" />
            ) : (
              <Mail aria-hidden="true" />
            )}
            {busy ? "Enviando solicitud…" : "Solicitar cotización por correo"}
            <ArrowUpRight aria-hidden="true" />
          </button>
        </form>
      )}
    </Reveal>
  );
}
