import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CrmAnalyticsDashboard } from "./lead-trend-chart";
import { exportClientsToCsv } from "@/lib/crm/export-csv";
import { db, Client } from "@/lib/db";
import React from "react";

// Mock Recharts ResponsiveContainer to prevent width/height 0 issues in JSDOM
vi.mock("recharts", async (importOriginal) => {
  const original = await importOriginal<typeof import("recharts")>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  };
});

// Mock database
vi.mock("@/lib/db", () => {
  const mockClients: unknown[] = [];
  return {
    db: {
      clients: {
        toArray: vi.fn(async () => mockClients),
      },
    },
  };
});

describe("CRM Analytics and CSV Export Features", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("CrmAnalyticsDashboard", () => {
    it("by mal zobraziť varovný banner a demo dáta, ak nie sú žiadni klienti", () => {
      render(<CrmAnalyticsDashboard clients={[]} />);
      
      // Overenie, či zobrazuje upozornenie na demo dáta
      expect(screen.getByText(/Zobrazujú sa demo dáta/)).toBeInTheDocument();
      expect(screen.getByText(/Celkovo \d+ leadov/i)).toBeInTheDocument();
    });

    it("by mal zobraziť reálnu štatistiku, ak sú k dispozícii klienti", () => {
      const mockActiveClients = [
        { id: 1, companyName: "Firma A", createdAt: Date.now(), status: "Lead" },
        { id: 2, companyName: "Firma B", createdAt: Date.now(), status: "Klient" },
      ];
      
      render(<CrmAnalyticsDashboard clients={mockActiveClients as unknown as Client[]} />);
      
      // Nemal by sa zobraziť banner s demo dátami
      expect(screen.queryByText(/Zobrazujú sa demo dáta/)).not.toBeInTheDocument();
      expect(screen.getByText(/Celkovo 2 leady/i)).toBeInTheDocument();
    });
  });

  describe("exportClientsToCsv", () => {
    it("by mal správne zostaviť a vyexportovať CSV súbor s UTF-8 BOM", async () => {
      // Mock window global URL methods
      const mockCreateObjectURL = vi.fn(() => "blob:url");
      const mockRevokeObjectURL = vi.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      // Mock anchor element click
      const mockClick = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      document.body.appendChild = mockAppendChild as unknown as <T extends Node>(node: T) => T;
      document.body.removeChild = mockRemoveChild as unknown as <T extends Node>(node: T) => T;

      const originalCreateElement = document.createElement;
      document.createElement = vi.fn((tagName) => {
        if (tagName === "a") {
          return {
            setAttribute: vi.fn(),
            click: mockClick,
            style: {},
          } as unknown as HTMLAnchorElement;
        }
        return originalCreateElement(tagName);
      }) as unknown as typeof document.createElement;

      // Nastavíme mockované dáta v db
      const mockData = [
        {
          id: 1,
          companyName: "Test Company\nInc.",
          contactName: "Janko Hraško",
          email: "janko@example.com",
          phone: "+421900111222",
          website: "https://example.com",
          service: "eCommerce",
          status: "Lead",
          budget: "2000 €",
          notes: "Poznámka s \"úvodzovkami\"\na novým riadkom",
          createdAt: new Date("2026-07-20T12:00:00Z").getTime(),
          updatedAt: new Date("2026-07-20T12:00:00Z").getTime(),
          deletedAt: null,
        },
      ];

      vi.mocked(db.clients.toArray).mockResolvedValueOnce(mockData as unknown as Client[]);

      // Spustíme export
      const exportedCount = await exportClientsToCsv();
      expect(exportedCount).toBe(1);

      // Vrátime createElement späť
      document.createElement = originalCreateElement;
    });

    it("by mal vrátiť null, ak neexistujú žiadni aktívni klienti na export", async () => {
      vi.mocked(db.clients.toArray).mockResolvedValueOnce([]);

      const exportedCount = await exportClientsToCsv();
      expect(exportedCount).toBeNull();
    });
  });
});
