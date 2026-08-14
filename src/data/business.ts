/**
 * Global business information for Set & Space.
 * Replace PLACEHOLDER values with real data before launch.
 */
export const business = {
  name: "Set & Space",
  tagline: "Filmy, które pozwalają poczuć miejsce.",
  description:
    "Set & Space tworzy krótkie filmy dla nieruchomości, hoteli, architektów i salonów meblowych. Przestrzeń w obrazie.",
  domain: "setandspace.pl",
  url: "https://setandspace.pl",

  // PLACEHOLDER — replace with real contact data
  email: "kontakt@setandspace.pl",
  phone: null as string | null, // e.g. "+48 000 000 000"

  // PLACEHOLDER — replace with real social profile URLs
  social: {
    instagram: null as string | null, // "https://instagram.com/setandspace"
    vimeo: null as string | null,     // "https://vimeo.com/setandspace"
    youtube: null as string | null,   // "https://youtube.com/@setandspace"
  },

  // PLACEHOLDER — replace with Google Analytics measurement ID
  ga4Id: null as string | null, // "G-XXXXXXXXXX"

  // PLACEHOLDER — replace with GSC verification token
  gscVerification: null as string | null,

  // Primary operating region
  region: "Polska",
  baseLocale: "pl" as const,
} as const;
