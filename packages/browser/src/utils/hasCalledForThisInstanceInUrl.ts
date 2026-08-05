// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Utility to check if `state` is available in the URL as a search param and matches the provided instance.
 *
 * @param params - The URL search params to check. Defaults to `window.location.search`.
 * @param instanceId - The instance ID to match against the `state` param.
 * @return `true` if the URL contains a matching `state` search param, otherwise `false`.
 */
const hasCalledForThisInstanceInUrl = (instanceId: number, params: string = window.location.search): boolean => {
  const MATCHER = new RegExp(`[?&]state=instance_${instanceId}_[^&]+`);

  return MATCHER.test(params);
};

export default hasCalledForThisInstanceInUrl;
