// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, beforeEach, vi} from 'vitest';
import generateFlattenedUserProfile from '../generateFlattenedUserProfile';

describe('generateFlattenedUserProfile', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the user profile response object as-is', () => {
    const me: Record<string, unknown> = {
      country: 'US',
      userName: 'john',
      emails: ['john@example.com'],
    };

    const out = generateFlattenedUserProfile(me);
    expect(out).toEqual(me);
  });
});
