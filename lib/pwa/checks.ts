import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");
const publicDir = path.join(root, "public");

export type WebManifest = {
  name?: string;
  short_name?: string;
  display?: string;
  start_url?: string;
  scope?: string;
  icons?: Array<{ src: string; sizes: string; purpose?: string }>;
};

export function loadManifest(): WebManifest {
  const raw = readFileSync(
    path.join(publicDir, "manifest.webmanifest"),
    "utf-8"
  );
  return JSON.parse(raw) as WebManifest;
}

export function publicFileExists(relativePath: string) {
  const filePath = path.join(publicDir, relativePath.replace(/^\//, ""));
  return existsSync(filePath) && statSync(filePath).size > 0;
}

export function readProjectFile(relativePath: string) {
  return readFileSync(path.join(root, relativePath), "utf-8");
}
