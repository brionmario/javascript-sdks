// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {ANONYMOUS_ANIMAL_ICONS} from '../anonymousAnimalIcons.generated';
import {ANONYMOUS_ENTITY_ICONS} from '../anonymousEntityIcons.generated';
import generateAvatarDataUri from '../generateAvatarDataUri';
import resolveLogoUri from '../resolveLogoUri';

describe('resolveLogoUri', () => {
  it('resolves an emoji: spec to its glyph', () => {
    expect(resolveLogoUri('emoji:🐼')).toEqual({glyph: '🐼', kind: 'emoji'});
  });

  it('resolves an avatar: spec with explicit content to a generated data URI', () => {
    const resolved = resolveLogoUri('avatar:shape=circle,variant=two_letter,content=AC,colors=2');
    expect(resolved.kind).toBe('avatar');
    expect(resolved.imgSrc).toBe(
      generateAvatarDataUri({colors: 2, content: 'AC', shape: 'circle', variant: 'two_letter'}),
    );
  });

  it('derives content from the seed text when the spec has none', () => {
    const resolved = resolveLogoUri('avatar:shape=rounded,variant=two_letter,colors=0', 'Jane Doe');
    expect(decodeURIComponent(resolved.imgSrc ?? '')).toContain('>JA<');
  });

  it('resolves an anonymous_animal spec to its bundled icon markup', () => {
    const [name, icon] = Object.entries(ANONYMOUS_ANIMAL_ICONS)[0];
    const resolved = resolveLogoUri(`avatar:shape=rounded,variant=anonymous_animal,content=${name}`);
    expect(resolved.kind).toBe('avatar');
    expect(decodeURIComponent(resolved.imgSrc ?? '')).toContain(icon.color);
  });

  it('resolves an anonymous_entity spec to its bundled icon markup', () => {
    const [name, icon] = Object.entries(ANONYMOUS_ENTITY_ICONS)[0];
    const resolved = resolveLogoUri(`avatar:shape=rounded,variant=anonymous_entity,content=${name}`);
    expect(resolved.kind).toBe('avatar');
    expect(decodeURIComponent(resolved.imgSrc ?? '')).toContain(icon.color);
  });

  it('resolves a plain URL as-is', () => {
    expect(resolveLogoUri('https://example.com/logo.png')).toEqual({
      imgSrc: 'https://example.com/logo.png',
      kind: 'url',
    });
  });

  it('bundles the full curated anonymous-animal icon set', () => {
    expect(Object.keys(ANONYMOUS_ANIMAL_ICONS)).toHaveLength(19);
    Object.values(ANONYMOUS_ANIMAL_ICONS).forEach((icon) => {
      expect(icon.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(icon.markup.length).toBeGreaterThan(0);
    });
  });

  it('bundles the full curated anonymous-entity icon set', () => {
    expect(Object.keys(ANONYMOUS_ENTITY_ICONS)).toHaveLength(36);
    Object.values(ANONYMOUS_ENTITY_ICONS).forEach((icon) => {
      expect(icon.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(icon.markup.length).toBeGreaterThan(0);
    });
  });
});
