export async function sendEmailSubmission(payload: unknown): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch("/api/send-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), signal: controller.signal,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true || typeof result?.id !== "string" || !result.id) {
      throw new Error(result?.error || "No pudimos confirmar el envío. Inténtalo de nuevo o escríbenos por WhatsApp al +57 311 456 5403.");
    }
  } finally {
    clearTimeout(timeout);
  }
}
