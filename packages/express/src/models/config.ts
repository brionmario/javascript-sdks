// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ThunderIDNodeConfig, ThunderIDRuntimeError, TokenResponse} from '@thunderid/node';
import express from 'express';

/**
 * Express-specific configuration fields.
 */
export interface StrictExpressClientConfig {
  /** Called with the response and token on successful sign-in. */
  onSignIn?: (res: express.Response, tokenResponse: TokenResponse) => void;
  /** Called with the response on successful sign-out. */
  onSignOut?: (res: express.Response) => void;
  /** Called with the response and error on authentication failure. */
  onError?: (res: express.Response, exception: ThunderIDRuntimeError) => void;
  /** Called with the response when a protected route is accessed without a valid session. */
  onUnauthenticated?: (res: express.Response) => void;
}

/**
 * Full configuration type for `ThunderIDExpressClient`.
 * Combines node-level auth config with Express-specific settings.
 *
 * `afterSignInUrl` and `afterSignOutUrl` are optional. When omitted, the SDK
 * infers them from the first incoming request's origin combined with the path
 * derived from those URLs (defaulting to `/login` and `/logout`).
 *
 * Set `mode: 'embedded'` to enable app-native embedded auth via `handleFlow()`.
 * Defaults to `'redirect'` (standard OAuth 2.0 authorization-code flow).
 *
 * Inherits `vendor` and `sessionCookie.name` from `ThunderIDNodeConfig` — set
 * either to control the session cookie name written by this SDK (default:
 * `__thunderid__session`, the same `@thunderid/node` `CookieConfig` naming
 * convention used by every server-side ThunderID SDK, derived from `vendor`
 * defaulting to `'thunderid'`). `sessionCookie.name` takes priority over the
 * `vendor`-derived default.
 */
export type ExpressClientConfig = ThunderIDNodeConfig & StrictExpressClientConfig;

/**
 * Configuration type for the ThunderID Express.js SDK.
 */
export type ThunderIDExpressConfig = ExpressClientConfig;
