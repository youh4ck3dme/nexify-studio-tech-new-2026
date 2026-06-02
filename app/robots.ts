import type { MetadataRoute } from "next";
import { companyLegal } from "@/lib/legal/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/~offline", "/crm", "/crm/"],
    },
    sitemap: `${companyLegal.website}/sitemap.xml`,
  };
}
