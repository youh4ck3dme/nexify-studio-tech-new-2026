import { spawnSync } from "node:child_process";

const runs = 10;
let failed = 0;

for (let i = 1; i <= runs; i += 1) {
  console.log(`\n--- PWA test run ${i}/${runs} ---`);
  const result = spawnSync("pnpm", ["exec", "vitest", "run", "lib/pwa/pwa.test.ts"], {
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    failed += 1;
    console.error(`Run ${i} failed with exit code ${result.status}`);
  }
}

console.log(`\nSummary: ${runs - failed}/${runs} runs passed`);
process.exit(failed > 0 ? 1 : 0);
