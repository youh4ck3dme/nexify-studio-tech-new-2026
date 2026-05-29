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
    <div className="max-w-3xl mb-16 lg:mb-20">
      <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6">
        {eyebrow}
      </span>
      <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-6">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl">{description}</p>
    </div>
  );
}
