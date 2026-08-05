// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Constants for OAuth 2.0 and OpenID Connect scopes.
 * These scopes define the level of access that the client application
 * is requesting from the authorization server.
 *
 * @remarks
 * Scopes are space-separated strings that represent different permissions.
 * The 'openid' scope is required for OpenID Connect flows, while other
 * scopes provide access to different resources or user information.
 *
 * @example
 * ```typescript
 * // Requesting OpenID Connect authentication
 * const scope = [ScopeConstants.OPENID];
 *
 * // Requesting profile information
 * const scopes = [ScopeConstants.OPENID, ScopeConstants.PROFILE];
 * ```
 */
const ScopeConstants: {
  OPENID: string;
  PROFILE: string;
} = {
  /**
   * The base OpenID Connect scope.
   * Required for all OpenID Connect flows. Indicates that the client
   * is initiating an OpenID Connect authentication request.
   */
  OPENID: 'openid',

  /**
   * The OpenID Connect profile scope.
   * This scope allows the client to access the user's profile information.
   * It includes details such as the user's name, email, and other profile attributes.
   */
  PROFILE: 'profile',
} as const;

export default ScopeConstants;
