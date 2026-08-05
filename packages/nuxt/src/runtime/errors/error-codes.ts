// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Typed error codes for the ThunderID Nuxt SDK.
 * Every structured error thrown by the SDK carries one of these codes
 * so callers can react to specific failure modes without string matching.
 */
export enum ErrorCode {
  // ── Configuration ──────────────────────────────────────────────────
  ConfigMissingBaseUrl = 'config/missing-base-url',
  ConfigMissingClientId = 'config/missing-client-id',
  ConfigMissingSecret = 'config/missing-session-secret',

  // ── OAuth ──────────────────────────────────────────────────────────
  OAuthCallbackError = 'oauth/callback-error',
  OAuthStateInvalid = 'oauth/state-invalid',
  // ── Security ───────────────────────────────────────────────────────
  OpenRedirectBlocked = 'security/open-redirect-blocked',

  // ── Session ────────────────────────────────────────────────────────
  SessionExpired = 'session/expired',
  SessionInvalid = 'session/invalid',
  SessionMissing = 'session/missing',

  TempSessionInvalid = 'session/temp-invalid',
  TokenExchangeFailed = 'oauth/token-exchange-failed',
  TokenRefreshFailed = 'oauth/token-refresh-failed',
  // ── User Profile ──────────────────────────────────────────────────
  UserProfileFetchFailed = 'user-profile/fetch-failed',
  UserProfileUpdateFailed = 'user-profile/update-failed',
}
