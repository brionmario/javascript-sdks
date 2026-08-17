// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/typedef, sort-keys, @typescript-eslint/explicit-function-return-type */

import type {H3Event} from 'h3';
import {describe, it, expect} from 'vitest';
import {deleteChunkedCookie, getChunkedCookie, setChunkedCookie} from '../../src/runtime/server/utils/chunkedCookie';

const OPTIONS = {httpOnly: true, maxAge: 3600, path: '/', sameSite: 'lax' as const, secure: false};

/**
 * A minimal fake H3Event, backed by real Node-response-shaped `req`/`res`
 * objects, so the tests exercise h3's real `getCookie`/`setCookie`/
 * `deleteCookie`/`parseCookies` rather than a hand-rolled mock.
 */
function createMockEvent(cookieHeader = ''): H3Event & {responseHeaders: Record<string, string | string[]>} {
  const responseHeaders: Record<string, string | string[]> = {};

  const res = {
    appendHeader: (name: string, value: string): void => {
      const key = name.toLowerCase();
      const existing = responseHeaders[key];
      if (existing === undefined) responseHeaders[key] = value;
      else if (Array.isArray(existing)) existing.push(value);
      else responseHeaders[key] = [existing, value];
    },
    getHeader: (name: string): string | string[] | undefined => responseHeaders[name.toLowerCase()],
    removeHeader: (name: string): void => {
      delete responseHeaders[name.toLowerCase()];
    },
    setHeader: (name: string, value: string | string[]): void => {
      responseHeaders[name.toLowerCase()] = value;
    },
  };

  const req = {headers: {cookie: cookieHeader}};

  return {node: {req, res}, responseHeaders} as unknown as H3Event & {
    responseHeaders: Record<string, string | string[]>;
  };
}

/** Extracts the `Set-Cookie` values written to a mock event's response. */
function getSetCookieHeaders(event: H3Event & {responseHeaders: Record<string, string | string[]>}): string[] {
  const header = event.responseHeaders['set-cookie'];
  if (!header) return [];
  return Array.isArray(header) ? header : [header];
}

/**
 * Applies a mock event's `Set-Cookie` response headers onto a cookie jar,
 * simulating a browser: `Max-Age=0` deletes, everything else is stored (or
 * overwritten). Returns the jar serialized as a `Cookie` request header.
 */
function applyResponseCookies(
  event: H3Event & {responseHeaders: Record<string, string | string[]>},
  jar: Record<string, string> = {},
): Record<string, string> {
  const next: Record<string, string> = {...jar};

  for (const raw of getSetCookieHeaders(event)) {
    const [pair, ...attrs] = raw.split(';').map((s: string) => s.trim());
    const eqIndex = pair.indexOf('=');
    const name = pair.slice(0, eqIndex);
    const value = pair.slice(eqIndex + 1);
    const maxAgeAttr = attrs.find((a: string) => a.toLowerCase().startsWith('max-age='));
    const maxAge = maxAgeAttr ? Number(maxAgeAttr.split('=')[1]) : undefined;

    if (maxAge === 0) {
      delete next[name];
    } else {
      next[name] = value;
    }
  }

  return next;
}

