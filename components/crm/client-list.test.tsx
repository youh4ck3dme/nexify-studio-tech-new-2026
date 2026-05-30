import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ClientList } from "./client-list";
import { db } from "@/lib/db";

describe("ClientList Component", () => {
  beforeEach(async () => {
    await db.clients.clear();
    await db.offlineQueue.clear();
  });

  it("by mal zobraziť prázdny stav, ak nie sú žiadni klienti", async () => {
    render(<ClientList />);
    
    // Dexie live query potrebuje chvíľu na tick
    await waitFor(() => {
      expect(screen.getByText(/Zatiaľ nemáte žiadnych klientov/i)).toBeInTheDocument();
    });
  });

  it("by mal zobraziť klientov vytiahnutých z lokálnej Dexie DB", async () => {
    await db.clients.add({
      name: "Anna Nováková",
      email: "anna@novakova.sk",
      service: "Webstránka",
      status: "Nový lead",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    render(<ClientList />);

    await waitFor(() => {
      expect(screen.getByText("Anna Nováková")).toBeInTheDocument();
      expect(screen.getByText("anna@novakova.sk")).toBeInTheDocument();
    });
  });

  it("by mal varovať používateľa, ak vo fronte čakajú nesynchronizované offline dáta", async () => {
    await db.offlineQueue.add({
      action: "CREATE_CLIENT",
      payload: { name: "Offline Test" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    render(<ClientList />);

    await waitFor(() => {
      expect(screen.getByText(/Čaká na sync:/i)).toBeInTheDocument();
      // Overenie, že sa ukazuje počet 1
      expect(screen.getByText(/1/i)).toBeInTheDocument();
    });
  });
});
