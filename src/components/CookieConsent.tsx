import { useEffect, useState } from "react";
import "./cookie-consent.css";

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
    <aside aria-label="Preferencias de cookies" className="roicas-cookie-consent flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-relaxed text-muted-foreground">
        <p>
          Elige tu preferencia de cookies. Consulta cómo usamos tus datos en la{" "}
          <a href="/politica-privacidad" className="underline underline-offset-2">política de privacidad</a>.
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => savePreference("accepted")} className="rounded px-1 py-1 text-xs font-medium text-foreground/80 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Aceptar
          </button>
          <button type="button" onClick={() => savePreference("declined")} className="rounded px-1 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Rechazar
          </button>
        </div>
    </aside>
  );
}
