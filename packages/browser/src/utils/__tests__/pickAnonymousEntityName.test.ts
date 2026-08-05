// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {ANONYMOUS_ENTITY_ICONS} from '../anonymousEntityIcons.generated';
import pickAnonymousEntityName from '../pickAnonymousEntityName';

describe('pickAnonymousEntityName', () => {
  it('always returns a name present in the bundled anonymous icon set', () => {
    expect(Object.keys(ANONYMOUS_ENTITY_ICONS)).toContain(pickAnonymousEntityName('some-seed'));
    expect(Object.keys(ANONYMOUS_ENTITY_ICONS)).toContain(pickAnonymousEntityName());
  });

  it('is deterministic for the same seed', () => {
    expect(pickAnonymousEntityName('app-abc123')).toBe(pickAnonymousEntityName('app-abc123'));
  });

  it('can differ across seeds', () => {
    const names = new Set(['a', 'b', 'c', 'd', 'e'].map((seed) => pickAnonymousEntityName(seed)));
    expect(names.size).toBeGreaterThan(1);
  });
});
