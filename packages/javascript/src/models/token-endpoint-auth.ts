// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * OAuth 2.0 client authentication method used at the token endpoint.
 * Corresponds to the `token_endpoint_auth_method` parameter in OIDC Discovery.
 *
 * - `client_secret_basic` — HTTP Basic authentication: credentials are sent in the
 *   `Authorization: Basic base64(client_id:client_secret)` header (RFC 6749 §2.3.1).
 *   Required for ThunderIDV2 (Thunder) by default.
 * - `client_secret_post` — Credentials are sent as `client_id` / `client_secret`
 *   parameters in the POST body (RFC 6749 §2.3.1). Default for all other platforms.
 * - `none` — No client authentication (public clients that have no client secret).
 */
export type TokenEndpointAuthMethod = 'client_secret_basic' | 'client_secret_post' | 'none';
