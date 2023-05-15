import { FooterNavigation } from "./types";

const FOOTER_NAVIGATION_LINKS: FooterNavigation = [
  [
    {
      title: "Navigation",
      links: [
        {
          title: "Startseite",
          to: "/",
        },
        {
          title: "Kita-Karte",
          to: "/finder",
        },
        {
          title: "PlatzFinder",
          to: "/service",
        },
      ],
    },
  ],
  [
    {
      title: "Kontakt",
      links: [
        {
          title: "Kontaktieren Sie uns",
          to: "mailto:hallo@kitaplatz-zentrale.de",
        },
      ],
    },
    {
      title: "Unternehmen",
      links: [
        {
          title: "Impressum",
          to: "/impressum",
        },
        {
          title: "Datenschutzerklärung",
          to: "/datenschutzerklaerung",
        },
      ],
    },
  ],
];

export default FOOTER_NAVIGATION_LINKS;
