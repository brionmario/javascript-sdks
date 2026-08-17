// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import CookieChunking from '../CookieChunking';

describe('CookieChunking.split', () => {
  it('returns a single unchunked entry for a small value', () => {
    expect(CookieChunking.split('session', 'small-value')).toEqual({session: 'small-value'});
  });

  it('splits an oversized value into numbered chunk entries', () => {
    const largeValue = 'x'.repeat(10_000);
    const chunks = CookieChunking.split('session', largeValue);

    const names = Object.keys(chunks);
    expect(names.length).toBeGreaterThan(1);
    expect(names.every((name: string) => /^session\.\d+$/.test(name))).toBe(true);
    expect(Object.values(chunks).join('')).toBe(largeValue);
  });
});

describe('CookieChunking.join', () => {
  it('returns the unchunked value when present', () => {
    const jar: Record<string, string> = {session: 'small-value'};
    expect(CookieChunking.join('session', (name: string) => jar[name])).toBe('small-value');
  });

  it('reassembles numbered chunks in order', () => {
    const largeValue = 'x'.repeat(10_000);
    const jar = CookieChunking.split('session', largeValue);

    expect(CookieChunking.join('session', (name: string) => jar[name])).toBe(largeValue);
  });

  it('returns undefined when nothing is present', () => {
    expect(CookieChunking.join('session', () => undefined)).toBeUndefined();
  });
});

describe('CookieChunking.filterChunkNames', () => {
  it('matches the base name and its numbered chunks only', () => {
    const names = ['session', 'session.0', 'session.1', 'other', 'session-other'];
    expect(CookieChunking.filterChunkNames('session', names)).toEqual(['session', 'session.0', 'session.1']);
  });
});
