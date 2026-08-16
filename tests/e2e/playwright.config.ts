// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Playwright E2E Test Configuration
 *
 * Chromium only for this first pass (keep CI time down — see the label-gated `e2e` job in
 * pr-builder.yml); a firefox/webkit matrix can follow the same shape thunderid's own
 * playwright.config.ts uses once this suite's proven out.
 *
 * Backend + sample app provisioning happens externally (run-e2e.sh locally, the `e2e` CI job in
 * pr-builder.yml) — not via Playwright's own `webServer` option — because it's a shared backend
 * plus six independently-ported sample apps, not a single dev server.
 */

import path from 'node:path';
import {defineConfig, devices} from '@playwright/test';
import dotenv from 'dotenv';
import {Timeouts} from './constants/timeouts';

// .env (if present) takes priority; defaults.env fills in anything it doesn't set, so running
// Playwright directly (without run-e2e.sh, which copies defaults.env to .env itself) still works
// against a locally-managed backend on the default port instead of failing on missing config.
dotenv.config({path: path.resolve(import.meta.dirname, '.env')});
dotenv.config({path: path.resolve(import.meta.dirname, 'defaults.env')});

export default defineConfig({
  testDir: './tests',

  // Each spec drives a distinct app/port with its own OAuth client, so cross-file parallelism is
  // safe; keep it off within a file (Playwright's default) so TC001/TC002 in the same describe
  // block never race the same browser context.
  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [['list'], ['html', {open: 'never'}]],

  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  timeout: Timeouts.GLOBAL_TEST,

  use: {
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
  ],
});