function toCookieHeader(jar: Record<string, string>): string {
  return Object.entries(jar)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

describe('setChunkedCookie / getChunkedCookie', () => {
  it('writes a small value as a single unchunked cookie', () => {
    const event = createMockEvent();
    setChunkedCookie(event, 'session', 'small-value', OPTIONS);

    const cookies = getSetCookieHeaders(event);
    expect(cookies).toHaveLength(1);
    expect(cookies[0].startsWith('session=small-value;')).toBe(true);
  });

  it('round-trips a small value through the next request', () => {
    const writeEvent = createMockEvent();
    setChunkedCookie(writeEvent, 'session', 'small-value', OPTIONS);

    const jar = applyResponseCookies(writeEvent);
    const readEvent = createMockEvent(toCookieHeader(jar));

    expect(getChunkedCookie(readEvent, 'session')).toBe('small-value');
  });

  it('splits an oversized value across numbered chunk cookies and reassembles it', () => {
    const largeValue = 'x'.repeat(10_000);

    const writeEvent = createMockEvent();
    setChunkedCookie(writeEvent, 'session', largeValue, OPTIONS);

    const cookies = getSetCookieHeaders(writeEvent);
    // Must be split — a single 10,000-byte cookie would never fit in one.
    expect(cookies.length).toBeGreaterThan(1);
    expect(cookies.every((c: string) => /^session\.\d+=/.test(c))).toBe(true);
    expect(cookies.some((c: string) => c.startsWith('session='))).toBe(false);

    const jar = applyResponseCookies(writeEvent);
    const readEvent = createMockEvent(toCookieHeader(jar));

    expect(getChunkedCookie(readEvent, 'session')).toBe(largeValue);
  });

  it('clears stale higher-numbered chunks when a re-issued value shrinks', () => {
    const largeValue = 'x'.repeat(12_000);
    const smallValue = 'small-value';

    // First write: chunked into several cookies.
    const firstWrite = createMockEvent();
    setChunkedCookie(firstWrite, 'session', largeValue, OPTIONS);
    let jar = applyResponseCookies(firstWrite);
    expect(Object.keys(jar).filter((k: string) => k.startsWith('session.')).length).toBeGreaterThan(1);

    // Second write, from a request carrying the first write's chunk cookies:
    // re-issuing a much smaller value should collapse back to one cookie and
    // clear every leftover numbered chunk.
    const secondWrite = createMockEvent(toCookieHeader(jar));
    setChunkedCookie(secondWrite, 'session', smallValue, OPTIONS);
    jar = applyResponseCookies(secondWrite, jar);

    expect(jar.session).toBe(smallValue);
    expect(Object.keys(jar).some((k: string) => k.startsWith('session.'))).toBe(false);

    const readEvent = createMockEvent(toCookieHeader(jar));
    expect(getChunkedCookie(readEvent, 'session')).toBe(smallValue);
  });

  it('clears the prior unchunked cookie when a re-issued value grows past the chunk threshold', () => {
    const smallValue = 'small-value';
    const largeValue = 'y'.repeat(10_000);

    const firstWrite = createMockEvent();
    setChunkedCookie(firstWrite, 'session', smallValue, OPTIONS);
    let jar = applyResponseCookies(firstWrite);
    expect(jar.session).toBe(smallValue);

    const secondWrite = createMockEvent(toCookieHeader(jar));
    setChunkedCookie(secondWrite, 'session', largeValue, OPTIONS);
    jar = applyResponseCookies(secondWrite, jar);

    expect(jar.session).toBeUndefined();
    expect(Object.keys(jar).filter((k: string) => k.startsWith('session.')).length).toBeGreaterThan(1);

    const readEvent = createMockEvent(toCookieHeader(jar));
    expect(getChunkedCookie(readEvent, 'session')).toBe(largeValue);
  });

  it('returns undefined when no cookie is present', () => {
    const event = createMockEvent();
    expect(getChunkedCookie(event, 'session')).toBeUndefined();
  });
});

describe('deleteChunkedCookie', () => {
  it('clears an unchunked cookie', () => {
    const writeEvent = createMockEvent();
    setChunkedCookie(writeEvent, 'session', 'small-value', OPTIONS);
    let jar = applyResponseCookies(writeEvent);

    const deleteEvent = createMockEvent(toCookieHeader(jar));
    deleteChunkedCookie(deleteEvent, 'session', OPTIONS);
    jar = applyResponseCookies(deleteEvent, jar);

    expect(jar.session).toBeUndefined();
  });

  it('clears every numbered chunk present in the request', () => {
    const largeValue = 'z'.repeat(12_000);

    const writeEvent = createMockEvent();
    setChunkedCookie(writeEvent, 'session', largeValue, OPTIONS);
    let jar = applyResponseCookies(writeEvent);
    expect(Object.keys(jar).filter((k: string) => k.startsWith('session.')).length).toBeGreaterThan(1);

    const deleteEvent = createMockEvent(toCookieHeader(jar));
    deleteChunkedCookie(deleteEvent, 'session', OPTIONS);
    jar = applyResponseCookies(deleteEvent, jar);

    expect(Object.keys(jar).some((k: string) => k === 'session' || k.startsWith('session.'))).toBe(false);
  });

  it('is a no-op-safe call when nothing is present', () => {
    const event = createMockEvent();
    expect(() => deleteChunkedCookie(event, 'session', OPTIONS)).not.toThrow();
  });
});
