// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Constants for OAuth 2.0 Token Exchange operations.
 * This object contains placeholders used in token exchange requests
 * and responses for dynamic value substitution.
 *
 * @remarks
 * These placeholders are used in token exchange templates and are replaced
 * with actual values during request processing. They help in creating
 * flexible and reusable token exchange configurations.
 *
 * @example
 * ```typescript
 * // Using placeholders in a token exchange template
 * const template = `grant_type=urn:ietf:params:oauth:grant-type:token-exchange&subject_token=${TokenExchangeConstants.Placeholders.TOKEN}`;
 * ```
 */
const TokenExchangeConstants: {
  readonly Placeholders: {
    readonly ACCESS_TOKEN: string;
    readonly CLIENT_ID: string;
    readonly CLIENT_SECRET: string;
    readonly SCOPES: string;
    readonly USERNAME: string;
  };
} = {
  /**
   * Collection of placeholder strings used in token exchange operations.
   * These placeholders are replaced with actual values when processing
   * token exchange requests.
   */
  Placeholders: {
    /**
     * Placeholder for the token value in exchange requests.
     * Usually replaced with an access token or refresh token.
     */
    ACCESS_TOKEN: '{{accessToken}}',

    /**
     * Placeholder for client ID in token exchange operations.
     * Required for client authentication.
     */
    CLIENT_ID: '{{clientId}}',

    /**
     * Placeholder for client secret in token exchange operations.
     * Used for client authentication in confidential client flows.
     */
    CLIENT_SECRET: '{{clientSecret}}',

    /**
     * Placeholder for OAuth scopes in token exchange requests.
     * Replaced with space-separated scope strings.
     */
    SCOPES: '{{scopes}}',

    /**
     * Placeholder for the username in token exchange operations.
     * Used when user identity needs to be included in the exchange.
     */
    USERNAME: '{{username}}',
  },
} as const;

export default TokenExchangeConstants;
