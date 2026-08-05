// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, vi} from 'vitest';
import ThunderIDRuntimeError from '../../errors/ThunderIDRuntimeError';
import isRecognizedBaseUrlPattern from '../isRecognizedBaseUrlPattern';

vi.mock('../logger', () => ({default: {warn: vi.fn()}}));

describe('isRecognizedBaseUrlPattern', () => {
  it('should return true for recognized base URL pattern', () => {
    expect(isRecognizedBaseUrlPattern('https://localhost:8090/t/dxlab')).toBe(true);
    expect(isRecognizedBaseUrlPattern('https://example.com/t/org')).toBe(true);
    expect(isRecognizedBaseUrlPattern('https://foo.com/t/bar/')).toBe(true);
    expect(isRecognizedBaseUrlPattern('https://foo.com/t/bar/extra')).toBe(true);
  });

  it('should return false for unrecognized base URL pattern', () => {
    expect(isRecognizedBaseUrlPattern('https://localhost:8090/tenant/dxlab')).toBe(false);
    expect(isRecognizedBaseUrlPattern('https://localhost:8090/')).toBe(false);
    expect(isRecognizedBaseUrlPattern('https://localhost:8090/t')).toBe(false);
    expect(isRecognizedBaseUrlPattern('https://localhost:8090/other/path')).toBe(false);
  });

  it('should throw ThunderIDRuntimeError if baseUrl is undefined', () => {
    expect(() => isRecognizedBaseUrlPattern(undefined)).toThrow(ThunderIDRuntimeError);

    try {
      isRecognizedBaseUrlPattern(undefined);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ThunderIDRuntimeError);
      expect(e.message).toMatch(/Base URL is required/);
    }
  });

  it('should throw ThunderIDRuntimeError for invalid URL format', () => {
    expect(() => isRecognizedBaseUrlPattern('not-a-valid-url')).toThrow(ThunderIDRuntimeError);

    try {
      isRecognizedBaseUrlPattern('not-a-valid-url');
    } catch (e: any) {
      expect(e).toBeInstanceOf(ThunderIDRuntimeError);
      expect(e.message).toMatch(/Invalid base URL format/);
    }
  });
});
