const POLISH: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n",
  ó: "o", ś: "s", ź: "z", ż: "z",
  Ą: "a", Ć: "c", Ę: "e", Ł: "l", Ń: "n",
  Ó: "o", Ś: "s", Ź: "z", Ż: "z",
};

export function generateSlug(title: string): string {
  return title
    .split("")
    .map((c) => POLISH[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
