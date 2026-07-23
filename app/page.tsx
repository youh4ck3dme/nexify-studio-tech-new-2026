import { AppleSubnav } from "@/components/landing/apple-subnav";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { HeroSection } from "@/components/landing/hero-section";
import { BentoFeatures } from "@/components/landing/bento-features";
import { AiPlaygroundSection } from "@/components/landing/ai-playground";
import { AppleHowItWorks } from "@/components/landing/apple-how-it-works";
import { AppleComparisonMatrix } from "@/components/landing/apple-comparison-matrix";
import { MetricsSection } from "@/components/landing/metrics-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CategoryMarqueeSection } from "@/components/landing/category-marquee-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-[#2997FF]/30 selection:text-white">
      <AppleSubnav />
      <HeroSection />
      <CategoryMarqueeSection />
      <RevealOnScroll>
        <BentoFeatures />
      </RevealOnScroll>
      <AiPlaygroundSection />
      <AppleHowItWorks />
      <RevealOnScroll delay={0.04}>
        <AppleComparisonMatrix />
      </RevealOnScroll>
      <RevealOnScroll delay={0.08}>
        <MetricsSection />
      </RevealOnScroll>
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
