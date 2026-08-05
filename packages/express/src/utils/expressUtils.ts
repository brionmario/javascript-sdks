// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const AUTH_ERROR_REGEXP = /[?&]error=[^&]+/;

/**
 * Returns `true` if the given URL contains an OAuth error query parameter.
 *
 * @param url - The URL to inspect.
 */
const hasErrorInURL = (url: string): boolean => AUTH_ERROR_REGEXP.test(url);

export default hasErrorInURL;
