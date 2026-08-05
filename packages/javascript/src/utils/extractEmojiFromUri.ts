// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import isEmojiUri, {EMOJI_URI_SCHEME} from './isEmojiUri';

/**
 * Extracts the emoji character from an `emoji:` URI.
 *
 * @param uri - A URI string in the form `"emoji:<emoji>"`.
 * @returns The emoji character, or an empty string if the URI is not a valid emoji URI.
 *
 * @example
 * ```typescript
 * extractEmojiFromUri("emoji:🐯"); // "🐯"
 * extractEmojiFromUri("https://example.com"); // ""
 * ```
 */
const extractEmojiFromUri = (uri: string): string => {
  if (!isEmojiUri(uri)) {
    return '';
  }

  return uri.slice(EMOJI_URI_SCHEME.length);
};

export default extractEmojiFromUri;
