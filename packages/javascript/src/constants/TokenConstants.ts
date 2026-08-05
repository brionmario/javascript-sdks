// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Constants related to OIDC token management and storage.
 * This object contains configuration values and storage keys
 * used in token validation and management processes.
 *
 * @remarks
 * The constants are organized into two main sections:
 * 1. SignatureValidation - Contains supported algorithms for token validation
 * 2. Storage - Contains keys used for storing token-related data
 *
 * @example
 * ```typescript
 * // Using signature validation algorithms
 * const algorithms = TokenConstants.SignatureValidation.SUPPORTED_ALGORITHMS;
 *
 * // Using storage keys
 * const timerKey = TokenConstants.Storage.StorageKeys.REFRESH_TOKEN_TIMER;
 * ```
 */
const TokenConstants: {
  readonly SignatureValidation: {
    readonly SUPPORTED_ALGORITHMS: readonly string[];
  };
  readonly Storage: {
    readonly StorageKeys: {
      readonly REFRESH_TOKEN_TIMER: string;
    };
  };
  readonly Lifecycle: {
    readonly CLIENT_CREDENTIALS_REFRESH_MARGIN_MS: number;
  };
} = {
  /**
   * Token signature validation constants.
   * Contains configurations related to token signature verification.
   */
  SignatureValidation: {
    /**
     * Fallback array of supported signature algorithms for OIDC token validation.
     * These values are used when the supported algorithms cannot be retrieved from
     * the .well-known/openid-configuration endpoint.
     *
     * Supported algorithms:
     * - `RS256` - RSASSA-PKCS1-v1_5 using SHA-256
     * - `RS512` - RSASSA-PKCS1-v1_5 using SHA-512
     * - `RS384` - RSASSA-PKCS1-v1_5 using SHA-384
     * - `PS256` - RSASSA-PSS using SHA-256 and MGF1 with SHA-256
     * - `ML-DSA-44` / `ML-DSA-65` / `ML-DSA-87` - post-quantum ML-DSA (RFC 9864), AKP JWKs
     */
    SUPPORTED_ALGORITHMS: ['RS256', 'RS512', 'RS384', 'PS256', 'ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87'],
  },

  /**
   * Storage-related constants for OIDC tokens.
   * Contains keys used to store token-related data in browser storage.
   */
  Storage: {
    /**
     * Collection of storage keys used in token management.
     * These keys are used to store and retrieve token-related
     * information from browser storage.
     */
    StorageKeys: {
      /**
       * Key used to store the refresh token timer identifier.
       * This timer is used to schedule token refresh operations
       * before the current token expires.
       */
      REFRESH_TOKEN_TIMER: 'refresh_token_timer',
    },
  },

  /**
   * Token lifecycle timing constants.
   * Contains timing thresholds used to decide when cached tokens should be refreshed.
   */
  Lifecycle: {
    /**
     * How far ahead of expiry a cached `client_credentials` token is treated as
     * stale and refreshed.
     */
    CLIENT_CREDENTIALS_REFRESH_MARGIN_MS: 30_000,
  },
} as const;

export default TokenConstants;
