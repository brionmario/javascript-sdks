// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {extractEmojiFromUri, isEmojiUri} from '@thunderid/javascript';

/**
 * Resolves `emoji:` URIs in an HTML string.
 *
 * Handles two forms:
 *   - `<img src="emoji:🐯" alt="tiger">` → `<span role="img" aria-label="tiger">🐯</span>`
 *   - Bare `emoji:🐯` text references → `🐯`
 *
 * @param html - The HTML string that may contain `emoji:` URIs.
 * @returns The HTML string with all `emoji:` URIs replaced.
 */
const resolveEmojiUrisInHtml = (html: string): string => {
  const withEmojiImages: string = html.replace(
    /<img([^>]*)src="(emoji:[^"]+)"([^>]*)\/?>/gi,
    (_match: string, pre: string, src: string, post: string): string => {
      const emoji: string = extractEmojiFromUri(src);
      if (!emoji) {
        return _match;
      }
      const altMatch: RegExpMatchArray | null = /alt="([^"]*)"/i.exec(pre + post);
      const label: string = altMatch ? altMatch[1] : emoji;
      return `<span role="img" aria-label="${label}">${emoji}</span>`;
    },
  );
  return withEmojiImages.replace(/emoji:([^\s"<>&]+)/g, (_: string, rest: string): string =>
    isEmojiUri(`emoji:${rest}`) ? rest : `emoji:${rest}`,
  );
};

export default resolveEmojiUrisInHtml;
