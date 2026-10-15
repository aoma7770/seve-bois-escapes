import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { LOCATION_IMAGES } from "../../../shared/location-images";
import { trackEvent } from "@/lib/analytics";

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", gdprConsent: false });

  const submitMutation = trpc.enquiries.submit.useMutation({
    onSuccess: () => {
      trackEvent("contact_request_success", { contact_method: "website_form" });
      toast.success(t({ fr: "Merci pour votre message ! Nous l’avons bien reçu et nous vous répondrons sous 24 heures. Au plaisir d’échanger avec vous !", en: "Thank you for reaching out! We’ve received your message and will reply within 24 hours. We look forward to helping you plan your escape.", nl: "Bedankt voor uw bericht! We hebben het goed ontvangen en antwoorden binnen 24 uur. We helpen u graag bij het plannen van uw verblijf." }));
      setForm({ name: "", email: "", phone: "", message: "", gdprConsent: false });
    },
    onError: (error) => {
      trackEvent("contact_request_error", { error_message: error.message.slice(0, 120) });
      toast.error(t({ fr: "Une erreur est survenue.", en: "Something went wrong.", nl: "Er is iets misgegaan." }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("contact_request_submitted", { contact_method: "website_form" });
    submitMutation.mutate({ name: form.name, email: form.email, phone: form.phone, message: form.message, gdprConsent: form.gdprConsent });
  };

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t({ fr: "Contact & Réserver", en: "Contact & Book", nl: "Contact & Boek" })}</p>
          <h1 className="text-headline text-white">{t({ fr: "Parlons de votre séjour", en: "Let's talk about your stay", nl: "Laten we het over uw verblijf hebben" })}</h1>
        </div>
      </div>
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="divider-ochre mb-6" />
            <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Envoyez-nous un message", en: "Send us a message", nl: "Stuur ons een bericht" })}</h2>
            <p className="text-lead mb-8">{t({ fr: "Nous répondons sous 24h. Pour une réponse immédiate, utilisez WhatsApp.", en: "We reply within 24h. For an immediate response, use WhatsApp.", nl: "Wij antwoorden binnen 24 uur. Voor direct antwoord gebruik je WhatsApp." })}</p>
            <form data-analytics-form="contact_request" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-eco">{t({ fr: "Nom *", en: "Name *", nl: "Naam *" })}</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-eco" />
                </div>
                <div>
                  <label className="label-eco">{t({ fr: "Email *", en: "Email *", nl: "E-mail *" })}</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-eco" />
                </div>
              </div>
              <div>
                <label className="label-eco">{t({ fr: "Téléphone", en: "Phone", nl: "Telefoon" })}</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-eco" />
              </div>
              <div>
                <label className="label-eco">{t({ fr: "Message", en: "Message", nl: "Bericht" })}</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-eco h-32 resize-none" placeholder={t({ fr: "Vos questions, dates souhaitées...", en: "Your questions, preferred dates...", nl: "Uw vragen, voorkeursdata..." })} />
              </div>
              <div className="flex items-start gap-3 p-4 bg-[var(--cream-50)] rounded-xl">
                <input type="checkbox" id="gdpr-contact" required checked={form.gdprConsent} onChange={e => setForm(f => ({ ...f, gdprConsent: e.target.checked }))} className="mt-0.5 w-4 h-4 accent-[var(--forest-700)]" />
                <label htmlFor="gdpr-contact" className="text-xs text-[var(--slate-600)]">
                  {t({ fr: "J'accepte que mes données soient utilisées pour répondre à ma demande. ", en: "I agree that my data will be used to respond to my request. ", nl: "Ik ga ermee akkoord dat mijn gegevens worden gebruikt om op mijn verzoek te reageren." })}
                  <Link href="/privacy" className="underline">{t({ fr: "Politique de confidentialité", en: "Privacy policy", nl: "Privacybeleid" })}</Link>.
                </label>
              </div>
              <button type="submit" disabled={submitMutation.isPending} className="btn-primary w-full py-4">
                {submitMutation.isPending ? t({ fr: "Envoi...", en: "Sending...", nl: "Verzenden..." }) : t({ fr: "Envoyer le message", en: "Send message", nl: "Bericht verzenden" })}
              </button>
            </form>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t({ fr: "Contactez-nous directement", en: "Contact us directly", nl: "Neem direct contact met ons op" })}</h3>
              <div className="space-y-4">
                <a href="mailto:support@sevebois.be" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-[var(--cream-300)] hover:border-[var(--forest-300)] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-[var(--forest-50)] flex items-center justify-center text-[var(--forest-600)] group-hover:bg-[var(--forest-100)] transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--forest-900)]">support@sevebois.be</p>
                    <p className="text-xs text-[var(--slate-500)]">{t({ fr: "Réponse sous 24h", en: "Reply within 24h", nl: "Antwoord binnen 24 uur" })}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-[var(--cream-300)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--forest-50)] flex items-center justify-center text-[var(--forest-600)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--forest-900)]">Laforêt, Wallonie, Belgique</p>
                    <p className="text-xs text-[var(--slate-500)]">{t({ fr: "Sur les rives de la Semois", en: "On the banks of the Semois", nl: "Aan de oevers van de Semois" })}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--forest-50)] rounded-2xl p-6">
              <h4 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-3">{t({ fr: "Prêt à réserver ?", en: "Ready to book?", nl: "Klaar om te boeken?" })}</h4>
              <p className="text-sm text-[var(--slate-600)] mb-4">{t({ fr: "Réservez directement en ligne pour le meilleur tarif.", en: "Book directly online for the best rate.", nl: "Boek direct online voor de beste prijs." })}</p>
              <Link href="/booking" className="btn-primary w-full text-center">{t({ fr: "Vérifier les disponibilités", en: "Check availability", nl: "Controleer beschikbaarheid" })}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
