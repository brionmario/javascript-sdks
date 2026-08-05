// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Callback invoked with the authorization URL when no authorization code is present.
 * The consumer is responsible for redirecting the user to this URL.
 *
 * @param url - The authorization URL to redirect the user to.
 */
type AuthURLCallback = (url: string) => void;

export default AuthURLCallback;
