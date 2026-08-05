// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {navigate, getVendorPrefix} from '@thunderid/browser';

/**
 * Initiates OAuth redirect with CSRF protection.
 * Generates random state, stores return path in sessionStorage, and redirects to OAuth provider.
 *
 * @param redirectURL - OAuth authorization URL from the server
 * @param vendor - Vendor/brand namespace used to prefix the sessionStorage key. Defaults to `'thunderid'`.
 */
export function initiateOAuthRedirect(redirectURL: string, vendor?: string): void {
  const basePath: string = document.querySelector('base')?.getAttribute('href') || '';
  let returnPath: string = window.location.pathname;

  if (basePath && returnPath.startsWith(basePath)) {
    returnPath = returnPath.slice(basePath.length) || '/';
  }

  const state: string = crypto.randomUUID();

  sessionStorage.setItem(
    `${getVendorPrefix(vendor)}_oauth_${state}`,
    JSON.stringify({
      path: returnPath,
      timestamp: Date.now(),
    }),
  );

  const redirectUrlObj: URL = new URL(redirectURL);
  redirectUrlObj.searchParams.set('state', state);

  navigate(redirectUrlObj.toString());
}
