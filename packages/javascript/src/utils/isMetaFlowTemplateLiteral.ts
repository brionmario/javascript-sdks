// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Regular expression to match a meta flow template literal `{{meta(key)}}` (exact, full-string match).
 * Optional whitespace around `{{` / `}}` is allowed.
 */
export const META_FLOW_TEMPLATE_LITERAL_PATTERN = /^\{\{\s*meta\([^)]+\)\s*\}\}$/;

/**
 * Regular expression to extract the path from a meta flow template literal `{{meta(path)}}`.
 */
export const META_FLOW_TEMPLATE_LITERAL_KEY_PATTERN = /^\{\{\s*meta\(([^)]+)\)\s*\}\}$/;

/**
 * Check if a string is exactly a meta flow template literal (`{{ meta(path) }}`).
 *
 * This checks that the **entire** string is the template pattern. Use
 * {@link FLOW_TEMPLATE_LITERAL_REGEX} from `parseFlowTemplateLiteral` to detect
 * templates embedded inside a larger string.
 *
 * @param value - The string to test.
 * @returns `true` if the trimmed value matches the pattern, `false` otherwise.
 *
 * @example
 * ```typescript
 * isMetaFlowTemplateLiteral('{{ meta(application.name) }}') // true
 * isMetaFlowTemplateLiteral('hello world')                  // false
 * isMetaFlowTemplateLiteral('Login to {{ meta(app.name) }}') // false — embedded, not exact
 * ```
 */
export default function isMetaFlowTemplateLiteral(value: string): boolean {
  return META_FLOW_TEMPLATE_LITERAL_PATTERN.test(value.trim());
}
