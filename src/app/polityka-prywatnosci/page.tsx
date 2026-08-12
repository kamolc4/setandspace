import type { Metadata } from "next";
import { business } from "@/data/business";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Polityka prywatności serwisu Set & Space.",
  alternates: { canonical: `${business.url}/polityka-prywatnosci` },
  robots: { index: false },
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div
      style={{
        paddingTop: "5.5rem",
        paddingBottom: "5rem",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "5.5rem 1.5rem 5rem",
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
        Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
      </p>

      <div className="prose">
        {/* ⚠️ PLACEHOLDER — replace with legal text prepared by qualified legal advisor */}
        <div
          style={{
            backgroundColor: "var(--surface-alt)",
            borderRadius: "var(--radius-sm)",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            borderLeft: "3px solid var(--clay)",
          }}
        >
          <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Uwaga dla właściciela serwisu
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Poniższy tekst to szkielet przeznaczony do uzupełnienia przez prawnika.
            Nie stanowi porady prawnej ani kompletnej polityki prywatności.
            Przed uruchomieniem serwisu należy go zastąpić dokumentem przygotowanym
            przez kwalifikowanego doradcę prawnego.
          </p>
        </div>

        <h2>Administrator danych</h2>
        <p>
          Administratorem danych osobowych jest{" "}
          <strong>{business.name}</strong>, prowadzący działalność pod adresem
          {/* PLACEHOLDER — replace with real address */}
          [ADRES FIRMY].{" "}
          Kontakt w sprawach ochrony danych:{" "}
          <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>

        <h2>Jakie dane zbieramy</h2>
        <p>
          Serwis może zbierać następujące dane osobowe:
        </p>
        <ul>
          <li>Dane podane w formularzu kontaktowym (imię, adres e-mail, treść wiadomości)</li>
          <li>Dane analityczne zbierane automatycznie (jeśli korzystasz z narzędzi analitycznych)</li>
          <li>Pliki cookie niezbędne do działania serwisu oraz opcjonalne pliki analityczne</li>
        </ul>

        <h2>Cel i podstawa przetwarzania</h2>
        <p>
          Dane z formularza kontaktowego przetwarzamy w celu odpowiedzi na zapytania
          (art. 6 ust. 1 lit. b lub f RODO).
          {/* PLACEHOLDER — uzupełnij zgodnie z rzeczywistymi celami przetwarzania */}
        </p>

        <h2>Osadzanie treści zewnętrznych</h2>
        <p>
          Serwis może osadzać materiały wideo z platform Vimeo oraz YouTube.
          Platformy te mogą zbierać dane o Tobie zgodnie ze swoimi politykami
          prywatności. Korzystamy z wersji z rozszerzonym trybem prywatności
          YouTube (youtube-nocookie.com) tam, gdzie to możliwe.
        </p>

        <h2>Twoje prawa</h2>
        <p>
          Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia,
          ograniczenia przetwarzania oraz prawo do przenoszenia danych.
          Masz prawo wnieść sprzeciw wobec przetwarzania oraz skargę do Prezesa
          Urzędu Ochrony Danych Osobowych.
        </p>

        <h2>Pliki cookie</h2>
        <p>
          {/* PLACEHOLDER — opisz dokładnie jakie cookies są używane */}
          Serwis może używać plików cookie. Szczegółowe informacje o używanych
          plikach cookie oraz możliwość zarządzania nimi zostaną opisane po
          wdrożeniu systemu zarządzania zgodami.
        </p>

        <h2>Kontakt</h2>
        <p>
          W sprawach dotyczących ochrony danych prosimy o kontakt:{" "}
          <a href={`mailto:${business.email}`}>{business.email}</a>
        </p>
      </div>
    </div>
  );
}
