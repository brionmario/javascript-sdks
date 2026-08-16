// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {removeChunkedCookieFromHeader, replaceChunkedCookieInHeader} from '../thunderIDProxy';

describe('removeChunkedCookieFromHeader', () => {
  it('removes a single unchunked cookie, leaving others untouched', () => {
    const header = 'session=abc123; theme=dark';
    expect(removeChunkedCookieFromHeader(header, 'session')).toBe('theme=dark');
  });

  it('removes every numbered chunk of a chunked cookie, leaving others untouched', () => {
    const header = 'theme=dark; session.0=aaa; session.1=bbb; session.2=ccc; locale=en';
    expect(removeChunkedCookieFromHeader(header, 'session')).toBe('theme=dark; locale=en');
  });

  it('does not remove an unrelated cookie that merely shares a prefix', () => {
    const header = 'session=abc123; session-other=xyz';
    expect(removeChunkedCookieFromHeader(header, 'session')).toBe('session-other=xyz');
  });

  it('returns an empty string for an empty header', () => {
    expect(removeChunkedCookieFromHeader('', 'session')).toBe('');
  });
});

describe('replaceChunkedCookieInHeader', () => {
  it('appends the cookie when it is not already present', () => {
    const header = 'theme=dark';
    expect(replaceChunkedCookieInHeader(header, 'session', 'small-value')).toBe('theme=dark; session=small-value');
  });

  it('replaces a small unchunked value in place', () => {
    const header = 'theme=dark; session=old-value; locale=en';
    expect(replaceChunkedCookieInHeader(header, 'session', 'new-value')).toBe(
      'theme=dark; locale=en; session=new-value',
    );
  });

  it('splits an oversized value into numbered chunk entries, dropping the unchunked entry', () => {
    const header = 'theme=dark; session=old-value';
    const largeValue = 'x'.repeat(10_000);

    const result = replaceChunkedCookieInHeader(header, 'session', largeValue);
    const parts = result.split('; ');

    expect(parts[0]).toBe('theme=dark');
    expect(parts.slice(1).every((p) => /^session\.\d+=/.test(p))).toBe(true);

    // Round-trip: reassembling the chunk values should reproduce the original.
    const reassembled = parts
      .slice(1)
      .map((p) => p.slice(p.indexOf('=') + 1))
      .join('');
    expect(reassembled).toBe(largeValue);
  });

  it('collapses stale numbered chunks back into a single entry when the new value shrinks', () => {
    const header = 'theme=dark; session.0=aaa; session.1=bbb; session.2=ccc';

    expect(replaceChunkedCookieInHeader(header, 'session', 'small-value')).toBe('theme=dark; session=small-value');
  });
});
