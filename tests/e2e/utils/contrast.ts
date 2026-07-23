import type { Page } from "@playwright/test";

/**
 * Scans visible text elements on the page and flags ones whose computed text
 * color is nearly indistinguishable from their effective background color
 * (walking up the DOM to the nearest ancestor with an opaque-enough
 * background).
 *
 * This is a regression guard for the class of bug found on /crm: a
 * component styled for a dark backdrop (e.g. `text-white`) rendered on a
 * light background because an ancestor's theme scope changed. It is
 * intentionally looser than full WCAG contrast (ratio < 1.5, i.e. "visually
 * identical"), since the goal is catching invisible text, not enforcing
 * accessibility-grade contrast ratios.
 */
export async function findLowContrastText(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    function relativeLuminance(r: number, g: number, b: number): number {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    // Canvas rasterization normalizes ANY CSS color syntax (rgb(), hsl(),
    // oklab(), oklch(), color(), named colors, ...) to concrete sRGBA byte
    // values, since Chrome's getComputedStyle() may echo back oklab()/oklch()
    // strings for Tailwind v4's color-mix()-based opacity utilities instead
    // of normalizing to rgb().
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    function toRgba(colorStr: string): [number, number, number, number] {
      if (!ctx) return [0, 0, 0, 0];
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000000";
      try {
        ctx.fillStyle = colorStr;
      } catch {
        return [0, 0, 0, 0];
      }
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    }

    // Walk up from `el`, collecting every ancestor's (possibly translucent)
    // background, then alpha-composite them outermost-to-innermost ("over"
    // operator) so a faint tint like `bg-white/5` is blended against what's
    // actually behind it instead of being treated as opaque white.
    function effectiveBackground(el: Element): [number, number, number] {
      const layers: Array<[number, number, number, number]> = [];
      let node: Element | null = el;
      while (node) {
        const [r, g, b, a] = toRgba(getComputedStyle(node).backgroundColor);
        if (a > 0.001) layers.push([r, g, b, a]);
        if (a >= 0.999) break;
        node = node.parentElement;
      }

      let [rr, rg, rb] = [255, 255, 255];
      for (let i = layers.length - 1; i >= 0; i--) {
        const [r, g, b, a] = layers[i];
        rr = r * a + rr * (1 - a);
        rg = g * a + rg * (1 - a);
        rb = b * a + rb * (1 - a);
      }
      return [rr, rg, rb];
    }

    const issues: string[] = [];
    const candidates = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, p, a, button, label, span, li")
    );

    for (const el of candidates) {
      // Only consider elements whose own direct text (not descendants) carries content.
      const directText = Array.from(el.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent || "")
        .join("")
        .trim();
      if (directText.length < 2) continue;

      // Disabled controls are conventionally styled faint/low-contrast on
      // purpose to signal "unavailable" (axe-core exempts them too) - that's
      // intended de-emphasis, not an invisible-text bug.
      if (el.closest(":disabled, [aria-disabled='true']")) continue;

      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") continue;
      if (parseFloat(style.opacity) === 0) continue;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const [fr, fg, fb, fa] = toRgba(style.color);
      if (fa < 0.5) continue;

      const [br, bg, bb] = effectiveBackground(el);
      const l1 = relativeLuminance(fr, fg, fb) + 0.05;
      const l2 = relativeLuminance(br, bg, bb) + 0.05;
      const ratio = l1 > l2 ? l1 / l2 : l2 / l1;

      if (ratio < 1.5) {
        const tag = el.tagName.toLowerCase();
        const snippet = directText.slice(0, 40);
        issues.push(
          `<${tag}> "${snippet}" color=rgb(${fr},${fg},${fb}) bg=rgb(${br},${bg},${bb}) ratio=${ratio.toFixed(2)}`
        );
      }
    }

    return issues;
  });
}
