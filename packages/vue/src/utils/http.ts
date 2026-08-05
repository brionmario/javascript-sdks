// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Re-export of the HTTP utility from the Browser SDK.
 *
 * Creates an HTTP utility for making authenticated requests using a specific
 * ThunderIDSPAClient instance. The returned object has `request` and `requestAll` methods.
 *
 * @see {@link @thunderid/browser#http}
 */
export {http, http as default} from '@thunderid/browser';
