import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token);
        window.location.href = "/admin/dashboard";
      } else {
        setError(t({ fr: "Mot de passe incorrect", en: "Incorrect password", be: "Incorrect password" }));
      }
    } catch (err) {
      setError(t({ fr: "Erreur de connexion", en: "Connection error", be: "Connection error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--forest-50)] to-[var(--cream-50)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          <h1 className="text-3xl font-serif font-bold text-[var(--forest-950)] mb-2 text-center">
            {t({ fr: "Admin", en: "Admin", be: "Admin" })}
          </h1>
          <p className="text-sm text-[var(--slate-600)] text-center mb-6">
            {t({ fr: "Connexion sécurisée", en: "Secure login", be: "Secure login" })}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--forest-700)] mb-2">
                {t({ fr: "Mot de passe", en: "Password", be: "Password" })}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t({ fr: "Entrez le mot de passe", en: "Enter password", be: "Enter password" })}
                disabled={loading}
                className="w-full"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full btn-primary"
            >
              {loading ? t({ fr: "Connexion...", en: "Logging in...", be: "Logging in..." }) : t({ fr: "Connexion", en: "Login", be: "Login" })}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
