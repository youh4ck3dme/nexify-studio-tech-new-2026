const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const endpoint = `${baseUrl.replace(/\/$/, "")}/api/contact`;
const timestamp = new Date().toISOString();

const payload = {
  name: `[SMOKE] Nexify ${timestamp}`,
  email: process.env.SMOKE_FROM_EMAIL || "smoke-test@example.com",
  phone: "000000000",
  message: `[SMOKE] Kontaktný smoke test ${timestamp}`,
};

async function main() {
  if (!process.env.RESEND_API_KEY && !baseUrl.startsWith("http")) {
    console.error("Set RESEND_API_KEY for local smoke or SMOKE_BASE_URL for remote.");
    process.exit(1);
  }

  console.log(`POST ${endpoint}`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    parsed = body;
  }

  if (!response.ok) {
    console.error(`Smoke failed (${response.status}):`, parsed);
    process.exit(1);
  }

  console.log("Smoke passed:", parsed);
}

main().catch((error) => {
  console.error("Smoke error:", error);
  process.exit(1);
});
