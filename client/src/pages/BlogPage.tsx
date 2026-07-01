import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function BlogPage() {
  const { lang, t } = useLanguage();
  const [offset, setOffset] = useState(0);
  const limit = 9;

  const { data: posts, isLoading } = trpc.blog.list.useQuery({
    limit,
    offset,
  });

  const translations = {
    fr: {
      title: "Blog",
      subtitle: "Découvrez nos conseils, histoires et guides pour explorer la Semois et les Ardennes belges",
      noPost: "Aucun article pour le moment. Revenez bientôt !",
      readMore: "Lire la suite",
      previous: "Précédent",
      next: "Suivant",
    },
    en: {
      title: "Blog",
      subtitle: "Discover our tips, stories and guides to explore the Semois and the Belgian Ardennes",
      noPost: "No articles yet. Check back soon!",
      readMore: "Read more",
      previous: "Previous",
      next: "Next",
    },
    nl: {
      title: "Blog",
      subtitle: "Ontdek onze tips, verhalen en gidsen om de Semois en de Belgische Ardennen te verkennen",
      noPost: "Nog geen artikelen. Kom binnenkort terug!",
      readMore: "Lees meer",
      previous: "Vorige",
      next: "Volgende",
    },
  };

  const trans = translations[lang as keyof typeof translations];

  return (
    <div className="min-h-screen bg-[var(--cream-50)]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--forest-900)] to-[var(--forest-800)] text-white py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{trans.title}</h1>
          <p className="text-lg text-[var(--cream-200)] max-w-2xl">{trans.subtitle}</p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="container py-16">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[var(--forest-600)]" size={32} />
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--slate-600)] text-lg">{trans.noPost}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {post.featuredImageUrl && (
                    <img
                      src={post.featuredImageUrl}
                      alt={lang === "fr" ? post.titleFr : post.titleEn}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className="text-sm text-[var(--ochre-600)] font-semibold mb-2">
                      {lang === "fr" ? post.categoryFr : post.categoryEn}
                    </p>
                    <h3 className="text-xl font-serif font-bold text-[var(--forest-900)] mb-2">
                      {lang === "fr" ? post.titleFr : post.titleEn}
                    </h3>
                    <p className="text-[var(--slate-600)] text-sm mb-4">
                      {lang === "fr" ? post.descriptionFr : post.descriptionEn}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[var(--forest-600)] font-semibold hover:text-[var(--forest-800)] transition-colors"
                    >
                      {trans.readMore} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="px-6 py-2 bg-[var(--forest-600)] text-white rounded-lg hover:bg-[var(--forest-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {trans.previous}
              </button>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={!posts || posts.length < limit}
                className="px-6 py-2 bg-[var(--forest-600)] text-white rounded-lg hover:bg-[var(--forest-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {trans.next}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
