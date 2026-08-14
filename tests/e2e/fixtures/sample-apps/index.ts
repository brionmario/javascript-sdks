// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Sample App Fixtures
 *
 * One page-object fixture per sample app. Each test file only pulls in the one fixture it needs.
 */

import {test as base} from '@playwright/test';
import {BrowserQuickstartPage} from '../../pages/browser-quickstart.page';
import {ExpressQuickstartPage} from '../../pages/express-quickstart.page';
import {ThunderIDWebSamplePage} from '../../pages/thunderid-web-sample.page';

interface SampleAppFixtures {
  browserQuickstartPage: BrowserQuickstartPage;
  expressQuickstartPage: ExpressQuickstartPage;
  nextjsQuickstartPage: ThunderIDWebSamplePage;
  nuxtQuickstartPage: ThunderIDWebSamplePage;
  reactQuickstartPage: ThunderIDWebSamplePage;
  vueQuickstartPage: ThunderIDWebSamplePage;
}

export const test = base.extend<SampleAppFixtures>({
  browserQuickstartPage: async ({page}, use) => {
    await use(new BrowserQuickstartPage(page));
  },
  expressQuickstartPage: async ({page}, use) => {
    await use(new ExpressQuickstartPage(page));
  },
  nextjsQuickstartPage: async ({page}, use) => {
    await use(new ThunderIDWebSamplePage(page));
  },
  nuxtQuickstartPage: async ({page}, use) => {
    await use(new ThunderIDWebSamplePage(page));
  },
  reactQuickstartPage: async ({page}, use) => {
    await use(new ThunderIDWebSamplePage(page));
  },
  vueQuickstartPage: async ({page}, use) => {
    await use(new ThunderIDWebSamplePage(page));
  },
});

export {expect} from '@playwright/test';
