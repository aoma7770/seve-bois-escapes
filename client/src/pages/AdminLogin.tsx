import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const t = (translations: { fr: string; en: string; nl: string }) => {
  const { lang } = useLanguage();
  return translations[lang as keyof typeof translations];
};

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Implement admin login with Manus OAuth
      // For now, redirect to dashboard if email is admin
      if (email.includes("admin")) {
        localStorage.setItem("adminToken", "temp-token");
        setLocation("/admin");
      } else {
        setError(t({ fr: "Identifiants invalides", en: "Invalid credentials", nl: "Ongeldige inloggegevens" }));
      }
    } catch (err) {
      setError(t({ fr: "Erreur de connexion", en: "Login error", nl: "Inlogfout" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream-50)] px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-serif font-bold text-[var(--forest-900)] mb-2">
          {t({ fr: "Admin", en: "Admin", nl: "Admin" })}
        </h1>
        <p className="text-[var(--slate-600)] mb-6">
          {t({
            fr: "Connectez-vous pour gérer vos propriétés",
            en: "Sign in to manage your properties",
            nl: "Meld u aan om uw eigenschappen te beheren",
          })}
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--slate-700)] mb-1">
              {t({ fr: "Email", en: "Email", nl: "E-mail" })}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sevebois.be"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--slate-700)] mb-1">
              {t({ fr: "Mot de passe", en: "Password", nl: "Wachtwoord" })}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-white"
          >
            {loading
              ? t({ fr: "Connexion...", en: "Signing in...", nl: "Bezig met aanmelden..." })
              : t({ fr: "Se connecter", en: "Sign In", nl: "Aanmelden" })}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--slate-600)] mt-6">
          {t({
            fr: "Vous n'avez pas de compte ? Contactez le support",
            en: "Don't have an account? Contact support",
            nl: "Geen account? Neem contact op met ondersteuning",
          })}
        </p>
      </Card>
    </div>
  );
}
