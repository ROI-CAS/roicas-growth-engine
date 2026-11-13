export {};
type Turnstile = {
  render: (container: string, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
    onTurnstileReady?: () => void;
  }
}
const form = document.querySelector<HTMLFormElement>("#lead-form")!;
const emailDelivery = form.dataset.channel === "email";
const submitLabel = emailDelivery
  ? "Recibir mi diagnóstico por correo"
  : "Solicitar revisión por WhatsApp";
const first = document.querySelector<HTMLFieldSetElement>("#step-one")!;
const second = document.querySelector<HTMLFieldSetElement>("#step-two")!;
const website = document.querySelector<HTMLInputElement>("#website")!;
const issue = document.querySelector<HTMLSelectElement>("#issue")!;
const feedback = document.querySelector<HTMLElement>("#form-feedback")!;
const submit = document.querySelector<HTMLButtonElement>("#submit")!;
const verifyStatus = document.querySelector<HTMLElement>(
  "#verification-status",
)!;
let idempotency = crypto.randomUUID();
let token = "";
let widget: string | undefined;
let sending = false;
let enabled = false;
let normalized = "";
const progress = document.querySelector<HTMLElement>("#diagnosis-progress")!;
const progressTitle = document.querySelector<HTMLElement>("#diagnosis-title")!;
const progressStatus =
  document.querySelector<HTMLElement>("#diagnosis-status")!;
const progressTime = document.querySelector<HTMLElement>("#diagnosis-time")!;
const checkDiagnosis =
  document.querySelector<HTMLButtonElement>("#check-diagnosis")!;
