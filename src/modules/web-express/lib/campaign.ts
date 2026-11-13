export const BLACK_NOVEMBER = {
  id: "black_november_2026",
  name: "Black November",
  startsAt: "2026-11-02T00:00:00-05:00",
  endsAt: "2026-11-28T00:00:00-05:00",
  // Weekly countdown requested by the business; independent of booking events.
  availability: {
    weeklySlots: 12,
    dailyDecrease: 2,
  },
  // One Page
  totalCOP: 399000,
  depositCOP: 199500,
  // Web Empresarial
  businessCOP: 550000,
  endsLabel: "27 de noviembre de 2026, 11:59 p. m., hora Colombia",
} as const;

export function getCampaignStatus(now: number): "upcoming" | "active" | "expired" {
  if (now < Date.parse(BLACK_NOVEMBER.startsAt)) return "upcoming";
  return now < Date.parse(BLACK_NOVEMBER.endsAt) ? "active" : "expired";
}
export function formatCOP(value: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value)}`;
}
export function verifiedCampaignCheckout(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      ["checkout.wompi.co", "checkout.wompi.com"].includes(url.hostname) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/** Scheduled weekly counter, shared by the hero and pricing section. */
export function getCampaignAvailability(now: number): number | null {
  if (!Number.isFinite(now) || getCampaignStatus(now) !== "active") return null;
  // America/Bogota is UTC-5 during the November 2026 campaign.
  // Read the shifted date with UTC methods so the visitor's timezone cannot change the count.
  const colombiaDate = new Date(now - 5 * 3600000);
  const daysSinceMonday = (colombiaDate.getUTCDay() + 6) % 7;
  const { weeklySlots, dailyDecrease } = BLACK_NOVEMBER.availability;
  return Math.max(0, weeklySlots - daysSinceMonday * dailyDecrease);
}
