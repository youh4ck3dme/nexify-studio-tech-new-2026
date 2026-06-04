import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Tento endpoint zavolá Service Worker na pozadí zakaždým, 
// keď sa aplikácia pripojí na internet a má niečo v offlineQueue.
export async function POST(req: Request) {
  try {
    const queue = await req.json();

    if (!Array.isArray(queue) || queue.length === 0) {
      return NextResponse.json({ success: true, processed: 0 });
    }

    // Uistíme sa, že tabuľky vo Vercel Postgres existujú
    await createTablesIfNotExist();

    let processedCount = 0;

    // Postupne prejdeme a aplikujeme všetky akcie z offline fronty
    for (const item of queue) {
      const { entityType, action, payload } = item;

      if (entityType === "client") {
        await processClientAction(action, payload as Record<string, unknown>);
      } else if (entityType === "activity") {
        await processActivityAction(action, payload as Record<string, unknown>);
      } else if (entityType === "task") {
        // Fallback pre task
        await processTaskAction();
      }

      processedCount++;
    }

    return NextResponse.json({ success: true, processed: processedCount });

  } catch (error) {
    console.error("[Sync API] Chyba pri synchronizácii:", error);
    return NextResponse.json({ success: false, error: "Zlyhalo spracovanie sync požiadavky" }, { status: 500 });
  }
}

// Inicializácia relačnej schémy
async function createTablesIfNotExist() {
  await sql`
    CREATE TABLE IF NOT EXISTS crm_clients (
      id SERIAL PRIMARY KEY,
      local_id INTEGER UNIQUE,
      company_name VARCHAR(255) NOT NULL,
      contact_name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(255),
      website VARCHAR(255),
      service VARCHAR(100),
      status VARCHAR(100),
      budget VARCHAR(100),
      notes TEXT,
      tasks JSONB DEFAULT '[]',
      created_at BIGINT,
      updated_at BIGINT,
      deleted_at BIGINT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS crm_activities (
      id SERIAL PRIMARY KEY,
      local_id INTEGER UNIQUE,
      client_local_id INTEGER,
      type VARCHAR(50),
      title VARCHAR(255),
      content TEXT,
      created_at BIGINT
    );
  `;
}

// Mapovanie TypeScript objektu do SQL tabuľky klienta
async function processClientAction(action: string, payload: Record<string, unknown>) {
  const localId = payload.id as number;
  const companyName = payload.companyName as string;
  const contactName = payload.contactName as string;
  const email = payload.email as string;
  const phone = payload.phone as string;
  const website = payload.website as string;
  const service = payload.service as string;
  const status = payload.status as string;
  const budget = payload.budget as string;
  const notes = payload.notes as string;
  const tasks = payload.tasks;
  const createdAt = payload.createdAt as number;
  const updatedAt = payload.updatedAt as number;
  const deletedAt = payload.deletedAt as number | null;
  
  const tasksJson = tasks ? JSON.stringify(tasks) : '[]';

  if (action === "create" || action === "update") {
    await sql`
      INSERT INTO crm_clients (local_id, company_name, contact_name, email, phone, website, service, status, budget, notes, tasks, created_at, updated_at, deleted_at)
      VALUES (${localId}, ${companyName}, ${contactName}, ${email}, ${phone}, ${website}, ${service}, ${status}, ${budget}, ${notes}, ${tasksJson}::jsonb, ${createdAt}, ${updatedAt}, ${deletedAt})
      ON CONFLICT (local_id) 
      DO UPDATE SET 
        company_name = EXCLUDED.company_name,
        contact_name = EXCLUDED.contact_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        website = EXCLUDED.website,
        service = EXCLUDED.service,
        status = EXCLUDED.status,
        budget = EXCLUDED.budget,
        notes = EXCLUDED.notes,
        tasks = EXCLUDED.tasks,
        updated_at = EXCLUDED.updated_at,
        deleted_at = EXCLUDED.deleted_at;
    `;
  } else if (action === "delete") {
    // Hard delete v DB (ak to chceme naozaj zmazať natrvalo). 
    // Pri soft delete príde action="update" s deletedAt.
    await sql`DELETE FROM crm_clients WHERE local_id = ${localId}`;
  }
}

// Mapovanie aktivity
async function processActivityAction(action: string, payload: Record<string, unknown>) {
  const localId = payload.id as number;
  const clientId = payload.clientId as number;
  const type = payload.type as string;
  const title = payload.title as string;
  const content = payload.content as string;
  const createdAt = payload.createdAt as number;

  if (action === "create" || action === "update") {
    await sql`
      INSERT INTO crm_activities (local_id, client_local_id, type, title, content, created_at)
      VALUES (${localId}, ${clientId}, ${type}, ${title}, ${content}, ${createdAt})
      ON CONFLICT (local_id)
      DO UPDATE SET
        type = EXCLUDED.type,
        title = EXCLUDED.title,
        content = EXCLUDED.content;
    `;
  } else if (action === "delete") {
    await sql`DELETE FROM crm_activities WHERE local_id = ${localId}`;
  }
}

async function processTaskAction() {
  // Akcie na konkrétny task sa v našej implementácii aktualizujú na klientovi a potom sa pošle action="update" na celého klienta
}
