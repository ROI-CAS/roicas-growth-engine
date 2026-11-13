import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { validRequest } from "../helpers";

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js**",
    (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: `window.turnstile={render:(target,options)=>{setTimeout(()=>options.callback('test-valid'),10);return 'fixture-widget'},reset:()=>{}};window.onTurnstileReady();`,
      }),
  );
});

test("landing en escritorio: precio, alcance, accesibilidad y enlaces legales", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "WordPress",
  );
  await expect(page.locator(".price-card .price").first()).toContainText(
    "189.000",
  );
  await expect(page.locator(".problem")).toHaveCount(4);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({
    path: "test-results/landing-desktop.png",
    fullPage: false,
  });
  await page
    .locator("footer")
    .getByRole("link", { name: "Privacidad", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Tratamiento de datos",
  );
});

test("formulario móvil conserva campos y registra solicitud sin escaneo ficticio", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#website").fill("https://micomercio.com/contacto");
  // La URL basta para continuar: el problema es opcional.
  await page.getByRole("button", { name: "Continuar al paso final" }).click();
  await expect(page.locator("#request-summary")).toContainText(
    "https://micomercio.com/",
  );
  await page.locator("#phone").fill("+573001234567");
  await page.getByRole("button", { name: "Volver" }).click();
  await expect(page.locator("#website")).toHaveValue(
    "https://micomercio.com/contacto",
  );
  await page.getByRole("button", { name: "Continuar al paso final" }).click();
  await expect(page.locator("#email")).toHaveCount(0);
  await expect(page.locator("#phone")).toHaveValue("+573001234567");
  await expect(page.locator("[name=marketing]")).toHaveCount(0);
  await expect(page.locator("[name=authorization]")).toHaveCount(0);
  await page.locator("[name=privacy]").uncheck();
  await page.locator("#submit").click();
  await expect(page.locator("#success")).toBeHidden();
  await expect(page.locator("[name=privacy]")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.locator("[name=privacy]").check();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  const submitted = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/v1/requests") && request.method() === "POST",
  );
  await page
    .getByRole("button", {
      name: "Solicitar revisión por WhatsApp",
      exact: true,
    })
    .click();
  const submittedBody = (await submitted).postDataJSON();
  expect(submittedBody.contact).toEqual({ whatsapp_phone: "+573001234567" });
  expect(submittedBody).toMatchObject({
    issue_type: "otro_no_se",
    privacy_accepted: true,
    authorization_confirmed: true,
    marketing_opt_in: false,
  });
  await expect(
    page.getByRole("heading", { name: "Solicitud recibida" }),
  ).toBeVisible();
  await expect(page.locator("#success")).toContainText(
    "No se ha realizado un diagnóstico automático",
  );
  await expect(page.locator("#success-wa")).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/573001234567\?text=/,
  );
  await expect(page.locator(".wa-floating-btn")).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/573001234567\?text=/,
  );
  expect(page.context().pages()).toHaveLength(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/form-mobile.png",
    fullPage: false,
  });
});

test("móvil 360px sin desbordes y navegación por teclado", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Saltar al contenido" }),
  ).toBeFocused();
  await page.screenshot({
    path: "test-results/landing-mobile.png",
    fullPage: true,
  });
});

test("error de red conserva formulario y no muestra éxito", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#website").fill("https://fallorecuperable.com");
  await page.locator("#issue").selectOption("lentitud");
  await page.getByRole("button", { name: "Continuar al paso final" }).click();
  await page.locator("#phone").fill("+573001234567");
  await page.locator("[name=privacy]").check();
  await page.route("**/api/v1/requests", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Servicio temporalmente no disponible.",
      }),
    }),
  );
  await page
    .getByRole("button", {
      name: "Solicitar revisión por WhatsApp",
      exact: true,
    })
    .click();
  await expect(page.locator("#form-feedback")).toContainText(
    "Servicio temporalmente no disponible.",
  );
  await expect(page.locator("#email")).toHaveCount(0);
  await expect(page.locator("#phone")).toHaveValue("+573001234567");
  await expect(page.locator("#success")).toBeHidden();
});

