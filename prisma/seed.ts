import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL is not set");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

const ARTICLES = [
  {
    slug: "jak-przygotowac-hotel-do-nagrania-filmu",
    title: "Jak przygotować hotel do nagrania filmu promocyjnego?",
    excerpt:
      "Dobry film zaczyna się od dobrego przygotowania. Kilka rzeczy, które możesz zrobić przed dniem nagrania, by materiał wyglądał jak najlepiej.",
    content: `## Porządek i staging

Zanim pojawi się kamera, warto przejść przez każdą przestrzeń z krytycznym okiem gościa, który widzi ją po raz pierwszy. Usuń zbędne przedmioty z blatów, wymień zniszczone elementy wystroju, zadbaj o świeże kwiaty w recepcji.

Szczególną uwagę zwróć na:
- **Łóżka:** pościel powinna być nienagannie biała lub dobrana do palety wnętrza
- **Łazienki:** czyste lustra, świeże ręczniki złożone estetycznie, brak mydeł i kosmetyków użytkowych
- **Restauracja i bar:** nakrycia stołów, detale, brak przypadkowych przedmiotów
- **Recepcja:** czysta lada, ukryte kable i dokumenty

## Oświetlenie

To jeden z najważniejszych elementów. Sprawdź wszystkie żarówki. Przepalona żarówka w lampce nocnej widać od razu. Zadbaj o spójną temperaturę barwową źródeł światła w każdym pomieszczeniu.

Przed nagraniem:
- Otwórz wszystkie zasłony i rolety — naturalne światło to najlepszy sprzymierzeniec
- Wyczyść szyby — zaskakująco mocno wpływają na jakość światła wpadającego do środka
- Wyłącz agresywne neonowe oświetlenie robocze tam, gdzie jest nieestetyczne

## Personel i goście

Poinformuj pracowników o dniu zdjęciowym. Zaplanuj, które aktywności obiektu chcesz pokazać — śniadanie, spa, recepcja. Jeśli zależy Ci na ujęciach z gośćmi, zaplanuj to wcześniej i uzyskaj odpowiednie zgody.

## Pora roku i pogoda

Najlepsze filmy hotelowe często korzystają z konkretnej pory roku — warto to zaplanować z wyprzedzeniem. Lato daje więcej naturalnego światła, jesień przynosi dramę i kolory, zima w górach tworzy magię mrozu i świec.

## Przed dniem nagrania

Skontaktuj się ze mną co najmniej tydzień wcześniej, by omówić:
- Plan dnia (które przestrzenie, w jakiej kolejności)
- Dostępność stref (SPA, restauracja, pokoje)
- Wszelkie ograniczenia techniczne

Dobre przygotowanie przekłada się bezpośrednio na efekt końcowy.`,
    category: "Produkcja",
    author: null,
    publishedAt: new Date("2026-04-08"),
    status: "PUBLISHED" as const,
    seoTitle: "Jak przygotować hotel do nagrania filmu promocyjnego? | Set & Space Poradniki",
    seoDescription:
      "Praktyczny przewodnik dla obiektów hotelowych: jak przygotować wnętrza, personel i harmonogram, by film promocyjny wyglądał jak najlepiej.",
    relatedService: "filmy-dla-butikowych-hoteli",
    faq: [
      {
        question: "Ile czasu przed nagraniem warto zacząć przygotowania?",
        answer:
          "Najlepiej co najmniej dwa tygodnie wcześniej. Daje to czas na drobne naprawy, uzupełnienie dekoracji i koordynację z personelem.",
      },
      {
        question: "Czy hotel musi być pusty podczas nagrania?",
        answer:
          "Absolutnie nie. Żywy, funkcjonujący hotel wygląda bardziej autentycznie. Planujemy realizację tak, by minimalizować dyskomfort gości.",
      },
    ],
  },
  {
    slug: "jak-przygotowac-mieszkanie-do-filmu-nieruchomosci",
    title: "Jak przygotować mieszkanie do filmu nieruchomości?",
    excerpt:
      "Film nieruchomości zaczyna się na długo przed dniem nagrania. Oto co możesz zrobić, by Twoje mieszkanie wyglądało jak z katalogu.",
    content: `## Declutter: mniej znaczy więcej

Kamera jest brutalnie szczera. Widzi każdy zbędny przedmiot, każdą kartkę na blacie, każdą parę butów przy wejściu. Przed dniem nagrania przeprowadź radykalne czyszczenie przestrzeni.

Co usunąć:
- Artykuły toaletowe z blatów łazienek
- Kable, ładowarki, przedłużacze
- Magnesy i zdjęcia z lodówki
- Zabawki i zbędne dekoracje
- Dokumenty i korespondencja z biurek

## Neutralizacja przestrzeni

Jeśli mieszkanie jest zamieszkałe, postaraj się je wizualnie zneutralizować — tak by potencjalny nabywca mógł wyobrazić sobie siebie w tej przestrzeni.

## Oświetlenie: klucz do nastroju

Naturalne światło jest bezcenne. Wyczyść okna, otwórz żaluzje i rolety. Uzupełnij oświetlenie sztuczne tak, by nie było zbyt zimne i dominujące — ciepłe, miękkie światło sprawia, że wnętrze wygląda przytulnie i przestronnie.

Zamień żarówki fluorescencyjne na ciepłe LED (2700–3000K) — różnica jest wyraźna na ekranie.

## Rośliny i kwiaty: prosty sposób na efekt

Kilka świeżych kwiatów lub zielona roślina pokojowa wizualnie ożywia przestrzeń. To jeden z najprostszych i najtańszych zabiegów stagingowych.

## Łazienka i kuchnia: miejsca na detale

Te dwa pomieszczenia wymagają szczególnej uwagi.

Łazienka: schowaj codzienne kosmetyki, zostaw tylko piękne ręczniki, może roślinę, wyczyść armaturę do połysku.

Kuchnia: wyczyść blaty, schowaj ekspres do kawy i inne sprzęty (chyba że są designerskie), zadbaj o świeże owoce lub zioła jako dekorację.

## Zewnętrze i balkon

Jeśli nieruchomość ma balkon, ogród lub taras — to potencjał, który warto pokazać. Upewnij się, że meble ogrodowe są czyste i estetycznie ustawione.

## Pora dnia ma znaczenie

Zaplanuj nagranie na porę, gdy do kluczowych pomieszczeń wpada najlepsze naturalne światło. Najczęściej jest to poranek lub wczesne popołudnie — zależy od orientacji mieszkania.`,
    category: "Nieruchomości",
    author: null,
    publishedAt: new Date("2026-04-24"),
    status: "PUBLISHED" as const,
    seoTitle: "Jak przygotować mieszkanie do filmu nieruchomości? | Set & Space Poradniki",
    seoDescription:
      "Przewodnik: jak przygotować mieszkanie lub apartament do profesjonalnego nagrania video. Staging, oświetlenie, porządek: wszystko, co ważne.",
    relatedService: "filmy-dla-nieruchomosci",
    faq: Prisma.JsonNull,
  },
  {
    slug: "jak-swiatlo-wplywa-na-wnetrze-w-filmie",
    title: "Jak światło wpływa na odbiór wnętrza w filmie?",
    excerpt:
      "Światło to nie dodatek do kadru, lecz materiał, z którego zbudowany jest każdy dobry film. Jak je czytać i dlaczego ma tak duże znaczenie.",
    content: `## Naturalne światło jest królem

Najlepsze filmy wnętrzarskie korzystają z naturalnego światła jako podstawy. Daje ono wnętrzu głębię, teksturę i autentyczność, której żadne sztuczne źródło nie odtworzy w pełni.

Dlatego planuję realizacje pod porę dnia i orientację okien. Pokój z oknami na południe będzie wyglądał inaczej o 8 rano i o 2 po południu — i oba te momenty mogą być piękne, ale na różne sposoby.

## Temperatura barwowa i spójność

Mieszanie zimnego dziennego światła z ciepłym oświetleniem sztucznym tworzy problemy na etapie postprodukcji i może sprawić, że wnętrze wygląda chaotycznie. Staram się pracować w jednej tonacji barwowej — albo naturalne, albo starannie dobrane sztuczne.

## Cień jest równie ważny jak światło

Cień definiuje formę. Bez cienia wnętrze jest płaskie. Dobrze ustawione oświetlenie tworzy głębię, eksponuje faktury i wprowadza trójwymiarowość. Kąt padania światła na beton, drewno czy tynk — to jest różnica między wnętrzem "płaskim" a wnętrzem, które "żyje".

## Złota godzina i niebieska godzina

Dwa szczególne momenty doby mają niesamowity wpływ na wygląd wnętrz:

**Złota godzina** (tuż po wschodzie lub przed zachodem słońca) — ciepłe, miękkie, złote światło. Idealne do wnętrz, które mają komunikować ciepło, przytulność i luksus.

**Niebieska godzina** (chwila po zachodzie) — chłodne, równe, dramatyczne. Nadaje wnętrzu nowoczesność i dramatyzm. Szczególnie efektowna przy rozświetlonych oknach.

## Konsekwencja w postprodukcji

Korekcja barwna (color grading) to etap, na którym oświetlenie wnętrza jest finalizowane i ujednolicane. Color grading to dla mnie część narracji, nie kosmetyka. Dobry colorist wzmacnia ciepło drewna, podkreśla chłód betonu, wyciąga szczegóły w cieniach.`,
    category: "Craft",
    author: null,
    publishedAt: new Date("2026-05-14"),
    status: "PUBLISHED" as const,
    seoTitle: "Jak światło wpływa na odbiór wnętrza w filmie? | Set & Space Poradniki",
    seoDescription:
      "Dlaczego światło to najważniejszy element kinematograficznego filmu wnętrzarskiego. Naturalne światło, temperatura barwowa i kolor w postprodukcji.",
    relatedService: "filmy-dla-architektow-i-projektantow-wnetrz",
    faq: Prisma.JsonNull,
  },
];

async function main() {
  console.log("Seeding articles...");
  for (const article of ARTICLES) {
    await db.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
    console.log(`  ✓ ${article.slug}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
