// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Constants related to Proof Key for Code Exchange (PKCE) implementation.
 * This object contains all the necessary constants for implementing PKCE
 * flow in the OAuth 2.0 authorization code grant.
 *
 * @remarks
 * PKCE is an extension to the authorization code flow to prevent CSRF and
 * authorization code injection attacks. The constants are organized into
 * storage-related sections for managing PKCE state.
 *
 * @example
 * ```typescript
 * // Using storage keys
 * const codeVerifierKey = PKCEConstants.Storage.StorageKeys.CODE_VERIFIER;
 * const separator = PKCEConstants.Storage.StorageKeys.SEPARATOR;
 * ```
 */
const PKCEConstants: {
  readonly DEFAULT_CODE_CHALLENGE_METHOD: string;
  readonly Storage: {
    readonly StorageKeys: {
      readonly CODE_VERIFIER: string;
      readonly SEPARATOR: string;
    };
  };
} = {
  DEFAULT_CODE_CHALLENGE_METHOD: 'S256',
  /**
   * Storage-related constants for managing PKCE state
   */
  Storage: {
    /**
     * Collection of storage keys used in PKCE implementation
     */
    StorageKeys: {
      /**
       * Key used to store the PKCE code verifier in temporary storage.
       * The code verifier is a cryptographically random string that is
       * used to generate the code challenge.
       */
      CODE_VERIFIER: 'pkce_code_verifier',

      /**
       * Separator used in storage keys to create unique identifiers
       * by combining different parts of the key.
       */
      SEPARATOR: '#',
    },
  },
} as const;

export default PKCEConstants;
