type CatalogHeroProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function CatalogHero({
  title,
  description,
  eyebrow = "Produktový katalóg",
}: CatalogHeroProps) {
  return (
    <div className="max-w-3xl mb-16 lg:mb-20 relative">
      <div className="inline-flex items-center gap-2 mb-6">
        <span className="pulse-red-dot" />
        <span className="font-mono text-xs tracking-widest text-brand-red font-semibold uppercase">
          {eyebrow}
        </span>
      </div>
      <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-6">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">{description}</p>
      <div className="mt-8 h-1 w-24 bg-gradient-to-r from-brand-red via-brand-blue to-transparent rounded-full opacity-80" />
    </div>
  );
}