const download = document.querySelector<HTMLAnchorElement>("#report-download")!;
let startedAt = 0;
let clock: ReturnType<typeof setInterval> | undefined;
let poll: ReturnType<typeof setTimeout> | undefined;
let capability: { id: string; token: string } | null = null;
let previousStatus = "";
const activeRequests = new Set<AbortController>();
function stopProgress() {
  clearInterval(clock);
  clock = undefined;
  clearTimeout(poll);
  for (const controller of activeRequests) controller.abort();
  activeRequests.clear();
  progress.classList.remove("is-waiting");
  document.body.classList.remove("diagnosis-active");
}
function progressMessage(title: string, message: string) {
  progressTitle.textContent = title;
  progressStatus.textContent = message;
}
function beginProgress() {
  stopProgress();
  document.body.classList.remove("diagnosis-complete");
  startedAt = Date.now();
  previousStatus = "";
  progress.hidden = false;
  progress.classList.add("is-waiting");
  document.body.classList.add("diagnosis-active");
  checkDiagnosis.hidden = true;
  progressMessage(
    "Registrando tu solicitud",
    "Validamos los datos antes de iniciar. No cierres esta página.",
  );
  const tick = () => {
    const seconds = Math.min(120, Math.floor((Date.now() - startedAt) / 1000));
    progressTime.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} transcurridos · límite de espera 2:00`;
    if (seconds >= 120) {
      stopProgress();
      progressMessage(
        "La revisión necesita más tiempo",
        "Terminó la espera de dos minutos. No damos el diagnóstico por completado. Consulta el estado o habla con el equipo; no vuelvas a enviar el formulario.",
      );
      checkDiagnosis.hidden = !capability;
    }
  };
  tick();
  clock = setInterval(tick, 1000);
}
new IntersectionObserver(([entry]) =>
  progress.classList.toggle("in-view", !!entry?.isIntersecting),
).observe(progress);

type ProgressResult = {
  status: string;
  delivery_status: string;
  delivery_channel?: "email" | "whatsapp";
  report_url: string | null;
};
async function fetchProgress(start: boolean): Promise<ProgressResult> {
  const controller = new AbortController();
  activeRequests.add(controller);
  const timeout = setTimeout(
    () => controller.abort(),
    start ? Math.max(1, 120000 - (Date.now() - startedAt)) : 8000,
  );
  try {
    const response = await fetch(
      `/api/v1/diagnosis/${start ? "start" : "status"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capability),
        signal: controller.signal,
      },
    );
    if (!response.ok) throw new Error("progress_unavailable");
    return (await response.json()) as ProgressResult;
  } finally {
    clearTimeout(timeout);
    activeRequests.delete(controller);
  }
}
function renderProgress(data: ProgressResult): boolean {
  if (
    data.status === "ready" &&
    (emailDelivery ||
      (data.report_url &&
        /^\/informe\/[A-Za-z0-9_-]{43}\.pdf$/.test(data.report_url)))
  ) {
    stopProgress();
    progressMessage(
      "Tu diagnóstico está listo",
      "Ya puedes abrir el PDF. El informe distingue lo observado de lo que requiere revisión adicional.",
    );
    if (!emailDelivery && data.report_url) download.href = data.report_url;
    download.hidden = emailDelivery;
    document.querySelector("#success-title")!.textContent = emailDelivery
      ? "Revisa tu bandeja de correo"
      : "Diagnóstico disponible";
    document.querySelector("#success-message")!.textContent = emailDelivery
      ? "Tu diagnóstico está listo. Enviaremos el enlace privado al correo que indicaste. Revisa también Spam o Correo no deseado."
      : "El PDF está disponible aquí; no necesitas esperar el mensaje para consultarlo.";
    const channelName =
      data.delivery_channel === "email" || emailDelivery
        ? "correo"
        : "WhatsApp";
    document.querySelector("#success-state")!.textContent =
      data.delivery_status === "accepted"
        ? `El proveedor aceptó el envío por ${channelName}; aún no confirma la recepción.`
        : `La entrega por ${channelName} se procesa por separado. No se ha confirmado su recepción.`;
    checkDiagnosis.hidden = true;
    progress.hidden = true;
    document.body.classList.add("diagnosis-complete");
    document.querySelector("#step-label")!.textContent = "Informe disponible";
    const success = document.querySelector<HTMLElement>("#success")!;
    success.focus({ preventScroll: true });
    success
      .closest(".form-card")
      ?.scrollIntoView({ block: "start", behavior: "auto" });
    return true;
  }
  if (["failed", "cancelled"].includes(data.status)) {
    stopProgress();
    progressMessage(
      "No pudimos completar el diagnóstico",
      "La solicitud está registrada, pero no hay un informe completo. Habla con el equipo para revisar el caso; no vuelvas a enviar tus datos.",
    );
    checkDiagnosis.hidden = true;
    return true;
  }
  if (previousStatus !== data.status && clock !== undefined) {
    previousStatus = data.status;
    progressMessage(
      data.status === "running"
        ? "Analizando tu WordPress"
        : "Solicitud en espera",
      data.status === "running"
        ? "Las pruebas de rendimiento móvil y PC se ejecutan en paralelo. Te avisaremos cuando finalice el análisis."
        : "Tu solicitud está registrada. Esperamos la confirmación de inicio del análisis.",
    );
  }
  return false;
}
function monitorDiagnosis(id: string, token: string) {
  capability = { id, token };
  progress.focus({ preventScroll: true });
  progress
    .closest(".form-card")
    ?.scrollIntoView({ block: "start", behavior: "auto" });
  const pollStatus = async () => {
    if (Date.now() - startedAt >= 120000) return;
    try {
      if (renderProgress(await fetchProgress(false))) return;
    } catch {
      if (!progress.classList.contains("is-waiting")) return;
      progressStatus.textContent =
        "No pudimos actualizar el estado. Seguiremos consultándolo dentro del tiempo de espera; no reenvíes tus datos.";
    }
    if (progress.classList.contains("is-waiting"))
      poll = setTimeout(() => void pollStatus(), 2500);
  };
  void fetchProgress(true)
    .then(renderProgress)
    .catch(() => {});
  poll = setTimeout(() => void pollStatus(), 1500);
}
checkDiagnosis.addEventListener("click", async () => {
  checkDiagnosis.disabled = true;
  try {
    if (!renderProgress(await fetchProgress(false)))
      progressMessage(
        "Tu solicitud sigue registrada",
        "El análisis todavía no está listo. Puedes consultar más tarde o hablar con el equipo. No necesitas repetir el formulario.",
      );
  } catch {
    progressMessage(
      "No pudimos consultar el estado",
      "Revisa tu conexión y vuelve a consultar. Tus datos no se enviarán de nuevo.",
    );
  } finally {
    checkDiagnosis.disabled = false;
  }
});

