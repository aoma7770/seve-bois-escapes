import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogOut, Calendar, Settings, Image, DollarSign } from "lucide-react";

const t = (translations: { fr: string; en: string; be: string }) => {
  const { lang } = useLanguage();
  return translations[lang as keyof typeof translations];
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    } else {
      setIsAdmin(true);
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin/login");
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--cream-50)] pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[var(--forest-900)]">
              {t({ fr: "Tableau de bord", en: "Dashboard", be: "Dashboard" })}
            </h1>
            <p className="text-[var(--slate-600)] mt-2">
              {t({
                fr: "Gérez vos propriétés et réservations",
                en: "Manage your properties and bookings",
                be: "Beheer uw eigenschappen en boekingen",
              })}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {t({ fr: "Déconnexion", en: "Logout", be: "Afmelden" })}
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">
              {t({ fr: "Aperçu", en: "Overview", be: "Overzicht" })}
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t({ fr: "Réservations", en: "Bookings", be: "Boekingen" })}
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {t({ fr: "Tarifs", en: "Pricing", be: "Prijzen" })}
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              {t({ fr: "Photos", en: "Photos", be: "Foto's" })}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t({ fr: "Paramètres", en: "Settings", be: "Instellingen" })}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card className="p-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--forest-900)] mb-6">
                {t({
                  fr: "Sève & Bois Escapes",
                  en: "Sève & Bois Escapes",
                  be: "Sève & Bois Escapes",
                })}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[var(--cream-100)] p-4 rounded-lg">
                  <p className="text-[var(--slate-600)] text-sm">
                    {t({ fr: "Capacité", en: "Capacity", be: "Capaciteit" })}
                  </p>
                  <p className="text-3xl font-bold text-[var(--forest-900)]">12</p>
                  <p className="text-xs text-[var(--slate-500)]">
                    {t({ fr: "hôtes max", en: "max guests", be: "max gasten" })}
                  </p>
                </div>
                <div className="bg-[var(--cream-100)] p-4 rounded-lg">
                  <p className="text-[var(--slate-600)] text-sm">
                    {t({
                      fr: "Réservations",
                      en: "Bookings",
                      be: "Boekingen",
                    })}
                  </p>
                  <p className="text-3xl font-bold text-[var(--forest-900)]">0</p>
                  <p className="text-xs text-[var(--slate-500)]">
                    {t({ fr: "ce mois", en: "this month", be: "deze maand" })}
                  </p>
                </div>
                <div className="bg-[var(--cream-100)] p-4 rounded-lg">
                  <p className="text-[var(--slate-600)] text-sm">
                    {t({ fr: "Revenu", en: "Revenue", be: "Inkomsten" })}
                  </p>
                  <p className="text-3xl font-bold text-[var(--forest-900)]">€0</p>
                  <p className="text-xs text-[var(--slate-500)]">
                    {t({ fr: "ce mois", en: "this month", be: "deze maand" })}
                  </p>
                </div>
                <div className="bg-[var(--cream-100)] p-4 rounded-lg">
                  <p className="text-[var(--slate-600)] text-sm">
                    {t({
                      fr: "Taux occupation",
                      en: "Occupancy",
                      be: "Bezettingsgraad",
                    })}
                  </p>
                  <p className="text-3xl font-bold text-[var(--forest-900)]">0%</p>
                  <p className="text-xs text-[var(--slate-500)]">
                    {t({ fr: "ce mois", en: "this month", be: "deze maand" })}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="p-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--forest-900)] mb-6">
                {t({
                  fr: "Gérer les réservations",
                  en: "Manage Bookings",
                  be: "Boekingen beheren",
                })}
              </h2>
              <p className="text-[var(--slate-600)]">
                {t({
                  fr: "Aucune réservation pour le moment",
                  en: "No bookings yet",
                  be: "Nog geen boekingen",
                })}
              </p>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card className="p-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--forest-900)] mb-6">
                {t({
                  fr: "Gérer les tarifs",
                  en: "Manage Pricing",
                  be: "Prijzen beheren",
                })}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--slate-700)] mb-2">
                      {t({
                        fr: "Tarif nuit en semaine",
                        en: "Weeknight Rate",
                        be: "Weeknacht tarief",
                      })}
                    </label>
                    <input
                      type="number"
                      defaultValue="300"
                      className="w-full px-3 py-2 border border-[var(--slate-300)] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--slate-700)] mb-2">
                      {t({
                        fr: "Tarif week-end",
                        en: "Weekend Rate",
                        be: "Weekendtarief",
                      })}
                    </label>
                    <input
                      type="number"
                      defaultValue="400"
                      className="w-full px-3 py-2 border border-[var(--slate-300)] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--slate-700)] mb-2">
                      {t({
                        fr: "Tarif semaine",
                        en: "Weekly Rate",
                        be: "Wekelijks tarief",
                      })}
                    </label>
                    <input
                      type="number"
                      defaultValue="1900"
                      className="w-full px-3 py-2 border border-[var(--slate-300)] rounded-lg"
                    />
                  </div>
                </div>
                <Button className="bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-white">
                  {t({ fr: "Enregistrer", en: "Save", be: "Opslaan" })}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <Card className="p-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--forest-900)] mb-6">
                {t({
                  fr: "Gérer les photos",
                  en: "Manage Photos",
                  be: "Foto's beheren",
                })}
              </h2>
              <p className="text-[var(--slate-600)]">
                {t({
                  fr: "Téléchargez et organisez les photos de votre propriété",
                  en: "Upload and organize your property photos",
                  be: "Upload en organiseer uw eigendomsfoto's",
                })}
              </p>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--forest-900)] mb-6">
                {t({
                  fr: "Paramètres de la propriété",
                  en: "Property Settings",
                  be: "Instellingen eigendom",
                })}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--slate-700)] mb-2">
                    {t({
                      fr: "Flux iCal (Airbnb, Booking.com)",
                      en: "iCal Feed (Airbnb, Booking.com)",
                      be: "iCal-feed (Airbnb, Booking.com)",
                    })}
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-[var(--slate-300)] rounded-lg"
                  />
                  <p className="text-xs text-[var(--slate-500)] mt-2">
                    {t({
                      fr: "Collez l'URL du flux iCal pour synchroniser les dates bloquées",
                      en: "Paste the iCal feed URL to sync blocked dates",
                      be: "Plak de iCal-feed-URL om geblokkeerde datums te synchroniseren",
                    })}
                  </p>
                </div>
                <Button className="bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-white">
                  {t({ fr: "Enregistrer", en: "Save", be: "Opslaan" })}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
