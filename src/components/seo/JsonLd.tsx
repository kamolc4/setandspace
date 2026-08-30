import { business } from "@/data/business";
import type { Project } from "@/data/projects";
import type { JournalArticle } from "@/data/journal";
import type { Service } from "@/data/services";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": business.url,
    name: business.name,
    legalName: business.legalName,
    url: business.url,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressCountry: "PL",
    },
    vatID: business.nip,
    ...(business.email && { email: business.email }),
    ...(business.phone && { telephone: business.phone }),
    ...(business.social.instagram && {
      sameAs: [
        business.social.instagram,
        business.social.vimeo,
        business.social.youtube,
      ].filter(Boolean),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: business.name,
    url: business.url,
    description: business.description,
    inLanguage: "pl",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: business.url },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href && { item: `${business.url}${item.href}` }),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleJsonLd({ article }: { article: JournalArticle }) {
  const articleUrl = `${business.url}/poradniki/${article.slug}`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    datePublished: article.publishDate,
    ...(article.modifiedDate && { dateModified: article.modifiedDate }),
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: business.name, url: business.url },
    publisher: {
      "@type": "Organization",
      name: business.name,
      url: business.url,
    },
    inLanguage: "pl",
    ...(article.heroImage && {
      image: article.heroImage.startsWith("http")
        ? article.heroImage
        : `${business.url}${article.heroImage}`,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function VideoObjectJsonLd({ project }: { project: Project }) {
  if (
    project.videoProvider === "none" ||
    !project.vimeoId && !project.youtubeId
  ) {
    return null;
  }

  const embedUrl =
    project.videoProvider === "vimeo" && project.vimeoId
      ? `https://player.vimeo.com/video/${project.vimeoId}`
      : project.youtubeId
      ? `https://www.youtube-nocookie.com/embed/${project.youtubeId}`
      : null;

  if (!embedUrl) return null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: project.title,
    description: project.shortDescription,
    thumbnailUrl: project.posterImage
      ? `${business.url}${project.posterImage}`
      : undefined,
    embedUrl,
    ...(project.videoUploadDate && { uploadDate: project.videoUploadDate }),
    ...(project.videoDuration && { duration: project.videoDuration }),
  };

  // Remove undefined values
  Object.keys(schema).forEach(
    (k) => schema[k] === undefined && delete schema[k]
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceJsonLd({ service }: { service: Service }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.intro,
    provider: {
      "@type": "Organization",
      name: business.name,
      url: business.url,
    },
    url: `${business.url}/uslugi/${service.slug}`,
    areaServed: {
      "@type": "Country",
      name: "Poland",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd({
  faq,
}: {
  faq: { question: string; answer: string }[];
}) {
  if (!faq || faq.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
