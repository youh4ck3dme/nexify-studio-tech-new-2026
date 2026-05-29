"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";

const footerLinks = {
  Služby: [
    { name: "SEO Optimalizácia", href: "/#services" },
    { name: "Google Marketing", href: "/#services" },
    { name: "Custom Weby", href: "/#services" },
    { name: "Booking Systémy", href: "/#services" },
  ],
  Produkty: [
    { name: "Celý katalóg", href: "/produkty" },
    { name: "Firemná webová stránka", href: "/produkty/firemna-webova-stranka" },
    { name: "eCommerce platforma", href: "/produkty/ecommerce-platforma" },
    { name: "PWA aplikácia", href: "/produkty/pwa-aplikacia" },
  ],
  Spoločnosť: [
    { name: "O nás", href: "/#" },
    { name: "Ako to funguje", href: "/#how-it-works" },
    { name: "Referencie", href: "/#testimonials" },
    { name: "Cenník", href: "/#pricing" },
  ],
  Kontakt: [
    { name: "Email", href: "mailto:magicasro@hotmail.com" },
    { name: "Telefón", href: "tel:+421900123456" },
    { name: "+421 917 488 903", href: "tel:+421917488903" },
    { name: "Kontakt", href: "/#contact" },
    { name: "MA.GI.CA., s.r.o.", href: "#", isCompanyInfo: true },
    { name: "Partizánska 101/45, 965 01 Žiar nad Hronom", href: "#", isCompanyInfo: true },
    { name: "IČO: 31677517", href: "#", isCompanyInfo: true },
    { name: "DIČ: 2020491550", href: "#", isCompanyInfo: true },
  ],
  Právne: [
    { name: "Ochrana súkromia", href: "#" },
    { name: "Podmienky", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "#" },
  { name: "GitHub", href: "https://github.com/youh4ck3dme" },
  { name: "LinkedIn", href: "#" },
];

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display">Nexify Studio</span>
              </Link>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                Vaše digitálne partnerstvo. Pomáhame malým a stredným podnikom rastieť cez digital marketing, SEO a custom weby.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      {("isCompanyInfo" in link && link.isCompanyInfo) ? (
                        <div className="text-sm text-muted-foreground">
                          {link.name}
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                        >
                          {link.name}
                          {"badge" in link && link.badge && (
                            <span className="text-xs px-2 py-0.5 bg-foreground text-background rounded-full">
                              {link.badge}
                            </span>
                          )}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Nexify Studio. Všetky práva vyhradené.
          </p>

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
