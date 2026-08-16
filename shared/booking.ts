export type BookingSelection = "la-seve" | "le-bois" | "both";

export const BOOKING_PRICING = {
  cottageNightlyBase: 150,
  extraGuestNightly: 40,
  minimumGuestsForBoth: 4,
  maxGuestsPerCottage: 6,
  maxGuestsForBoth: 12,
  minimumStayNights: 2,
} as const;

export function cottageCount(selection: BookingSelection): number {
  return selection === "both" ? 2 : 1;
}

export function minimumGuestsForSelection(selection: BookingSelection): number {
  return selection === "both" ? BOOKING_PRICING.minimumGuestsForBoth : 1;
}

export function maximumGuestsForSelection(selection: BookingSelection): number {
  return selection === "both"
    ? BOOKING_PRICING.maxGuestsForBoth
    : BOOKING_PRICING.maxGuestsPerCottage;
}

export type BookingExtraFee = { feeType: "fixed" | "percentage"; amount: number };

export type BookingRateConfig = {
  cottageNightlyBase?: number;
  extraGuestNightly?: number;
  extraFees?: BookingExtraFee[];
};

export function nightlyRate(selection: BookingSelection, guests: number, config: BookingRateConfig = {}): number {
  const cottageNightlyBase = config.cottageNightlyBase ?? BOOKING_PRICING.cottageNightlyBase;
  const extraGuestNightly = config.extraGuestNightly ?? BOOKING_PRICING.extraGuestNightly;
  const base = cottageCount(selection) * cottageNightlyBase;
  const extraGuests = Math.max(0, guests - 1);
  return base + extraGuests * extraGuestNightly;
}

export function bookingTotal(selection: BookingSelection, guests: number, nights: number, config: BookingRateConfig = {}): number {
  const subtotal = nightlyRate(selection, guests, config) * nights;
  const configuredFees = (config.extraFees ?? []).reduce((total, fee) => total + (fee.feeType === "percentage" ? subtotal * fee.amount / 100 : fee.amount), 0);
  return subtotal + configuredFees;
}

export const BOOKING_SELECTION_LABELS: Record<BookingSelection, { fr: string; en: string; be: string }> = {
  "la-seve": { fr: "La Sève", en: "La Sève", be: "La Sève" },
  "le-bois": { fr: "Le Bois", en: "Le Bois", be: "Le Bois" },
  both: { fr: "Les deux cottages", en: "Both cottages", be: "Beide cottages" },
};
