import type { LegalDocument } from "../types";

export const termsDocument: LegalDocument = {
  slug: "podmienky",
  title: "Všeobecné obchodné podmienky",
  description:
    "Podmienky používania webu a objednávania služieb Nexify Studio od MA.GI.CA., s.r.o.",
  sections: [
    {
      id: "vymedzenie",
      title: "1. Vymedzenie",
      paragraphs: [
        "Poskytovateľom služieb je MA.GI.CA., s.r.o., IČO 31677517, obchodná značka Nexify Studio.",
        "Web nexify-studio.tech slúži na prezentáciu služieb, produktového katalógu a zber dopytov. Nie je to automatizovaný e-shop s okamžitou objednávkou.",
      ],
    },
    {
      id: "sluzby",
      title: "2. Služby",
      paragraphs: [
        "Ponúkame digitálny vývoj: firemné weby, e-commerce, PWA, mobilné aplikácie, AI riešenia a bezpečnostné služby podľa produktového katalógu.",
        "Ceny uvedené na webe sú orientačné. Záväzná ponuka a rozsah prác vzniká až po dohode a písomnej alebo e-mailovej akceptácii.",
      ],
    },
    {
      id: "objednavka",
      title: "3. Objednávka a komunikácia",
      paragraphs: [
        "Dopyt môžete odoslať kontaktným formulárom, e-mailom alebo telefonicky. Odoslaním dopytu nevzniká zmluvný vzťah.",
        "Prevádzkovateľ sa vám ozve s návrhom riešenia, cenou a harmonogramom.",
      ],
    },
    {
      id: "platba",
      title: "4. Platobné podmienky",
      paragraphs: [
        "Platobné podmienky sa dohodnú individuálne (záloha, fakturácia po etapách, jednorazová platba).",
        "Faktúra sa vystavuje v EUR podľa platnej legislatívy SR.",
      ],
    },
    {
      id: "dodanie",
      title: "5. Dodacie lehoty",
      paragraphs: [
        "Termín dodania závisí od zvoleného produktu a rozsahu projektu. Orientačné lehoty sú uvedené pri jednotlivých produktoch v katalógu.",
      ],
    },
    {
      id: "reklamacie",
      title: "6. Reklamácie",
      paragraphs: [
        "Reklamáciu uplatnite e-mailom na magicasro@hotmail.com s popisom vady a požadovaným riešením.",
        "Lehoty a spôsob vybavenia reklamácie sa riadia dohodnutou zmluvou a príslušnými ustanoveniami Občianskeho zákonníka.",
      ],
    },
    {
      id: "autorske",
      title: "7. Autorské práva",
      paragraphs: [
        "Obsah webu, dizajn a zdrojový kód sú chránené autorským právom, ak nie je dohodnuté inak.",
        "Po úhrade dohodnutej ceny môže klient získať licenciu na dodané dielo podľa zmluvy o dielo.",
      ],
    },
    {
      id: "zodpovednost",
      title: "8. Obmedzenie zodpovednosti",
      paragraphs: [
        "Informácie na webe majú informatívny charakter. Prevádzkovateľ nezodpovedá za rozhodnutia učinené výhradne na základe orientačných cien bez písomnej ponuky.",
        "Podrobná zodpovednosť za dodanie služieb sa riadi individuálnou zmluvou.",
      ],
    },
    {
      id: "zaver",
      title: "9. Záverečné ustanovenia",
      paragraphs: [
        "Tieto podmienky sa riadia právom Slovenskej republiky.",
        "Prevádzkovateľ môže podmienky aktualizovať. Platné znenie je vždy zverejnené na tejto stránke.",
      ],
    },
  ],
};
