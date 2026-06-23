import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import LoginPage from "./page";
import { signInWithPopup } from "firebase/auth";
import { loginWithGoogleAction } from "./actions";
import { toast } from "sonner";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock firebase/auth
vi.mock("firebase/auth", () => ({
  signInWithPopup: vi.fn(),
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
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      href: "",
    } as any;

    // Suppress console.error in tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).location;
    window.location = originalLocation;
  });

  it("by mal uspesne prihlasit cez Google a presmerovat do CRM", async () => {
    const mockUser = { email: "test@nexify.sk" };
    vi.mocked(signInWithPopup).mockResolvedValue({
      user: mockUser,
    } as any);

    vi.mocked(loginWithGoogleAction).mockResolvedValue({
      success: true,
    });

    render(<LoginPage />);

    const googleBtn = screen.getByRole("button", { name: /Prihlásiť sa cez Google/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(loginWithGoogleAction).toHaveBeenCalledWith("test@nexify.sk");
      expect(toast.success).toHaveBeenCalledWith("Prihlásenie úspešné!");
    });
  });

  it("by mal zobrazit chybu, ak Firebase zlyha", async () => {
    vi.mocked(signInWithPopup).mockRejectedValue(new Error("Auth failed"));

    render(<LoginPage />);

    const googleBtn = screen.getByRole("button", { name: /Prihlásiť sa cez Google/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(screen.getByText("Auth failed")).toBeInTheDocument();
    });
  });
});
