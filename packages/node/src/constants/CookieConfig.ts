// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {getVendorPrefix} from '@thunderid/javascript';

class CookieConfig {
  /**
   * Builds the session cookie name for a given vendor namespace.
   * @param vendor - Vendor/brand namespace. Defaults to `VendorConstants.VENDOR_PREFIX` ('thunderid').
   */
  static getSessionCookieName(vendor?: string): string {
    return `__${getVendorPrefix(vendor)}__session`;
  }

  /**
   * Builds the temporary session cookie name for a given vendor namespace.
   * @param vendor - Vendor/brand namespace. Defaults to `VendorConstants.VENDOR_PREFIX` ('thunderid').
   */
  static getTempSessionCookieName(vendor?: string): string {
    return `__${getVendorPrefix(vendor)}__temp.session`;
  }

  /**
   * Resolves the session cookie name, honoring an explicit `sessionCookie.name`
   * override before falling back to the vendor-derived default.
   */
  static resolveSessionCookieName(vendor?: string, overrideName?: string): string {
    return overrideName ?? CookieConfig.getSessionCookieName(vendor);
  }

  /**
   * Resolves the temporary session cookie name, honoring an explicit
   * `sessionCookie.name`-derived override before falling back to the vendor-derived default.
   */
  static resolveTempSessionCookieName(vendor?: string, overrideName?: string): string {
    return overrideName ?? CookieConfig.getTempSessionCookieName(vendor);
  }

  static readonly DEFAULT_MAX_AGE: number = 3600;

  static readonly DEFAULT_HTTP_ONLY: boolean = true;

  static readonly DEFAULT_SAME_SITE: 'lax' | 'strict' | 'none' = 'lax';

  static readonly DEFAULT_SECURE: boolean = true;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}

export default CookieConfig;
