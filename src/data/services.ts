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
    slug: "filmy-dla-hoteli",
    shortTitle: "Filmy dla hoteli",
    title: "Filmy dla hoteli i obiektów hospitality",
    headline: "Twój hotel na ekranie — zanim gość przekroczy próg.",
    intro:
      "Tworzymy filmy promocyjne, które pozwalają poczuć atmosferę obiektu przed rezerwacją. Nie robimy folderów wideo. Budujemy narracje, które sprzedają doświadczenie.",
    body:
      "Każdy hotel ma swój klimat, który trudno opisać słowami, ale który od razu wyczuwa się po przekroczeniu progu. Naszą pracą jest przetłumaczenie tej atmosfery na język obrazu. Pracujemy z butikowym hotelami, pensjonatami górskimi, resortami spa i obiektami designerskimi w całej Polsce.",
    useCases: [
      "Film wizerunkowy dla strony www i rezerwacji online",
      "Materiał dla portali booking i OTA",
      "Treści dla mediów społecznościowych (Instagram, Facebook)",
      "Kampanie Google Ads / Meta Ads",
      "Pitch dla inwestorów lub grup hotelowych",
      "Materiały na targi turystyczne",
    ],
    deliverables: [
      "Film promocyjny (pełna wersja, typowo 1:30–3:30)",
      "Wersja skrócona :60 do reklam",
      "Wersje 9:16 dla Stories i Reels",
      "Zdjęcia stills z realizacji",
      "Surowy materiał B-roll do dalszego wykorzystania",
    ],
    process: [
      {
        step: "Brief i research",
        description:
          "Zanim pojawimy się z kamerą, rozmawiamy o tym, co czyni ten obiekt wyjątkowym. Co powinna poczuć osoba oglądająca film? Co ma zapamiętać?",
      },
      {
        step: "Plan produkcyjny",
        description:
          "Przygotowujemy harmonogram uwzględniający najlepsze pory dnia, aktywności gości, warunki oświetleniowe i logistykę obiektu.",
      },
      {
        step: "Realizacja",
        description:
          "1–3 dni zdjęciowe zależnie od skali obiektu. Pracujemy dyskretnie, by nie zakłócać codziennej pracy hotelu.",
      },
      {
        step: "Postprodukcja i kolor",
        description:
          "Montaż, korekcja barwna i oprawa dźwiękowa. Typowo 2–3 tygodnie od zakończenia zdjęć.",
      },
      {
        step: "Dostarczenie i konsultacja",
        description:
          "Przekazujemy gotowy materiał w uzgodnionych formatach. Służymy radą w kwestii dystrybucji.",
      },
    ],
    preparation: [
      "Zadbaj o czystość i porządek we wszystkich filmowanych pomieszczeniach",
      "Upewnij się, że wnętrza są właściwie oświetlone (sprawdź żarówki, żaluzje)",
      "Przygotuj obiekty na zdjęcia: usuń zbędne przedmioty, zadbaj o detale",
      "Zaplanuj, które aktywności i przestrzenie chcesz pokazać",
      "Poinformuj pracowników o dniu zdjęciowym",
    ],
    faq: [
      {
        question: "Ile kosztuje film dla hotelu?",
        answer:
          "Cena zależy od skali obiektu, liczby dni zdjęciowych, oczekiwanej długości i wersji materiałów. Skontaktuj się z nami. Przygotujemy wycenę po krótkim briefie.",
      },
      {
        question: "Ile czasu zajmuje realizacja?",
        answer:
          "Typowy projekt trwa od 1 do 3 dni zdjęciowych plus 2–4 tygodnie postprodukcji. Harmonogram ustalamy indywidualnie.",
      },
      {
        question: "Czy możecie filmować w trakcie pracy hotelu?",
        answer:
          "Tak — pracujemy dyskretnie i planujemy realizację tak, by minimalizować wpływ na gości i pracowników. Najlepsze ujęcia często udaje się zrobić rano, przed największym ruchem.",
      },
    ],
    relatedProjectCategories: ["hotele"],
    seo: {
      title: "Filmy dla hoteli i obiektów hospitality | Set & Space",
      description:
        "Kinematograficzne filmy promocyjne dla hoteli, pensjonatów i resortów. Uchwytujemy atmosferę miejsca, zanim gość przekroczy próg. Set & Space, Polska.",
      keywords: [
        "film dla hotelu",
        "filmy promocyjne dla hoteli",
        "video marketing hotelowy",
        "film promocyjny hotelu",
        "filmy hospitality",
        "video dla obiektu turystycznego",
      ],
    },
  },
  {
    slug: "video-nieruchomosci",
    shortTitle: "Video nieruchomości",
    title: "Video nieruchomości i apartamentów",
    headline: "Sprzedaj przestrzeń, zanim ktoś ją zobaczy na żywo.",
    intro:
      "Film nieruchomości to jeden z najskuteczniejszych narzędzi sprzedaży i marketingu na rynku premium. Tworzymy materiały, które pokazują przestrzeń z charakterem, nie z metrami kwadratowymi.",
    body:
      "Oferty z filmem wideo generują zdecydowanie większe zainteresowanie i angażują potencjalnych nabywców znacznie dłużej niż same zdjęcia. Współpracujemy z deweloperami premium, biurami nieruchomości i prywatnymi właścicielami, którym zależy na wyróżnieniu oferty na rynku.",
    useCases: [
      "Film dla portalu nieruchomości (Otodom, Morizon, OLX)",
      "Materiał na stronę inwestycji dewelopera",
      "Wideo dla kampanii digital",
      "Prezentacja dla agentów i kupujących",
      "Film wirtualnej wycieczki",
      "Materiał na Instagram i YouTube",
    ],
    deliverables: [
      "Film nieruchomości (1:30–3:00)",
      "Wersja skrócona :60 dla reklam",
      "Wybrane klatki stills",
      "Wersja pionowa dla Stories",
    ],
    process: [
      {
        step: "Brief i ogląd",
        description:
          "Rozmawiamy o nieruchomości, jej unikalnych cechach, grupie docelowej i pożądanym tonie materiału.",
      },
      {
        step: "Home staging guidance",
        description:
          "Podpowiadamy, jak przygotować nieruchomość do zdjęć, by wyglądała najlepiej na ekranie.",
      },
      {
        step: "Realizacja",
        description:
          "Najczęściej jeden dzień zdjęciowy, zaplanowany pod optymalne warunki świetlne.",
      },
      {
        step: "Postprodukcja",
        description:
          "Montaż, korekcja barwna, muzyka, teksty (opcjonalnie). Czas: 7–14 dni.",
      },
    ],
    preparation: [
      "Posprzątaj i zdekoruj nieruchomość jak do sesji fotograficznej",
      "Usuń niepotrzebne przedmioty, kable, bibeloty",
      "Zadbaj o świeże kwiaty lub rośliny jako akcenty dekoracyjne",
      "Upewnij się, że okna są czyste — przepuszczają więcej naturalnego światła",
      "Sprawdź, czy wszystkie żarówki działają i mają tę samą temperaturę barwową",
      "Zaplanuj nakręcenie widoków o najbardziej atrakcyjnej porze dnia",
    ],
    faq: [
      {
        question: "Czy film nieruchomości jest potrzebny przy sprzedaży?",
        answer:
          "Na rynku premium coraz częściej tak. Kupujący oczekują więcej niż suchych zdjęć — chcą poczuć przestrzeń przed decyzją o wizycie.",
      },
      {
        question: "Czy filmujecie z drona?",
        answer:
          "Tak — w zależności od lokalizacji i potrzeb projektu. Ujęcia z powietrza świetnie sprawdzają się przy domach z ogrodem, dużych działkach lub nieruchomościach z atrakcyjnym otoczeniem.",
      },
    ],
    relatedProjectCategories: ["nieruchomosci"],
    seo: {
      title: "Video nieruchomości i filmowanie apartamentów | Set & Space",
      description:
        "Kinematograficzne filmy nieruchomości dla deweloperów, biur i prywatnych sprzedających. Pokaż przestrzeń z charakterem. Set & Space, Polska.",
      keywords: [
        "video nieruchomości",
        "film nieruchomości",
        "filmowanie mieszkania",
        "film domu",
        "wideo marketing nieruchomości",
        "film dla dewelopera",
        "filmowanie apartamentów",
      ],
    },
  },
  {
    slug: "filmy-architektury-i-wnetrz",
    shortTitle: "Architektura i wnętrza",
    title: "Filmy architektury i wnętrz",
    headline: "Architektura zasługuje na ruch.",
    intro:
      "Projekty architektoniczne i aranżacje wnętrz żyją inaczej w filmie niż na fotografii — zmieniają się z perspektywą, ruchem i światłem. Tworzymy materiały, które oddają tę czwartą wymiar projektu.",
    body:
      "Współpracujemy z pracowniami architektonicznymi, projektantami wnętrz, studia projektowymi i inwestorami. Nasze filmy służą jako portfolio, materiał do prasy i publikacji, treść na strony oraz narzędzie do prezentacji klientom.",
    useCases: [
      "Portfolio pracowni architektonicznej",
      "Film na stronę www studia",
      "Materiał do branżowych portali i magazynów",
      "Prezentacja dla klientów i inwestorów",
      "Film dokumentujący budowę/remont",
      "Content na Instagram i LinkedIn",
    ],
    deliverables: [
      "Film główny (2:00–6:00 zależnie od projektu)",
      "Wersja portfolio :90",
      "Seria krótkich ujęć na social media",
      "Fotografia architektoniczna (opcjonalnie)",
    ],
    process: [
      {
        step: "Wizja twórcza",
        description:
          "Każdy projekt architektoniczny ma nastrój. Rozmawiamy z architektem o tym, co projekt ma opowiadać — o materiale, świetle, funkcji.",
      },
      {
        step: "Reconnaissance",
        description:
          "Często przed dniem zdjęciowym odwiedzamy obiekt, by zaplanować kąty, pory dnia i kolejność ujęć.",
      },
      {
        step: "Realizacja",
        description:
          "Praca na miejscu, często w kilku porach dnia, przy różnych warunkach naturalnego oświetlenia.",
      },
      {
        step: "Opowieść",
        description:
          "Postprodukcja skupiona na narracji — jak film prowadzi widza przez przestrzeń i co mu opowiada.",
      },
    ],
    preparation: [
      "Upewnij się, że wszystkie prace wykończeniowe są zakończone",
      "Usuń tymczasowe elementy budowlane i narzędzia",
      "Zadbaj o meble i dekoracje — finalny wystrój jak do oddania klientowi",
      "Omów z nami, które elementy projektu chcesz szczególnie podkreślić",
    ],
    faq: [
      {
        question: "Czy filmujecie w trakcie budowy?",
        answer:
          "Tak — dokumentacja budowy to osobna specjalizacja. Możemy zrealizować zarówno film procesu jak i finalną dokumentację gotowego projektu.",
      },
      {
        question: "Co wyróżnia dobry film architektoniczny?",
        answer:
          "Dobry film architektoniczny idzie dalej niż samo pokazanie budynku. Opowiada o nim. Pokazuje relację między przestrzenią a człowiekiem, między architekturą a otoczeniem. Nie jest katalogiem ujęć, lecz doświadczeniem.",
      },
    ],
    relatedProjectCategories: ["architektura"],
    seo: {
      title: "Filmy architektury i filmowanie wnętrz | Set & Space",
      description:
        "Kinematograficzne filmy dla pracowni architektonicznych i projektantów wnętrz. Portfolio w ruchu, przestrzeń w obrazie. Set & Space, Polska.",
      keywords: [
        "film architektury",
        "filmowanie wnętrz",
        "video wnętrz",
        "film dla architekta",
        "video dla biura architektonicznego",
        "film architektoniczny",
        "dokumentacja architektoniczna",
      ],
    },
  },
  {
    slug: "filmy-reklamowe",
    shortTitle: "Filmy reklamowe",
    title: "Filmy reklamowe i brand content",
    headline: "Marka, która ma coś do powiedzenia — powinna to powiedzieć obrazem.",
    intro:
      "Tworzymy filmy reklamowe i brand content dla wybranych marek, których estetyka współgra z naszym podejściem do obrazu. Pracujemy z markami z sektora design, lifestyle, hospitality i premium consumer.",
    body:
      "Nie jesteśmy dla każdej marki — i to jest zamierzone. Pracujemy tam, gdzie klient rozumie, że film to nie po prostu ruchome zdjęcia, a środek wyrazu budujący tożsamość marki.",
    useCases: [
      "Film wizerunkowy marki",
      "Kampania reklamowa (TV, online, OOH)",
      "Film produktowy z narracją",
      "Content na social media",
      "Materiał dla inwestorów i partnerów",
      "Film dokumentujący markę / behind the scenes",
    ],
    deliverables: [
      "Film reklamowy główny (15–90s zależnie od formatu)",
      "Pakiet wersji do różnych kanałów",
      "Materiał dodatkowy / making of",
    ],
    process: [
      {
        step: "Warsztat briefu",
        description:
          "Rozmawiamy o marce, jej wartościach i tym, co ma wywołać film. Nie robimy nic bez solidnego briefu.",
      },
      {
        step: "Koncepcja i scenariusz",
        description:
          "Przygotowujemy koncepcję kreatywną z opisem nastroju, podejścia i wizualnego języka.",
      },
      {
        step: "Preprodukcja",
        description:
          "Planowanie lokacji, castingu (jeśli potrzebny), harmonogramu i logistyki.",
      },
      {
        step: "Realizacja",
        description:
          "Jeden lub kilka dni zdjęciowych zależnie od skali projektu.",
      },
      {
        step: "Postprodukcja",
        description:
          "Montaż, VFX (jeśli potrzebne), kolor, dźwięk, muzyka lub voiceover.",
      },
    ],
    preparation: [
      "Przygotuj brief obejmujący: cel, grupę docelową, ton komunikacji, budżet",
      "Zbierz materiały o marce: logo, paleta kolorów, tone of voice",
      "Określ kanały dystrybucji i wymagania techniczne",
      "Zaplanuj zaangażowanie kluczowych decydentów po stronie marki",
    ],
    faq: [
      {
        question: "Ile kosztuje film reklamowy?",
        answer:
          "Zakres cenowy jest bardzo szeroki: zależy od koncepcji, ekipy, lokacji, castingu i wymagań postprodukcji. Krótki film produktowy to zupełnie inny budżet niż rozbudowana kampania telewizyjna. Porozmawiajmy. Dopasujemy zakres do możliwości.",
      },
      {
        question: "Czy pracujecie ze wszystkimi markami?",
        answer:
          "Nie. Wybieramy projekty, w których nasz styl ma sens — marki premium, design-oriented, hospitality i lifestyle. Nie robimy filmów sprzecznych z naszą estetyką.",
      },
    ],
    relatedProjectCategories: ["marki"],
    seo: {
      title: "Filmy reklamowe i brand content | Set & Space",
      description:
        "Produkcja filmów reklamowych i brand contentu dla marek premium. Estetyczna komunikacja, kinematograficzne podejście. Set & Space, Polska.",
      keywords: [
        "film reklamowy",
        "produkcja filmów reklamowych",
        "film promocyjny",
        "brand content",
        "produkcja video",
        "film wizerunkowy",
        "film dla marki",
      ],
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
