import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useSEO } from "./hooks/useSEO";
import { getAlternateLinks, getSeoPage, SEO_SITE_URL } from "../../shared/seo";
import Home from "./pages/Home";
import CottagePage from "./pages/CottagePage";
import LocationPage from "./pages/LocationPage";
import RatesPage from "./pages/RatesPage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import AboutPage from "./pages/AboutPage";
import GroupsPage from "./pages/GroupsPage";
import DogsPage from "./pages/DogsPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CookiePage from "./pages/CookiePage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileBottomBar from "./components/MobileBottomBar";
import CookieBanner from "./components/CookieBanner";
import ExitIntentPopup from "./components/ExitIntentPopup";
import ScrollRevealObserver from "./components/ScrollRevealObserver";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

function getPathWithoutQuery(path: string) {
  const pathname = path.split("?")[0];
  if (pathname === "/" || /^\/(fr|nl|en)\/$/.test(pathname)) return pathname;
  return pathname.replace(/\/$/, "") || "/";
}

function RouteSEO() {
  const [location] = useLocation();
  const path = getPathWithoutQuery(location);
  const page = getSeoPage(path === "/" ? "/en/" : path);
  const fallback = {
    title: "Sève & Bois Cottages | Laforêt, Belgian Ardennes",
    description: "Two contemporary timber cottages in Laforêt, Vresse-sur-Semois, in the Belgian Ardennes.",
    h1: "Sève & Bois Cottages",
    intro: "Green Cottages of Laforêt: two contemporary timber cottages, La Sève and Le Bois.",
    path,
    lang: "en" as const,
    key: "fallback",
    primaryKeyword: "Sève & Bois Cottages",
  };
  const metadata = page ?? fallback;
  const canonicalPath = page?.path ?? path;
  const alternates = page ? getAlternateLinks(page) : [];
  useSEO({
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.primaryKeyword,
    ogTitle: metadata.title,
    ogDescription: metadata.description,
    canonical: `${SEO_SITE_URL}${canonicalPath}`,
    robots: import.meta.env.VITE_SEO_PREVIEW_MODE === "true" || path.startsWith("/admin") || path.startsWith("/blog") ? "noindex,nofollow" : undefined,
    lang: metadata.lang,
    alternates,
  });
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/fr/" component={Home} />
      <Route path="/nl/" component={Home} />
      <Route path="/en/" component={Home} />

      <Route path="/cottages/la-seve" component={() => <CottagePage slug="la-seve" />} />
      <Route path="/fr/la-seve" component={() => <CottagePage slug="la-seve" />} />
      <Route path="/nl/la-seve" component={() => <CottagePage slug="la-seve" />} />
      <Route path="/en/la-seve" component={() => <CottagePage slug="la-seve" />} />
      <Route path="/cottages/le-bois" component={() => <CottagePage slug="le-bois" />} />
      <Route path="/fr/le-bois" component={() => <CottagePage slug="le-bois" />} />
      <Route path="/nl/le-bois" component={() => <CottagePage slug="le-bois" />} />
      <Route path="/en/le-bois" component={() => <CottagePage slug="le-bois" />} />

      <Route path="/location" component={LocationPage} />
      <Route path="/fr/gite-vresse-sur-semois" component={LocationPage} />
      <Route path="/nl/vakantiehuis-vresse-sur-semois" component={LocationPage} />
      <Route path="/en/vresse-sur-semois-cottage" component={LocationPage} />
      <Route path="/sustainability" component={Home} />

      <Route path="/rates" component={RatesPage} />
      <Route path="/fr/tarifs" component={RatesPage} />
      <Route path="/nl/prijzen" component={RatesPage} />
      <Route path="/en/rates" component={RatesPage} />

      <Route path="/groups" component={GroupsPage} />
      <Route path="/fr/gite-12-personnes-ardennes" component={GroupsPage} />
      <Route path="/nl/groepsaccommodatie-ardennen" component={GroupsPage} />
      <Route path="/en/group-accommodation-ardennes" component={GroupsPage} />
      <Route path="/dogs" component={DogsPage} />
      <Route path="/fr/gite-chien-ardennes" component={DogsPage} />
      <Route path="/nl/vakantiehuis-ardennen-hond" component={DogsPage} />
      <Route path="/en/dog-friendly-cottage-ardennes" component={DogsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/fr/a-propos" component={AboutPage} />
      <Route path="/nl/over-ons" component={AboutPage} />
      <Route path="/en/about" component={AboutPage} />

      <Route path="/booking" component={BookingPage} />
      <Route path="/booking/confirmation" component={BookingConfirmation} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/fr/contact" component={ContactPage} />
      <Route path="/nl/contact" component={ContactPage} />
      <Route path="/en/contact" component={ContactPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/fr/faq" component={FaqPage} />
      <Route path="/nl/faq" component={FaqPage} />
      <Route path="/en/faq" component={FaqPage} />

      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/cookies" component={CookiePage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function LivePresence() {
  const [location] = useLocation();
  const heartbeat = trpc.analytics.heartbeat.useMutation();
  const [sessionKey] = useState(() => {
    if (typeof window === "undefined") return "server-rendered-session";
    const key = window.sessionStorage.getItem("green-cottages-live-session");
    if (key) return key;
    const created = `${crypto.randomUUID()}-${Date.now()}`;
    window.sessionStorage.setItem("green-cottages-live-session", created);
    return created;
  });

  useEffect(() => {
    if (location.startsWith("/admin")) return;
    const send = () => heartbeat.mutate({ sessionKey, path: location.split("?")[0], bookingStage: location.startsWith("/booking") ? "booking" : "browsing", countryCode: typeof navigator !== "undefined" ? (navigator.language.split("-")[1] ?? "").toUpperCase() : undefined, language: typeof navigator !== "undefined" ? navigator.language : undefined });
    send();
    const timer = window.setInterval(send, 30_000);
    return () => window.clearInterval(timer);
  }, [location, sessionKey]);
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <RouteSEO />
            <LivePresence />
            <AnalyticsTracker />
            <ScrollRevealObserver />
            <Header />
            <main><Router /></main>
            <Footer />
            <MobileBottomBar />
            <CookieBanner />
            <ExitIntentPopup />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
