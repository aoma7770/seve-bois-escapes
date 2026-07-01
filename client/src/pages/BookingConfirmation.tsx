import { useLocation, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Calendar, Mail, Phone } from "lucide-react";

export default function BookingConfirmation() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const sessionId = params.get("session_id");

  const { data: booking } = trpc.bookings.getBySessionId.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  return (
    <div className="min-h-screen bg-[var(--cream-50)] flex items-center justify-center py-20" style={{ paddingTop: "6rem" }}>
      <div className="container max-w-2xl text-center">
        <div className="bg-white rounded-3xl p-12 shadow-lg border border-[var(--cream-300)]">
          <div className="w-20 h-20 rounded-full bg-[var(--forest-100)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[var(--forest-600)]" />
          </div>
          <div className="divider-ochre mx-auto mb-6" />
          <h1 className="text-headline text-[var(--forest-950)] mb-4">
            {t({ fr: "Réservation confirmée !", en: "Booking confirmed!", nl: "Booking confirmed!" })}
          </h1>
          <p className="text-lead mb-8">
            {t({ fr: "Merci pour votre réservation. Un email de confirmation vous a été envoyé. Nous avons hâte de vous accueillir !", en: "Thank you for your booking. A confirmation email has been sent to you. We look forward to welcoming you!", nl: "Thank you for your booking. A confirmation email has been sent to you. We look forward to welcoming you!" })}
          </p>

          {booking && (
            <div className="bg-[var(--forest-50)] rounded-2xl p-6 text-left mb-8 space-y-3">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-[var(--forest-600)]" />
                <div>
                  <p className="text-xs text-[var(--slate-500)]">{t({ fr: "Dates", en: "Dates", nl: "Dates" })}</p>
                  <p className="font-semibold text-[var(--forest-900)] text-sm">
                    {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[var(--forest-600)]" />
                <div>
                  <p className="text-xs text-[var(--slate-500)]">{t({ fr: "Email", en: "Email", nl: "Email" })}</p>
                  <p className="font-semibold text-[var(--forest-900)] text-sm">{booking.guestEmail}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-8">
            <p className="text-sm text-[var(--slate-600)]">
              {t({ fr: "Des questions ? Contactez-nous :", en: "Questions? Contact us:", nl: "Questions? Contact us:" })}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:support@sevebois.be" className="btn-outline text-sm">
                <Mail size={14} /> support@sevebois.be
              </a>
              <a href="https://wa.me/32467808179" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                <Phone size={14} /> WhatsApp
              </a>
            </div>
          </div>

          <Link href="/" className="text-sm text-[var(--forest-600)] underline hover:no-underline">
            {t({ fr: "Retour à l'accueil", en: "Back to homepage", nl: "Back to homepage" })}
          </Link>
        </div>
      </div>
    </div>
  );
}
