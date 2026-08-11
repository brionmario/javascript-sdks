// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import substituteTranslationParams, {hasUnresolvedTranslationParams} from '../substituteTranslationParams';

describe('substituteTranslationParams', () => {
  it('substitutes the backend `{{param(name)}}` syntax', () => {
    expect(
      substituteTranslationParams('User already exists with the provided {{param(attribute)}}', {attribute: 'email'}),
    ).toBe('User already exists with the provided email');
  });

  it('tolerates whitespace inside the backend placeholder', () => {
    expect(substituteTranslationParams('The provided {{ param( attribute ) }} is taken', {attribute: 'username'})).toBe(
      'The provided username is taken',
    );
  });

  it('substitutes the bundle `{name}` syntax', () => {
    expect(substituteTranslationParams('Minimum length is {min} characters', {min: 8})).toBe(
      'Minimum length is 8 characters',
    );
  });

  it('substitutes every occurrence of every param', () => {
    expect(
      substituteTranslationParams('{{param(attribute)}} and {other} conflict with {{param(attribute)}}', {
        attribute: 'email',
        other: 'username',
      }),
    ).toBe('email and username conflict with email');
  });

  it('leaves placeholders without a matching param untouched', () => {
    expect(substituteTranslationParams('The provided {{param(attribute)}} is taken', {unrelated: 'x'})).toBe(
      'The provided {{param(attribute)}} is taken',
    );
  });

  it('returns the translation unchanged when no params are given', () => {
    expect(substituteTranslationParams('The provided {{param(attribute)}} is taken')).toBe(
      'The provided {{param(attribute)}} is taken',
    );
    expect(substituteTranslationParams('Plain message', {})).toBe('Plain message');
    expect(substituteTranslationParams('', {attribute: 'email'})).toBe('');
  });

  it('treats param values as literals rather than replacement patterns', () => {
    expect(substituteTranslationParams('Value: {{param(attribute)}}', {attribute: '$&'})).toBe('Value: $&');
  });
});

describe('hasUnresolvedTranslationParams', () => {
  it('detects a remaining backend placeholder', () => {
    expect(hasUnresolvedTranslationParams('The provided {{param(attribute)}} is taken')).toBe(true);
    expect(hasUnresolvedTranslationParams('The provided {{ param( attribute ) }} is taken')).toBe(true);
  });

  it('reports fully resolved strings as resolved', () => {
    expect(hasUnresolvedTranslationParams('The provided email is taken')).toBe(false);
    expect(hasUnresolvedTranslationParams('Minimum length is {min} characters')).toBe(false);
    expect(hasUnresolvedTranslationParams('')).toBe(false);
  });
});
