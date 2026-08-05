// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ANONYMOUS_ENTITY_ICONS} from './anonymousEntityIcons.generated';
import hashStr from './hashStr';

const ANONYMOUS_ENTITY_NAMES: string[] = Object.keys(ANONYMOUS_ENTITY_ICONS).sort();

/**
 * Deterministically picks one of the curated anonymous-entity icon keys for a given seed
 * (e.g. an application, organization, or resource server identifier), so the same seed
 * always maps to the same icon.
 *
 * Use this to derive the `content` value for an `avatar:variant=anonymous_entity` spec —
 * the spec parser itself does no hashing, it just looks up whatever key it's given.
 *
 * @param seed - Seed text the pick is derived from. Falls back to a random pick when omitted.
 * @returns An anonymous entity key (e.g. `"hexagon"`) usable as `avatar:` spec's `content` param.
 *
 * @example
 * ```typescript
 * pickAnonymousEntityName('app-abc123'); // "hexagon"
 * `avatar:variant=anonymous_entity,content=${pickAnonymousEntityName(appId)}`;
 * ```
 */
const pickAnonymousEntityName = (seed?: string): string => {
  const index: number = seed
    ? hashStr(seed) % ANONYMOUS_ENTITY_NAMES.length
    : Math.floor(Math.random() * ANONYMOUS_ENTITY_NAMES.length);

  return ANONYMOUS_ENTITY_NAMES[index];
};

export default pickAnonymousEntityName;
