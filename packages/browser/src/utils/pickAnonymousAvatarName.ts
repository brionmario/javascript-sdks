// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ANONYMOUS_ANIMAL_ICONS} from './anonymousAnimalIcons.generated';
import hashStr from './hashStr';

const ANONYMOUS_AVATAR_NAMES: string[] = Object.keys(ANONYMOUS_ANIMAL_ICONS).sort();

/**
 * Deterministically picks one of the curated anonymous-avatar animal keys for a given seed
 * (e.g. a session or device identifier), so the same seed always maps to the same avatar.
 *
 * Use this to derive the `content` value for an `avatar:variant=anonymous_animal` spec —
 * the spec parser itself does no hashing, it just looks up whatever key it's given.
 *
 * @param seed - Seed text the pick is derived from. Falls back to a random pick when omitted.
 * @returns An anonymous animal key (e.g. `"otter"`) usable as `avatar:` spec's `content` param.
 *
 * @example
 * ```typescript
 * pickAnonymousAvatarName('session-abc123'); // "otter"
 * `avatar:variant=anonymous_animal,content=${pickAnonymousAvatarName(sessionId)}`;
 * ```
 */
const pickAnonymousAvatarName = (seed?: string): string => {
  const index: number = seed
    ? hashStr(seed) % ANONYMOUS_AVATAR_NAMES.length
    : Math.floor(Math.random() * ANONYMOUS_AVATAR_NAMES.length);

  return ANONYMOUS_AVATAR_NAMES[index];
};

export default pickAnonymousAvatarName;
