"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";
import { companyLegal, legalRoutes } from "@/lib/legal/company";

const footerLinks = {
  Služby: [
    { name: "Firemné weby", href: "/sluzby/firemne-weby" },
    { name: "eCommerce platformy", href: "/sluzby/ecommerce" },
    { name: "Mobilné aplikácie", href: "/sluzby/mobilne-aplikacie" },
    { name: "Katalóg produktov", href: "/produkty" },
  ],
  Spoločnosť: [
    { name: "Ako to funguje", href: "/#how-it-works" },
    { name: "Naše referencie", href: "/#testimonials" },
    { name: "Cenník služieb", href: "/#pricing" },
    { name: "Kontaktujte nás", href: "/#contact" },
  ],
  Právne: [
    { name: "Ochrana súkromia", href: legalRoutes.privacy },
    { name: "Obchodné podmienky", href: legalRoutes.terms },
    { name: "Zásady cookies", href: legalRoutes.cookies },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/youh4ck3dme" },
];

type FooterLink = {
  name: string;
  href?: string;
  isCompanyInfo?: true;
};

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10">
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-8">
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display">{companyLegal.brandName}</span>
              </Link>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                Vaše digitálne partnerstvo. Pomáhame malým a stredným podnikom rastieť cez digitálny
                marketing, SEO a custom weby.
              </p>

              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {(links as FooterLink[]).map((link) => (
                    <li key={link.name}>
                      {link.isCompanyInfo ? (
                        <div className="text-sm text-muted-foreground">{link.name}</div>
                      ) : link.href ? (
                        link.href.startsWith("/") ? (
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {link.name}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                          >
                            {link.name}
                            {link.href.startsWith("http") ? (
                              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            ) : null}
                          </a>
                        )
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-4">
            <p>© 2026 {companyLegal.brandName}. Všetky práva vyhradené.</p>
            <span className="hidden sm:inline opacity-50">|</span>
            <p>Prevádzkuje: {companyLegal.legalName}, IČO: {companyLegal.ico}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Všetky systémy v poriadku
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
