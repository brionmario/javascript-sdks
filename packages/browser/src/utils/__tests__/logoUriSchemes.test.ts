// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {extractEmojiFromUri, isEmojiUri} from '@thunderid/javascript';
import {describe, it, expect} from 'vitest';
import isAvatarUri from '../isAvatarUri';

describe('logo URI scheme predicates', () => {
  it('recognizes only their own scheme', () => {
    expect(isEmojiUri('emoji:🐯')).toBe(true);
    expect(isAvatarUri('avatar:shape=circle,variant=two_letter,content=BM')).toBe(true);

    const specs = ['emoji:🐯', 'avatar:shape=circle', 'https://example.com/logo.png'];
    expect(specs.filter(isEmojiUri)).toEqual(['emoji:🐯']);
    expect(specs.filter(isAvatarUri)).toEqual(['avatar:shape=circle']);
  });

  it('extracts the payload from their own scheme', () => {
    expect(extractEmojiFromUri('emoji:🐯')).toBe('🐯');
  });
});
