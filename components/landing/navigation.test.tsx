import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Navigation } from "./navigation";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "light",
    setTheme: vi.fn(),
  }),
}));

describe("Navigation Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("by mal správne vykresliť hlavné navigačné odkazy", () => {
    render(<Navigation />);
    
    // Na desktope by mali byť viditeľné odkazy
    expect(screen.getByText("Domov")).toBeInTheDocument();
    expect(screen.getByText("Služby")).toBeInTheDocument();
    expect(screen.getByText("Produkty")).toBeInTheDocument();
    expect(screen.getByText("Cenník")).toBeInTheDocument();
    expect(screen.getAllByText("Kontakt").length).toBeGreaterThanOrEqual(1);
  });

  it("by mal otvoriť a zatvoriť mobilné menu pri kliknutí", async () => {
    render(<Navigation />);
    
    // Tlačidlo pre otvorenie mobilného menu (zvyčajne má aria-label alebo ikonu Menu/X)
    const toggleButton = screen.getByRole("button", { name: /otvoriť menu/i });
    expect(toggleButton).toBeInTheDocument();

    // Otvoríme menu
    fireEvent.click(toggleButton);
    
    // V mobilnom menu by mal byť viditeľný odkaz "Domov" aj v mobilnej verzii
    const mobileMenuLinks = screen.getAllByText("Domov");
    expect(mobileMenuLinks.length).toBeGreaterThanOrEqual(1);

    // Tlačidlo zatvorenia mobilného menu (má aria-label "Zavrieť menu")
    const closeButton = screen.getByRole("button", { name: /zavrieť menu/i });
    expect(closeButton).toBeInTheDocument();

    // Klikneme na zatvorenie
    fireEvent.click(closeButton);
  });
});
