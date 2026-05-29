import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const out = path.join(publicDir, "og-image.png");
const iconPath = path.join(publicDir, "android-chrome-512x512.png");

const iconSize = 200;
const iconLeft = 80;
const iconTop = Math.round((630 - iconSize) / 2);
const textLeft = iconLeft + iconSize + 48;

const icon = await sharp(iconPath).resize(iconSize, iconSize).png().toBuffer();

const textSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#FCFCFC"/>
  <text x="${textLeft}" y="280" font-family="Georgia, serif" font-size="96" font-weight="700" fill="#1D1D1F">Nexify Studio</text>
  <text x="${textLeft}" y="360" font-family="ui-monospace, monospace" font-size="28" fill="#6E6E73">Digitálne riešenia pre rast podnikania</text>
  <rect x="${textLeft}" y="400" width="120" height="4" fill="#1D1D1F"/>
  <text x="${textLeft}" y="480" font-family="ui-sans-serif, sans-serif" font-size="22" fill="#6E6E73">nexify-studio.tech</text>
</svg>
`;

await sharp(Buffer.from(textSvg))
  .composite([{ input: icon, left: iconLeft, top: iconTop }])
  .png()
  .toFile(out);

console.log("Wrote", out);