test("panel: autenticación, revisión, nota segura, propuesta y venta", async ({
  page,
}) => {
  const created = await page.request.post("/api/v1/requests", {
    headers: { Origin: "http://127.0.0.1:4173" },
    data: validRequest({ website_url: "operacion.com" }),
  });
  expect(created.status()).toBe(202);
  const denied = await page.request.get(
    "http://127.0.0.1:4174/api/v1/admin/leads",
  );
  expect(denied.status()).toBe(401);
  await page.request.get("http://127.0.0.1:4174/__fixture__/login");
  await page.goto("http://127.0.0.1:4174/");
  await expect(page.locator("#identity")).toContainText("owner@example.com");
  await page.getByRole("button", { name: /operacion.com/ }).click();
  await expect(page.locator("#detail")).toContainText("cliente@gmail.com");
  await page.locator("#status").selectOption("calificado");
  await page.locator("#next-action").fill("Preparar propuesta del menú.");
  await page
    .locator("#note")
    .fill("<img src=x onerror=alert(1)> Nota de prueba.");
  await page.getByRole("button", { name: "Guardar seguimiento" }).click();
  await expect(page.locator("#admin-message")).toContainText(
    "Seguimiento guardado",
  );
  await expect(page.locator(".history").first()).toContainText(
    "<img src=x onerror=alert(1)>",
  );
  expect(await page.locator("#detail img").count()).toBe(0);
  await page
    .locator("#scope")
    .fill("Revisar y corregir el fallo delimitado del menú móvil.");
  await page.locator("#exclusions").fill("Sin rediseño, hosting ni licencias.");
  await page.locator("#quote").fill("189000");
  await page.locator("#offer-status").selectOption("enviada");
  await page.getByRole("button", { name: "Registrar oferta" }).click();
  await expect(page.locator("#admin-message")).toContainText(
    "No se envió ningún mensaje",
  );
  await expect(page.locator("#status")).toHaveValue("propuesta_enviada");
  await page.locator("#status").selectOption("ganado");
  await page.getByRole("button", { name: "Guardar seguimiento" }).click();
  await expect(page.locator("#admin-message")).toContainText(
    "Seguimiento guardado",
  );
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({
    path: "test-results/admin-desktop.png",
    fullPage: true,
  });
});

test("landing sin barra ni eventos de medición, incluso con preferencia antigua", async ({ page }) => {
  const events: string[] = [];
  page.on("request", request => { if (request.url().endsWith("/api/v1/funnel-events")) events.push(request.url()); });
  await page.addInitScript(() => localStorage.setItem("wpdoctor-analytics", "granted"));
  await page.goto("/");
  await expect(page.locator(".analytics-consent")).toHaveCount(0);
  await page.locator("#hero-url").fill("https://example.com");
  await page.locator("#hero-url-continue").click();
  await expect(page.locator("#step-two")).toBeVisible();
  expect(events).toHaveLength(0);
});

