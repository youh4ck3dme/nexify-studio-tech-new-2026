import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ClientList } from "./client-list";
import { db } from "@/lib/db";

describe("ClientList Component", () => {
  beforeEach(async () => {
    await db.clients.clear();
    await db.offlineQueue.clear();
  });

  it("by mal zobraziť prázdny stav, ak nie sú žiadni klienti", async () => {
    render(<ClientList onEditClient={vi.fn()} />);
    
    // Dexie live query potrebuje chvíľu na tick
    await waitFor(() => {
      expect(screen.getByText(/Žiadni klienti nezodpovedajú vybraným filtrom/i)).toBeInTheDocument();
    });
  });

  it("by mal zobraziť klientov vytiahnutých z lokálnej Dexie DB", async () => {
    await db.clients.add({
      companyName: "Anna Nováková",
      email: "anna@novakova.sk",
      service: "Web stránka",
      status: "Lead",
      syncStatus: "synced",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    render(<ClientList onEditClient={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Anna Nováková")).toBeInTheDocument();
      expect(screen.getByText("anna@novakova.sk")).toBeInTheDocument();
    });
  });

  it("by mal varovať používateľa, ak vo fronte čakajú nesynchronizované offline dáta", async () => {
    await db.offlineQueue.add({
      entityType: "client",
      entityId: "temp-id",
      action: "create",
      payload: { companyName: "Offline Test" },
      createdAt: Date.now(),
      retryCount: 0,
    });

    render(<ClientList onEditClient={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Čaká na sync:/i)).toBeInTheDocument();
      // Overenie, že sa ukazuje počet 1
      expect(screen.getByText(/1/i)).toBeInTheDocument();
    });
  });
});
