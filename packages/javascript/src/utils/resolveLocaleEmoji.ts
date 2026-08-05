// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import countryCodeToFlagEmoji from './countryCodeToFlagEmoji';

/**
 * Maps BCP 47 language subtags to ISO 3166-1 alpha-2 country codes used for
 * flag emoji resolution when no country subtag is present in the locale.
 */
const LANGUAGE_TO_COUNTRY: Readonly<Record<string, string>> = {
  am: 'ET',
  ar: 'SA',
  bn: 'BD',
  cs: 'CZ',
  da: 'DK',
  de: 'DE',
  el: 'GR',
  en: 'GB',
  es: 'ES',
  fa: 'IR',
  fi: 'FI',
  fr: 'FR',
  he: 'IL',
  hi: 'IN',
  hu: 'HU',
  id: 'ID',
  it: 'IT',
  ja: 'JP',
  ko: 'KR',
  ml: 'IN',
  ms: 'MY',
  nl: 'NL',
  no: 'NO',
  pl: 'PL',
  pt: 'PT',
  ro: 'RO',
  ru: 'RU',
  si: 'LK',
  sk: 'SK',
  sv: 'SE',
  sw: 'KE',
  ta: 'IN',
  th: 'TH',
  tr: 'TR',
  uk: 'UA',
  ur: 'PK',
  vi: 'VN',
  zh: 'CN',
};

/**
 * Resolves a BCP 47 locale tag to a flag emoji.
 *
 * Resolution order:
 * 1. Country subtag when present (e.g. `"en-US"` → 🇺🇸)
 * 2. Language-to-country fallback map (e.g. `"en"` → 🇬🇧)
 * 3. Globe emoji 🌐 for unrecognised codes
 *
 * @param locale - BCP 47 locale tag (e.g. "en", "en-US", "fr-CA")
 * @returns Flag or globe emoji string
 */
function resolveLocaleEmoji(locale: string): string {
  const parts: string[] = locale.split('-');
  const languageCode: string = parts[0].toLowerCase();
  const countrySubtag: string | undefined = parts.length > 1 ? parts[parts.length - 1].toUpperCase() : undefined;

  const countryCode: string | undefined = countrySubtag ?? LANGUAGE_TO_COUNTRY[languageCode];

  if (countryCode?.length !== 2) {
    return '\u{1F310}'; // 🌐
  }

  return countryCodeToFlagEmoji(countryCode);
}
export default resolveLocaleEmoji;
