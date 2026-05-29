import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { db } from "./index";

describe("NexifyDatabase (Dexie Offline DB)", () => {
  beforeEach(async () => {
    // Pred každým testom vyčistíme databázu, aby mali testy čistý štít
    await db.clients.clear();
    await db.offlineQueue.clear();
  });

  afterAll(async () => {
    // Na konci testovania úplne odstránime DB, aby nezostala v pamäti
    await db.delete();
  });

  it("malo by úspešne vytvoriť a načítať klienta z tabuľky clients", async () => {
    const timestamp = Date.now();
    
    // Uloženie klienta do DB
    const id = await db.clients.add({
      name: "Jozef Mak",
      email: "jozef@example.com",
      phone: "+421900111222",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    // Kontrola či ID bolo vygenerované automaticky (auto-increment)
    expect(id).toBeDefined();
    expect(typeof id).toBe("number");

    // Načítanie klienta späť pomocou ID
    const client = await db.clients.get(id);
    expect(client).toBeDefined();
    expect(client?.name).toBe("Jozef Mak");
    expect(client?.email).toBe("jozef@example.com");
  });

  it("malo by úspešne pridať a získať akciu do offlineQueue", async () => {
    const timestamp = Date.now();
    
    // Vytvorenie offline akcie napr. pri výpadku pripojenia
    const id = await db.offlineQueue.add({
      action: "SEND_FORM",
      payload: { message: "Testovacia správa bez pripojenia" },
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    expect(id).toBeDefined();

    // Načítanie všetkých úloh z fronty
    const actions = await db.offlineQueue.toArray();
    expect(actions).toHaveLength(1);
    expect(actions[0]?.action).toBe("SEND_FORM");
    
    // Type casting kvôli 'unknown' typu z interface
    const payload = actions[0]?.payload as { message: string };
    expect(payload.message).toBe("Testovacia správa bez pripojenia");
  });
});
