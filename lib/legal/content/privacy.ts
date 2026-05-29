import type { LegalDocument } from "../types";

export const privacyDocument: LegalDocument = {
  slug: "ochrana-sukromia",
  title: "Ochrana súkromia",
  description:
    "Informácie o spracúvaní osobných údajov na webovej stránke Nexify Studio v súlade s GDPR.",
  sections: [
    {
      id: "prevadzkovatel",
      title: "1. Prevádzkovateľ",
      paragraphs: [
        "Prevádzkovateľom osobných údajov je MA.GI.CA., s.r.o., IČO 31677517, DIČ 2020491550, so sídlom Partizánska 101/45, 965 01 Žiar nad Hronom, Slovenská republika (ďalej len „prevádzkovateľ“).",
        "Obchodná značka webovej stránky je Nexify Studio. Kontakt pre otázky ochrany údajov: magicasro@hotmail.com.",
      ],
    },
    {
      id: "rozsah",
      title: "2. Rozsah spracovania",
      paragraphs: [
        "Tieto zásady sa vzťahujú na web nexify-studio.tech, produktový katalóg, kontaktný formulár, PWA funkcionalitu a súvisiace technické služby potrebné na prevádzku webu.",
      ],
    },
    {
      id: "udaje",
      title: "3. Aké údaje spracúvame",
      paragraphs: [
        "Kontaktný formulár: meno, e-mail, telefón (voliteľný) a text správy, ktoré dobrovoľne zadáte pri dopyte.",
        "Technické údaje: IP adresa, typ prehliadača, čas požiadavky a podobné logy generované pri návšteve webu a pri volaní API.",
        "Analytika: agregované údaje o návštevnosti cez Vercel Analytics (bez profilovania jednotlivých návštevníkov cookies na strane analytiky).",
        "PWA a service worker: ukladanie statických súborov do cache prehliadača na účely offline prístupu a rýchlejšieho načítania.",
      ],
    },
    {
      id: "ucel",
      title: "4. Účel a právny základ",
      paragraphs: [
        "Odpoveď na váš dopyt a predzmluvná komunikácia — plnenie opatrení pred uzatvorením zmluvy (čl. 6 ods. 1 písm. b) GDPR).",
        "Prevádzka, bezpečnosť a zlepšovanie webu — oprávnený záujem prevádzkovateľa (čl. 6 ods. 1 písm. f) GDPR).",
        "Analytika návštevnosti — oprávnený záujem na pochopenie používania webu (čl. 6 ods. 1 písm. f) GDPR), ak neudelíte súhlas s voliteľnými cookies.",
      ],
    },
    {
      id: "prijemcovia",
      title: "5. Príjemcovia a sprostredkovatelia",
      paragraphs: [
        "Vercel Inc. — hosting, CDN a analytika webu.",
        "Resend — odosielanie e-mailov z kontaktného formulára prevádzkovateľovi.",
        "Tretie strany spracúvajú údaje len v rozsahu potrebnom na poskytnutie služby a na základe zmlúv o spracúvaní údajov, ak je to vyžadované.",
      ],
    },
    {
      id: "doba",
      title: "6. Doba uchovávania",
      paragraphs: [
        "Dopyty z kontaktného formulára uchovávame maximálne 3 roky od poslednej komunikácie, ak zákon nevyžaduje dlhšiu lehotu.",
        "Technické logy uchováva hosting podľa svojich pravidiel, spravidla niekoľko dní až mesiacov.",
      ],
    },
    {
      id: "prava",
      title: "7. Vaše práva",
      paragraphs: [
        "Máte právo na prístup, opravu, vymazanie, obmedzenie spracovania, námietku a prenosnosť údajov v rozsahu stanovenom GDPR.",
        "Sťažnosť môžete podať Úradu na ochranu osobných údajov SR: www.dataprotection.gov.sk.",
        "Žiadosti posielajte na magicasro@hotmail.com.",
      ],
    },
    {
      id: "bezpecnost",
      title: "8. Bezpečnosť",
      paragraphs: [
        "Web beží cez HTTPS. API kľúče a citlivé konfigurácie sú uložené ako serverové premenné prostredia, nie v klientskom kóde.",
        "Kontaktný formulár prechádza serverovou validáciou pred odoslaním e-mailu.",
      ],
    },
  ],
};
