// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// src/server/actions/__tests__/getClientOrigin.test.ts
import {headers} from 'next/headers';
import {describe, it, expect, vi, beforeEach, afterEach, type Mock} from 'vitest';

// Import SUT and mocked dep
import getClientOrigin from '../getClientOrigin';

// Mock next/headers BEFORE importing the SUT
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

// Helper: build a Headers-like object. get() should be case-insensitive.
interface HLike {
  get: (name: string) => string | null;
}
const makeHeaders = (map: Record<string, string | null | undefined>): HLike => {
  const normalized: Record<string, string | null | undefined> = {};
  Object.entries(map).forEach(([k, val]: [string, string | null | undefined]) => {
    normalized[k.toLowerCase()] = val;
  });
  return {
    get: (name: string): string | null => {
      const v: string | null | undefined = normalized[name.toLowerCase()];
      return v == null ? null : v; // emulate real Headers.get(): string | null
    },
  };
};

describe('getClientOrigin', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // by default return empty headers
    (headers as unknown as Mock).mockResolvedValue(makeHeaders({}));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return https origin when x-forwarded-proto is https and host is present', async () => {
    (headers as unknown as Mock).mockResolvedValue(makeHeaders({host: 'example.com', 'x-forwarded-proto': 'https'}));

    const origin: string = await getClientOrigin();

    expect(headers).toHaveBeenCalledTimes(1);
    expect(origin).toBe('https://example.com');
  });

  it('should fall back to http when x-forwarded-proto is missing', async () => {
    (headers as unknown as Mock).mockResolvedValue(
      makeHeaders({host: 'svc.internal' /* x-forwarded-proto: missing */}),
    );

    const origin: string = await getClientOrigin();

    expect(origin).toBe('http://svc.internal');
  });

  it('should return "protocol://null" when host is missing', async () => {
    // host header absent -> get('host') returns null -> interpolates as "null"
    (headers as unknown as Mock).mockResolvedValue(makeHeaders({'x-forwarded-proto': 'https'}));

    const origin: string = await getClientOrigin();

    expect(origin).toBe('https://null');
  });

  it('should propagate errors when headers() rejects', async () => {
    (headers as unknown as Mock).mockRejectedValue(new Error('headers not available'));

    await expect(getClientOrigin()).rejects.toThrow('headers not available');
  });
});
