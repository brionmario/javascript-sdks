// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {I18nTranslations} from '../models/i18n';

/**
 * Accepts translations in either flat or namespaced format and normalizes them
 * to the flat format required by the SDK.
 *
 * Flat format (already correct):
 * ```ts
 * { "signin.heading": "Sign In" }
 * ```
 *
 * Namespaced format (auto-converted):
 * ```ts
 * { signin: { heading: "Sign In" } }
 * ```
 *
 * Both formats can be mixed within the same object — a top-level string value
 * is kept as-is, while a top-level object value is flattened one level deep
 * using `"namespace.key"` concatenation.
 *
 * @param translations - Translations in flat or namespaced format.
 * @returns Normalized flat translations compatible with `I18nTranslations`.
 */
const normalizeTranslations = (
  translations: Record<string, string | Record<string, string>> | null | undefined,
): I18nTranslations => {
  if (!translations || typeof translations !== 'object') {
    return {} as unknown as I18nTranslations;
  }

  const result: Record<string, string> = {};

  Object.entries(translations).forEach(([topKey, value]: [string, string | Record<string, string>]) => {
    if (typeof value === 'string') {
      // Already flat — keep as-is (e.g., "signin.heading": "Sign In")
      result[topKey] = value;
    } else if (value !== null && typeof value === 'object') {
      // Namespaced — flatten one level (e.g., signin: { heading: "Sign In" } → "signin.heading": "Sign In")
      Object.entries(value).forEach(([subKey, subValue]: [string, string]) => {
        if (typeof subValue === 'string') {
          result[`${topKey}.${subKey}`] = subValue;
        }
      });
    }
  });

  return result as unknown as I18nTranslations;
};

export default normalizeTranslations;
