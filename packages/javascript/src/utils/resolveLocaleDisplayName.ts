// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Resolves a BCP 47 locale tag to a human-readable display name using the
 * `Intl.DisplayNames` API.
 *
 * Falls back to the raw locale code if the runtime does not support
 * `Intl.DisplayNames` or if resolution returns `undefined`.
 *
 * @param locale - BCP 47 locale tag to resolve (e.g. "en", "fr", "zh-Hant")
 * @param displayLocale - Locale used for the display name language (defaults to "en")
 * @returns Human-readable language name (e.g. "English", "French")
 */
export default function resolveLocaleDisplayName(locale: string, displayLocale: string): string {
  try {
    const displayNames: Intl.DisplayNames = new Intl.DisplayNames([displayLocale], {type: 'language'});
    return displayNames.of(locale) ?? locale;
  } catch {
    return locale;
  }
}
