// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {AvatarParams} from './extractAvatarParamsFromUri';
import {AVATAR_URI_SCHEME} from './isAvatarUri';

/**
 * Serializes {@link AvatarParams} into an `avatar:` URI, the inverse of
 * {@link extractAvatarParamsFromUri}.
 *
 * @param params - The avatar parameters to serialize.
 * @returns An `"avatar:shape=...,variant=...,content=...,colors=..."` spec string, with a
 * trailing `,bg=...` when {@link AvatarParams.bg} is set.
 *
 * @example
 * ```typescript
 * buildAvatarSpec({shape: 'circle', variant: 'two_letter', content: 'BM', colors: 2});
 * // "avatar:shape=circle,variant=two_letter,content=BM,colors=2"
 * ```
 */
const buildAvatarSpec = ({shape, variant, content, colors, bg}: AvatarParams): string => {
  const base = `${AVATAR_URI_SCHEME}shape=${shape},variant=${variant},content=${content},colors=${colors}`;
  return bg ? `${base},bg=${bg}` : base;
};

export default buildAvatarSpec;
