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
    window.dispatchEvent(new Event("roicas-cookie-preference-saved"));
  }

  if (!visible) return null;

  return (
    <aside aria-label="Preferencias de cookies" className="roicas-cookie-consent text-xs leading-relaxed text-muted-foreground">
      <div className="roicas-cookie-consent__inner">
        <p>
          Elige tu preferencia de cookies. Consulta cómo usamos tus datos en la{" "}
          <a href="/politica-privacidad">política de privacidad</a>.
        </p>
        <div className="roicas-cookie-consent__actions">
          <button type="button" onClick={() => savePreference("accepted")}>
            Aceptar cookies
          </button>
          <button type="button" onClick={() => savePreference("declined")}>
            Rechazar
          </button>
        </div>
      </div>
    </aside>
  );
}
