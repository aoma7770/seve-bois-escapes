import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/cottages/la-seve", label: t({ fr: "La Sève", en: "La Sève", nl: "La Sève" }) },
    { href: "/cottages/le-bois", label: t({ fr: "Le Bois", en: "Le Bois", nl: "Le Bois" }) },
    { href: "/location", label: t({ fr: "Le Lieu", en: "The Location", nl: "The Location" }) },
    { href: "/rates", label: t({ fr: "Tarifs", en: "Rates", nl: "Rates" }) },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: t({ fr: "Contact", en: "Contact", nl: "Contact" }) },
  ];

  const headerBg = isHome && !scrolled
    ? "bg-transparent"
    : "bg-[var(--cream-50)]/95 backdrop-blur-md shadow-sm border-b border-[var(--cream-300)]";

  const textColor = isHome && !scrolled ? "text-white" : "text-[var(--forest-950)]";
  const logoColor = isHome && !scrolled ? "text-white" : "text-[var(--forest-800)]";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
        style={{ paddingBottom: 0 }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className={`font-serif text-xl font-semibold tracking-tight ${logoColor} transition-colors duration-300 shrink-0`}>
              Sève & Bois
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:opacity-70 ${textColor}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side: lang toggle + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language toggle */}
              <button
                onClick={() => setLang(lang === "fr" ? "en" : lang === "en" ? "nl" : "fr")}
                className={`text-xs font-bold tracking-widest uppercase px-2 py-1 rounded border transition-all duration-200 ${
                  isHome && !scrolled
                    ? "border-white/50 text-white hover:bg-white/10"
                    : "border-[var(--forest-300)] text-[var(--forest-700)] hover:bg-[var(--forest-50)]"
                }`}
              >
                {lang === "fr" ? "EN" : lang === "en" ? "NL" : "FR"}
              </button>

              {/* CTA */}
              <Link
                href="/booking"
                className="btn-primary text-sm px-5 py-2.5"
                style={isHome && !scrolled ? { background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.7)", color: "white" } : {}}
              >
                {t({ fr: "Vérifier les disponibilités", en: "Check availability", nl: "Beschikbaarheid controleren" })}
              </Link>
            </div>

            {/* Mobile: lang + hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setLang(lang === "fr" ? "en" : lang === "en" ? "nl" : "fr")}
                className={`text-xs font-bold tracking-widest uppercase px-2 py-1 rounded border transition-all ${
                  isHome && !scrolled
                    ? "border-white/50 text-white"
                    : "border-[var(--forest-300)] text-[var(--forest-700)]"
                }`}
              >
                {lang === "fr" ? "EN" : lang === "en" ? "NL" : "FR"}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 rounded-md transition-colors ${textColor}`}
                aria-label="Menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-[var(--cream-50)] border-t border-[var(--cream-300)] animate-slide-down">
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--forest-800)] font-medium py-3 px-2 border-b border-[var(--cream-200)] last:border-0 hover:text-[var(--forest-600)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                className="btn-primary mt-3 text-center"
              >
                {t({ fr: "Vérifier les disponibilités", en: "Check availability", nl: "Beschikbaarheid controleren" })}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
