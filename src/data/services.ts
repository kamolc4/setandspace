export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  headline: string;
  intro: string;
  body: string;
  useCases: string[];
  deliverables: string[];
  process: { step: string; description: string }[];
  preparation: string[];
  faq: ServiceFaq[];
  relatedProjectCategories: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const services: Service[] = [
  {
    slug: "filmy-dla-nieruchomosci",
    shortTitle: "Filmy dla nieruchomości",
    title: "Filmy dla nieruchomości",
    headline: "Przestrzeń, którą widać prawdziwie.",
    intro:
      "Materiał, który pokazuje przestrzeń tak, jak wygląda naprawdę. Światło, proporcje i atmosfera są równie ważne jak metraż. Sprawdza się przy sprzedaży, wynajmie i prezentacjach inwestorskich.",
    body:
      "Nagrywam nieruchomości dla deweloperów, biur i prywatnych właścicieli. Każdy materiał dopasuję do przeznaczenia: może być krótki i pionowy na Instagram, dłuższy na stronę inwestycji lub w formacie do prezentacji. Zależy mi na tym, żeby przestrzeń wyglądała jak w rzeczywistości, nie jak w katalogu.",
    useCases: [
      "Instagram i social media",
      "Strona internetowa inwestycji lub biura",
      "Portale nieruchomości",
      "Prezentacja inwestorska",
      "Sprzedaż i wynajem premium",
    ],
    deliverables: [
      "Film główny (format poziomy)",
      "Wersja pionowa na Reels i Stories",
      "Wersja skrócona 30–60 sekund",
    ],
    process: [
      {
        step: "Rozmowa o projekcie",
        description:
          "Pytam o nieruchomość, jej charakter i to, jak ma być wykorzystany film. Na tej podstawie planuję dzień nagrania.",
      },
      {
        step: "Wskazówki przed nagraniem",
        description:
          "Przesyłam wytyczne dotyczące przygotowania przestrzeni, żeby każde ujęcie wyglądało jak najlepiej.",
      },
      {
        step: "Dzień nagrania",
        description:
          "Nagrywam w naturalnym świetle, pracując przez przestrzeń spokojnie. Zazwyczaj to jeden dzień.",
      },
      {
        step: "Montaż i dostarczenie",
        description:
          "Przygotowuję wersję roboczą do akceptacji, uwzględniam uwagi i dostarczam gotowy materiał w uzgodnionych formatach.",
      },
    ],
    preparation: [
      "Posprzątaj i zdekoruj przestrzeń jak do sesji fotograficznej",
      "Usuń zbędne przedmioty z blatów, schowaj kable i ładowarki",
      "Zadbaj o czyste okna, otwórz zasłony i rolety",
      "Wymień przepalone żarówki, zadbaj o spójną temperaturę barwową",
      "Zaplanuj nagranie na porę najlepszego naturalnego światła",
    ],
    faq: [
      {
        question: "Czy film jest potrzebny przy sprzedaży nieruchomości?",
        answer:
          "Na rynku premium coraz częściej tak. Zdjęcia pokazują, jak mieszkanie wygląda. Film pozwala poczuć proporcje, kierunek światła i rytm przestrzeni.",
      },
      {
        question: "Jakie formaty dostarczam?",
        answer:
          "Dostarczam film w formatach dopasowanych do zastosowania: poziomym na stronę i YouTube, pionowym na Instagram i TikTok. Zawsze omawiamy to wcześniej.",
      },
    ],
    relatedProjectCategories: ["nieruchomosci"],
    seo: {
      title: "Filmy dla nieruchomości | Set & Space",
      description:
        "Krótkie, estetyczne filmy dla nieruchomości. Sprzedaż, wynajem i prezentacje inwestorskie. Instagram, social media, strona internetowa. Set & Space.",
      keywords: [
        "filmy dla nieruchomości",
        "video nieruchomości",
        "filmowanie nieruchomości",
        "rolki nieruchomości",
        "video nieruchomości na Instagram",
        "film nieruchomości",
      ],
    },
  },
  {
    slug: "filmy-dla-architektow-i-projektantow-wnetrz",
    shortTitle: "Filmy dla architektów i projektantów",
    title: "Filmy dla architektów i projektantów wnętrz",
    headline: "Architektura inaczej żyje w ruchu niż na zdjęciu.",
    intro:
      "Dokumentacja zrealizowanych projektów w formie, która oddaje intencję projektu, nie tylko jego wygląd. Przestrzeń zmienia się z ruchem kamery i światłem inaczej niż na zdjęciu.",
    body:
      "Nagrywam skończone realizacje dla pracowni architektonicznych i projektantów wnętrz. Zależy mi na tym, żeby film pokazał projekt tak, jak naprawdę wygląda: w naturalnym świetle, z faktyczną głębią i atmosferą, które trudno oddać fotografią. Materiał sprawdza się w portfolio, na stronie pracowni i w social mediach.",
    useCases: [
      "Portfolio pracowni architektonicznej",
      "Instagram i LinkedIn",
      "Strona internetowa studia",
      "Prezentacja klientom i inwestorom",
      "Branżowe portale i publikacje",
    ],
    deliverables: [
      "Film dokumentacyjny projektu",
      "Wersje pionowe na social media",
      "Krótka wersja do portfolio (do 60 sekund)",
    ],
    process: [
      {
        step: "Rozmowa o projekcie",
        description:
          "Pytam o intencję projektu i to, co chcesz pokazać. Planuję nagranie pod naturalne światło i logikę przestrzeni.",
      },
      {
        step: "Dzień nagrania",
        description:
          "Nagrywam po zakończeniu wszystkich prac. Pracuję z naturalnym światłem, często w kilku porach dnia.",
      },
      {
        step: "Montaż",
        description:
          "Montuję film tak, żeby poprowadził widza przez przestrzeń w logiczny i wizualnie spójny sposób.",
      },
      {
        step: "Dostarczenie",
        description:
          "Przekazuję gotowy materiał w uzgodnionych formatach do portfolio, strony lub social mediów.",
      },
    ],
    preparation: [
      "Upewnij się, że wszystkie prace wykończeniowe są zakończone",
      "Usuń tymczasowe elementy budowlane i narzędzia",
      "Zadbaj o ustawienie mebli i dekoracji zgodnie z projektem",
      "Poinformuj mnie wcześniej o szczegółach, które chcesz podkreślić",
    ],
    faq: [
      {
        question: "Czy filmowanie może odbywać się etapami?",
        answer:
          "Tak, w zależności od harmonogramu realizacji. Możemy zaplanować dokumentację zakończonego projektu lub kilka wizyt w różnych momentach prac.",
      },
      {
        question: "Co wyróżnia dobry film architektoniczny?",
        answer:
          "To, że pokazuje projekt, a nie tylko budynek. Ruch kamery przez przestrzeń, zmieniające się światło i rytm ujęć opowiadają o intencji projektu lepiej niż statyczne zdjęcia.",
      },
    ],
    relatedProjectCategories: ["architektura"],
    seo: {
      title: "Filmy dla architektów i projektantów wnętrz | Set & Space",
      description:
        "Krótkie filmy dokumentujące realizacje architektoniczne i projekty wnętrz. Portfolio w ruchu, social media, strona pracowni. Set & Space.",
      keywords: [
        "filmy dla architektów",
        "video dla architektów",
        "filmy dla projektantów wnętrz",
        "video wnętrz",
        "filmowanie wnętrz",
      ],
    },
  },
  {
    slug: "filmy-dla-salonow-meblowych-i-showroomow",
    shortTitle: "Filmy dla salonów meblowych",
    title: "Filmy dla salonów meblowych i showroomów",
    headline: "Meble wyglądają inaczej we własnym kontekście.",
    intro:
      "Prezentacja przestrzeni ekspozycyjnej i wybranych realizacji w formacie dopasowanym do social mediów i strony sklepu. Pokazuję meble tam, gdzie żyją, w konkretnym świetle i kontekście wnętrza.",
    body:
      "Nagrywam salony meblowe, showroomy i realizacje aranżacji wnętrz. Krótki film na Instagram pokazuje meble inaczej niż katalog: w ruchu, w prawdziwym świetle, w kontekście pomieszczenia. Takie materiały sprawdzają się zarówno w social mediach, jak i na stronie salonu.",
    useCases: [
      "Instagram i Reels",
      "Strona internetowa salonu",
      "Prezentacja wybranych kolekcji",
      "Dokumentacja realizacji aranżacji wnętrz",
      "Materiały sezonowe",
    ],
    deliverables: [
      "Krótki film prezentacyjny (do 60 sekund)",
      "Wersje pionowe na Instagram i TikTok",
      "Dłuższa wersja na stronę internetową",
    ],
    process: [
      {
        step: "Ustalenie celu",
        description:
          "Pytam, co chcesz pokazać: showroom jako całość, konkretną kolekcję czy wybrane realizacje u klientów.",
      },
      {
        step: "Dzień nagrania",
        description:
          "Nagrywam w Twoim salonie lub u klienta. Pracuję z naturalnym i sztucznym światłem dostępnym na miejscu.",
      },
      {
        step: "Montaż i muzyka",
        description:
          "Montuję materiał dopasowany do tempa social mediów. Dobór muzyki jest częścią procesu.",
      },
      {
        step: "Dostarczenie w formatach",
        description:
          "Przekazuję materiał w formatach gotowych do publikacji na Instagramie, stronie i innych kanałach.",
      },
    ],
    preparation: [
      "Przygotuj ekspozycję jak do sesji fotograficznej",
      "Sprawdź oświetlenie i usuń niepotrzebne elementy z planowanego kadru",
      "Zdecyduj, które produkty lub przestrzenie mają być w centrum",
      "Poinformuj mnie wcześniej o planowanym zastosowaniu materiału",
    ],
    faq: [
      {
        question: "Czy nagrania odbywają się tylko w showroomie?",
        answer:
          "Nie, nagrywam też realizacje aranżacji u klientów. Dokumentacja prawdziwych wnętrz sprawdza się szczególnie dobrze w social mediach.",
      },
      {
        question: "Jak długi film jest optymalny na Instagram?",
        answer:
          "Reels do 30–60 sekund angażują najlepiej. Jeśli potrzebujesz dłuższej wersji na stronę internetową, przygotuję ją jako osobny format.",
      },
    ],
    relatedProjectCategories: ["architektura"],
    seo: {
      title: "Filmy dla salonów meblowych i showroomów | Set & Space",
      description:
        "Krótkie filmy dla salonów meblowych, showroomów i realizacji wnętrz. Instagram, Reels, strona salonu. Set & Space.",
      keywords: [
        "filmy dla salonów meblowych",
        "video dla salonów meblowych",
        "filmy showroomów",
        "video showroomu",
        "rolki dla salonu meblowego",
        "filmy mebli",
      ],
    },
  },
  {
    slug: "filmy-dla-butikowych-hoteli",
    shortTitle: "Filmy dla butikowych hoteli",
    title: "Filmy dla butikowych hoteli",
    headline: "Nastrój miejsca, zanim gość dokona rezerwacji.",
    intro:
      "Materiał budujący nastrój miejsca. Coś więcej niż folder z pokojami. Pozwala poczuć atmosferę obiektu, zanim gość dokona rezerwacji.",
    body:
      "Tworzę krótkie filmy promocyjne dla butikowych hoteli, pensjonatów i obiektów z charakterem. Zależy mi na tym, żeby film pokazał nie tylko jak wygląda obiekt, ale jak się w nim czuje. Taki materiał sprawdza się na stronie hotelu, Instagramie i przy kampaniach sezonowych.",
    useCases: [
      "Strona internetowa i rezerwacje online",
      "Instagram i social media",
      "Kampanie sezonowe",
      "Materiały dla portali OTA",
      "Prezentacja dla partnerów i inwestorów",
    ],
    deliverables: [
      "Film wizerunkowy",
      "Wersje pionowe na Instagram i Stories",
      "Krótka wersja do kampanii (do 30 sekund)",
    ],
    process: [
      {
        step: "Rozmowa o obiekcie",
        description:
          "Pytam o charakter hotelu, grupę gości i cel materiału. Planuję realizację pod naturalne światło i rytm obiektu.",
      },
      {
        step: "Przygotowanie przestrzeni",
        description:
          "Przed nagraniem przesyłam wskazówki, na co zwrócić uwagę. Hotel może pracować normalnie w dniu nagrania.",
      },
      {
        step: "Dzień nagrania",
        description:
          "Nagrywam spokojnie, bez nadmiaru sprzętu. Dopasowuję się do rytmu dnia i naturalnego oświetlenia obiektu.",
      },
      {
        step: "Montaż i przekazanie",
        description:
          "Przygotowuję wersję roboczą do akceptacji. Po poprawkach dostarczam gotowy materiał w uzgodnionych formatach.",
      },
    ],
    preparation: [
      "Przejdź przez każde filmowane pomieszczenie z perspektywy gościa",
      "Zadbaj o detale: czyste szyby, schowane kable, świeże kwiaty w recepcji",
      "Sprawdź żarówki i oświetlenie we wszystkich pomieszczeniach",
      "Poinformuj personel o dniu nagrania",
    ],
    faq: [
      {
        question: "Czy film można nakręcić w trakcie pracy hotelu?",
        answer:
          "Tak, planuję realizację tak, żeby minimalizować wpływ na gości i personel. Najlepsze ujęcia często powstają rano, przed największym ruchem.",
      },
      {
        question: "Ile trwa realizacja?",
        answer:
          "Zazwyczaj jeden dzień nagrania i do dwóch tygodni na montaż. Harmonogram ustalamy indywidualnie na etapie wyceny.",
      },
    ],
    relatedProjectCategories: ["hotele"],
    seo: {
      title: "Filmy dla butikowych hoteli | Set & Space",
      description:
        "Krótkie filmy promocyjne dla butikowych hoteli i obiektów z charakterem. Instagram, strona hotelu, kampanie sezonowe. Set & Space.",
      keywords: [
        "filmy dla hoteli",
        "video dla hoteli",
        "film promocyjny hotelu",
        "rolki dla hoteli",
        "video hotelu na Instagram",
      ],
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
