import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
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
