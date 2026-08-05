// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import PKCEConstants from '../constants/PKCEConstants';

/**
 * Extracts the PKCE key from a state parameter string.
 *
 * @param state - The state parameter string containing the request index.
 * @returns The PKCE key string in the format `pkce_code_verifier_${index}`.
 *
 * @example
 * ```typescript
 * const state = "request_1";
 * const pkceKey = extractPkceStorageKeyFromState(state);
 * // Returns: "pkce_code_verifier_1"
 * ```
 */
const extractPkceStorageKeyFromState = (state: string): string => {
  const index: number = parseInt(state.split('request_')[1], 10);

  return `${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}${index}`;
};

export default extractPkceStorageKeyFromState;
