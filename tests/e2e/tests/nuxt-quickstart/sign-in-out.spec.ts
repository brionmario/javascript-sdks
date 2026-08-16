// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * nuxt/quickstart — sign in and sign out via the redirect flow (already the checked-in default).
 * See react-quickstart/sign-in-out.spec.ts for the rest of the prerequisites.
 */

import {SampleApps, sampleAppUrl} from '../../constants/sample-apps';
import {expect, test} from '../../fixtures/sample-apps';
import {ProfileFieldLabels} from '../../pages/thunderid-web-sample.page';
import {decodeJwtPayload} from '../../utils/jwt';

const appUrl = sampleAppUrl(SampleApps.NUXT);
const username = process.env.TEST_USER_USERNAME!;
const password = process.env.TEST_USER_PASSWORD!;

test.describe('nuxt/quickstart - Sign in and Sign out', () => {
  test('TC001: signs in with valid credentials', async ({nuxtQuickstartPage}) => {
    await nuxtQuickstartPage.goto(appUrl);
    await nuxtQuickstartPage.verifyHomePageLoaded();

    await nuxtQuickstartPage.clickSignInButton();
    await nuxtQuickstartPage.verifyLoginPageLoaded();

    await nuxtQuickstartPage.login(username, password);
    await nuxtQuickstartPage.verifyLoggedIn();
  });

  test('TC002: signs out after a successful sign-in', async ({nuxtQuickstartPage}) => {
    await nuxtQuickstartPage.goto(appUrl);
    await nuxtQuickstartPage.verifyHomePageLoaded();
    await nuxtQuickstartPage.clickSignInButton();
    await nuxtQuickstartPage.verifyLoginPageLoaded();
    await nuxtQuickstartPage.login(username, password);
    await nuxtQuickstartPage.verifyLoggedIn();

    await nuxtQuickstartPage.logout();
    await nuxtQuickstartPage.verifyLoggedOut();
  });

  test('TC003: token debug page displays a valid access token', async ({nuxtQuickstartPage}) => {
    await nuxtQuickstartPage.goto(appUrl);
    await nuxtQuickstartPage.verifyHomePageLoaded();
    await nuxtQuickstartPage.clickSignInButton();
    await nuxtQuickstartPage.verifyLoginPageLoaded();
    await nuxtQuickstartPage.login(username, password);
    await nuxtQuickstartPage.verifyLoggedIn();

    await nuxtQuickstartPage.openTokenDebug();
    await nuxtQuickstartPage.verifyTokenDebugLoaded();

    const token = await nuxtQuickstartPage.getDisplayedAccessToken();
    expect(token.split('.')).toHaveLength(3);

    const payload = decodeJwtPayload(token);
    expect(payload.sub).toBeTruthy();
    expect(payload.exp as number).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  test('TC004: profile changes made via Manage Profile are reflected', async ({nuxtQuickstartPage}) => {
    await nuxtQuickstartPage.goto(appUrl);
    await nuxtQuickstartPage.verifyHomePageLoaded();
    await nuxtQuickstartPage.clickSignInButton();
    await nuxtQuickstartPage.verifyLoginPageLoaded();
    await nuxtQuickstartPage.login(username, password);
    await nuxtQuickstartPage.verifyLoggedIn();

    await nuxtQuickstartPage.openManageProfile();
    await nuxtQuickstartPage.editProfileField(ProfileFieldLabels.givenName, 'Profile');
    await nuxtQuickstartPage.editProfileField(ProfileFieldLabels.familyName, 'Updated');

    await nuxtQuickstartPage.verifyProfileFieldValue(ProfileFieldLabels.givenName, 'Profile');
    await nuxtQuickstartPage.verifyProfileFieldValue(ProfileFieldLabels.familyName, 'Updated');
  });
});
