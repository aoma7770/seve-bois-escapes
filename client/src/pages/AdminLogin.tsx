import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const t = (translations: { fr: string; en: string; be: string }) => {
  const { lang } = useLanguage();
  return translations[lang as keyof typeof translations];
};

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated and is admin
  if (isAuthenticated && user?.role === "admin") {
    setLocation("/admin");
    return null;
  }

  // If not authenticated, show login button
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream-50)] px-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-serif font-bold text-[var(--forest-900)] mb-2">
            {t({ fr: "Admin", en: "Admin", be: "Admin" })}
          </h1>
          <p className="text-[var(--slate-600)] mb-6">
            {t({
              fr: "Connectez-vous pour gérer vos propriétés",
              en: "Sign in to manage your properties",
              be: "Meld u aan om uw eigenschappen te beheren",
            })}
          </p>

          <a href={getLoginUrl()}>
            <Button className="w-full bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-white">
              {t({ fr: "Se connecter avec Manus", en: "Sign In with Manus", be: "Aanmelden met Manus" })}
            </Button>
          </a>

          <p className="text-center text-sm text-[var(--slate-600)] mt-6">
            {t({
              fr: "Vous n'avez pas de compte ? Contactez le support",
              en: "Don't have an account? Contact support",
              be: "Geen account? Neem contact op met ondersteuning",
            })}
          </p>
        </Card>
      </div>
    );
  }

  // If authenticated but not admin
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream-50)] px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-serif font-bold text-[var(--forest-900)] mb-2">
          {t({ fr: "Accès refusé", en: "Access Denied", be: "Toegang geweigerd" })}
        </h1>
        <p className="text-[var(--slate-600)] mb-6">
          {t({
            fr: "Vous n'avez pas les permissions d'accès à l'admin",
            en: "You don't have permission to access the admin panel",
            be: "U hebt geen toestemming om het admin-paneel te openen",
          })}
        </p>
        <p className="text-center text-sm text-[var(--slate-600)]">
          {t({
            fr: "Contactez le support pour plus d'informations",
            en: "Contact support for more information",
            be: "Neem contact op met ondersteuning voor meer informatie",
          })}
        </p>
      </Card>
    </div>
  );
}
