#!/usr/bin/env node
// Vygeneruje bcrypt hash pre admin heslo, aby sa nikdy neukladalo plaintext.
// Použitie: node scripts/generate-admin-hash.mjs "<heslo>"
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Použitie: node scripts/generate-admin-hash.mjs \"<heslo>\"");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

// Next.js (@next/env) expanduje neescapované "$" ako shell-style premenné,
// čo v .env.local ticho vyprázdni bcrypt hash (začína "$2b$..."). V súbore
// musí byť každý "$" uvedený ako "\$". Vo Vercel env premenných (a inde mimo
// .env.local) sa táto escapovaná verzia NEPOUŽÍVA - tam vložte pôvodný hash.
const escapedForDotenv = hash.replace(/\$/g, "\\$");

console.log("\nADMIN_PASSWORD_HASH vygenerovaný.\n");
console.log("Pre .env.local (escapované \"$\" kvôli @next/env expanzii):");
console.log(`ADMIN_PASSWORD_HASH="${escapedForDotenv}"\n`);
console.log("Pre Vercel / iné env úložiská (neescapovaný pôvodný hash):");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
