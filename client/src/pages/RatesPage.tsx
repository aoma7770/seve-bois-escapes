import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";

export default function RatesPage() {
  const { t } = useLanguage();
  const [selectedCottage, setSelectedCottage] = useState<1 | 2>(1);
  const [range, setRange] = useState<DateRange | undefined>();

  const { data: bookedDates } = trpc.availability.getBookedDates.useQuery({ propertyId: selectedCottage });

  const disabledDays = (bookedDates || []).flatMap(({ checkIn, checkOut }) => {
    const days: Date[] = [];
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  });

  const today = new Date();
  disabledDays.push({ before: today } as any);

  const nights = range?.from && range?.to
    ? Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const pricePerNight = selectedCottage === 1 ? 150 : 175;
  const cleaningFee = selectedCottage === 1 ? 75 : 90;
  const total = nights * pricePerNight + cleaningFee;

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t({ fr: "Tarifs & Disponibilités", en: "Rates & Availability", be: "Rates & Availability" })}</p>
          <h1 className="text-headline text-white">{t({ fr: "Vérifiez les disponibilités", en: "Check availability", be: "Check availability" })}</h1>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Calendar */}
          <div className="lg:col-span-2">
            {/* Cottage selector */}
            <div className="flex gap-3 mb-8">
              {[
                { id: 1, name: "La Sève", price: "€797" },
                { id: 2, name: "Le Bois", price: "€797" },
              ].map(({ id, name, price }) => (
                <button
                  key={id}
                  onClick={() => { setSelectedCottage(id as 1 | 2); setRange(undefined); }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                    selectedCottage === id
                      ? "border-[var(--forest-700)] bg-[var(--forest-700)] text-white"
                      : "border-[var(--cream-300)] bg-white text-[var(--forest-800)] hover:border-[var(--forest-400)]"
                  }`}
                >
                  {name} <span className="opacity-70">{t({ fr: "à partir de", en: "from", be: "from" })} {price}/nuit</span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[var(--cream-300)] shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-4">
                {t({ fr: "Sélectionnez vos dates", en: "Select your dates", be: "Select your dates" })}
              </h3>
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                disabled={disabledDays}
                numberOfMonths={2}
                fromDate={today}
                styles={{
                  root: { fontFamily: "Lato, sans-serif" },
                }}
              />
            </div>

            {/* Pricing table */}
            <div className="mt-8 bg-white rounded-2xl p-8 border border-[var(--cream-300)]">
              <h3 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-6">{t({ fr: "Grille tarifaire", en: "Pricing", be: "Pricing" })}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--cream-200)]">
                      <th className="text-left py-3 text-[var(--slate-600)] font-semibold">{t({ fr: "Cottage", en: "Cottage", be: "Cottage" })}</th>
                      <th className="text-right py-3 text-[var(--slate-600)] font-semibold">{t({ fr: "Nuit semaine", en: "Weeknight", be: "Weeknight" })}</th>
                      <th className="text-right py-3 text-[var(--slate-600)] font-semibold">{t({ fr: "Nuit week-end", en: "Weekend night", be: "Weekend night" })}</th>
                      <th className="text-right py-3 text-[var(--slate-600)] font-semibold">{t({ fr: "Semaine", en: "Week", be: "Week" })}</th>
                      <th className="text-right py-3 text-[var(--slate-600)] font-semibold">{t({ fr: "Ménage", en: "Cleaning", be: "Cleaning" })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "La Sève", weeknight: "€797", weekend: "€797", week: "€797", cleaning: "€797" },
                      { name: "Le Bois", weeknight: "€797", weekend: "€797", week: "€797 100", cleaning: "€797" },
                    ].map((row) => (
                      <tr key={row.name} className="border-b border-[var(--cream-100)] hover:bg-[var(--cream-50)]">
                        <td className="py-4 font-semibold text-[var(--forest-900)]">{row.name}</td>
                        <td className="py-4 text-right text-[var(--forest-700)]">{row.weeknight}</td>
                        <td className="py-4 text-right text-[var(--forest-700)]">{row.weekend}</td>
                        <td className="py-4 text-right text-[var(--forest-700)]">{row.week}</td>
                        <td className="py-4 text-right text-[var(--slate-500)]">{row.cleaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[var(--slate-400)] mt-4">{t({ fr: "Séjour minimum 2 nuits. Tarifs indicatifs, susceptibles de varier selon les périodes.", en: "Minimum 2-night stay. Indicative rates, subject to variation by season.", be: "Minimum 2-night stay. Indicative rates, subject to variation by season." })}</p>
            </div>
          </div>

          {/* Booking summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-[var(--cream-300)] overflow-hidden">
              <div className="bg-[var(--forest-700)] p-6 text-white">
                <p className="text-sm text-[var(--forest-300)] mb-1">
                  {selectedCottage === 1 ? "La Sève" : "Le Bois"}
                </p>
                <div className="text-4xl font-serif font-bold">€{pricePerNight}</div>
                <p className="text-sm text-[var(--forest-300)] mt-1">{t({ fr: "/ nuit", en: "/ night", be: "/ night" })}</p>
              </div>
              <div className="p-6 space-y-4">
                {range?.from && range?.to ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">{t({ fr: "Arrivée", en: "Check-in", be: "Check-in" })}</span>
                      <span className="font-semibold">{range.from.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">{t({ fr: "Départ", en: "Check-out", be: "Check-out" })}</span>
                      <span className="font-semibold">{range.to.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">{nights} {t({ fr: "nuit(s)", en: "night(s)", be: "night(s)" })}</span>
                      <span>€{nights * pricePerNight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">{t({ fr: "Frais de ménage", en: "Cleaning fee", be: "Cleaning fee" })}</span>
                      <span>€{cleaningFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[var(--forest-900)] border-t border-[var(--cream-200)] pt-3">
                      <span>Total</span>
                      <span>€{total}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--slate-500)] text-center py-4">
                    {t({ fr: "Sélectionnez vos dates pour voir le total.", en: "Select your dates to see the total.", be: "Select your dates to see the total." })}
                  </p>
                )}

                <Link
                  href={`/booking?cottage=${selectedCottage === 1 ? "la-seve" : "le-bois"}${range?.from ? `&checkin=${range.from.toISOString().split("T")[0]}` : ""}${range?.to ? `&checkout=${range.to.toISOString().split("T")[0]}` : ""}`}
                  className="btn-primary w-full text-center"
                >
                  {t({ fr: "Réserver maintenant", en: "Book now", be: "Book now" })}
                </Link>
                <p className="text-xs text-center text-[var(--slate-400)]">
                  🔒 {t({ fr: "Paiement sécurisé via Stripe", en: "Secure payment via Stripe", be: "Secure payment via Stripe" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
