// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {en_US} from '../translations';

/**
 * Constants related to internationalization (i18n) translation bundles.
 *
 * @example
 * ```typescript
 * // Using default locale
 * const locale = TranslationBundleConstants.FALLBACK_LOCALE;
 *
 * // Using supported locales
 * const locales = TranslationBundleConstants.DEFAULT_LOCALES;
 * ```
 */
const TranslationBundleConstants: {
  DEFAULT_LOCALES: string[];
  FALLBACK_LOCALE: string;
} = {
  /**
   * List of default locales bundles with the SDKs.
   *
   * Current default locales:
   * - `en-US` - English (United States)
   */
  DEFAULT_LOCALES: [en_US.metadata.localeCode],

  /**
   * Default locale code used as fallback when no specific locale is provided.
   */
  FALLBACK_LOCALE: en_US.metadata.localeCode,
} as const;

export default TranslationBundleConstants;
