import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  function savePreference(value: "accepted" | "declined") {
    localStorage.setItem("cookie-consent", value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside aria-label="Preferencias de cookies" className="border-b border-border bg-background">
      <div className="section-container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-foreground">
          Elige tu preferencia de cookies. Consulta cómo usamos tus datos en la{" "}
          <a href="/politica-privacidad" className="underline underline-offset-4">política de privacidad</a>.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => savePreference("accepted")} className="min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Aceptar cookies
          </button>
          <button type="button" onClick={() => savePreference("declined")} className="min-h-11 rounded-md border border-border px-4 text-sm font-medium hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Rechazar
          </button>
        </div>
      </div>
    </aside>
  );
}
