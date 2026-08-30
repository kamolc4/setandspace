export const business = {
  name: "Set & Space",
  tagline: "Filmy, które pozwalają poczuć miejsce.",
  description:
    "Set & Space tworzy krótkie filmy dla nieruchomości, hoteli, architektów i salonów meblowych. Przestrzeń w obrazie.",
  domain: "www.setandspace.pl",
  url: "https://www.setandspace.pl",

  // Legal entity
  legalName: "Cyprian Corp Sp. z o.o.",
  address: {
    street: "ul. Tomasza Zana 43",
    postalCode: "20-601",
    city: "Lublin",
    cityLocative: "Lublinie",
    country: "Polska",
  },
  nip: "7123480923",
  krs: "0001125572",
  regon: "529580930",

  email: "paulinaolczykk@gmail.com",
  phone: null as string | null, // PLACEHOLDER — replace with real phone number

  // PLACEHOLDER — replace with real social profile URLs
  social: {
    instagram: null as string | null,
    vimeo: null as string | null,
    youtube: null as string | null,
  },

  // PLACEHOLDER — replace with Google Analytics measurement ID
  ga4Id: null as string | null,

  // PLACEHOLDER — replace with GSC verification token
  gscVerification: null as string | null,

  // Primary operating region
  region: "Polska",
  baseLocale: "pl" as const,
} as const;