const progressCapability = {
  request_id: "b410e193-dfcb-4185-a307-1ea44d510a0d",
  diagnosis_id: "b410e193-dfcb-4185-a307-1ea44d510a0d",
  progress_token: "a".repeat(43),
};
async function prepareDiagnosticForm(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.locator("#website").fill("https://audit-example.com");
  await page.locator("#continue").click();
  if (await page.locator("#email").isVisible())
    await page.locator("#email").fill("owner@example.com");
  else await page.locator("#phone").fill("+573001234567");
  await page.locator("[name=privacy]").check();
  await expect(page.locator("#submit")).toBeEnabled();
}
for (const width of [390, 1440])
  test(`cargador usa estado real, es accesible y envía al correo sin exponer el PDF (${width}px)`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page
      .context()
      .addCookies([
        { name: "fixture-email", value: "1", url: "http://127.0.0.1:4173" },
      ]);
    await page.route("**/api/v1/requests", (r) =>
      r.fulfill({ status: 202, json: progressCapability }),
    );
    let ready = false;
    let starts = 0;
    await page.route("**/api/v1/diagnosis/start", (r) => {
      starts++;
      return r.fulfill({ json: { status: "running", report_url: null } });
    });
    await page.route("**/api/v1/diagnosis/status", (r) =>
      r.fulfill({
        json: ready
          ? {
              status: "ready",
              report_url: null,
              delivery_channel: "email",
              delivery_status: "queued",
            }
          : { status: "running", report_url: null },
      }),
    );
    await prepareDiagnosticForm(page);
    await page.locator("#submit").click();
    await expect(page.locator("#diagnosis-title")).toHaveText(
      "Analizando tu WordPress",
    );
    await expect(page.locator("#report-download")).toBeHidden();
    expect(starts).toBe(1);
    const a11y = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(a11y.violations).toEqual([]);
    await page.screenshot({
      path: `test-results/diagnostic-progress-${width}.png`,
      fullPage: false,
    });
    ready = true;
    await expect(page.locator("#success-title")).toHaveText("Revisa tu bandeja de correo");
    await expect(page.locator("#report-download")).toBeHidden();
    await expect(page.locator("#diagnosis-progress")).toBeHidden();
    await expect(page.locator("#email-delivery-hint")).toBeInViewport();
    await expect(page.locator("#success-wa")).toBeInViewport();
    await expect(page.locator("#diagnosis-progress")).not.toHaveClass(
      /is-waiting/,
    );
    await expect(page.locator("#success-state")).toContainText(
      "No se ha confirmado",
    );
    // Scrolling to the result must not scroll a clipped ancestor internally.
    expect(
      await page.locator("#solicitud").evaluate((node) => node.scrollTop),
    ).toBe(0);
    const resultBounds = await page.locator("#success").boundingBox();
    const sectionBounds = await page.locator("#solicitud").boundingBox();
    expect(resultBounds!.y).toBeGreaterThanOrEqual(sectionBounds!.y);
    expect(resultBounds!.y + resultBounds!.height).toBeLessThanOrEqual(
      sectionBounds!.y + sectionBounds!.height,
    );
    await page.screenshot({
      path: `reports/diagnostic-complete-${width}.png`,
      fullPage: false,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("al agotar el cupo ofrece ayuda por WhatsApp sin crear otro diagnóstico", async ({ page }) => {
  await page.context().addCookies([{name: "fixture-email", value: "1", url: "http://127.0.0.1:4173"}]);
  await page.route("**/api/v1/requests", r => r.fulfill({status: 429, json: {
    error: "email_diagnosis_limit", message: "Se alcanzó el cupo de dos diagnósticos gratuitos por correo en 30 días.",
  }}));
  await prepareDiagnosticForm(page);
  await page.locator("#submit").click();
  await expect(page.locator("#form-feedback")).toContainText("dos diagnósticos");
  await expect(page.locator("#quota-contact")).toBeVisible();
  const link = await page.locator("#quota-contact").getAttribute("href");
  expect(new URL(link!).searchParams.get("text")).toContain("diagnóstico adicional para audit-example.com");
  await expect(page.locator("#success")).toBeHidden();
  await expect(page.locator("#lead-form")).toBeVisible();
});

test("corta la espera a dos minutos y consulta el estado sin repetir la solicitud", async ({
  page,
}) => {
  let requests = 0;
  let ready = false;
  await page.route("**/api/v1/requests", (r) => {
    requests++;
    return r.fulfill({ status: 202, json: progressCapability });
  });
  await page.route("**/api/v1/diagnosis/start", (r) =>
    r.fulfill({ json: { status: "running", report_url: null } }),
  );
  await page.route("**/api/v1/diagnosis/status", (r) =>
    r.fulfill({
      json: ready
        ? {
            status: "ready",
            report_url: `/informe/${"a".repeat(43)}.pdf`,
            delivery_status: "queued",
          }
        : { status: "running", report_url: null },
    }),
  );
  await prepareDiagnosticForm(page);
  await page.clock.install();
  await page.locator("#submit").click();
  await expect(page.locator("#diagnosis-title")).toHaveText(
    "Analizando tu WordPress",
  );
  await page.clock.fastForward(120000);
  await expect(page.locator("#diagnosis-title")).toHaveText(
    "La revisión necesita más tiempo",
  );
  await expect(page.locator("#diagnosis-progress")).not.toHaveClass(
    /is-waiting/,
  );
  await expect(page.locator("#report-download")).toBeHidden();
  await expect(page.locator("#check-diagnosis")).toBeVisible();
  ready = true;
  await page.locator("#check-diagnosis").click();
  await expect(page.locator("#report-download")).toBeVisible();
  expect(requests).toBe(1);
});
test("un diagnóstico fallido no se presenta como PDF generado", async ({
  page,
}) => {
  await page.route("**/api/v1/requests", (r) =>
    r.fulfill({ status: 202, json: progressCapability }),
  );
  await page.route("**/api/v1/diagnosis/start", (r) =>
    r.fulfill({ json: { status: "failed", report_url: null } }),
  );
  await prepareDiagnosticForm(page);
  await page.locator("#submit").click();
  await expect(page.locator("#diagnosis-title")).toHaveText(
    "No pudimos completar el diagnóstico",
  );
  await expect(page.locator("#report-download")).toBeHidden();
  await expect(page.locator("#diagnosis-progress")).not.toHaveClass(
    /is-waiting/,
  );
});

test("prototipo: seis ilustraciones, errores reales, precios y contenido accesible", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Tu WordPress funcionando.Tu negocio avanzando.",
  );
  await expect(page.locator(".pain-tags li")).toHaveCount(5);
  await expect(page.locator(".hero-visual figcaption")).toContainText(
    "No es un diagnóstico",
  );
  await expect(page.locator(".landing picture img")).toHaveCount(6);
  for (const img of await page.locator(".landing picture img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveJSProperty("complete", true);
    expect(
      await img.evaluate((el: HTMLImageElement) => el.naturalWidth),
    ).toBeGreaterThan(0);
    expect(new URL(await img.evaluate((el: HTMLImageElement) => el.currentSrc)).pathname).toMatch(
      /\.webp$/,
    );
  }
  await page.locator(".technical-details summary").click();
  await expect(page.locator(".technical-details")).toContainText(
    "Pantalla blanca de la muerte (WSOD)",
  );
  await expect(page.locator(".technical-details li")).toHaveCount(4);
  await page
    .getByRole("link", { name: "Consultar optimización", exact: true })
    .click();
  await expect(page.locator("#issue")).toHaveValue("lentitud");
  await expect(page.locator("#service-selection")).toContainText(
    "Optimización",
  );
  await page
    .getByRole("link", { name: "Consultar reparación", exact: true })
    .click();
  await expect(page.locator("#issue")).toHaveValue("errores_caidas");
  await page
    .getByRole("link", { name: "Consultar mantenimiento", exact: true })
    .click();
  await expect(page.locator("#service-selection")).toContainText(
    "Mantenimiento",
  );
  await page.locator("#preguntas summary").first().click();
  await expect(page.locator("#preguntas details").first()).toHaveAttribute(
    "open",
    "",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/prototype-desktop.png",
    fullPage: true,
  });
});
test("prototipo: menú móvil por teclado y tamaños sin desbordamientos", async ({
  page,
}) => {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 360, height: 800 });
  await page.locator(".mobile-nav summary").focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("navigation", { name: "Principal móvil" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Principal móvil" })
    .getByRole("link", { name: "Cómo funciona" })
    .click();
  await expect(page.locator(".mobile-nav")).not.toHaveAttribute("open");
  await expect(page).toHaveURL(/#proceso$/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/prototype-mobile.png",
    fullPage: true,
  });
});
test("prototipo: conserva el bloqueo y ofrece WhatsApp mientras está en preparación", async ({
  page,
}) => {
  await page.route("**/api/v1/public/config", (route) =>
    route.fulfill({ json: { enabled: false, site_key: null } }),
  );
  await page.goto("/");
  await expect(page.locator("#availability-note")).toBeVisible();
  await expect(page.locator("#continue")).toBeDisabled();
  await expect(page.locator(".request-copy a")).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\//,
  );
  await expect(page.locator("#submit")).toBeDisabled();
});

