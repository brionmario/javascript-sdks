// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Converts a two-letter ISO 3166-1 alpha-2 country code to a flag emoji using
 * Unicode Regional Indicator Symbols (U+1F1E6–U+1F1FF).
 *
 * @param countryCode - Two-letter uppercase country code (e.g. "US", "GB")
 * @returns Flag emoji string (e.g. "🇺🇸", "🇬🇧")
 */
export default function countryCodeToFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split('')
    .map((char: string) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
    .join('');
}
