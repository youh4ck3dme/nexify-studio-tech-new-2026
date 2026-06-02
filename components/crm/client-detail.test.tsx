import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ClientDetail } from "./client-detail";
import { db } from "@/lib/db";

// Mockovanie Next.js routra
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("ClientDetail Component", () => {
  let testClientId: number;

  beforeEach(async () => {
    await db.clients.clear();
    mockPush.mockClear();

    // Vytvorenie testovacieho klienta pred každým testom
    testClientId = await db.clients.add({
      companyName: "Firma ABC",
      email: "info@firma-abc.sk",
      service: "PWA aplikácia",
      status: "Vo vývoji",
      budget: "3000€+",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      syncStatus: "synced",
      tasks: [],
    });
  });

  it("by mal načítať a zobraziť detaily klienta", async () => {
    render(<ClientDetail clientId={testClientId.toString()} />);

    expect(await screen.findByText("Firma ABC")).toBeInTheDocument();
    expect(screen.getByText(/PWA Aplikácia/i)).toBeInTheDocument();
    expect(screen.getByText(/3000€/i)).toBeInTheDocument();
  });

  it("by mal presmerovať späť, ak klient neexistuje", async () => {
    render(<ClientDetail clientId="9999" />); // Neexistujúce ID

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/crm");
    });
  });

  it("by mal pridať novú úlohu do To-Do listu", async () => {
    const user = userEvent.setup();
    render(<ClientDetail clientId={testClientId.toString()} />);

    expect(await screen.findByText("Firma ABC")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Pridať novú úlohu...");
    const addButton = screen.getByRole("button", { name: /Pridať/i });

    await user.type(input, "Zavolať klientovi ohľadom dizajnu");
    await user.click(addButton);

    // Overenie, že sa úloha zobrazí na obrazovke
    expect(await screen.findByText("Zavolať klientovi ohľadom dizajnu")).toBeInTheDocument();

    // Overenie, že sa uložila do databázy
    const client = await db.clients.get(testClientId);
    expect(client?.tasks).toHaveLength(1);
    expect(client?.tasks?.[0].text).toBe("Zavolať klientovi ohľadom dizajnu");
    expect(client?.tasks?.[0].done).toBe(false);
  });
});
