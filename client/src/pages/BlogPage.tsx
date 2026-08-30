import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Loader2, Search, Tag } from "lucide-react";

export default function BlogPage() {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: posts, isLoading } = trpc.blog.list.useQuery({
    limit: 50,
    offset: 0,
  });

  const categories = useMemo(() => {
    if (!posts) return [];
    const set = new Set<string>();
    posts.forEach((post) => {
      if (!post) return;
      const cat = lang === "fr" ? post.categoryFr : post.categoryEn;
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [posts, lang]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post) => {
      if (!post) return false;
      const title = (lang === "fr" ? post.titleFr : post.titleEn).toLowerCase();
      const desc = (lang === "fr" ? (post.descriptionFr ?? "") : (post.descriptionEn ?? "")).toLowerCase();
      const cat = lang === "fr" ? post.categoryFr : post.categoryEn;
      
      const matchesSearch = searchQuery === "" || title.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || cat === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory, lang]);

  const translations = {
    fr: {
      title: "Journal des Ardennes",
      subtitle: "Conseils, histoires et guides pour explorer Laforêt, la Semois et la nature environnante",
      searchPlaceholder: "Rechercher un article...",
      allCategories: "Tous les sujets",
      noPost: "Aucun article ne correspond à votre recherche.",
      readMore: "Lire l'article",
    },
    en: {
      title: "Ardennes Journal",
      subtitle: "Tips, stories and guides for exploring Laforêt, the Semois valley and surrounding nature",
      searchPlaceholder: "Search articles...",
      allCategories: "All topics",
      noPost: "No articles match your search.",
      readMore: "Read article",
    },
    nl: {
      title: "Ardennen Journaal",
      subtitle: "Tips, verhalen en gidsen om Laforêt, de Semois en de omliggende natuur te verkennen",
      searchPlaceholder: "Zoek artikelen...",
      allCategories: "Alle onderwerpen",
      noPost: "Geen artikelen gevonden die aan uw zoekopdracht voldoen.",
      readMore: "Lees artikel",
    },
  };

  const trans = (translations as Record<string, typeof translations.en>)[lang] ?? translations.en;

  return (
    <div className="min-h-screen bg-[var(--cream-50)]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--forest-900)] to-[var(--forest-800)] text-white py-16 md:py-24">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">SÈVE & BOIS ESCAPES</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{trans.title}</h1>
          <p className="text-lg text-[var(--cream-200)] max-w-2xl mb-8">{trans.subtitle}</p>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--slate-400)] w-5 h-5" />
              <input
                type="text"
                placeholder={trans.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-[var(--forest-900)] placeholder-[var(--slate-400)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre-500)] text-sm shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === "all"
                    ? "bg-[var(--ochre-500)] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {trans.allCategories}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-[var(--ochre-500)] text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <section className="container py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[var(--forest-600)]" size={36} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[var(--cream-300)] max-w-md mx-auto p-8 shadow-sm">
            <Tag className="w-10 h-10 text-[var(--ochre-500)] mx-auto mb-4" />
            <p className="text-[var(--slate-700)] text-lg font-medium">{trans.noPost}</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="mt-4 px-4 py-2 bg-[var(--forest-900)] text-white rounded-lg text-sm hover:bg-[var(--forest-800)] transition-colors"
              >
                {lang === "fr" ? "Réinitialiser" : lang === "be" ? "Reset" : "Reset filters"}
              </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden border border-[var(--cream-300)] shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {post.featuredImageUrl && (
                  <div className="h-52 overflow-hidden bg-[var(--cream-200)]">
                    <img
                      src={post.featuredImageUrl}
                      alt={lang === "fr" ? post.titleFr : post.titleEn}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[var(--cream-100)] text-[var(--ochre-700)] text-xs font-semibold rounded-full mb-3">
                      {lang === "fr" ? post.categoryFr : post.categoryEn}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[var(--forest-900)] mb-3 leading-snug">
                      {lang === "fr" ? post.titleFr : post.titleEn}
                    </h3>
                    <p className="text-[var(--slate-600)] text-sm mb-6 line-clamp-3">
                      {lang === "fr" ? post.descriptionFr : post.descriptionEn}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[var(--forest-700)] font-semibold hover:text-[var(--forest-900)] transition-colors text-sm group"
                  >
                    {trans.readMore} <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
