import { cookiesDocument } from "./content/cookies";
import { privacyDocument } from "./content/privacy";
import { termsDocument } from "./content/terms";

export { companyLegal, legalRoutes } from "./company";
export { cookiesDocument } from "./content/cookies";
export { privacyDocument } from "./content/privacy";
export { termsDocument } from "./content/terms";
export type { LegalDocument, LegalSection } from "./types";

export const legalDocuments = [
  privacyDocument,
  termsDocument,
  cookiesDocument,
] as const;
