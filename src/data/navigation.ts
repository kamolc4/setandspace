export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "Realizacje", href: "/realizacje" },
  { label: "Usługi", href: "/uslugi" },
  { label: "O nas", href: "/o-nas" },
  { label: "Journal", href: "/journal" },
  { label: "Kontakt", href: "/kontakt" },
];

export const serviceNav: NavLink[] = [
  { label: "Filmy dla hoteli", href: "/uslugi/filmy-dla-hoteli" },
  { label: "Video nieruchomości", href: "/uslugi/video-nieruchomosci" },
  { label: "Architektura i wnętrza", href: "/uslugi/filmy-architektury-i-wnetrz" },
  { label: "Filmy reklamowe", href: "/uslugi/filmy-reklamowe" },
];

export const footerLinks = {
  navigation: mainNav,
  services: serviceNav,
  legal: [
    { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
  ],
};
