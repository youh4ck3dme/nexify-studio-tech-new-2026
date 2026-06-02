import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SyncManager } from "./sync-manager";
import { db } from "@/lib/db";
import { toast } from "sonner";

// Mock pre toast notifikácie, ktoré SyncManager volá
vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe("SyncManager Component", () => {
  beforeEach(async () => {
    await db.offlineQueue.clear();
    vi.clearAllMocks();
  });

  it("by nemal robiť nič (potichu bežať), ak je databáza prázdna", async () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    
    render(<SyncManager />);
    
    // Keďže fronta je prázdna, toast by sa nemal spustiť
    expect(toast.info).not.toHaveBeenCalled();
  });

  it("by mal spustiť synchronizáciu, ak sú vo fronte dáta a sme online", async () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    
    // Pridáme dáta
    await db.offlineQueue.add({
      entityType: "client",
      entityId: "test-id",
      action: "create",
      payload: { companyName: "Test" },
      createdAt: Date.now(),
      retryCount: 0,
    });

    render(<SyncManager />);

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(expect.stringContaining("Spúšťam synchronizáciu"));
    });
  });
});
