import type { Metadata } from "next";
import { business } from "@/data/business";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Polityka prywatności — Set & Space",
  description:
    "Polityka prywatności serwisu Set & Space. Informacje o przetwarzaniu danych osobowych, plikach cookie i prawach użytkowników.",
  alternates: { canonical: `${business.url}/polityka-prywatnosci` },
  robots: { index: true, follow: false },
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div
      style={{
        padding: "5.5rem 1.5rem 5rem",
        maxWidth: "860px",
        margin: "0 auto",
      }}
    >
      <Breadcrumb items={[{ label: "Polityka prywatności" }]} />

      <h1
        className="text-headline"
        style={{ color: "var(--text-primary)", marginBottom: "0.75rem" }}
      >
        Polityka prywatności
      </h1>
      <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "3rem" }}>
        Ostatnia aktualizacja: 30 sierpnia 2026
      </p>

      <div className="prose">
        <h2>Administrator danych</h2>
        <p>
          Administratorem danych osobowych przetwarzanych w związku z korzystaniem z serwisu{" "}
          <strong>setandspace.pl</strong> jest{" "}
          <strong>
            {business.legalName} z siedzibą w {business.address.cityLocative},{" "}
            {business.address.street}, {business.address.postalCode} {business.address.city},
            NIP: {business.nip}, KRS: {business.krs}, REGON: {business.regon}
          </strong>
          .
        </p>
        <p>
          W sprawach dotyczących ochrony danych osobowych możesz skontaktować się pod adresem
          e-mail:{" "}
          <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>

        <h2>Jakie dane przetwarzamy i w jakim celu</h2>

        <h3>Formularz kontaktowy</h3>
        <p>
          Gdy kontaktujesz się za pośrednictwem formularza kontaktowego, przetwarzamy dane
          podane dobrowolnie: imię lub pseudonim, adres e-mail oraz treść wiadomości. Dane
          te służą wyłącznie do udzielenia odpowiedzi na Twoje zapytanie.
        </p>
        <p>
          Podstawa prawna: art. 6 ust. 1 lit. b RODO (działania niezbędne do podjęcia przed
          zawarciem umowy) lub art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes
          administratora polegający na obsłudze korespondencji).
        </p>
        <p>
          Dane są przechowywane przez czas niezbędny do obsługi zapytania i nie dłużej niż
          jest to uzasadnione.
        </p>

        <h3>Dane techniczne i logi serwera</h3>
        <p>
          Dostawca hostingu (Vercel) może automatycznie rejestrować dane techniczne dostępu do
          serwisu, takie jak adres IP, dane przeglądarki, data i godzina żądania. Dane te
          przetwarzane są przez Vercel jako odrębny administrator w celu zapewnienia bezpieczeństwa
          i stabilności usługi, zgodnie z własną polityką prywatności dostępną na{" "}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            vercel.com/legal/privacy-policy
          </a>
          .
        </p>

        <h2>Hosting</h2>
        <p>
          Serwis jest hostowany przez Vercel Inc. z siedzibą w Stanach Zjednoczonych. Vercel
          przetwarza dane w ramach standardowych klauzul umownych (SCC) i innych mechanizmów
          zapewniających zgodność z RODO przy przekazywaniu danych poza EOG.
        </p>

        <h2>Pliki cookie i lokalne przechowywanie danych</h2>

        <h3>Niezbędne mechanizmy techniczne</h3>
        <p>
          Serwis może korzystać z plików cookie lub mechanizmu localStorage niezbędnych do
          prawidłowego działania.
        </p>

        <h3>Zapamiętywanie Twojego wyboru prywatności</h3>
        <p>
          Twój wybór dotyczący opcjonalnych narzędzi analitycznych (Akceptuję / Odrzucam)
          jest zapisywany lokalnie w przeglądarce za pomocą mechanizmu localStorage pod
          kluczem <code>ss-analytics-consent</code>. Dane te nie są przesyłane na serwer
          i pozostają wyłącznie na Twoim urządzeniu. Możesz je usunąć w dowolnym momencie
          z poziomu ustawień przeglądarki lub klikając{" "}
          <strong>&bdquo;Ustawienia prywatności&rdquo;</strong> w stopce strony.
        </p>

        <h3>Google Analytics 4 (opcjonalne, za zgodą)</h3>
        <p>
          Serwis jest przygotowany do korzystania z Google Analytics 4 w celu analizy ruchu
          i poprawy jakości treści. Narzędzie to <strong>nie jest aktualnie aktywne</strong>.
          Zostanie uruchomione wyłącznie po uzupełnieniu konfiguracji i uzyskaniu Twojej
          zgody. W przypadku aktywacji GA4 może zbierać dane o sesjach, stronach i zdarzeniach;
          dane są przetwarzane przez Google Ireland Limited zgodnie z polityką prywatności
          Google.
        </p>
        <p>
          Podstawa prawna dla opcjonalnej analityki: art. 6 ust. 1 lit. a RODO (zgoda). Zgodę
          możesz wycofać w dowolnym momencie — patrz sekcja &bdquo;Wycofanie zgody&rdquo;.
        </p>

        <h2>Czcionki</h2>
        <p>
          Serwis korzysta z czcionek Syne oraz Cormorant Garamond dostarczanych przez Google
          Fonts. Czcionki są pobierane i obsługiwane lokalnie przez infrastrukturę hostingu —
          przeglądarka użytkownika <strong>nie wysyła żądań</strong> bezpośrednio do serwerów
          Google podczas przeglądania serwisu.
        </p>

        <h2>Osadzone materiały wideo (Vimeo i YouTube)</h2>
        <p>
          Serwis docelowo będzie prezentować materiały wideo z platform Vimeo oraz YouTube.
          Stosujemy mechanizm click-to-play: iframe ładowany jest wyłącznie po kliknięciu
          przez użytkownika, nie automatycznie. Ogranicza to zbieranie danych przez platformy
          zewnętrzne przed podjęciem świadomej decyzji o odtworzeniu materiału.
        </p>
        <p>
          Dla materiałów YouTube stosujemy domenę <code>youtube-nocookie.com</code>, która
          ogranicza cookies ustawiane przed interakcją z odtwarzaczem.
        </p>
        <p>
          Po kliknięciu przycisku odtwarzania platformy Vimeo i YouTube mogą zbierać dane
          zgodnie z własnymi politykami prywatności.
        </p>
        <p>
          Aktualnie serwis <strong>nie prezentuje żadnych aktywnych materiałów wideo</strong>.
        </p>

        <h2>Twoje prawa</h2>
        <p>Na podstawie RODO przysługują Ci następujące prawa:</p>
        <ul>
          <li>
            <strong>Prawo dostępu</strong> — możesz uzyskać informację o tym, jakie Twoje
            dane przetwarzamy.
          </li>
          <li>
            <strong>Prawo do sprostowania</strong> — możesz żądać poprawienia danych
            nieprawidłowych lub uzupełnienia niekompletnych.
          </li>
          <li>
            <strong>Prawo do usunięcia</strong> — możesz żądać usunięcia danych w przypadkach
            przewidzianych w art. 17 RODO.
          </li>
          <li>
            <strong>Prawo do ograniczenia przetwarzania</strong> — możesz żądać ograniczenia
            przetwarzania w przypadkach określonych w art. 18 RODO.
          </li>
          <li>
            <strong>Prawo do przenoszenia danych</strong> — dotyczy danych przetwarzanych
            na podstawie zgody lub umowy, w sposób zautomatyzowany.
          </li>
          <li>
            <strong>Prawo do sprzeciwu</strong> — możesz wnieść sprzeciw wobec przetwarzania
            opartego na prawnie uzasadnionym interesie (art. 6 ust. 1 lit. f RODO).
          </li>
        </ul>
        <p>
          Aby skorzystać z powyższych praw, skontaktuj się pod adresem:{" "}
          <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>

        <h2>Wycofanie zgody</h2>
        <p>
          Jeżeli przetwarzanie odbywa się na podstawie Twojej zgody (np. cookies analityczne),
          masz prawo wycofać ją w dowolnym momencie. Wycofanie zgody nie wpływa na zgodność
          z prawem przetwarzania, które miało miejsce przed jej wycofaniem.
        </p>
        <p>
          Wybór dotyczący cookies analitycznych możesz zmienić klikając{" "}
          <strong>&bdquo;Ustawienia prywatności&rdquo;</strong> w stopce strony. Możesz też usunąć dane
          z localStorage bezpośrednio w ustawieniach przeglądarki.
        </p>

        <h2>Prawo wniesienia skargi do organu nadzorczego</h2>
        <p>
          Masz prawo wnieść skargę do organu nadzorczego właściwego w sprawach ochrony danych
          osobowych. W Polsce jest to Prezes Urzędu Ochrony Danych Osobowych (UODO):
        </p>
        <ul>
          <li>ul. Stawki 2, 00-193 Warszawa</li>
          <li>
            <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer">
              uodo.gov.pl
            </a>
          </li>
        </ul>

        <h2>Zmiany polityki prywatności</h2>
        <p>
          Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej polityce prywatności.
          O istotnych zmianach poinformujemy przez aktualizację daty &bdquo;Ostatnia aktualizacja&rdquo;
          widocznej na górze tej strony. Prosimy o regularne zapoznawanie się z aktualną
          wersją dokumentu.
        </p>
      </div>
    </div>
  );
}
