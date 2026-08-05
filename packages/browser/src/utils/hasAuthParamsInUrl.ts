// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Utility to check if `code` and `session_state` are available in the URL as search params.
 *
 * @param params - The URL search params to check. Defaults to `window.location.search`.
 * @return `true` if the URL contains `code` and `session_state` search params, otherwise `false`.
 */
const hasAuthParamsInUrl = (params: string = window.location.search): boolean => {
  const MATCHER = /[?&]code=[^&]+/;

  return MATCHER.test(params);
};

export default hasAuthParamsInUrl;
