export interface ParsedArticle {
  title: string;
  slug: string;
  excerpt: string;
  quickAnswer: string;
  category: string;
  author: string;
  relatedService: string;
  canonical: string;
  ogImage: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  faq: { question: string; answer: string }[];
}

/**
 * Parse quick-paste article format into structured fields.
 *
 * Accepts both Polish and English meta field names (Polish takes priority).
 *
 * Header meta (before first ## section):
 *   # Tytuł
 *   Tytuł SEO: ...       / SEO Title: ...
 *   Opis meta: ...        / SEO Description: ...
 *   Slug: ...
 *   Krótki opis: ...      / Excerpt: ...
 *   Kategoria: ...        / Category: ...
 *   Autor: ...
 *   Powiązana usługa: ... / Related Service: ...
 *   Canonical: ...
 *   Obraz Open Graph: ... / OG Image: ...
 *
 * Special ## sections:
 *   ## Szybka odpowiedź  → quickAnswer field (excluded from content)
 *   ## FAQ               → faq array (excluded from content)
 *
 * FAQ item format:
 *   ### Pytanie: Treść pytania?
 *   Odpowiedź: Treść odpowiedzi.
 */
export function parseArticle(raw: string): ParsedArticle {
  const lines = raw.split("\n").map((l) => l.trimEnd());

  const result: ParsedArticle = {
    title: "",
    slug: "",
    excerpt: "",
    quickAnswer: "",
    category: "",
    author: "",
    relatedService: "",
    canonical: "",
    ogImage: "",
    seoTitle: "",
    seoDescription: "",
    content: "",
    faq: [],
  };

  // --- Parse header block (before first ## section) ---
  const metaEnd = lines.findIndex((l) => l.startsWith("## "));
  const headerLines = metaEnd >= 0 ? lines.slice(0, metaEnd) : lines;

  for (const line of headerLines) {
    if (line.startsWith("# ")) {
      result.title = line.slice(2).trim();
    } else if (/^(Tytuł SEO|SEO Title):/i.test(line)) {
      result.seoTitle = line.replace(/^[^:]+:\s*/, "").trim();
    } else if (/^(Opis meta|SEO Description):/i.test(line)) {
      result.seoDescription = line.replace(/^[^:]+:\s*/, "").trim();
    } else if (/^Slug:/i.test(line)) {
      result.slug = line.replace(/^Slug:\s*/i, "").trim();
    } else if (/^(Krótki opis|Excerpt):/i.test(line)) {
      result.excerpt = line.replace(/^[^:]+:\s*/, "").trim();
    } else if (/^(Kategoria|Category):/i.test(line)) {
      result.category = line.replace(/^[^:]+:\s*/, "").trim();
    } else if (/^Autor:/i.test(line)) {
      result.author = line.replace(/^Autor:\s*/i, "").trim();
    } else if (/^(Powiązana usługa|Related Service):/i.test(line)) {
      result.relatedService = line.replace(/^[^:]+:\s*/, "").trim();
    } else if (/^Canonical:/i.test(line)) {
      result.canonical = line.replace(/^Canonical:\s*/i, "").trim();
    } else if (/^(Obraz Open Graph|OG Image):/i.test(line)) {
      result.ogImage = line.replace(/^[^:]+:\s*/, "").trim();
    }
  }

  if (metaEnd < 0) return result;

  // --- Group lines into ## sections ---
  type Section = { header: string; lines: string[] };
  const sections: Section[] = [];
  let current: Section | null = null;

  for (let i = metaEnd; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { header: line, lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  // --- Classify sections ---
  const bodyLines: string[] = [];
  const faqLines: string[] = [];

  for (const section of sections) {
    if (/^##\s+Szybka odpowiedź/i.test(section.header)) {
      result.quickAnswer = section.lines.join("\n").trim();
    } else if (/^##\s+FAQ/i.test(section.header)) {
      faqLines.push(...section.lines);
    } else {
      bodyLines.push(section.header);
      bodyLines.push(...section.lines);
    }
  }

  result.content = bodyLines.join("\n").trim();

  // --- Parse FAQ pairs: ### Pytanie: ... \n Odpowiedź: ... ---
  let j = 0;
  while (j < faqLines.length) {
    const qMatch = faqLines[j].match(/^###\s+Pytanie:\s*(.+)/i);
    if (qMatch) {
      const question = qMatch[1].trim();
      const answerParts: string[] = [];
      j++;
      while (j < faqLines.length && !faqLines[j].match(/^###\s+Pytanie:/i)) {
        const aMatch = faqLines[j].match(/^Odpowiedź:\s*(.*)/i);
        if (aMatch) {
          if (aMatch[1].trim()) answerParts.push(aMatch[1].trim());
        } else if (faqLines[j].trim()) {
          answerParts.push(faqLines[j].trim());
        }
        j++;
      }
      if (question) result.faq.push({ question, answer: answerParts.join(" ") });
    } else {
      j++;
    }
  }

  return result;
}
