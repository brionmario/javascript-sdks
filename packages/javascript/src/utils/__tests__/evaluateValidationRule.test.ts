// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
// Deliberate type-violation casts exercise the evaluator's tolerance for malformed
// rule shapes (non-string regex value, non-numeric length, unknown rule type).

import {describe, it, expect} from 'vitest';
import evaluateValidationRule, {DEFAULT_VALIDATION_MESSAGE_KEYS} from '../evaluateValidationRule';

describe('evaluateValidationRule', () => {
  describe('regex', () => {
    it('returns null when the value matches the pattern', () => {
      expect(evaluateValidationRule({type: 'regex', value: '^[a-z]+$', message: 'bad'}, 'hello')).toBeNull();
    });

    it('returns the rule message when the value does not match', () => {
      expect(evaluateValidationRule({type: 'regex', value: '^[a-z]+$', message: 'bad'}, 'Hello')).toBe('bad');
    });

    it('falls back to the default i18n key when no message is provided', () => {
      expect(evaluateValidationRule({type: 'regex', value: '^X+$'}, 'abc')).toBe(DEFAULT_VALIDATION_MESSAGE_KEYS.regex);
    });

    it('treats an invalid regex pattern as passing (lenient client-side)', () => {
      // `[` is an unterminated character class — RegExp constructor throws on this.
      // We expect the rule to be skipped on the client; the server stays authoritative.
      expect(evaluateValidationRule({type: 'regex', value: '[', message: 'bad'}, 'anything')).toBeNull();
    });

    it('treats a non-string value as passing', () => {
      expect(evaluateValidationRule({type: 'regex', value: 42 as any, message: 'bad'}, 'a')).toBeNull();
    });
  });

  describe('minLength', () => {
    it('returns null when the value length is at least value', () => {
      expect(evaluateValidationRule({type: 'minLength', value: 5, message: 'too short'}, '12345')).toBeNull();
      expect(evaluateValidationRule({type: 'minLength', value: 3, message: 'too short'}, 'abcd')).toBeNull();
    });

    it('returns the message when the value is shorter than required', () => {
      expect(evaluateValidationRule({type: 'minLength', value: 8, message: 'too short'}, 'abc')).toBe('too short');
    });

    it('falls back to the default i18n key when no message is provided', () => {
      expect(evaluateValidationRule({type: 'minLength', value: 5}, 'a')).toBe(
        DEFAULT_VALIDATION_MESSAGE_KEYS.minLength,
      );
    });

    it('treats a non-numeric value as passing', () => {
      expect(evaluateValidationRule({type: 'minLength', value: 'oops' as any, message: 'bad'}, 'a')).toBeNull();
    });
  });

  describe('maxLength', () => {
    it('returns null when the value length is at or below value', () => {
      expect(evaluateValidationRule({type: 'maxLength', value: 5, message: 'too long'}, '12345')).toBeNull();
      expect(evaluateValidationRule({type: 'maxLength', value: 5, message: 'too long'}, 'ab')).toBeNull();
    });

    it('returns the message when the value exceeds the max', () => {
      expect(evaluateValidationRule({type: 'maxLength', value: 3, message: 'too long'}, 'abcdef')).toBe('too long');
    });

    it('falls back to the default i18n key when no message is provided', () => {
      expect(evaluateValidationRule({type: 'maxLength', value: 2}, 'abcdef')).toBe(
        DEFAULT_VALIDATION_MESSAGE_KEYS.maxLength,
      );
    });
  });

  describe('unknown rule types', () => {
    it('returns null for forward-compatibility', () => {
      expect(evaluateValidationRule({type: 'unknown' as any, value: 'x', message: 'bad'}, 'anything')).toBeNull();
    });
  });
});
