// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Error information returned when a sign-out redirect fails.
 */
export interface SignOutError {
  /** OAuth2/OIDC error code from the redirect URL. */
  error: string;
  /** Human-readable error description from the redirect URL. */
  description: string;
}

export default SignOutError;
