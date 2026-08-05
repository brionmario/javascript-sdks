// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import VendorConstants from '../constants/VendorConstants';

/**
 * Adds a vendor-specific prefix to a CSS class name.
 *
 * @param className - The original CSS class name to be prefixed
 * @returns A new string with the vendor prefix added to the class name
 *
 * @example
 * ```typescript
 * // Usage with clsx
 * clsx(withVendorCSSClassPrefix('sign-in-button'), className)
 * // Result: "thunderid-sign-in-button"
 * ```
 */
const withVendorCSSClassPrefix = (className: string): string => `${VendorConstants.VENDOR_PREFIX}-${className}`;

export default withVendorCSSClassPrefix;