// Optional funnel analytics are disabled; no stored preference enables tracking.
document.querySelectorAll<HTMLAnchorElement>(".mobile-nav a").forEach((link) =>
  link.addEventListener("click", () => {
    document.querySelector<HTMLDetailsElement>(".mobile-nav")!.open = false;
  }),
);
document.querySelectorAll<HTMLAnchorElement>("[data-service]").forEach((link) =>
  link.addEventListener("click", () => {
    if (
      link.dataset.issue &&
      Array.from(issue.options).some((o) => o.value === link.dataset.issue)
    ) {
      issue.value = link.dataset.issue;
      idempotency = crypto.randomUUID();
    }
    const note = document.querySelector<HTMLElement>("#service-selection")!;
    note.textContent = `Tu consulta: ${link.dataset.service}. La revisión inicial es gratuita; el precio final se acuerda por separado.`;
    note.hidden = false;
  }),
);

const tell = (message: string) => {
  feedback.textContent = message;
  if (message) feedback.focus();
};
function resetVerification() {
  token = "";
  submit.disabled = true;
  if (widget !== undefined) window.turnstile?.reset(widget);
}
function validateFieldset(fieldset: HTMLFieldSetElement): boolean {
  const fields = fieldset.querySelectorAll<
    HTMLInputElement | HTMLSelectElement
  >("input,select");
  for (const field of fields) {
    field.removeAttribute("aria-invalid");
    if (!field.checkValidity()) {
      field.setAttribute("aria-invalid", "true");
      field.reportValidity();
      return false;
    }
  }
  return true;
}
function normalize(value: string): string {
  const url = new URL(
    /^https?:\/\//i.test(value.trim())
      ? value.trim()
      : `https://${value.trim()}`,
  );
  if (
    !url.hostname.includes(".") ||
    url.username ||
    url.password ||
    url.port ||
    url.hash ||
    !["http:", "https:"].includes(url.protocol) ||
    /^[\d.]+$/.test(url.hostname)
  )
    throw new Error(
      "Escribe un dominio público sin credenciales, puertos ni fragmentos.",
    );
  return `https://${url.hostname.toLowerCase()}/`;
}
function continueToContact() {
  if (!validateFieldset(first)) return;
  try {
    normalized = normalize(website.value);
  } catch {
    website.setAttribute("aria-invalid", "true");
    document.querySelector("#website-error")!.textContent =
      "Escribe un dominio público válido.";
    website.focus();
    return;
  }
  document.querySelector("#website-error")!.textContent = "";
  first.hidden = true;
  first.disabled = true;
  second.hidden = false;
  second.disabled = false;
  document.querySelector("#step-label")!.textContent = "Paso 2 de 2";
  document.querySelector("#progress-fill")!.classList.add("complete");
  document.querySelector("#request-summary")!.textContent =
    `${normalized}${issue.value ? ` · ${issue.selectedOptions[0]?.textContent}` : ""}. Solo la página de inicio.`;
  document
    .querySelector<HTMLInputElement>(emailDelivery ? "#email" : "#phone")!
    .focus();
  tell("");
}
document
  .querySelector("#continue")!
  .addEventListener("click", continueToContact);
const heroForm = document.querySelector<HTMLFormElement>("#hero-url-form")!;
const heroUrl = document.querySelector<HTMLInputElement>("#hero-url")!;
const heroButton =
  document.querySelector<HTMLButtonElement>("#hero-url-continue")!;
