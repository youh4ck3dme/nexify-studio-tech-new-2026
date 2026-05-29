import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CustomInstallPrompt } from "./custom-install-prompt";

describe("CustomInstallPrompt Component", () => {
  let originalMatchMedia: any;
  let originalUserAgent: string;

  beforeEach(() => {
    vi.clearAllMocks();
    originalMatchMedia = window.matchMedia;
    originalUserAgent = window.navigator.userAgent;
    
    // Zabraňuje reálnemu zobrazeniu alert() vo vitest konzole
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window.navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it("by nemal zobraziť inštalačný panel, ak bežíme v Standalone (PWA) režime", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(display-mode: standalone)",
      media: query,
    }));
    
    const { container } = render(<CustomInstallPrompt />);
    
    // Panel by mal vrátiť null
    expect(container).toBeEmptyDOMElement();
  });

  it("by mal na iOS zariadeniach automaticky zobraziť fallback panel (pretože Apple nemá beforeinstallprompt)", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit",
      configurable: true,
    });

    render(<CustomInstallPrompt />);
    
    // Panel by sa mal renderovať
    expect(screen.getByText(/Nainštalovať aplikáciu/i)).toBeInTheDocument();
    
    // Ak sa klikne na "Pridať" na iOS, vyvolá sa návod cez alert()
    const addBtn = screen.getByRole("button", { name: /Pridať/i });
    fireEvent.click(addBtn);
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Pre inštaláciu na iOS"));
  });

  it("by mal zaregistrovať beforeinstallprompt event pre Android/Chrome a zavolať prompt() po stlačení", async () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (Android 14) Chrome/120.0",
      configurable: true,
    });

    render(<CustomInstallPrompt />);
    
    // Umelé vyvolanie eventu, ktorý prehliadač odpáli, keď je apka inštalovateľná
    const promptEvent = new Event("beforeinstallprompt");
    Object.assign(promptEvent, {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: "accepted" }),
    });

    act(() => {
      window.dispatchEvent(promptEvent);
    });

    // Keď sa panel zjaví, klikneme na "Pridať"
    const addBtn = screen.getByRole("button", { name: /Pridať/i });
    expect(addBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(addBtn);
    });

    // Skutočný inštalačný dialóg by sa mal spustiť
    expect((promptEvent as any).prompt).toHaveBeenCalled();
  });

  it("by mal skryť panel, keď používateľ klikne na Zavrieť (X)", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0) AppleWebKit",
      configurable: true,
    });

    render(<CustomInstallPrompt />);
    
    // Panel je viditeľný
    expect(screen.getByText(/Nainštalovať aplikáciu/i)).toBeInTheDocument();

    // Klikneme na tlačidlo Zavrieť (má aria-label "Zatvoriť")
    const closeBtn = screen.getByRole("button", { name: /Zatvoriť/i });
    fireEvent.click(closeBtn);

    // Panel by mal zmiznúť
    expect(screen.queryByText(/Nainštalovať aplikáciu/i)).not.toBeInTheDocument();
  });
});
