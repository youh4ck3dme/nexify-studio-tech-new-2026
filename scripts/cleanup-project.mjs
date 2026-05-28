import { execSync, spawnSync } from "node:child_process";
import { rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectName = "nexify-studio-tech-new-2026";

function run(command) {
  console.log(`$ ${command}`);
  try {
    execSync(command, { cwd: root, stdio: "inherit" });
  } catch {
    console.warn(`(warn) command failed: ${command}`);
  }
}

function killProjectProcesses() {
  const list = spawnSync("pgrep", ["-fl", projectName], { encoding: "utf-8" });
  if (list.status !== 0 || !list.stdout.trim()) {
    console.log("No project processes found.");
    return;
  }

  const pids = new Set();
  for (const line of list.stdout.split("\n")) {
    const match = line.match(/^(\d+)\s/);
    if (match) pids.add(match[1]);
  }

  for (const pid of pids) {
  if (pid === String(process.pid)) continue;
    console.log(`Killing PID ${pid}`);
    try {
      process.kill(Number(pid), "SIGTERM");
    } catch {
      // already gone
    }
  }
}

function freePorts() {
  for (const port of [3000, 3011, 3012, 3013]) {
    const result = spawnSync("lsof", ["-ti", `tcp:${port}`], { encoding: "utf-8" });
    if (result.status !== 0 || !result.stdout.trim()) continue;

    for (const pid of result.stdout.trim().split("\n")) {
      const cmd = spawnSync("ps", ["-p", pid, "-o", "command="], { encoding: "utf-8" });
      if (!cmd.stdout.includes(projectName)) continue;
      console.log(`Freeing port ${port} (PID ${pid})`);
      try {
        process.kill(Number(pid), "SIGKILL");
      } catch {
        // ignore
      }
    }
  }
}

console.log(`Cleanup: ${root}\n`);

killProjectProcesses();
freePorts();

for (const dir of [".next", "node_modules/.cache", ".turbo"]) {
  const target = path.join(root, dir);
  if (existsSync(target)) {
    console.log(`Removing ${dir}`);
    rmSync(target, { recursive: true, force: true });
  }
}

if (existsSync(path.join(root, "public/sw.js"))) {
  console.log("Removing generated public/sw.js");
  rmSync(path.join(root, "public/sw.js"), { force: true });
}

run("pnpm store prune");

console.log("\nCleanup done. Start fresh with: pnpm dev");
