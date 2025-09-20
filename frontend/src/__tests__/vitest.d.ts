/// <reference types="vitest" />
/// <reference types="vitest/globals" />

import type {
  ExpectStatic,
  SuiteFactory,
  TestFunction,
  VitestUtils,
} from "vitest";

declare global {
  const beforeAll: (fn: () => void | Promise<void>) => void;
  const afterAll: (fn: () => void | Promise<void>) => void;
  const beforeEach: (fn: () => void | Promise<void>) => void;
  const afterEach: (fn: () => void | Promise<void>) => void;
  const describe: (name: string, fn: SuiteFactory) => void;
  const it: (name: string, fn: TestFunction) => void;
  const test: (name: string, fn: TestFunction) => void;
  const expect: ExpectStatic;
  const vi: VitestUtils;
}

export {};
