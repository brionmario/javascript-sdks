// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * react/quickstart — sign in and sign out via the redirect flow.
 *
 * Prerequisites (handled by global-setup.ts / run-e2e.sh):
 * - The backend running, with react/quickstart's OAuth2 client imported
 *   (thunderid-config/sample-apps.yaml)
 * - react/quickstart running at REACT_APP_URL
 * - The shared E2E test user (TEST_USER_USERNAME / TEST_USER_PASSWORD)
 */

import {SampleApps, sampleAppUrl} from '../../constants/sample-apps';
import {expect, test} from '../../fixtures/sample-apps';
import {ProfileFieldLabels} from '../../pages/thunderid-web-sample.page';
import {decodeJwtPayload} from '../../utils/jwt';

const appUrl = sampleAppUrl(SampleApps.REACT);
const username = process.env.TEST_USER_USERNAME!;
const password = process.env.TEST_USER_PASSWORD!;

test.describe('react/quickstart - Sign in and Sign out', () => {
  test('TC001: signs in with valid credentials', async ({reactQuickstartPage}) => {
    await reactQuickstartPage.goto(appUrl);
    await reactQuickstartPage.verifyHomePageLoaded();

    await reactQuickstartPage.clickSignInButton();
    await reactQuickstartPage.verifyLoginPageLoaded();

    await reactQuickstartPage.login(username, password);
    await reactQuickstartPage.verifyLoggedIn();
  });

  test('TC002: signs out after a successful sign-in', async ({reactQuickstartPage}) => {
    await reactQuickstartPage.goto(appUrl);
    await reactQuickstartPage.verifyHomePageLoaded();
    await reactQuickstartPage.clickSignInButton();
    await reactQuickstartPage.verifyLoginPageLoaded();
    await reactQuickstartPage.login(username, password);
    await reactQuickstartPage.verifyLoggedIn();

    await reactQuickstartPage.logout();
    await reactQuickstartPage.verifyLoggedOut();
  });

  test('TC003: token debug page displays a valid access token', async ({reactQuickstartPage}) => {
    await reactQuickstartPage.goto(appUrl);
    await reactQuickstartPage.verifyHomePageLoaded();
    await reactQuickstartPage.clickSignInButton();
    await reactQuickstartPage.verifyLoginPageLoaded();
    await reactQuickstartPage.login(username, password);
    await reactQuickstartPage.verifyLoggedIn();

    await reactQuickstartPage.openTokenDebug();
    await reactQuickstartPage.verifyTokenDebugLoaded();

    const token = await reactQuickstartPage.getDisplayedAccessToken();
    expect(token.split('.')).toHaveLength(3);

    const payload = decodeJwtPayload(token);
    expect(payload.sub).toBeTruthy();
    expect(payload.exp as number).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  test('TC004: profile changes made via Manage Profile are reflected', async ({reactQuickstartPage}) => {
    await reactQuickstartPage.goto(appUrl);
    await reactQuickstartPage.verifyHomePageLoaded();
    await reactQuickstartPage.clickSignInButton();
    await reactQuickstartPage.verifyLoginPageLoaded();
    await reactQuickstartPage.login(username, password);
    await reactQuickstartPage.verifyLoggedIn();

    await reactQuickstartPage.openManageProfile();
    await reactQuickstartPage.editProfileField(ProfileFieldLabels.givenName, 'Profile');
    await reactQuickstartPage.editProfileField(ProfileFieldLabels.familyName, 'Updated');

    await reactQuickstartPage.verifyProfileFieldValue(ProfileFieldLabels.givenName, 'Profile');
    await reactQuickstartPage.verifyProfileFieldValue(ProfileFieldLabels.familyName, 'Updated');
  });
});
