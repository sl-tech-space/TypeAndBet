/// <reference types="../__tests__/vitest.d.ts" />
import "@testing-library/jest-dom";
import { vi } from "vitest";

const port = process.env.FRONTEND_PORT || 3000;

// TextEncoder/TextDecoder polyfill for Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => ""),
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return `<img src="${src}" alt="${alt}" {...rest} />`;
  },
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return `<a href="${href}" {...props}>${children}</a>`;
  },
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
global.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.location
const mockLocation = {
  href: `http://localhost:${port}`,
  origin: `http://localhost:${port}`,
  pathname: "/",
  search: "",
  hash: "",
  reload: vi.fn(),
  assign: vi.fn(),
  replace: vi.fn(),
};
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(global, "sessionStorage", {
  value: sessionStorageMock,
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

// Console warnings suppression for tests
const originalConsoleWarn = console.warn;

// Setup and teardown hooks
beforeAll(() => {
  console.warn = (...args: any[]) => {
    if (
      args[0]?.includes?.("validateDOMNesting") ||
      args[0]?.includes?.("useLayoutEffect") ||
      args[0]?.includes?.("act()")
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
