import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", gdprConsent: false });

  const submitMutation = trpc.enquiries.submit.useMutation({
    onSuccess: () => {
      toast.success(t("Message envoyé ! Nous vous répondrons sous 24h.", "Message sent! We'll reply within 24 hours."));
      setForm({ name: "", email: "", phone: "", message: "", gdprConsent: false });
    },
    onError: () => toast.error(t("Une erreur est survenue.", "Something went wrong.")),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({ name: form.name, email: form.email, phone: form.phone, message: form.message, gdprConsent: form.gdprConsent });
  };

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t("Contact & Réserver", "Contact & Book")}</p>
          <h1 className="text-headline text-white">{t("Parlons de votre séjour", "Let's talk about your stay")}</h1>
        </div>
      </div>
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="divider-ochre mb-6" />
            <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("Envoyez-nous un message", "Send us a message")}</h2>
            <p className="text-lead mb-8">{t("Nous répondons sous 24h. Pour une réponse immédiate, utilisez WhatsApp.", "We reply within 24h. For an immediate response, use WhatsApp.")}</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-eco">{t("Nom *", "Name *")}</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-eco" />
                </div>
                <div>
                  <label className="label-eco">{t("Email *", "Email *")}</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-eco" />
                </div>
              </div>
              <div>
                <label className="label-eco">{t("Téléphone", "Phone")}</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-eco" />
              </div>
              <div>
                <label className="label-eco">{t("Message", "Message")}</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-eco h-32 resize-none" placeholder={t("Vos questions, dates souhaitées...", "Your questions, preferred dates...")} />
              </div>
              <div className="flex items-start gap-3 p-4 bg-[var(--cream-50)] rounded-xl">
                <input type="checkbox" id="gdpr-contact" required checked={form.gdprConsent} onChange={e => setForm(f => ({ ...f, gdprConsent: e.target.checked }))} className="mt-0.5 w-4 h-4 accent-[var(--forest-700)]" />
                <label htmlFor="gdpr-contact" className="text-xs text-[var(--slate-600)]">
                  {t("J'accepte que mes données soient utilisées pour répondre à ma demande. ", "I agree that my data will be used to respond to my request. ")}
                  <Link href="/privacy" className="underline">{t("Politique de confidentialité", "Privacy policy")}</Link>.
                </label>
              </div>
              <button type="submit" disabled={submitMutation.isPending} className="btn-primary w-full py-4">
                {submitMutation.isPending ? t("Envoi...", "Sending...") : t("Envoyer le message", "Send message")}
              </button>
            </form>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t("Contactez-nous directement", "Contact us directly")}</h3>
              <div className="space-y-4">
                <a href="mailto:support@sevebois.be" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-[var(--cream-300)] hover:border-[var(--forest-300)] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-[var(--forest-50)] flex items-center justify-center text-[var(--forest-600)] group-hover:bg-[var(--forest-100)] transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--forest-900)]">support@sevebois.be</p>
                    <p className="text-xs text-[var(--slate-500)]">{t("Réponse sous 24h", "Reply within 24h")}</p>
                  </div>
                </a>
                <a href="https://wa.me/32467808179" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-[var(--cream-300)] hover:border-[#25D366] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#25D366] group-hover:bg-[#dcfce7] transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--forest-900)]">+32 467 80 81 79</p>
                    <p className="text-xs text-[var(--slate-500)]">{t("WhatsApp — réponse rapide", "WhatsApp — quick response")}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-[var(--cream-300)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--forest-50)] flex items-center justify-center text-[var(--forest-600)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--forest-900)]">Laforêt, Wallonie, Belgique</p>
                    <p className="text-xs text-[var(--slate-500)]">{t("Sur les rives de la Semois", "On the banks of the Semois")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--forest-50)] rounded-2xl p-6">
              <h4 className="font-serif text-lg font-semibold text-[var(--forest-950)] mb-3">{t("Prêt à réserver ?", "Ready to book?")}</h4>
              <p className="text-sm text-[var(--slate-600)] mb-4">{t("Réservez directement en ligne pour le meilleur tarif.", "Book directly online for the best rate.")}</p>
              <Link href="/booking" className="btn-primary w-full text-center">{t("Vérifier les disponibilités", "Check availability")}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
