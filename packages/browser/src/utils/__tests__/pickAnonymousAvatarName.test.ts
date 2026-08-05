// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {ANONYMOUS_ANIMAL_ICONS} from '../anonymousAnimalIcons.generated';
import pickAnonymousAvatarName from '../pickAnonymousAvatarName';

describe('pickAnonymousAvatarName', () => {
  it('always returns a name present in the bundled anonymous icon set', () => {
    expect(Object.keys(ANONYMOUS_ANIMAL_ICONS)).toContain(pickAnonymousAvatarName('some-seed'));
    expect(Object.keys(ANONYMOUS_ANIMAL_ICONS)).toContain(pickAnonymousAvatarName());
  });

  it('is deterministic for the same seed', () => {
    expect(pickAnonymousAvatarName('session-abc123')).toBe(pickAnonymousAvatarName('session-abc123'));
  });

  it('can differ across seeds', () => {
    const names = new Set(['a', 'b', 'c', 'd', 'e'].map((seed) => pickAnonymousAvatarName(seed)));
    expect(names.size).toBeGreaterThan(1);
  });
});
