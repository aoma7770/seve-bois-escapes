import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const copy = {
  title: { fr: "Espace administrateur", en: "Admin workspace", be: "Beheerdersruimte" },
  subtitle: { fr: "Connexion réservée à l'équipe Green Cottages.", en: "Sign in for Green Cottages staff only.", be: "Aanmelden voor Green Cottages-medewerkers." },
  username: { fr: "Nom d'utilisateur", en: "Username", be: "Gebruikersnaam" },
  password: { fr: "Mot de passe", en: "Password", be: "Wachtwoord" },
  submit: { fr: "Se connecter", en: "Sign in", be: "Aanmelden" },
  loading: { fr: "Connexion…", en: "Signing in…", be: "Aanmelden…" },
  error: { fr: "Nom d'utilisateur ou mot de passe incorrect.", en: "Incorrect username or password.", be: "Onjuiste gebruikersnaam of wachtwoord." },
  connection: { fr: "Impossible de se connecter. Réessayez.", en: "Unable to sign in. Please try again.", be: "Aanmelden mislukt. Probeer opnieuw." },
};

export default function AdminLogin() {
  const { lang } = useLanguage();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = (key: keyof typeof copy) => copy[key][lang];

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setError(response.status === 401 ? t("error") : t("connection"));
        return;
      }
      setLocation("/admin");
      window.location.reload();
    } catch {
      setError(t("connection"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream-50)] px-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <p className="text-caption text-[var(--ochre-600)] mb-3">GREEN COTTAGES OF LAFORÊT</p>
        <h1 className="text-3xl font-serif font-bold text-[var(--forest-900)] mb-2">{t("title")}</h1>
        <p className="text-[var(--slate-600)] mb-7">{t("subtitle")}</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm font-medium text-[var(--forest-700)]">
            {t("username")}
            <Input className="mt-2" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required disabled={loading} />
          </label>
          <label className="block text-sm font-medium text-[var(--forest-700)]">
            {t("password")}
            <Input className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required disabled={loading} />
          </label>
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Button type="submit" className="w-full btn-primary" disabled={loading || !username || !password}>{loading ? t("loading") : t("submit")}</Button>
        </form>
      </Card>
    </div>
  );
}
