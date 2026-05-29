import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Polyfill pre JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mockovanie Lucide React ikoniek (v JSDOM občas spôsobujú problémy so SVG)
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  const mocks: any = {};
  for (const key in actual) {
    mocks[key] = () => `<span data-testid="icon-${key}"></span>`;
  }
  return mocks;
});
