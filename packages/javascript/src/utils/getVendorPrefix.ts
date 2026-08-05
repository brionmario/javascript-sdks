// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import VendorConstants from '../constants/VendorConstants';

/**
 * Resolves the vendor/brand namespace to use for storage keys, cookie names, etc.
 * Falls back to `VendorConstants.VENDOR_PREFIX` (the SDK-wide default) when no vendor
 * is configured, so there is a single source of truth for the default brand name.
 *
 * @param vendor - The vendor value from the resolved SDK configuration, if any.
 * @returns The resolved vendor prefix.
 */
export const getVendorPrefix = (vendor?: string): string => vendor ?? VendorConstants.VENDOR_PREFIX;

export default getVendorPrefix;
