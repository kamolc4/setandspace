export type VideoProvider = "vimeo" | "youtube" | "none";

export interface ProjectGalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  category: "hotele" | "nieruchomosci" | "architektura" | "marki";
  categoryLabel: string;
  location: string;
  year: number | null;
  shortDescription: string;
  story: string;
  scope: string[];
  posterImage: string;
  posterAlt: string;
  videoProvider: VideoProvider;
  vimeoId: string | null;
  youtubeId: string | null;
  videoDuration: string | null; // ISO 8601, e.g. "PT3M30S"
  videoUploadDate: string | null; // ISO 8601 date
  gallery: ProjectGalleryImage[];
  featured: boolean;
  relatedSlugs: string[];
  relatedService: string | null;
  seo: {
    title: string;
    description: string;
  };
}

export const projects: Project[] = [
  {
    slug: "hotel-w-gorach",
    title: "Film promocyjny górskiego hotelu",
    category: "hotele",
    categoryLabel: "Hotele i hospitality",
    location: "Zakopane, Polska",
    year: 2025,
    shortDescription:
      "Kinematograficzny film dla butikowego hotelu w Tatrach, oddający atmosferę górskiej ciszy, ciepło drewna i rytuał porannej kawy z widokiem na szczyty.",
    story:
      "Celem projektu było uchwycenie nie tyle samego miejsca, co uczucia, które towarzyszy pobytowi w tym hotelu. Zaczęliśmy od wczesnego poranka — mgła nad doliną, pierwsze światło we wnętrzach, cisza przed przebudzeniem. Każde ujęcie budowaliśmy wokół detalu: faktury kamienia, refleksu w oknie, gestu podania filiżanki. Finalny materiał to trzyipółminutowa narracja bez słów, która robi więcej niż jakakolwiek ulotka.",
    scope: [
      "Film promocyjny (wersja pełna 3:30)",
      "Wersja social media :60 i :30",
      "Zdjęcia stills z planu",
      "Materiał B-roll do wykorzystania na stronie",
    ],
    posterImage: "/images/placeholder-hotel.jpg",
    posterAlt: "Kadr z filmu promocyjnego górskiego hotelu — zimowy wschód słońca",
    videoProvider: "vimeo",
    vimeoId: null, // PLACEHOLDER — replace with real Vimeo ID
    youtubeId: null,
    videoDuration: "PT3M30S",
    videoUploadDate: "2025-03-15",
    gallery: [],
    featured: true,
    relatedSlugs: ["apartamenty-w-centrum", "architektura-rezydencji"],
    relatedService: "filmy-dla-hoteli",
    seo: {
      title: "Film dla hotelu górskiego — realizacja Set & Space",
      description:
        "Kinematograficzny film promocyjny dla butikowego hotelu w Tatrach. Atmosfera, wnętrza, luz i naturalność — zrealizowane przez Set & Space.",
    },
  },
  {
    slug: "apartamenty-w-centrum",
    title: "Video nieruchomości — apartamenty premium",
    category: "nieruchomosci",
    categoryLabel: "Nieruchomości",
    location: "Warszawa, Polska",
    year: 2025,
    shortDescription:
      "Kinematograficzny film nieruchomości dla dewelopera apartamentów w centrum Warszawy. Przestrzeń, światło dzienne i wyrafinowanie oddane w obrazie.",
    story:
      "Apartamenty wymagały ujęć, które komunikują nie metry kwadratowe, a styl życia. Pracowaliśmy o złotej godzinie, by naturalne światło stało się głównym materiałem dekoracyjnym. Kamera poruszała się powoli i konsekwentnie, prowadząc widza przez przestrzeń jak przez własne mieszkanie. Film stał się centralnym punktem kampanii sprzedażowej.",
    scope: [
      "Film dla developera (wersja 2:00)",
      "Osobne klipy dla każdego apartamentu",
      "Materiał dla portali nieruchomości",
    ],
    posterImage: "/images/placeholder-apartment.jpg",
    posterAlt: "Kadr z filmu nieruchomości — nowoczesny salon z panoramicznym oknem",
    videoProvider: "vimeo",
    vimeoId: null, // PLACEHOLDER
    youtubeId: null,
    videoDuration: "PT2M00S",
    videoUploadDate: "2025-05-20",
    gallery: [],
    featured: true,
    relatedSlugs: ["hotel-w-gorach", "architektura-rezydencji"],
    relatedService: "video-nieruchomosci",
    seo: {
      title: "Video nieruchomości — apartamenty premium w Warszawie | Set & Space",
      description:
        "Film nieruchomości dla dewelopera apartamentów premium w Warszawie. Kinematograficzne ujęcia przestrzeni, naturalnego światła i architektury.",
    },
  },
  {
    slug: "architektura-rezydencji",
    title: "Film architektury — rezydencja prywatna",
    category: "architektura",
    categoryLabel: "Architektura i wnętrza",
    location: "Mazury, Polska",
    year: 2024,
    shortDescription:
      "Film dokumentujący pracownie architektoniczną i jej flagowy projekt — dom nad jeziorem zaprojektowany w duchu harmonii między budynkiem a krajobrazem.",
    story:
      "Architekt chciał pokazać projekt nie tylko jako budynek, ale jako odpowiedź na miejsce. Filmowaliśmy w czterech różnych porach dnia i przy dwóch różnych pogodach. Interesowało nas to, jak budynek zmienia się razem ze światłem — jak jest czymś innym o świcie i czymś innym pod wieczór. Finał to sześciominutowy esej wizualny o architekturze zakorzenionej w krajobrazie.",
    scope: [
      "Film architektoniczny (6:00)",
      "Wersja portfolio pracowni (2:30)",
      "Fotografia architektoniczna (20 kadrów)",
    ],
    posterImage: "/images/placeholder-architecture.jpg",
    posterAlt: "Kadr z filmu architektury — dom nad jeziorem o złotej godzinie",
    videoProvider: "vimeo",
    vimeoId: null, // PLACEHOLDER
    youtubeId: null,
    videoDuration: "PT6M00S",
    videoUploadDate: "2024-09-10",
    gallery: [],
    featured: true,
    relatedSlugs: ["hotel-w-gorach", "studio-designu"],
    relatedService: "filmy-architektury-i-wnetrz",
    seo: {
      title: "Film architektury — rezydencja nad jeziorem | Set & Space",
      description:
        "Kinematograficzny film dokumentujący prywatną rezydencję nad Mazurami. Architektura, światło i krajobraz uchwycone przez Set & Space.",
    },
  },
  {
    slug: "studio-designu",
    title: "Brand content — studio designu i wyposażenia wnętrz",
    category: "marki",
    categoryLabel: "Marki",
    location: "Kraków, Polska",
    year: 2024,
    shortDescription:
      "Film reklamowy dla krakowskiego studia designu specjalizującego się w autorskich meblach i tkaninach. Produkcja, materiał, rzemiosło.",
    story:
      "Studio chciało pokazać proces twórczy — od szkicu po gotowy produkt. Interesowały nas ręce projektanta, faktura materiałów, ruch maszyny tkackiej. Zbudowaliśmy narrację wokół jednego krzesła — od pierwszej linii na papierze do finalnego kadru w showroomie.",
    scope: [
      "Film marki (2:00)",
      "Seria krótkich filmów produktowych",
      "Materiał za kulisami dla social media",
    ],
    posterImage: "/images/placeholder-brand.jpg",
    posterAlt: "Kadr z brand contentu — detal materiału w warsztacie studia designu",
    videoProvider: "youtube",
    vimeoId: null,
    youtubeId: null, // PLACEHOLDER
    videoDuration: "PT2M00S",
    videoUploadDate: "2024-11-01",
    gallery: [],
    featured: false,
    relatedSlugs: ["architektura-rezydencji", "apartamenty-w-centrum"],
    relatedService: "filmy-reklamowe",
    seo: {
      title: "Brand content — studio designu i wnętrz w Krakowie | Set & Space",
      description:
        "Film reklamowy dla krakowskiego studia designu. Rzemiosło, materiał, proces twórczy — uchwycone przez Set & Space.",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(
  category: Project["category"]
): Project[] {
  return projects.filter((p) => p.category === category);
}

export const categoryLabels: Record<Project["category"], string> = {
  hotele: "Hotele i hospitality",
  nieruchomosci: "Nieruchomości",
  architektura: "Architektura i wnętrza",
  marki: "Marki",
};
