import { techProviders } from "@/lib/tech-providers";
import { ProviderWordmark } from "@/components/landing/provider-wordmark";

export function TechProvidersMarquee() {
  return (
    <div className="mt-24 pt-12 border-t border-foreground/10">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-8 text-center">
        Stack modernej AI a vývoja
      </p>
      <div className="w-full overflow-hidden -mx-6 lg:-mx-12">
        <div className="flex gap-12 md:gap-16 items-center marquee">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex gap-12 md:gap-16 items-center shrink-0">
              {techProviders.map((provider) => (
                <ProviderWordmark
                  key={`${setIdx}-${provider.id}`}
                  provider={provider}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
