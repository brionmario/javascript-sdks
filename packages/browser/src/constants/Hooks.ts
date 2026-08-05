// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Event hook names for attaching callbacks via `ThunderIDBrowserClient.on()`.
 */
export enum Hooks {
  SignIn = 'sign-in',
  SignOut = 'sign-out',
  Initialize = 'initialize',
  HttpRequestStart = 'http-request-start',
  HttpRequestFinish = 'http-request-finish',
  HttpRequestError = 'http-request-error',
  HttpRequestSuccess = 'http-request-success',
  RevokeAccessToken = 'revoke-access-token',
  CustomGrant = 'custom-grant',
  SignOutFailed = 'sign-out-failed',
}

export default Hooks;
