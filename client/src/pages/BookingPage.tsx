import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { toast } from "sonner";
import {
  BOOKING_PRICING,
  BookingSelection,
  bookingTotal,
  maximumGuestsForSelection,
  minimumGuestsForSelection,
  nightlyRate,
} from "../../../shared/booking";

export default function BookingPage() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const initialCheckin = params.get("checkin");
  const initialCheckout = params.get("checkout");
  const initialCottage = params.get("cottage");
  const initialSelection: BookingSelection = initialCottage === "la-seve" || initialCottage === "le-bois" || initialCottage === "both"
    ? initialCottage
    : "both";

  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<BookingSelection>(initialSelection);
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (initialCheckin && initialCheckout) {
      return { from: new Date(initialCheckin), to: new Date(initialCheckout) };
    }
    return undefined;
  });
  const [guestCount, setGuestCount] = useState(initialSelection === "both" ? 4 : 1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", specialRequests: "", pets: "none", gdprConsent: false });

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
  const cleaningFee = Number(selectedPricing?.cleaningFee ?? selectedProperty?.cleaningFee ?? 0);
  const basePricePerNight = nightlyRate(selection, guestCount, rateConfig);

  const { data: bookedDates } = trpc.availability.getBookedDates.useQuery({ propertyId, bookingSelection: selection });

  const disabledDays = (bookedDates || []).flatMap(({ checkIn, checkOut }) => {
    const days: Date[] = [];
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  });
  disabledDays.push({ before: new Date() } as any);

  const nights = range?.from && range?.to
    ? Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const total = bookingTotal(selection, guestCount, nights, rateConfig) + cleaningFee;

  const checkoutMutation = trpc.bookings.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
        toast.success(t({ fr: "Redirection vers le paiement...", en: "Redirecting to payment...", be: "Redirecting to payment..." }));
      } else {
        toast.success(t({ fr: "Réservation créée ! Nous vous contacterons sous peu.", en: "Booking created! We will contact you shortly.", be: "Booking created! We will contact you shortly." }));
      }
    },
    onError: (err) => {
      toast.error(err.message || t({ fr: "Une erreur est survenue.", en: "Something went wrong.", be: "Something went wrong." }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!range?.from || !range?.to || !form.gdprConsent) return;
    checkoutMutation.mutate({
      propertyId,
      bookingSelection: selection,
      guestName: form.name,
      guestEmail: form.email,
      guestPhone: form.phone,
      guestCount,
      checkIn: range.from.toISOString().split("T")[0],
      checkOut: range.to.toISOString().split("T")[0],
      specialRequests: form.specialRequests,
      gdprConsent: form.gdprConsent,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t({ fr: "Réservation directe", en: "Direct booking", be: "Direct booking" })}</p>
          <h1 className="text-headline text-white">{t({ fr: "Réservez votre séjour", en: "Book your stay", be: "Book your stay" })}</h1>
          <p className="text-[var(--forest-300)] mt-2">{t({ fr: "Meilleur tarif garanti · Paiement sécurisé · Hôte humain", en: "Best rate guaranteed · Secure payment · Human host", be: "Best rate guaranteed · Secure payment · Human host" })}</p>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-[var(--ochre-50)] border-b border-[var(--ochre-200)] py-4">
        <div className="container">
          <p className="text-sm font-semibold text-[var(--ochre-900)] text-center">
            {t({ fr: "🎉 Tarifs de lancement spéciaux — Nous mettons les dernières touches à nos magnifiques nouveaux cottages. Profitez de notre tarif d'introduction et soyez parmi nos premiers clients !", en: "🎉 Special Introductory Rates — We are putting the finishing touches on our beautiful new cottages. Enjoy our launch pricing and be among our first guests!", be: "🎉 Special Introductory Rates — We are putting the finishing touches on our beautiful new cottages. Enjoy our launch pricing and be among our first guests!" })}
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking scope */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--cream-300)]">
              <h3 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-2">{t({ fr: "Que souhaitez-vous réserver ?", en: "What would you like to book?", be: "Wat wilt u boeken?" })}</h3>
              <p className="text-sm text-[var(--slate-600)] mb-5">{t({ fr: "Choisissez un cottage pour 1 à 6 personnes, ou les deux pour un groupe de 4 à 12 personnes.", en: "Choose one cottage for 1–6 guests, or both for a group of 4–12 guests.", be: "Kies één cottage voor 1–6 gasten, of beide voor een groep van 4–12 gasten." })}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {([
                  { value: "la-seve" as const, title: "La Sève", detail: t({ fr: "1 cottage · jusqu'à 6 personnes", en: "1 cottage · up to 6 guests", be: "1 cottage · tot 6 gasten" }) },
                  { value: "le-bois" as const, title: "Le Bois", detail: t({ fr: "1 cottage · jusqu'à 6 personnes", en: "1 cottage · up to 6 guests", be: "1 cottage · tot 6 gasten" }) },
                  { value: "both" as const, title: t({ fr: "Les deux cottages", en: "Both cottages", be: "Beide cottages" }), detail: t({ fr: "2 cottages · 4 à 12 personnes", en: "2 cottages · 4–12 guests", be: "2 cottages · 4–12 gasten" }) },
                ]).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelection(option.value);
                      setGuestCount(option.value === "both" ? 4 : 1);
                      setRange(undefined);
                    }}
                    className={`text-left rounded-xl border-2 p-4 transition-colors ${selection === option.value ? "border-[var(--forest-700)] bg-[var(--forest-50)]" : "border-[var(--cream-300)] hover:border-[var(--forest-300)]"}`}
                  >
                    <span className="block font-semibold text-[var(--forest-900)]">{option.title}</span>
                    <span className="block text-xs text-[var(--slate-600)] mt-1">{option.detail}</span>
                    <span className="block text-xs font-semibold text-[var(--ochre-700)] mt-3">{t({ fr: "À partir de", en: "From", be: "Vanaf" })} €{option.value === "both" ? 300 : 150} / {t({ fr: "nuit", en: "night", be: "nacht" })}</span>
                  </button>
                ))}
              </div>
            </div>


            {/* Date picker */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--cream-300)]">
              <h3 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-4">{t({ fr: "Sélectionnez vos dates", en: "Select your dates", be: "Select your dates" })}</h3>
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                disabled={disabledDays}
                numberOfMonths={2}
                fromDate={new Date()}
              />
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-xs text-[var(--slate-500)]">
                  <div className="w-3 h-3 rounded-full bg-[var(--forest-700)]" />
                  {t({ fr: "Sélectionné", en: "Selected", be: "Selected" })}
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--slate-500)]">
                  <div className="w-3 h-3 rounded-full bg-red-200" />
                  {t({ fr: "Indisponible", en: "Unavailable", be: "Unavailable" })}
                </div>
              </div>
            </div>

            {/* Guest details */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-[var(--cream-300)] space-y-5">
              <h3 className="font-serif text-lg font-semibold text-[var(--forest-950)]">{t({ fr: "Vos coordonnées", en: "Your details", be: "Your details" })}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-eco">{t({ fr: "Nom complet *", en: "Full name *", be: "Full name *" })}</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-eco" placeholder={t({ fr: "Jean Dupont", en: "Jane Smith", be: "Jane Smith" })} />
                </div>
                <div>
                  <label className="label-eco">{t({ fr: "Email *", en: "Email *", be: "Email *" })}</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-eco" placeholder="jean@exemple.com" />
                </div>
                <div>
                  <label className="label-eco">{t({ fr: "Téléphone", en: "Phone", be: "Phone" })}</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-eco" placeholder="+32 4XX XX XX XX" />
                </div>
                <div>
                  <label className="label-eco">{t({ fr: "Nombre de personnes *", en: "Number of guests *", be: "Aantal gasten *" })}</label>
                  <select value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} className="input-eco">
                    {Array.from({ length: maximumGuestsForSelection(selection) - minimumGuestsForSelection(selection) + 1 }, (_, index) => index + minimumGuestsForSelection(selection)).map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  {selection === "both" && <p className="text-xs text-[var(--slate-500)] mt-2">{t({ fr: "Les deux cottages sont disponibles pour les groupes de 4 à 12 personnes.", en: "Both cottages are available for groups of 4–12 guests.", be: "Beide cottages zijn beschikbaar voor groepen van 4–12 gasten." })}</p>}
                </div>
              </div>

              <div>
                <label className="label-eco">{t({ fr: "Animaux domestiques", en: "Pets", be: "Pets" })}</label>
                <select value={form.pets || "none"} onChange={e => setForm(f => ({ ...f, pets: e.target.value }))} className="input-eco">
                  <option value="none">{t({ fr: "Aucun", en: "None", be: "None" })}</option>
                  <option value="1-small">{t({ fr: "1 petit animal", en: "1 small pet", be: "1 small pet" })}</option>
                  <option value="2-small">{t({ fr: "2 petits animaux", en: "2 small pets", be: "2 small pets" })}</option>
                  <option value="1-large">{t({ fr: "1 grand animal", en: "1 large pet", be: "1 large pet" })}</option>
                </select>
              </div>

              <div>
                <label className="label-eco">{t({ fr: "Demandes spéciales", en: "Special requests", be: "Special requests" })}</label>
                <textarea value={form.specialRequests} onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))} className="input-eco h-24 resize-none" placeholder={t({ fr: "Allergies, heure d'arrivée, etc.", en: "Allergies, arrival time, etc.", be: "Allergies, arrival time, etc." })} />
              </div>
              
              {/* Parking Note */}
              <div className="bg-[var(--cream-50)] rounded-lg p-4 border border-[var(--cream-200)]">
                <p className="text-xs text-[var(--slate-600)]">
                  {t({ fr: "📍 Notre zone de stationnement a une surface en pierre naturelle et est légèrement surélevée. Nous recommandons les véhicules avec un bon dégagement au sol.", en: "📍 Our parking area has a natural stone surface and is slightly elevated. We recommend vehicles with reasonable ground clearance.", be: "📍 Our parking area has a natural stone surface and is slightly elevated. We recommend vehicles with reasonable ground clearance." })}
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[var(--cream-50)] rounded-xl">
                <input
                  type="checkbox"
                  id="gdpr"
                  required
                  checked={form.gdprConsent}
                  onChange={e => setForm(f => ({ ...f, gdprConsent: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-[var(--forest-700)]"
                />
                <label htmlFor="gdpr" className="text-xs text-[var(--slate-600)] leading-relaxed">
                  {t({ fr: "J'accepte que mes données soient utilisées pour traiter ma réservation, conformément à la ", en: "I agree that my data will be used to process my booking, in accordance with the ", be: "I agree that my data will be used to process my booking, in accordance with the " })}
                  <Link href="/privacy" className="underline text-[var(--forest-600)]">{t({ fr: "politique de confidentialité", en: "privacy policy", be: "privacy policy" })}</Link>.
                  {t({ fr: " Pas de spam, désabonnement possible à tout moment.", en: " No spam, unsubscribe at any time.", be: " No spam, unsubscribe at any time." })}
                </label>
              </div>

              <button
                type="submit"
                disabled={!range?.from || !range?.to || nights < BOOKING_PRICING.minimumStayNights || guestCount < minimumGuestsForSelection(selection) || !form.name || !form.email || !form.gdprConsent || checkoutMutation.isPending}
                className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutMutation.isPending
                  ? t({ fr: "Création de la réservation...", en: "Creating booking...", be: "Creating booking..." })
                  : t({ fr: "Procéder au paiement sécurisé", en: "Proceed to secure payment", be: "Proceed to secure payment" })}
              </button>
              <p className="text-xs text-center text-[var(--slate-400)]">
                🔒 {t({ fr: "Paiement sécurisé via Stripe. Vos données bancaires ne nous sont jamais transmises.", en: "Secure payment via Stripe. Your card details are never shared with us.", be: "Secure payment via Stripe. Your card details are never shared with us." })}
              </p>
            </form>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-[var(--cream-300)] overflow-hidden">
                  <div className="bg-[var(--forest-700)] p-6 text-white">
                <div className="text-4xl font-serif font-bold">€{basePricePerNight}</div>
                <p className="text-sm text-[var(--forest-300)] mt-1">{t({ fr: "/ nuit pour cette sélection", en: "/ night for this selection", be: "/ nacht voor deze selectie" })}</p>
              </div>
              <div className="p-6 space-y-3 text-sm">
                {range?.from && range?.to ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">{t({ fr: "Arrivée", en: "Check-in", be: "Check-in" })}</span>
                      <span className="font-semibold">{range.from.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">{t({ fr: "Départ", en: "Check-out", be: "Check-out" })}</span>
                      <span className="font-semibold">{range.to.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">{nights} {t({ fr: "nuit(s)", en: "night(s)", be: "nacht(en)" })} × €{basePricePerNight}</span>
                      <span>€{nights * basePricePerNight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">{t({ fr: "Frais de ménage", en: "Cleaning fee", be: "Cleaning fee" })}</span>
                      <span>€{cleaningFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[var(--forest-900)] border-t border-[var(--cream-200)] pt-3 text-base">
                      <span>Total</span>
                      <span>€{total}</span>
                    </div>
                    {nights < BOOKING_PRICING.minimumStayNights && (
                      <p className="text-xs text-red-500">{t({ fr: "Séjour minimum 2 nuits.", en: "Minimum 2-night stay.", be: "Minimum 2-night stay." })}</p>
                    )}
                    {guestCount < minimumGuestsForSelection(selection) && (
                      <p className="text-xs text-red-500">{t({ fr: "Les deux cottages nécessitent au moins 4 personnes.", en: "Both cottages require at least 4 guests.", be: "Beide cottages vereisen minstens 4 gasten." })}</p>
                    )}
                  </>
                ) : (
                  <p className="text-[var(--slate-500)] text-center py-4">{t({ fr: "Sélectionnez vos dates.", en: "Select your dates.", be: "Select your dates." })}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
