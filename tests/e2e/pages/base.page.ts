// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import path from 'node:path';
import {Page} from '@playwright/test';

/**
 * Base Page Object Model — shared screenshot helper for debugging.
 *
 * Modeled on thunderid/tests/e2e/pages/base.page.ts.
 */
export class BasePage {
  constructor(readonly page: Page) {}

  async screenshot(name: string): Promise<void> {
    const screenshotPath = path.resolve(import.meta.dirname, '../test-results/debug', `${name}.png`);
    await this.page.screenshot({fullPage: true, path: screenshotPath});
  }
}