const heroError = document.querySelector<HTMLElement>("#hero-url-error")!;
heroForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (sending || form.hidden) return;
  heroUrl.removeAttribute("aria-invalid");
  heroError.textContent = "";
  try {
    if (!heroUrl.checkValidity()) throw new Error();
    normalize(heroUrl.value);
  } catch {
    heroUrl.setAttribute("aria-invalid", "true");
    heroError.textContent =
      "Escribe un dominio público válido, por ejemplo tuempresa.com.";
    heroUrl.focus();
    return;
  }
  website.value = heroUrl.value;
  website.dispatchEvent(new Event("input", { bubbles: true }));
  if (enabled) {
    continueToContact();
  } else {
    heroError.textContent =
      "El servicio está en preparación. Puedes revisar tu URL en el formulario o consultar por WhatsApp; no se ha enviado ningún dato.";
    website.focus({ preventScroll: true });
  }
  document
    .querySelector("#solicitud")!
    .scrollIntoView({ block: "start", behavior: "auto" });
});
website.addEventListener("input", () => {
  heroUrl.value = website.value;
});

document.querySelector("#back")!.addEventListener("click", () => {
  second.hidden = true;
  second.disabled = true;
  first.hidden = false;
  first.disabled = false;
  document.querySelector("#step-label")!.textContent = "Paso 1 de 2";
  document.querySelector("#progress-fill")!.classList.remove("complete");
  website.focus();
  tell("");
});
form.addEventListener("input", () => {
  if (!sending) idempotency = crypto.randomUUID();
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (sending || !enabled || !token || !validateFieldset(second)) return;
  sending = true;
  heroButton.disabled = true;
  submit.disabled = true;
  submit.textContent = "Enviando solicitud…";
  tell("");
  beginProgress();
  form.setAttribute("aria-busy", "true");
  const values = new FormData(form);
  // El primer fieldset está deshabilitado; se recupera desde sus controles, no FormData.
  const payload = {
    website_url: website.value,
    issue_type: issue.value || "otro_no_se",
    contact: {
      ...(emailDelivery
        ? { email: String(values.get("email") ?? "").trim() }
        : {}),
      ...(String(values.get("whatsapp_phone") ?? "").trim()
        ? { whatsapp_phone: String(values.get("whatsapp_phone")).trim() }
        : {}),
    },
    privacy_accepted: values.get("privacy") === "on",
    authorization_confirmed: values.get("privacy") === "on",
    marketing_opt_in: false,
    privacy_policy_version: form.dataset.policy,
    authorization_text_version: form.dataset.policy,
    form_version: form.dataset.version,
    idempotency_key: idempotency,
    turnstile_token: token,
    company: values.get("company") || "",
  };
  second.disabled = true;
  try {
    const response = await fetch("/api/v1/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
    const data = (await response.json()) as {
      message?: string;
      error?: string;
      fields?: Record<string, string>;
      request_id?: string;
      whatsapp_url?: string | null;
      diagnosis_id?: string | null;
      progress_token?: string | null;
    };
    if (!response.ok || !data.request_id) {
      if (data.error === "email_diagnosis_limit") {
        const help =
          document.querySelector<HTMLAnchorElement>("#quota-contact")!;
        if (help.href) {
          const target = new URL(help.href);
          target.searchParams.set(
            "text",
            `Hola WP Doctor. Necesito un diagnóstico adicional para ${new URL(normalized).hostname}. ¿Me ayudan a revisar mi cupo?`,
          );
          help.href = target.href;
        }
        help.hidden = false;
      }
      const fieldMessage = data.fields
        ? Object.values(data.fields).join(" ")
        : "";
      throw new Error(
        `${data.message || "No se pudo registrar la solicitud."} ${fieldMessage}`.trim(),
      );
    }
    form.hidden = true;
    const success = document.querySelector<HTMLElement>("#success")!;
    success.hidden = false;
    document.querySelector("#success-copy")!.textContent =
      `Sitio: ${new URL(normalized).hostname} · Referencia WP-${data.request_id.slice(0, 8).toUpperCase()}.`;
    document.querySelector("#success-message")!.textContent = data.diagnosis_id
      ? emailDelivery
        ? "Tu sitio está registrado. El enlace privado del informe llegará al correo que indicaste; no se mostrará en esta página."
        : "Tu sitio está registrado. Aquí podrás abrir el PDF cuando esté disponible."
      : "Hemos registrado tu sitio para revisión del equipo. No se ha iniciado un chequeo automático.";
    document.querySelector("#success-state")!.textContent = data.diagnosis_id
      ? `El PDF y el envío por ${emailDelivery ? "correo" : "WhatsApp"} tienen estados independientes.`
      : "No se ha realizado un diagnóstico automático.";
    if (
      data.whatsapp_url &&
      /^https:\/\/wa\.me\/[1-9]\d+\?/.test(data.whatsapp_url)
    ) {
      const link = document.querySelector<HTMLAnchorElement>("#success-wa")!;
      link.href = data.whatsapp_url;
      link.hidden = false;
    }
    document.querySelector("#step-label")!.textContent = "Solicitud recibida";
    if (data.diagnosis_id && data.progress_token) {
      monitorDiagnosis(data.diagnosis_id, data.progress_token);
    } else {
      stopProgress();
      progress.hidden = true;
      success.focus();
    }
  } catch (error) {
    stopProgress();
    progress.hidden = true;
    tell(
      error instanceof Error && error.name !== "TimeoutError"
        ? error.message
        : "No pudimos confirmar el envío. Reintenta: conservaremos la misma solicitud si ya fue recibida.",
    );
    resetVerification();
  } finally {
    sending = false;
    heroButton.disabled = !!form.hidden;
    second.disabled = false;
    form.setAttribute("aria-busy", "false");
    submit.textContent = submitLabel;
    submit.disabled = !token;
  }
});
async function initialize() {
  try {
    const response = await fetch("/api/v1/public/config");
    if (!response.ok) throw new Error();
    const config = (await response.json()) as {
      enabled: boolean;
      site_key: string | null;
    };
    enabled = config.enabled;
    if (!enabled || !config.site_key) {
      const notice = document.querySelector<HTMLElement>("#availability-note")!;
      heroButton.textContent = "Preparar diagnóstico";
      document.querySelector("#hero-url-help")!.textContent =
        "Servicio en preparación. La URL se conserva solo en esta página.";
      notice.hidden = false;
      notice.textContent =
        "Diagnóstico en preparación. El formulario aún no recibe solicitudes; puedes consultar al equipo por WhatsApp.";
      document.querySelector<HTMLButtonElement>("#continue")!.disabled = true;
      verifyStatus.textContent =
        "La recepción de solicitudes todavía no está habilitada.";
      return;
    }
    window.onTurnstileReady = () => {
      widget = window.turnstile!.render("#turnstile", {
        sitekey: config.site_key,
        action: "request_lead",
        theme: "light",
        callback: (value: string) => {
          token = value;
          submit.disabled = sending;
          verifyStatus.textContent = "";
        },
        "expired-callback": () => {
          token = "";
          submit.disabled = true;
          verifyStatus.textContent =
            "La verificación venció. Complétala nuevamente.";
        },
        "error-callback": () => {
          token = "";
          submit.disabled = true;
          verifyStatus.textContent =
            "No se pudo cargar la verificación. Revisa tu conexión.";
        },
      });
    };
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileReady&render=explicit";
    script.async = true;
    script.onerror = () => {
      verifyStatus.textContent =
        "La verificación no está disponible. Vuelve a cargar la página.";
    };
    document.head.append(script);
  } catch {
    verifyStatus.textContent =
      "No pudimos comprobar la disponibilidad del formulario. Vuelve a cargar la página.";
  }
}
void initialize();
