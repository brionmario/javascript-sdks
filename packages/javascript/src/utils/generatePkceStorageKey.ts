// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import PKCEConstants from '../constants/PKCEConstants';
import {TemporaryStore} from '../models/store';

/**
 * Generates the next available PKCE storage key based on the current temporary data.
 *
 * The generated key will follow the format: `pkce_code_verifier_<index>`, where `<index>` is incremented
 * based on the highest existing index in the provided storage object.
 *
 * @param tempStore - The object that holds temporary PKCE-related data (e.g., sessionStorage).
 *
 * @returns A new unique PKCE storage key to store the next `code_verifier`.
 *
 * @example
 * const key = generatePkceStorageKey(sessionStorage);
 * // Returns: "pkce_code_verifier_3" (if existing keys are pkce_code_verifier_0 to _2)
 */
const generatePkceStorageKey = (tempStore: TemporaryStore): string => {
  const keys: string[] = [];

  Object.keys(tempStore).forEach((key: string) => {
    if (key.startsWith(PKCEConstants.Storage.StorageKeys.CODE_VERIFIER)) {
      keys.push(key);
    }
  });

  const lastKey: string | undefined = keys.sort().pop();
  const index: number = parseInt(lastKey?.split(PKCEConstants.Storage.StorageKeys.SEPARATOR)[1] ?? '-1', 10);

  return `${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}${index + 1}`;
};

export default generatePkceStorageKey;
