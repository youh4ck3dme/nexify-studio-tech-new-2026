import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import LoginPage from "./page";
import { signInWithPopup } from "firebase/auth";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock firebase/auth
vi.mock("firebase/auth", () => ({
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn().mockResolvedValue(null),
  GoogleAuthProvider: class {},
}));

// Mock actions
vi.mock("./actions", () => ({
  loginAction: vi.fn(),
  loginWithGoogleAction: vi.fn(),
}));

// Mock firebase config
vi.mock("@/lib/firebase/config", () => ({
  auth: {},
  googleProvider: {},
  isFirebaseConfigured: true,
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("LoginPage - Google Sign-In", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Safe mock of window.location
    delete (window as unknown as Record<string, unknown>).location;
    window.location = {
      ...originalLocation,
      href: "",
    } as Location;

    // Suppress console.error in tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as unknown as Record<string, unknown>).location;
    window.location = originalLocation;
  });

  it("by mal uspesne zavolat signInWithPopup po kliknuti na Google tlacidlo", async () => {
    const mockUser = { email: "test@nexify.sk" };
    vi.mocked(signInWithPopup).mockResolvedValue({
      user: mockUser,
    } as ReturnType<typeof signInWithPopup> extends Promise<infer T> ? T : never);

    render(<LoginPage />);

    const googleBtn = screen.getByRole("button", { name: /Prihlásiť sa cez Google/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
    });
  });

  it("by mal zobrazit chybu, ak Firebase zlyha", async () => {
    vi.mocked(signInWithPopup).mockRejectedValue(
      Object.assign(new Error("Auth failed"), { code: "auth/internal-error" })
    );

    render(<LoginPage />);

    const googleBtn = screen.getByRole("button", { name: /Prihlásiť sa cez Google/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(screen.getByText("Auth failed")).toBeInTheDocument();
    });
  });
});
