import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useSEO } from "./hooks/useSEO";
import Home from "./pages/Home";
import CottagePage from "./pages/CottagePage";
import LocationPage from "./pages/LocationPage";
import SustainabilityPage from "./pages/SustainabilityPage";
import RatesPage from "./pages/RatesPage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
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

const routeSEO: Record<string, { title: string; description: string; keywords: string; robots?: string }> = {
  "/": { title: "Green Cottages of Laforet | Belgian Ardennes", description: "Two private eco-cottages in Laforet in the Belgian Ardennes, beside the Semois valley. Book a quiet, pet-friendly stay directly.", keywords: "Green Cottages Laforet, cottages Ardennes, Semois holiday rental, eco accommodation Belgium" },
  "/cottages/la-seve": { title: "La Sève — Eco-Cottage in Laforet | Green Cottages", description: "Discover La Sève, a private eco-cottage in Laforet in the Belgian Ardennes, with forest surroundings, thoughtful amenities and direct booking.", keywords: "La Sève cottage, Laforet cottage, Belgian Ardennes accommodation, Semois holiday rental" },
  "/cottages/le-bois": { title: "Le Bois — Eco-Cottage in Laforet | Green Cottages", description: "Discover Le Bois, a private eco-cottage in Laforet in the Belgian Ardennes, designed for restful stays beside the Semois valley.", keywords: "Le Bois cottage, Laforet cottage, Belgian Ardennes accommodation, Semois holiday rental" },
  "/location": { title: "Laforet & the Semois Valley | Green Cottages", description: "Explore Laforet, the Semois valley, forests, villages, restaurants and outdoor activities around Green Cottages in the Belgian Ardennes.", keywords: "Laforet Belgium, Semois valley, Belgian Ardennes activities, Bouillon day trips" },
  "/sustainability": { title: "Sustainable Stays in the Ardennes | Green Cottages", description: "Learn how Green Cottages combines comfortable stays with renewable energy, thoughtful resources and respect for the Belgian Ardennes landscape.", keywords: "sustainable cottage Belgium, eco accommodation Ardennes, renewable energy holiday rental" },
  "/rates": { title: "Rates & Availability | Green Cottages of Laforet", description: "Choose La Sève, Le Bois or both cottages, select your dates and see the current total for your stay in Laforet.", keywords: "Laforet cottage rates, Ardennes cottage availability, Semois holiday rental prices" },
  "/booking": { title: "Book Your Stay | Green Cottages of Laforet", description: "Select a cottage or both cottages, choose your dates and request a secure booking at Green Cottages of Laforet.", keywords: "book cottage Laforet, Ardennes cottage booking, Semois accommodation booking" },
  "/booking/confirmation": { title: "Booking Confirmation | Green Cottages of Laforet", description: "Your Green Cottages booking confirmation and next steps.", keywords: "Green Cottages booking confirmation", robots: "noindex,nofollow" },
  "/contact": { title: "Contact Green Cottages of Laforet", description: "Contact Green Cottages of Laforet for questions about your stay, availability, accessibility and the Belgian Ardennes.", keywords: "contact Green Cottages, Laforet holiday rental contact, Semois accommodation" },
  "/faq": { title: "Frequently Asked Questions | Green Cottages", description: "Find answers about booking, amenities, pets, arrival, bed linen, towels and staying at Green Cottages in Laforet.", keywords: "Green Cottages FAQ, Laforet cottage questions, Ardennes holiday rental information" },
  "/terms": { title: "Booking Terms & Conditions | Green Cottages", description: "Read the booking terms, cancellation information and conditions for stays at Green Cottages of Laforet.", keywords: "Green Cottages terms, cottage booking conditions Belgium, cancellation policy Laforet" },
  "/privacy": { title: "Privacy Policy | Green Cottages of Laforet", description: "Read how Green Cottages of Laforet handles personal data, booking information and newsletter preferences.", keywords: "Green Cottages privacy policy, GDPR holiday rental Belgium" },
  "/cookies": { title: "Cookie Policy | Green Cottages of Laforet", description: "Read the cookie policy for the Green Cottages of Laforet website.", keywords: "Green Cottages cookie policy, Laforet website cookies" },
  "/blog": { title: "Ardennes Travel Journal | Green Cottages", description: "Read practical guides and inspiration for exploring Laforet, the Semois valley and the Belgian Ardennes.", keywords: "Laforet travel journal, Belgian Ardennes blog, Semois travel guide" },
  "/admin/login": { title: "Admin Login | Green Cottages", description: "Secure administration login for Green Cottages of Laforet.", keywords: "Green Cottages administration", robots: "noindex,nofollow" },
  "/admin": { title: "Admin Dashboard | Green Cottages", description: "Private property management dashboard for Green Cottages of Laforet.", keywords: "Green Cottages administration", robots: "noindex,nofollow" },
};

function RouteSEO() {
  const [location] = useLocation();
  const path = location.split("?")[0];
  const metadata = routeSEO[path] ?? (path.startsWith("/blog/") ? { title: "Ardennes Travel Journal | Green Cottages", description: "Stories, practical guides and inspiration for your stay in Laforet and the Belgian Ardennes.", keywords: "Belgian Ardennes travel blog, Laforet travel guide, Semois valley" } : { title: "Page not found | Green Cottages", description: "The requested Green Cottages page could not be found.", keywords: "Green Cottages", robots: "noindex,nofollow" });
  useSEO({ ...metadata, ogTitle: metadata.title, ogDescription: metadata.description, canonical: typeof window === "undefined" ? undefined : `${window.location.origin}${path}` });
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cottages/la-seve" component={() => <CottagePage slug="la-seve" />} />
      <Route path="/cottages/le-bois" component={() => <CottagePage slug="le-bois" />} />
      <Route path="/location" component={LocationPage} />
      <Route path="/sustainability" component={SustainabilityPage} />
      <Route path="/rates" component={RatesPage} />
      <Route path="/booking" component={BookingPage} />
      <Route path="/booking/confirmation" component={BookingConfirmation} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/faq" component={FaqPage} />
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <RouteSEO />
            <Header />
            <main>
              <Router />
            </main>
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
