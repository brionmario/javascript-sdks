// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import isEmpty from '../isEmpty';

describe('isEmpty', () => {
  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should return true for whitespace-only string', () => {
    expect(isEmpty('   ')).toBe(true);
    expect(isEmpty('\t')).toBe(true);
    expect(isEmpty('\n')).toBe(true);
    expect(isEmpty(' \t\n ')).toBe(true);
  });

  it('should return false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty(' hello ')).toBe(false);
    expect(isEmpty('0')).toBe(false);
  });

  it('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return false for non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty([''])).toBe(false);
    expect(isEmpty([null])).toBe(false);
  });

  it('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for non-empty object', () => {
    expect(isEmpty({name: 'John'})).toBe(false);
    expect(isEmpty({'': ''})).toBe(false);
    expect(isEmpty({a: undefined})).toBe(false);
  });

  it('should return false for numbers', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(-1)).toBe(false);
    expect(isEmpty(3.14)).toBe(false);
    expect(isEmpty(NaN)).toBe(false);
    expect(isEmpty(Infinity)).toBe(false);
  });

  it('should return false for booleans', () => {
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(false)).toBe(false);
  });

  it('should return false for functions', () => {
    expect(isEmpty(() => {})).toBe(false);
    expect(isEmpty(() => {})).toBe(false);
  });

  it('should return false for dates', () => {
    expect(isEmpty(new Date())).toBe(false);
  });

  it('should return false for other object types', () => {
    expect(isEmpty(new Set())).toBe(false);
    expect(isEmpty(new Map())).toBe(false);
    expect(isEmpty(/regex/)).toBe(false);
  });
});
