import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";
import { LOCATION_IMAGES } from "../../../shared/location-images";

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", gdprConsent: false });

  const submitMutation = trpc.enquiries.submit.useMutation({
    onSuccess: () => {
      toast.success(t({ fr: "Message envoyé ! Nous vous répondrons sous 24h.", en: "Message sent! We'll reply within 24 hours.", be: "Message sent! We'll reply within 24 hours." }));
      setForm({ name: "", email: "", phone: "", message: "", gdprConsent: false });
    },
    onError: () => toast.error(t({ fr: "Une erreur est survenue.", en: "Something went wrong.", be: "Something went wrong." })),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({ name: form.name, email: form.email, phone: form.phone, message: form.message, gdprConsent: form.gdprConsent });
  };

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t({ fr: "Contact & Réserver", en: "Contact & Book", be: "Contact & Book" })}</p>
          <h1 className="text-headline text-white">{t({ fr: "Parlons de votre séjour", en: "Let's talk about your stay", be: "Let's talk about your stay" })}</h1>
        </div>
      </div>
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="divider-ochre mb-6" />
            <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Envoyez-nous un message", en: "Send us a message", be: "Send us a message" })}</h2>
            <p className="text-lead mb-8">{t({ fr: "Nous répondons sous 24h. Pour une réponse immédiate, utilisez WhatsApp.", en: "We reply within 24h. For an immediate response, use WhatsApp.", be: "We reply within 24h. For an immediate response, use WhatsApp." })}</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-eco">{t({ fr: "Nom *", en: "Name *", be: "Name *" })}</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-eco" />
                </div>
                <div>
                  <label className="label-eco">{t({ fr: "Email *", en: "Email *", be: "Email *" })}</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-eco" />
                </div>
              </div>
              <div>
                <label className="label-eco">{t({ fr: "Téléphone", en: "Phone", be: "Phone" })}</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-eco" />
              </div>
              <div>
                <label className="label-eco">{t({ fr: "Message", en: "Message", be: "Message" })}</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-eco h-32 resize-none" placeholder={t({ fr: "Vos questions, dates souhaitées...", en: "Your questions, preferred dates...", be: "Your questions, preferred dates..." })} />
              </div>
              <div className="flex items-start gap-3 p-4 bg-[var(--cream-50)] rounded-xl">
                <input type="checkbox" id="gdpr-contact" required checked={form.gdprConsent} onChange={e => setForm(f => ({ ...f, gdprConsent: e.target.checked }))} className="mt-0.5 w-4 h-4 accent-[var(--forest-700)]" />
                <label htmlFor="gdpr-contact" className="text-xs text-[var(--slate-600)]">
                  {t({ fr: "J'accepte que mes données soient utilisées pour répondre à ma demande. ", en: "I agree that my data will be used to respond to my request. ", be: "I agree that my data will be used to respond to my request. " })}
                  <Link href="/privacy" className="underline">{t({ fr: "Politique de confidentialité", en: "Privacy policy", be: "Privacy policy" })}</Link>.
                </label>
              </div>
              <button type="submit" disabled={submitMutation.isPending} className="btn-primary w-full py-4">
                {submitMutation.isPending ? t({ fr: "Envoi...", en: "Sending...", be: "Sending..." }) : t({ fr: "Envoyer le message", en: "Send message", be: "Send message" })}
              </button>
            </form>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t({ fr: "Contactez-nous directement", en: "Contact us directly", be: "Contact us directly" })}</h3>
              <div className="space-y-4">
                <a href="mailto:support@sevebois.be" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-[var(--cream-300)] hover:border-[var(--forest-300)] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-[var(--forest-50)] flex items-center justify-center text-[var(--forest-600)] group-hover:bg-[var(--forest-100)] transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--forest-900)]">support@sevebois.be</p>
                    <p className="text-xs text-[var(--slate-500)]">{t({ fr: "Réponse sous 24h", en: "Reply within 24h", be: "Reply within 24h" })}</p>
                  </div>
                </a>
                <a href="https://wa.me/32467808179" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-[var(--cream-300)] hover:border-[#25D366] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#25D366] group-hover:bg-[#dcfce7] transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--forest-900)]">+32 467 80 81 79</p>
                    <p className="text-xs text-[var(--slate-500)]">{t({ fr: "WhatsApp — réponse rapide", en: "WhatsApp — quick response", be: "WhatsApp — quick response" })}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-[var(--cream-300)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--forest-50)] flex items-center justify-center text-[var(--forest-600)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--forest-900)]">Laforêt, Wallonie, Belgique</p>
                    <p className="text-xs text-[var(--slate-500)]">{t({ fr: "Sur les rives de la Semois", en: "On the banks of the Semois", be: "On the banks of the Semois" })}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--forest-50)] rounded-2xl p-6">
              <h4 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-3">{t({ fr: "Prêt à réserver ?", en: "Ready to book?", be: "Ready to book?" })}</h4>
              <p className="text-sm text-[var(--slate-600)] mb-4">{t({ fr: "Réservez directement en ligne pour le meilleur tarif.", en: "Book directly online for the best rate.", be: "Book directly online for the best rate." })}</p>
              <Link href="/booking" className="btn-primary w-full text-center">{t({ fr: "Vérifier les disponibilités", en: "Check availability", be: "Check availability" })}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
