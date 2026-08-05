// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Build a regex that matches `{{ meta(key) }}` (with optional whitespace) anywhere
 * within a string, escaping any special regex characters in `key`.
 */
function buildMetaFlowTemplateLiteralRegex(key: string): RegExp {
  const escapedKey: string = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(`\\{\\{\\s*meta\\(${escapedKey}\\)\\s*\\}\\}`);
}

/**
 * Check whether a string contains a `{{ meta(key) }}` flow template literal anywhere within it.
 *
 * Unlike {@link isMetaFlowTemplateLiteral}, which requires the **entire** string to be the
 * template, this function detects the pattern embedded inside a larger string such as an
 * HTML label or sentence.
 *
 * Whitespace around `{{` / `}}` is allowed, e.g. `{{ meta(application.signUpUrl) }}`.
 *
 * @param str - The string to search (may be a plain value or an HTML fragment).
 * @param key - The meta path to look for, e.g. `"application.signUpUrl"`.
 * @returns `true` if the pattern is found anywhere in `str`, `false` otherwise.
 *
 * @example
 * ```typescript
 * containsMetaFlowTemplateLiteral('<a href="{{meta(application.signUpUrl)}}">Sign up</a>', 'application.signUpUrl')
 * // true
 *
 * containsMetaFlowTemplateLiteral('<a href="https://example.com">Sign up</a>', 'application.signUpUrl')
 * // false
 * ```
 */
export default function containsMetaFlowTemplateLiteral(str: string, key: string): boolean {
  return buildMetaFlowTemplateLiteralRegex(key).test(str);
}

/**
 * Replace all occurrences of `{{ meta(key) }}` (with optional whitespace) in `str`
 * with `replacement`.
 *
 * @param str - The source string.
 * @param key - The meta path to replace, e.g. `"application.signUpUrl"`.
 * @param replacement - The value to substitute for each match.
 * @returns A new string with all occurrences replaced.
 *
 * @example
 * ```typescript
 * replaceMetaFlowTemplateLiteral('Sign up at {{ meta(application.signUpUrl) }}', 'application.signUpUrl', 'https://example.com')
 * // 'Sign up at https://example.com'
 * ```
 */
export function replaceMetaFlowTemplateLiteral(str: string, key: string, replacement: string): string {
  const escapedKey: string = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\{\\{\\s*meta\\(${escapedKey}\\)\\s*\\}\\}`, 'g');

  return str.replace(regex, replacement);
}
