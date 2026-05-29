"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { companyLegal } from "@/lib/legal/company";
import { ArrowRight } from "lucide-react";
import { AnimatedTetrahedron } from "./animated-tetrahedron";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

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

      setSubmitSuccess("Správa bola odoslaná. Ozveme sa čo najskôr.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setSubmitError("Došlo k chybe siete. Skúste to znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)`
            }}
          />
          
          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left content */}
              <div className="flex-1">
                <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                  Nechajte nás zviditeľniť
                  <br />
                  váš business!
                </h2>

                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  Získajte bezplatnú konzultáciu už dnes. 
                  Bez povinnosti, bez skrytých poplatkov.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-xl space-y-4"
                  aria-busy={isSubmitting}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Meno"
                      autoComplete="name"
                      className="h-12 min-h-[44px] px-4 border border-foreground/20 bg-background/80 text-foreground rounded-md outline-none focus:border-foreground input-glow"
                    />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      autoComplete="email"
                      className="h-12 min-h-[44px] px-4 border border-foreground/20 bg-background/80 text-foreground rounded-md outline-none focus:border-foreground input-glow"
                    />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Telefón (voliteľné)"
                    autoComplete="tel"
                    className="w-full h-12 min-h-[44px] px-4 border border-foreground/20 bg-background/80 text-foreground rounded-md outline-none focus:border-foreground input-glow"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Vaša správa"
                    rows={5}
                    className="w-full px-4 py-3 border border-foreground/20 bg-background/80 text-foreground rounded-md outline-none resize-none focus:border-foreground input-glow"
                  />

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 min-h-[44px] text-base rounded-full group disabled:opacity-60 btn-micro"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner className="size-4 mr-2" />
                          Odosielam…
                        </>
                      ) : (
                        <>
                          Kontaktujte nás
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
                    >
                      Objednajte termín
                    </Button>
                  </div>
                </form>

                {submitError && (
                  <p className="text-sm text-red-500 mt-4" role="alert" aria-live="polite">
                    {submitError}
                  </p>
                )}
                {submitSuccess && (
                  <p className="text-sm text-green-600 mt-4" role="status" aria-live="polite">
                    {submitSuccess}
                  </p>
                )}

                <p className="text-sm text-muted-foreground mt-8 font-mono">
                  📧 {companyLegal.email} | 📞 {companyLegal.phoneDisplay}
                </p>
              </div>

              {/* Right animation */}
              <div className="hidden lg:flex items-center justify-center w-[500px] h-[500px] -mr-16">
                <AnimatedTetrahedron />
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
