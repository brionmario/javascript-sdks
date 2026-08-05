// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ExtendedAuthorizeRequestUrlParams} from '@thunderid/javascript';

/**
 * Options accepted by `ThunderIDBrowserClient.signIn()`.
 */
export type SignInConfig = ExtendedAuthorizeRequestUrlParams & {
  /**
   * When `true`, the `signIn` call is a no-op unless the current URL already contains
   * an authorization code (i.e., the page is the redirect landing page).
   */
  callOnlyOnRedirect?: boolean;
};

export default SignInConfig;
