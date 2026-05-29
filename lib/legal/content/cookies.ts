import type { LegalDocument } from "../types";

export const cookiesDocument: LegalDocument = {
  slug: "cookies",
  title: "Zásady používania cookies",
  description:
    "Informácie o cookies a podobných technológiách na webovej stránke Nexify Studio.",
  sections: [
    {
      id: "co-su",
      title: "1. Čo sú cookies",
      paragraphs: [
        "Cookies sú malé textové súbory ukladané vo vašom prehliadači. Podobne fungujú aj localStorage a cache prehliadača.",
      ],
    },
    {
      id: "ake",
      title: "2. Čo používame",
      paragraphs: [
        "Nevyhnutné: uloženie vášho rozhodnutia o cookies (localStorage kľúč nexify-cookie-consent-v1).",
        "Analytické: Vercel Analytics — agregované metriky návštevnosti bez cookies tretích strán na meranie podľa dokumentácie Vercel.",
        "PWA: service worker (Serwist) ukladá statické súbory webu do cache pre rýchlejšie načítanie a offline režim.",
        "Marketingové cookies tretích strán momentálne nepoužívame.",
      ],
    },
    {
      id: "tabulka",
      title: "3. Prehľad",
      paragraphs: [
        "nexify-cookie-consent-v1 (localStorage) — zapamätanie súhlasu — nevyhnutné — trvalé do vymazania — Nexify Studio.",
        "Service Worker Cache — offline prístup a rýchlosť — nevyhnutné pre PWA — podľa prehliadača — Nexify Studio.",
        "Vercel Analytics — štatistika návštevnosti — analytické — session / agregované — Vercel.",
      ],
    },
    {
      id: "sprava",
      title: "4. Ako cookies spravovať",
      paragraphs: [
        "Pri prvej návšteve môžete prijať všetky cookies alebo len nevyhnutné.",
        "Cookies môžete kedykoľvek vymazať v nastaveniach prehliadača (Chrome, Safari, Firefox, Edge).",
        "Blokovanie nevyhnutných technológií môže obmedziť PWA alebo offline režim.",
      ],
    },
    {
      id: "zmeny",
      title: "5. Zmeny",
      paragraphs: [
        "Tieto zásady môžeme aktualizovať pri zmene technológií na webe. Dátum poslednej aktualizácie je uvedený v pätičke dokumentu.",
      ],
    },
  ],
};
