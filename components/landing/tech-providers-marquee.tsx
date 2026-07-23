import { techProviders } from "@/lib/tech-providers";
import { ProviderWordmark } from "@/components/landing/provider-wordmark";

export function TechProvidersMarquee() {
  return (
    <div className="mt-24 pt-12 border-t border-foreground/10">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-8 text-center">
        Technológie, na ktorých staviame
      </p>
      <div
        className="w-full overflow-hidden -mx-6 px-6 lg:-mx-12 lg:px-12 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        aria-label="Logá technologických partnerov a platforiem"
      >
        <div className="flex gap-4 md:gap-5 items-center marquee">
          {[...Array(2)].map((_, setIdx) => (
            <div
              key={setIdx}
              aria-hidden={setIdx > 0}
              className="flex gap-4 md:gap-5 items-center shrink-0 py-2"
            >
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
