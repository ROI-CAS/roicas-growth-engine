export async function productRequest<T>(action: string, data?: unknown): Promise<T> {
  const response = await fetch(`/api/web-express?action=${encodeURIComponent(action)}`, {
    method: data === undefined ? "GET" : "POST",
    headers: data === undefined ? undefined : { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  if (!response.ok) throw new Error("No pudimos completar la solicitud. Inténtalo de nuevo.");
  return response.json() as Promise<T>;
}
