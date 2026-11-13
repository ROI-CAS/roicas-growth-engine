export {};
const paymentForm = document.querySelector<HTMLFormElement>("#payment-form");
const status = document.querySelector<HTMLElement>("#payment-status")!;
const paymentToken = location.pathname.split("/").pop();
async function paymentApi(
  path: string,
  body: unknown,
): Promise<Record<string, string>> {
  const response = await fetch(`/api/v1/payments/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as Record<string, string>;
  if (!response.ok)
    throw new Error(
      data.message ||
        "No se pudo confirmar el pago. Contacta al equipo antes de intentarlo de nuevo.",
    );
  return data;
}
paymentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!paymentForm.reportValidity()) return;
  const button = paymentForm.querySelector<HTMLButtonElement>("button")!;
  button.disabled = true;
  try {
    const data = await paymentApi("checkout", {
      token: paymentToken,
      accepted: true,
    });
    const url = new URL(data.checkout_url!);
    if (url.origin !== "https://checkout.wompi.co" || url.pathname !== "/p/")
      throw new Error("Destino de pago no válido.");
    location.assign(url.href);
  } catch (error) {
    status.textContent =
      error instanceof Error ? error.message : "Pago no disponible.";
    button.disabled = false;
  }
});
const transaction = new URLSearchParams(location.search).get("id");
// Remove the provider's transaction parameter from browser history after reading it.
if (transaction) {
  history.replaceState(null, "", location.pathname);
  status.textContent = "Confirmando el pago directamente con Wompi…";
  paymentApi("status", { token: paymentToken, transaction_id: transaction })
    .then((data) => {
      if (data.status === "APPROVED") {
        status.textContent =
          "Pago confirmado por Wompi. El equipo coordinará la intervención contigo.";
        if (paymentForm) paymentForm.hidden = true;
      } else
        status.textContent = `Estado confirmado: ${data.status}. Si está pendiente, espera la confirmación antes de pagar de nuevo.`;
    })
    .catch((error) => {
      status.textContent =
        error instanceof Error
          ? error.message
          : "No pudimos verificar el pago.";
    });
}
