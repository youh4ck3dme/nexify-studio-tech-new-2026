export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  description: string;
  sections: LegalSection[];
};
