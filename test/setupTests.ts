import '@testing-library/jest-dom/vitest'

// jsdom lacks ResizeObserver; provide a lightweight stub for components/tests
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Only define if not already provided (e.g., by browser-like envs)
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ResizeObserverStub
}
