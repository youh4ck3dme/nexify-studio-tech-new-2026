"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { companyLegal } from "@/lib/legal/company";
import { ArrowRight, Envelope, Phone, Sparkle } from "@phosphor-icons/react";
import { AnimatedTetrahedron } from "./animated-tetrahedron";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError("Meno, email a správa sú povinné.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setSubmitError(result.error || "Správu sa nepodarilo odoslať.");
        return;
      }

      setSubmitSuccess("Správa bola úspešne odoslaná. Ozveme sa vám čoskoro.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setSubmitError("Došlo k chybe siete. Skúste to znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 lg:py-36 bg-background text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`apple-glass rounded-3xl p-8 lg:p-16 border border-foreground/10 relative overflow-hidden transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2997FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left content */}
            <div className="flex-1 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2997FF] mb-3 inline-flex items-center gap-2">
                <Sparkle className="w-4 h-4" weight="fill" /> Začnite Hneď
              </span>
              <h2 className="text-4xl lg:text-6xl font-semibold tracking-[-0.03em] mb-6 apple-gradient-text">
                Buďte súčasťou toho, čo príde.
              </h2>

              <p className="text-lg text-foreground/70 mb-10 leading-relaxed">
                Spojte sa s našimi špecialistami a zistite, ako môže Nexify naštartovať rast vašej značky.
              </p>

              <form onSubmit={handleSubmit} className="w-full space-y-4" aria-busy={isSubmitting}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Vaše meno *"
                    autoComplete="name"
                    className="w-full h-12 px-4 border border-foreground/10 bg-foreground/5 text-foreground placeholder:text-foreground/40 rounded-xl outline-none focus:border-[#2997FF] transition-all"
                  />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Pracovný email *"
                    autoComplete="email"
                    className="w-full h-12 px-4 border border-foreground/10 bg-foreground/5 text-foreground placeholder:text-foreground/40 rounded-xl outline-none focus:border-[#2997FF] transition-all"
                  />
                </div>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Telefónne číslo (voliteľné)"
                  autoComplete="tel"
                  className="w-full h-12 px-4 border border-foreground/10 bg-foreground/5 text-foreground placeholder:text-foreground/40 rounded-xl outline-none focus:border-[#2997FF] transition-all"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Ako vám môžeme pomôcť? *"
                  rows={4}
                  className="w-full px-4 py-3 border border-foreground/10 bg-foreground/5 text-foreground placeholder:text-foreground/40 rounded-xl outline-none resize-none focus:border-[#2997FF] transition-all"
                />

                <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-[#2997FF] hover:bg-[#0071E3] text-white px-8 h-14 text-base font-semibold rounded-full disabled:opacity-60 shadow-xl shadow-[#2997FF]/25 transition-all hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="size-4 mr-2" />
                        Odosielam…
                      </>
                    ) : (
                      <>
                        Vyžiadať si Demo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {submitError && (
                <p className="text-sm text-red-400 mt-4 font-medium" role="alert">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="text-sm text-emerald-400 mt-4 font-medium" role="status">
                  {submitSuccess}
                </p>
              )}

              <div className="flex items-center flex-wrap gap-4 text-xs text-foreground/50 mt-8 font-mono">
                <a href={`mailto:${companyLegal.email}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Envelope className="w-4 h-4" weight="fill" /> {companyLegal.email}
                </a>
                <span className="opacity-30 hidden sm:inline">|</span>
                <a href={`tel:${companyLegal.phone}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4" weight="fill" /> {companyLegal.phoneDisplay}
                </a>
              </div>
            </div>

            {/* Right animation */}
            <div className="hidden lg:flex items-center justify-center w-100 h-100">
              <AnimatedTetrahedron />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
