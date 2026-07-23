import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AiPlaygroundSection } from "./ai-playground";

describe("AiPlaygroundSection Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("by mal správne vykresliť počiatočný stav", () => {
    render(<AiPlaygroundSection />);
    expect(screen.getByText("Vyskúšajte si orchestráciu")).toBeInTheDocument();
    expect(screen.getByText("Lokálna Kaviareň")).toBeInTheDocument();
    expect(screen.getByText("Módny E-shop")).toBeInTheDocument();
  });

  it("by mal spustiť orchestráciu a po dokončení zobraziť kampaň", () => {
    render(<AiPlaygroundSection />);
    
    const kaviarenButton = screen.getByText("Lokálna Kaviareň");
    fireEvent.click(kaviarenButton);

    // Mali by sme vidieť zobrazený terminál okamžite po kliknutí
    expect(screen.getByText("nexify-orchestrator.sh")).toBeInTheDocument();

    // Posunieme zostávajúci čas na dokončenie všetkých krokov logu a zobrazenie kampane
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // Mali by sme vidieť výsledky kampane
    expect(screen.getByText("Výsledok AI Orchestrácie")).toBeInTheDocument();
    expect(screen.getByText("Čerstvo Upražená Káva u Vás do 60 Minút")).toBeInTheDocument();
  });
});
