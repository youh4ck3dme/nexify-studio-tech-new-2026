import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RoiCalculatorCard } from "./roi-calculator-card";

import React from "react";

// Mock Recharts ResponsiveContainer to prevent width/height 0 issues in JSDOM
vi.mock("recharts", async (importOriginal) => {
  const original = await importOriginal<typeof import("recharts")>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe("RoiCalculatorCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("by mal správne vykresliť počiatočný stav s predvolenými hodnotami", () => {
    render(<RoiCalculatorCard />);
    
    // Predvolená hodnota budgetu by mala byť zobrazená
    expect(screen.getByText("5 000 €")).toBeInTheDocument();
    
    // Mali by sme vidieť tlačidlá pre odvetvia
    expect(screen.getByText("eCommerce")).toBeInTheDocument();
    expect(screen.getByText("Služby")).toBeInTheDocument();
    expect(screen.getByText("Finančníctvo")).toBeInTheDocument();
  });

  it("by mal správne zmeniť výpočty pri zmene odvetvia", () => {
    render(<RoiCalculatorCard />);
    
    // Klikneme na odvetvie "Služby"
    const sluzbyBtn = screen.getByText("Služby");
    fireEvent.click(sluzbyBtn);
    
    // Skontrolujeme, či sa zmenil priradený koeficient (pre Služby je nexifyMultiplier = 3.5, baseline = 1.5)
    expect(screen.getByText(/3.5x/)).toBeInTheDocument();
    expect(screen.getByText(/1.5x/)).toBeInTheDocument();
  });

  it("by mal správne reagovať na zmenu posuvníka / zadanie budgetu", () => {
    render(<RoiCalculatorCard />);
    
    const input = screen.getByLabelText("Mesačný budget na reklamu") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    
    // Zmeníme hodnotu na 20 000 €
    fireEvent.change(input, { target: { value: "20000" } });
    
    // Hodnota by sa mala zobraziť vo formáte eura
    expect(screen.getByText("20 000 €")).toBeInTheDocument();
  });
});
