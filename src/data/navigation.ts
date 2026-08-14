export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "Realizacje", href: "/realizacje" },
  { label: "Usługi", href: "/uslugi" },
  { label: "Współpraca", href: "/wspolpraca" },
  { label: "O mnie", href: "/o-mnie" },
  { label: "Poradniki", href: "/poradniki" },
  { label: "Kontakt", href: "/kontakt" },
];

export const serviceNav: NavLink[] = [
  { label: "Filmy dla nieruchomości", href: "/uslugi/filmy-dla-nieruchomosci" },
  { label: "Filmy dla architektów", href: "/uslugi/filmy-dla-architektow-i-projektantow-wnetrz" },
  { label: "Filmy dla salonów meblowych", href: "/uslugi/filmy-dla-salonow-meblowych-i-showroomow" },
  { label: "Filmy dla butikowych hoteli", href: "/uslugi/filmy-dla-butikowych-hoteli" },
];

export const footerLinks = {
  navigation: mainNav,
  services: serviceNav,
  legal: [
    { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
  ],
};
