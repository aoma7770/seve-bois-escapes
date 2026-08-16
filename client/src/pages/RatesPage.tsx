import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import {
  BOOKING_PRICING,
  BookingSelection,
  bookingTotal,
  maximumGuestsForSelection,
  minimumGuestsForSelection,
  nightlyRate,
} from "../../../shared/booking";

export default function RatesPage() {
  const { t } = useLanguage();
  const [selection, setSelection] = useState<BookingSelection>("la-seve");
  const [range, setRange] = useState<DateRange | undefined>();
  const [guestCount, setGuestCount] = useState(1);
  const propertyId = selection === "both" ? 1 : selection === "la-seve" ? 2 : 3;
  const pricingSlug = selection === "both" ? "seve-bois-escapes" : selection;
  const { data: selectedProperty } = trpc.cottages.bySlug.useQuery({ slug: pricingSlug });
  const pricingCheckIn = range?.from?.toISOString().slice(0, 10);
  const pricingCheckOut = range?.to?.toISOString().slice(0, 10);
  const { data: selectedPricing } = trpc.cottages.pricing.useQuery({ slug: pricingSlug, checkIn: pricingCheckIn, checkOut: pricingCheckOut }, { enabled: Boolean(pricingCheckIn && pricingCheckOut) });
  const rateConfig = {
    cottageNightlyBase: Number(selectedPricing?.nightlyRate ?? selectedProperty?.basePriceWeeknight ?? BOOKING_PRICING.cottageNightlyBase),
    extraGuestNightly: Number(selectedPricing?.extraGuestRate ?? selectedProperty?.extraGuestRate ?? BOOKING_PRICING.extraGuestNightly),
    extraFees: selectedPricing?.extraFees ?? [],
  };
  const { data: bookedDates } = trpc.availability.getBookedDates.useQuery({ propertyId, bookingSelection: selection });

  const disabledDays = (bookedDates || []).flatMap(({ checkIn, checkOut }) => {
    const days: Date[] = [];
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) days.push(new Date(d));
    return days;
  });
  const today = new Date();
  disabledDays.push({ before: today } as any);

  const nights = range?.from && range?.to
    ? Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const nightly = nightlyRate(selection, guestCount, rateConfig);
  const total = bookingTotal(selection, guestCount, nights, rateConfig);
  const optionLabel = selection === "both"
    ? t({ fr: "Les deux cottages", en: "Both cottages", be: "Beide cottages" })
    : selection === "la-seve" ? "La Sève" : "Le Bois";

  const selectOption = (next: BookingSelection) => {
    setSelection(next);
    setGuestCount(next === "both" ? 4 : 1);
    setRange(undefined);
  };

  const bookingHref = `/booking?cottage=${selection}${range?.from ? `&checkin=${range.from.toISOString().split("T")[0]}` : ""}${range?.to ? `&checkout=${range.to.toISOString().split("T")[0]}` : ""}`;

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t({ fr: "Tarifs & disponibilités", en: "Rates & availability", be: "Tarieven & beschikbaarheid" })}</p>
          <h1 className="text-headline text-white">{t({ fr: "Choisissez votre séjour", en: "Choose your stay", be: "Kies uw verblijf" })}</h1>
          <p className="text-white/75 mt-3 max-w-2xl">{t({ fr: "Réservez La Sève, Le Bois, ou les deux cottages. Le tarif par nuit est calculé selon votre choix et le nombre de voyageurs.", en: "Book La Sève, Le Bois, or both cottages. The nightly rate is calculated from your choice and number of guests.", be: "Boek La Sève, Le Bois of beide cottages. Het nachttarief wordt berekend op basis van uw keuze en het aantal gasten." })}</p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {([
                { value: "la-seve" as const, title: "La Sève", description: t({ fr: "1 à 6 personnes", en: "1–6 guests", be: "1–6 gasten" }), from: 150 },
                { value: "le-bois" as const, title: "Le Bois", description: t({ fr: "1 à 6 personnes", en: "1–6 guests", be: "1–6 gasten" }), from: 150 },
                { value: "both" as const, title: t({ fr: "Les deux cottages", en: "Both cottages", be: "Beide cottages" }), description: t({ fr: "4 à 12 personnes", en: "4–12 guests", be: "4–12 gasten" }), from: 300 },
              ]).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOption(option.value)}
                  className={`text-left rounded-xl border-2 p-4 transition-colors ${selection === option.value ? "border-[var(--forest-700)] bg-[var(--forest-50)]" : "border-[var(--cream-300)] bg-white hover:border-[var(--forest-300)]"}`}
                >
                  <span className="block font-semibold text-[var(--forest-900)]">{option.title}</span>
                  <span className="block text-xs text-[var(--slate-600)] mt-1">{option.description}</span>
                  <span className="block text-xs font-semibold text-[var(--ochre-700)] mt-3">{t({ fr: "À partir de", en: "From", be: "Vanaf" })} €{option.from} / {t({ fr: "nuit", en: "night", be: "nacht" })}</span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[var(--cream-300)] shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-4">{t({ fr: "Sélectionnez vos dates", en: "Select your dates", be: "Selecteer uw data" })}</h3>
              <DayPicker mode="range" selected={range} onSelect={setRange} disabled={disabledDays} numberOfMonths={2} fromDate={today} />
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-eco">{t({ fr: "Nombre de personnes", en: "Number of guests", be: "Aantal gasten" })}</label>
                  <select value={guestCount} onChange={(event) => setGuestCount(Number(event.target.value))} className="input-eco">
                    {Array.from({ length: maximumGuestsForSelection(selection) - minimumGuestsForSelection(selection) + 1 }, (_, index) => index + minimumGuestsForSelection(selection)).map((guest) => <option key={guest} value={guest}>{guest}</option>)}
                  </select>
                </div>
                <div className="rounded-xl bg-[var(--forest-50)] p-4 text-sm text-[var(--forest-800)]">
                  {t({ fr: "Tarif calculé", en: "Rate calculation", be: "Tariefberekening" })}: €{BOOKING_PRICING.cottageNightlyBase} {t({ fr: "par cottage", en: "per cottage", be: "per cottage" })} + €{BOOKING_PRICING.extraGuestNightly} {t({ fr: "par personne supplémentaire et par nuit", en: "per additional guest per night", be: "per extra gast per nacht" })}.
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl p-8 border border-[var(--cream-300)]">
              <h3 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-6">{t({ fr: "Comment le tarif est calculé", en: "How the rate is calculated", be: "Hoe het tarief wordt berekend" })}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="rounded-xl bg-[var(--cream-50)] p-4"><p className="font-semibold text-[var(--forest-900)]">{t({ fr: "Un cottage", en: "One cottage", be: "Eén cottage" })}</p><p className="text-[var(--slate-600)] mt-1">{t({ fr: "À partir de €150 / nuit pour 1 personne.", en: "From €150 / night for 1 guest.", be: "Vanaf €150 / nacht voor 1 gast." })}</p></div>
                <div className="rounded-xl bg-[var(--cream-50)] p-4"><p className="font-semibold text-[var(--forest-900)]">{t({ fr: "Personnes supplémentaires", en: "Additional guests", be: "Extra gasten" })}</p><p className="text-[var(--slate-600)] mt-1">{t({ fr: "+ €40 / nuit par personne au-delà de la première.", en: "+ €40 / night per guest after the first.", be: "+ €40 / nacht per gast na de eerste." })}</p></div>
                <div className="rounded-xl bg-[var(--cream-50)] p-4"><p className="font-semibold text-[var(--forest-900)]">{t({ fr: "Les deux cottages", en: "Both cottages", be: "Beide cottages" })}</p><p className="text-[var(--slate-600)] mt-1">{t({ fr: "À partir de €300 / nuit pour un groupe de 4 à 12 personnes.", en: "From €300 / night for a group of 4–12 guests.", be: "Vanaf €300 / nacht voor een groep van 4–12 gasten." })}</p></div>
              </div>
              <p className="text-xs text-[var(--slate-400)] mt-5">{t({ fr: "Séjour minimum de 2 nuits. Les tarifs peuvent être ajustés par l'hébergeur selon la période.", en: "Minimum stay of 2 nights. Rates may be adjusted by the host depending on the period.", be: "Minimum verblijf van 2 nachten. Tarieven kunnen per periode door de verhuurder worden aangepast." })}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-[var(--cream-300)] overflow-hidden">
              <div className="bg-[var(--forest-700)] p-6 text-white">
                <p className="text-sm text-[var(--forest-300)] mb-1">{optionLabel}</p>
                <div className="text-4xl font-serif font-bold">€{nightly}</div>
                <p className="text-sm text-[var(--forest-300)] mt-1">{t({ fr: "/ nuit pour votre sélection", en: "/ night for your selection", be: "/ nacht voor uw selectie" })}</p>
              </div>
              <div className="p-6 space-y-4">
                {range?.from && range?.to ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-[var(--slate-600)]">{t({ fr: "Arrivée", en: "Check-in", be: "Check-in" })}</span><span className="font-semibold">{range.from.toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--slate-600)]">{t({ fr: "Départ", en: "Check-out", be: "Check-out" })}</span><span className="font-semibold">{range.to.toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--slate-600)]">{nights} {t({ fr: "nuit(s)", en: "night(s)", be: "nacht(en)" })}</span><span>€{total}</span></div>
                    <div className="flex justify-between font-bold text-[var(--forest-900)] border-t border-[var(--cream-200)] pt-3"><span>{t({ fr: "Total", en: "Total", be: "Totaal" })}</span><span>€{total}</span></div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--slate-500)] text-center py-4">{t({ fr: "Sélectionnez vos dates pour voir le total.", en: "Select your dates to see the total.", be: "Selecteer uw data om het totaal te zien." })}</p>
                )}
                <Link href={bookingHref} className="btn-primary w-full text-center">{t({ fr: "Réserver maintenant", en: "Book now", be: "Boek nu" })}</Link>
                <p className="text-xs text-center text-[var(--slate-400)]">🔒 {t({ fr: "Paiement sécurisé via Stripe", en: "Secure payment via Stripe", be: "Veilige betaling via Stripe" })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
