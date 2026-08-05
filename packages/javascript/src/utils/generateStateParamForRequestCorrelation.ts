// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import PKCEConstants from '../constants/PKCEConstants';

/**
 * Generates a state parameter for request correlation by combining an optional state string with a request index.
 *
 * @param pkceKey - The PKCE key containing the index (format: 'pkce_code_verifier_[index]').
 * @param state - Optional state string to prepend to the request correlation.
 * @returns A state parameter string in the format '[state_]request_[index]'.
 *
 * @example
 * const pkceKey = "pkce_code_verifier_1";
 * const result = generateStateParamForRequestCorrelation(pkceKey, "myState");
 * // Returns: "myState_request_1"
 *
 * const resultNoState = generateStateParamForRequestCorrelation(pkceKey);
 * // Returns: "request_1"
 */
const generateStateParamForRequestCorrelation = (pkceKey: string, state?: string): string => {
  const index: number = parseInt(pkceKey.split(PKCEConstants.Storage.StorageKeys.SEPARATOR)[1], 10);

  return state ? `${state}_request_${index}` : `request_${index}`;
};

export default generateStateParamForRequestCorrelation;
