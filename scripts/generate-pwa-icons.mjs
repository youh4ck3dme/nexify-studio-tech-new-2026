import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const sourceSvg = path.join(publicDir, "icon.svg");

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

async function writePng(name, size, buffer) {
  const out = path.join(publicDir, name);
  await sharp(buffer).resize(size, size).png().toFile(out);
  console.log(`wrote ${name}`);
}

async function writeMaskable(name, size, buffer) {
  const out = path.join(publicDir, name);
  const inset = Math.round(size * 0.1);
  const inner = size - inset * 2;
  const icon = await sharp(buffer).resize(inner, inner).png().toBuffer();
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: icon, gravity: "centre" }])
    .png()
    .toFile(out);
  console.log(`wrote ${name}`);
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  const svgBuffer = await sharp(sourceSvg).png().toBuffer();

  for (const { name, size } of sizes) {
    await writePng(name, size, svgBuffer);
  }

  await writeMaskable("android-chrome-512x512-maskable.png", 512, svgBuffer);
  console.log("favicon.ico: ponechaný existujúci súbor v public/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
