import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { toast } from "sonner";

export default function BookingPage() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  // Single unit booking: both cottages together
  const initialCheckin = params.get("checkin");
  const initialCheckout = params.get("checkout");

  const [step, setStep] = useState(1);
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (initialCheckin && initialCheckout) {
      return { from: new Date(initialCheckin), to: new Date(initialCheckout) };
    }
    return undefined;
  });
  const [guestCount, setGuestCount] = useState(6);
  const [form, setForm] = useState({ name: "", email: "", phone: "", specialRequests: "", gdprConsent: false });

  const propertyId = 1; // Single unit: both cottages
  const basePricePerNight = 300; // For both cottages
  const cleaningFee = 150;

  const { data: bookedDates } = trpc.availability.getBookedDates.useQuery({ propertyId });

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
  const total = nights * basePricePerNight + cleaningFee;

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

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cottage selector */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--cream-300)]">
              <h3 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-4">{t({ fr: "Choisissez votre cottage", en: "Choose your cottage", be: "Choose your cottage" })}</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { slug: "la-seve", name: "La Sève", desc: t({ fr: "4 personnes · 2 chambres", en: "4 guests · 2 bedrooms", be: "4 guests · 2 bedrooms" }), price: "€150" },
                  { slug: "le-bois", name: "Le Bois", desc: t({ fr: "6 personnes · 3 chambres", en: "6 guests · 3 bedrooms", be: "6 guests · 3 bedrooms" }), price: "€175" },
                ].map(({ slug, name, desc, price }) => (
                  <Link
                    key={slug}
                    href={`/booking?cottage=${slug}`}
                    className={`p-4 rounded-xl border-2 text-left transition-all border-[var(--cream-300)] hover:border-[var(--forest-300)]`}
                  >
                    <p className="font-semibold text-[var(--forest-900)]">{name}</p>
                    <p className="text-xs text-[var(--slate-500)] mt-1">{desc}</p>
                    <p className="text-sm font-bold text-[var(--forest-700)] mt-2">{t({ fr: "à partir de", en: "from", be: "from" })} {price}/nuit</p>
                  </Link>
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
                  <label className="label-eco">{t({ fr: "Nombre de personnes *", en: "Number of guests *", be: "Number of guests *" })}</label>
                  <select value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} className="input-eco">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label-eco">{t({ fr: "Demandes spéciales", en: "Special requests", be: "Special requests" })}</label>
                <textarea value={form.specialRequests} onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))} className="input-eco h-24 resize-none" placeholder={t({ fr: "Allergies, heure d'arrivée, etc.", en: "Allergies, arrival time, etc.", be: "Allergies, arrival time, etc." })} />
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
                disabled={!range?.from || !range?.to || nights < 2 || !form.name || !form.email || !form.gdprConsent || checkoutMutation.isPending}
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
                <p className="text-sm text-[var(--forest-300)] mt-1">{t({ fr: "/ nuit", en: "/ night", be: "/ night" })}</p>
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
                      <span className="text-[var(--slate-600)]">{nights} {t({ fr: "nuit(s)", en: "night(s)", be: "night(s)" })} × €{basePricePerNight}</span>
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
                    {nights < 2 && (
                      <p className="text-xs text-red-500">{t({ fr: "Séjour minimum 2 nuits.", en: "Minimum 2-night stay.", be: "Minimum 2-night stay." })}</p>
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
