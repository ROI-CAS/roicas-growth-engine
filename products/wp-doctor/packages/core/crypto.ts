const encoder = new TextEncoder();
export function base64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}
export function unbase64(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}
export async function hmac(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64(
    new Uint8Array(
      await crypto.subtle.sign("HMAC", key, encoder.encode(value)),
    ),
  );
}
export async function encrypt(
  secret: string,
  value: string,
  scope: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    unbase64(secret),
    "AES-GCM",
    false,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const result = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode(scope) },
    key,
    encoder.encode(value),
  );
  return `${base64(iv)}.${base64(new Uint8Array(result))}`;
}
export async function decrypt(
  secret: string,
  value: string,
  scope: string,
): Promise<string> {
  const [iv, cipher] = value.split(".");
  if (!iv || !cipher) throw new Error("Invalid encrypted value");
  const key = await crypto.subtle.importKey(
    "raw",
    unbase64(secret),
    "AES-GCM",
    false,
    ["decrypt"],
  );
  return new TextDecoder().decode(
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: unbase64(iv),
        additionalData: encoder.encode(scope),
      },
      key,
      unbase64(cipher),
    ),
  );
}
