import type { Article } from "@/generated/prisma/client";
import type { JournalArticle } from "@/data/journal";

export function dbToJournalArticle(a: Article): JournalArticle {
  const faq = a.faq as { question: string; answer: string }[] | null;
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    author: a.author,
    publishDate: toDateStr(a.publishedAt ?? a.createdAt),
    modifiedDate: toDateStr(a.updatedAt),
    heroImage: a.ogImage ?? null,
    heroImageAlt: a.title,
    category: a.category,
    tags: [],
    relatedService: a.relatedService ?? null,
    relatedProjectSlugs: [],
    seo: {
      title: a.seoTitle ?? a.title,
      description: a.seoDescription ?? a.excerpt,
      canonical: a.canonical ?? undefined,
      ogImage: a.ogImage ?? undefined,
    },
    faq: faq ?? undefined,
  };
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}
