export interface ParsedArticle {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  relatedService: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  faq: { question: string; answer: string }[];
}

/**
 * Parse quick-paste article format into structured fields.
 * Format:
 *   # Title
 *   SEO Title: ...
 *   SEO Description: ...
 *   Slug: ...
 *   Excerpt: ...
 *   Category: ...
 *   Related Service: ...
 *   ## Section ...
 *   ### FAQ
 *   ### Pytanie: ...
 *   Odpowiedź: ...
 */
export function parseArticle(raw: string): ParsedArticle {
  const lines = raw.split("\n").map((l) => l.trimEnd());

  const result: ParsedArticle = {
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    relatedService: "",
    seoTitle: "",
    seoDescription: "",
    content: "",
    faq: [],
  };

  let i = 0;

  // --- Parse header block (before first ## section) ---
  const metaEnd = lines.findIndex((l) => l.startsWith("## "));
  const headerLines = metaEnd >= 0 ? lines.slice(0, metaEnd) : lines;

  for (const line of headerLines) {
    if (line.startsWith("# ")) {
      result.title = line.slice(2).trim();
    } else if (/^SEO Title:/i.test(line)) {
      result.seoTitle = line.replace(/^SEO Title:/i, "").trim();
    } else if (/^SEO Description:/i.test(line)) {
      result.seoDescription = line.replace(/^SEO Description:/i, "").trim();
    } else if (/^Slug:/i.test(line)) {
      result.slug = line.replace(/^Slug:/i, "").trim();
    } else if (/^Excerpt:/i.test(line)) {
      result.excerpt = line.replace(/^Excerpt:/i, "").trim();
    } else if (/^Category:/i.test(line)) {
      result.category = line.replace(/^Category:/i, "").trim();
    } else if (/^Related Service:/i.test(line)) {
      result.relatedService = line.replace(/^Related Service:/i, "").trim();
    }
  }

  if (metaEnd < 0) return result;

  i = metaEnd;

  // --- Parse content + FAQ sections ---
  const bodyLines: string[] = [];
  const faqLines: string[] = [];
  let inFaq = false;

  while (i < lines.length) {
    const line = lines[i];

    if (/^##\s+FAQ/i.test(line)) {
      inFaq = true;
      i++;
      continue;
    }

    if (inFaq) {
      faqLines.push(line);
    } else {
      bodyLines.push(line);
    }
    i++;
  }

  result.content = bodyLines.join("\n").trim();

  // Parse FAQ pairs: ### Pytanie: ... \n Odpowiedź: ...
  let j = 0;
  while (j < faqLines.length) {
    const faqLine = faqLines[j];
    const qMatch = faqLine.match(/^###\s+Pytanie:\s*(.+)/i);
    if (qMatch) {
      const question = qMatch[1].trim();
      let answer = "";
      j++;
      while (j < faqLines.length && !faqLines[j].startsWith("### ")) {
        const aMatch = faqLines[j].match(/^Odpowiedź:\s*(.+)/i);
        if (aMatch) answer = aMatch[1].trim();
        else if (faqLines[j].trim() && !answer) answer = faqLines[j].trim();
        j++;
      }
      if (question) result.faq.push({ question, answer });
    } else {
      j++;
    }
  }

  return result;
}