test("Hero: URL directa pasa a contacto, valida errores y conserva la URL al volver", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#hero-url").fill("localhost");
  await page.locator("#hero-url-continue").click();
  await expect(page.locator("#hero-url-error")).toContainText(
    "dominio público válido",
  );
  await page.locator("#hero-url").fill("https://micomercio.com/contacto");
  await page.locator("#hero-url-continue").click();
  await expect(page.locator("#step-two")).toBeVisible();
  await expect(page.locator("#request-summary")).toContainText(
    "https://micomercio.com/",
  );
  await expect(page.locator("#phone")).toBeFocused();
  await page.locator("#back").click();
  await expect(page.locator("#website")).toHaveValue(
    "https://micomercio.com/contacto",
  );
  await page.locator("#website").fill("https://otraempresa.com");
  await expect(page.locator("#hero-url")).toHaveValue(
    "https://otraempresa.com",
  );
});
test("correo: Hero lleva al email y permite solicitar sin teléfono", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "fixture-email", value: "1", url: "http://127.0.0.1:4173" },
  ]);
  await page.goto("/");
  await page.locator("#hero-url").fill("https://diagnostico-correo.com");
  await page.locator("#hero-url-continue").click();
  await expect(page.locator("#email")).toBeFocused();
  await expect(page.locator("#phone")).not.toHaveAttribute("required");
  await expect(page.locator("#phone")).toBeHidden();
  await page.locator("#email").fill("cliente@gmail.com");
  await page.locator("[name=privacy]").check();
  await expect(page.locator("#submit")).toBeEnabled();
  const sent = page.waitForRequest(
    (r) => r.url().endsWith("/api/v1/requests") && r.method() === "POST",
  );
  await page.locator("#submit").click();
  expect((await sent).postDataJSON().contact).toEqual({
    email: "cliente@gmail.com",
  });
  await expect(page.locator("#email-delivery-hint")).toContainText("Spam");
  await expect(page.locator("#success")).toBeVisible();
  await expect(page.locator("#success")).toContainText(
    "No se ha realizado un diagnóstico automático",
  );
  await expect(page.locator("#hero-url-continue")).toBeDisabled();
});
