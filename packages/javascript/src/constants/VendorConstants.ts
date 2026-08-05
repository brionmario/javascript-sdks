// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Constants for vendor-specific configurations.
 * By default, the vendor is inferred as ThunderID.
 *
 * @example
 * ```typescript
 *  // Using the vendor prefix in a URL
 * const apiUrl = `${VendorConstants.VENDOR_PREFIX}/api/v1/resource`;
 * ```
 */
const VendorConstants: {
  VENDOR_PREFIX: string;
} = {
  /**
   * The prefix used for vendor-specific API endpoints, CSS classes, or other identifiers.
   */
  VENDOR_PREFIX: 'thunderid',
} as const;

export default VendorConstants;
