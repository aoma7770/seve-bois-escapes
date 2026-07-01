import { useRoute, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  const { lang } = useLanguage();
  const [match, params] = useRoute("/blog/:slug");

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery(
    { slug: params?.slug || "" },
    { enabled: !!params?.slug }
  );

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--forest-600)]" size={32} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--cream-50)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-[var(--forest-900)] mb-4">
            {lang === "fr" ? "Article non trouvé" : "Post not found"}
          </h1>
          <Link href="/blog" className="text-[var(--forest-600)] hover:text-[var(--forest-800)]">
            {lang === "fr" ? "Retour au blog" : "Back to blog"}
          </Link>
        </div>
      </div>
    );
  }

  const title = lang === "fr" ? post.titleFr : post.titleEn;
  const content = lang === "fr" ? post.contentFr : post.contentEn;
  const category = lang === "fr" ? post.categoryFr : post.categoryEn;

  return (
    <div className="min-h-screen bg-[var(--cream-50)]">
      {/* Hero with featured image */}
      {post.featuredImageUrl && (
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={post.featuredImageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Article content */}
      <article className="container py-12 md:py-16">
        <Link
          href="/blog"
          className="flex items-center gap-2 text-[var(--forest-600)] hover:text-[var(--forest-800)] mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          {lang === "fr" ? "Retour au blog" : "Back to blog"}
        </Link>

        <header className="max-w-3xl mb-12">
          <p className="text-sm text-[var(--ochre-600)] font-semibold mb-3">{category}</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--forest-900)] mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-[var(--slate-600)] text-sm">
            <span>{post.authorName}</span>
            <span>•</span>
            <time>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </time>
          </div>
        </header>

        <div className="max-w-3xl prose prose-lg text-[var(--slate-700)] leading-relaxed">
          {content.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
