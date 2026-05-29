import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../public/og-image.png");

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#ffffff"/>
  <text x="80" y="280" font-family="Georgia, serif" font-size="96" font-weight="700" fill="#0a0a0a">Nexify Studio</text>
  <text x="80" y="360" font-family="ui-monospace, monospace" font-size="28" fill="#525252">Digitálne riešenia pre rast biznisu</text>
  <rect x="80" y="400" width="120" height="4" fill="#0a0a0a"/>
  <text x="80" y="480" font-family="ui-sans-serif, sans-serif" font-size="22" fill="#737373">nexify-studio.tech</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("Wrote", out);
