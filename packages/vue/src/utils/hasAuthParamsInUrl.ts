// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Re-export of the auth params URL check from the Browser SDK.
 *
 * Checks if `code` (and optionally `session_state`) are present in the URL search params,
 * indicating an OAuth2 authorization code callback.
 *
 * @see {@link @thunderid/browser#hasAuthParamsInUrl}
 */
export {hasAuthParamsInUrl, hasAuthParamsInUrl as default} from '@thunderid/browser';
