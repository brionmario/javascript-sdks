// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {extractEmojiFromUri, isEmojiUri} from '@thunderid/javascript';
import extractAvatarParamsFromUri, {type AvatarParams} from './extractAvatarParamsFromUri';
import generateAvatarDataUri, {deriveAvatarContent} from './generateAvatarDataUri';
import isAvatarUri from './isAvatarUri';

export type ResolvedLogoKind = 'avatar' | 'emoji' | 'url';

export interface ResolvedLogo {
  /**
   * Rendered image source (a data URI or plain URL). Absent when `kind` is `"emoji"`.
   */
  imgSrc?: string;
  /**
   * The emoji glyph to render. Only present when `kind` is `"emoji"`.
   */
  glyph?: string;
  /**
   * Which logo spec variant was resolved.
   */
  kind: ResolvedLogoKind;
}

/**
 * Resolves an application logo spec string — `emoji:<glyph>`, `avatar:shape=...,variant=...,
 * content=...,colors=...,bg=...`, or a bare URL — into a renderable representation.
 *
 * A spec in none of the recognized schemes falls back to treating it as a plain URL so
 * callers can always render *something* without special-casing.
 *
 * @param spec - The stored logo spec string.
 * @param fallbackSeedText - Raw seed name (e.g. an app or user display name) used to derive
 *   an `avatar:` spec's `content` when the spec itself doesn't carry one (e.g. an app name
 *   to keep the avatar in sync as it changes).
 * @returns The resolved logo, ready to render.
 *
 * @example
 * ```typescript
 * resolveLogoUri("emoji:🛡️"); // { kind: "emoji", glyph: "🛡️" }
 * resolveLogoUri("avatar:shape=circle,variant=two_letter,content=BM"); // { kind: "avatar", imgSrc: "data:image/svg+xml,..." }
 * resolveLogoUri("https://example.com/logo.png"); // { kind: "url", imgSrc: "https://example.com/logo.png" }
 * ```
 */
const resolveLogoUri = (spec: string, fallbackSeedText = ''): ResolvedLogo => {
  if (isEmojiUri(spec)) {
    return {glyph: extractEmojiFromUri(spec), kind: 'emoji'};
  }

  if (isAvatarUri(spec)) {
    const params: AvatarParams = extractAvatarParamsFromUri(spec);
    const content: string = params.content || deriveAvatarContent(params.variant, fallbackSeedText);
    return {imgSrc: generateAvatarDataUri({...params, content}), kind: 'avatar'};
  }

  return {imgSrc: spec, kind: 'url'};
};

export default resolveLogoUri;
