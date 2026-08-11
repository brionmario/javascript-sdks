// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Matches the `{{param(name)}}` placeholder syntax used by backend messages.
 */
const BACKEND_PARAM_PATTERN = /\{\{\s*param\(\s*\w+\s*\)\s*\}\}/;

/**
 * Escapes characters that carry special meaning inside a regular expression.
 *
 * @param value - The literal string to escape.
 * @returns The escaped string, safe to embed in a `RegExp`.
 */
const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Checks whether a translation still contains an unsubstituted `{{param(name)}}` placeholder.
 *
 * Used to detect that a resolved translation is not presentable to the user, so the caller can
 * fall back to a pre-substituted value instead.
 *
 * @param translation - The translation string to inspect.
 * @returns `true` when at least one backend placeholder remains unsubstituted.
 */
export const hasUnresolvedTranslationParams = (translation: string): boolean =>
  Boolean(translation) && BACKEND_PARAM_PATTERN.test(translation);

/**
 * Substitutes named parameters into a translation string.
 *
 * Two placeholder syntaxes are supported, because messages reach the SDK from two sources:
 * - `{{param(name)}}` is used by backend messages and the server-shipped `system` i18n bundle.
 * - `{name}` is used by the SDK's own translation bundles.
 *
 * @param translation - The translation string, possibly containing placeholders.
 * @param params - The parameter values to substitute, keyed by placeholder name.
 * @returns The translation with every matching placeholder replaced.
 */
const substituteTranslationParams = (translation: string, params?: Record<string, string | number>): string => {
  if (!translation || !params || Object.keys(params).length === 0) {
    return translation;
  }

  return Object.entries(params).reduce((acc: string, [paramKey, paramValue]: [string, string | number]): string => {
    const escapedKey: string = escapeRegExp(paramKey);
    const value = String(paramValue);

    return acc
      .replace(new RegExp(`\\{\\{\\s*param\\(\\s*${escapedKey}\\s*\\)\\s*\\}\\}`, 'g'), () => value)
      .replace(new RegExp(`\\{${escapedKey}\\}`, 'g'), () => value);
  }, translation);
};

export default substituteTranslationParams;
