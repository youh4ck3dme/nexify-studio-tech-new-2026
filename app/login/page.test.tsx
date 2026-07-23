import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "./page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock actions
vi.mock("./actions", () => ({
  loginAction: vi.fn(),
}));

describe("LoginPage - Credentials Authorization", () => {
  it("vykreslí polia pre email a heslo a tlačidlo Sign In", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^heslo$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("nezobrazuje žiadne Google prihlasovacie tlačidlo", () => {
    render(<LoginPage />);

    expect(
      screen.queryByRole("button", { name: /google/i })
    ).not.toBeInTheDocument();
  });

  it("má vypnuté tlačidlo Zabudnuté heslo", () => {
    render(<LoginPage />);

    const forgotButton = screen.getByRole("button", { name: /Zabudnuté heslo/i });
    expect(forgotButton).toBeDisabled();
  });
});
