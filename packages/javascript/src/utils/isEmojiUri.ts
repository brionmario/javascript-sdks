// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export const EMOJI_URI_SCHEME = 'emoji:';

/**
 * Checks whether a given URI uses the `emoji:` scheme (e.g. `"emoji:🐯"`).
 *
 * @param uri - The URI string to check.
 * @returns `true` if the URI starts with `"emoji:"`, `false` otherwise.
 *
 * @example
 * ```typescript
 * isEmojiUri("emoji:🐯");          // true
 * isEmojiUri("https://example.com/logo.png"); // false
 * isEmojiUri("");                  // false
 * ```
 */
const isEmojiUri = (uri: string): boolean => typeof uri === 'string' && uri.startsWith(EMOJI_URI_SCHEME);

export default isEmojiUri;
