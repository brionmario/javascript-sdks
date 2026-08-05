// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, vi, afterEach} from 'vitest';
import formatDate from '../formatDate';

describe('formatDate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a formatted date for a valid date string', () => {
    const dateIso = '2025-07-09T12:00:00Z';
    const dateRfc = 'Wed, 09 Jul 2025 12:00:00 GMT';
    expect(formatDate(dateIso)).toBe('July 9, 2025');
    expect(formatDate(dateRfc)).toBe('July 9, 2025');
  });

  it('returns "-" when given undefined or empty', () => {
    expect(formatDate(undefined)).toBe('-');
    expect(formatDate('')).toBe('-');
  });

  it('returns the "Invalid Date" when the date is invalid', () => {
    const invalid = 'invalid-date';
    expect(formatDate(invalid)).toBe('Invalid Date');
  });

  it('returns the original string when parsing/formatting throws', () => {
    const spy: ReturnType<typeof vi.spyOn> = vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(() => {
      throw new RangeError('Forced failure');
    });

    const input = '2025-07-09T12:00:00Z';
    expect(formatDate(input)).toBe(input);

    spy.mockRestore();
  });
});
