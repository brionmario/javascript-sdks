// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Global timeouts for the E2E suite.
 */
export const Timeouts = {
  /** Default timeout for UI actions (clicks, fills). */
  DEFAULT_ACTION: 15000,

  /** Timeout for checking element visibility. */
  ELEMENT_VISIBILITY: 10000,

  /** Timeout for a redirect-flow round trip (app -> gate -> app). */
  REDIRECT: 20000,

  /** Budget for a suite-level beforeAll/afterAll that provisions server state (e.g. a test user). */
  SUITE_SETUP: 60 * 1000,

  /** Per-test timeout (playwright.config.ts). */
  GLOBAL_TEST: 60 * 1000,
} as const;
