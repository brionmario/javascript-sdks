// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import generateStateParamForRequestCorrelation from './generateStateParamForRequestCorrelation';
import PKCEConstants from '../constants/PKCEConstants';
import {TemporaryStore} from '../models/store';

/**
 * Gets the latest PKCE storage key from the temporary store.
 *
 * @param tempStore - The object that holds temporary PKCE-related data (e.g., sessionStorage).
 * @returns The latest PKCE storage key or null if no keys exist.
 */
const getLatestPkceStorageKey = (tempStore: TemporaryStore): string | null => {
  const keys: string[] = [];

  Object.keys(tempStore).forEach((key: string) => {
    if (key.startsWith(PKCEConstants.Storage.StorageKeys.CODE_VERIFIER)) {
      keys.push(key);
    }
  });

  const lastKey: string | undefined = keys.sort().pop();

  return lastKey ?? null;
};

/**
 * Finds the latest state parameter based on the most recent PKCE storage key.
 *
 * This utility combines the functionality of finding the latest PKCE key and generating
 * the corresponding state parameter for request correlation.
 *
 * @param tempStore - The object that holds temporary PKCE-related data (e.g., sessionStorage).
 * @param state - Optional state string to prepend to the request correlation.
 * @returns The latest state parameter string or null if no PKCE keys exist.
 *
 * @example
 * const latestState = getLatestStateParam(sessionStorage, "myState");
 * // Returns: "myState_request_2" (if latest PKCE key is pkce_code_verifier_2)
 *
 * const latestStateNoPrefix = getLatestStateParam(sessionStorage);
 * // Returns: "request_2" (if latest PKCE key is pkce_code_verifier_2)
 *
 * const noKeys = getLatestStateParam(emptyStorage);
 * // Returns: null (if no PKCE keys exist)
 */
const getLatestStateParam = (tempStore: TemporaryStore, state?: string): string | null => {
  const latestPkceKey: string | null = getLatestPkceStorageKey(tempStore);

  if (!latestPkceKey) {
    return null;
  }

  return generateStateParamForRequestCorrelation(latestPkceKey, state);
};

export default getLatestStateParam;
