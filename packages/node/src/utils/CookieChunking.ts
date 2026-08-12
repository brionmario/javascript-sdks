// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Framework-agnostic cookie chunking. Browsers reject a `Set-Cookie` once
 * the full `name=value; attributes` line exceeds ~4096 bytes, so a session
 * cookie carrying a JWT (access/id/refresh tokens) can overflow that limit.
 * Mirrors next-auth's session cookie chunking (packages/core/src/lib/utils/cookie.ts):
 * split an oversized value across numbered `${name}.0`, `${name}.1`, ...
 * cookies and reassemble on read.
 *
 * This class only computes chunk names/values — reading, writing, and
 * deleting cookies is framework-specific (h3, Next.js, Express, ...), so
 * callers plug in their own cookie access via the `getCookie` callback and
 * by writing/deleting the names this class returns.
 */
class CookieChunking {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static readonly ALLOWED_COOKIE_SIZE: number = 4096;

  static readonly ESTIMATED_EMPTY_COOKIE_SIZE: number = 160;

  static readonly CHUNK_SIZE: number = CookieChunking.ALLOWED_COOKIE_SIZE - CookieChunking.ESTIMATED_EMPTY_COOKIE_SIZE;

  /**
   * Builds the cookie name for chunk `index` of a chunked cookie `name`.
   */
  static getChunkName(name: string, index: number): string {
    return `${name}.${index}`;
  }

  /**
   * Filters `cookieNames` down to those belonging to `name`: the unchunked
   * base cookie and/or any numbered `${name}.0`, `${name}.1`, ... chunks.
   */
  static filterChunkNames(name: string, cookieNames: string[]): string[] {
    const prefix = `${name}.`;
    return cookieNames.filter((cookieName: string) => cookieName === name || cookieName.startsWith(prefix));
  }

  /**
   * Splits `value` into the cookie name/value pairs that should be written
   * for `name`: a single `{[name]: value}` entry when it fits in one
   * cookie, or numbered `${name}.0`, `${name}.1`, ... entries once it would
   * exceed the ~4KB per-cookie limit.
   */
  static split(name: string, value: string): Record<string, string> {
    const chunkCount: number = Math.max(1, Math.ceil(value.length / CookieChunking.CHUNK_SIZE));

    if (chunkCount === 1) {
      return {[name]: value};
    }

    const chunks: Record<string, string> = {};
    for (let i = 0; i < chunkCount; i += 1) {
      chunks[CookieChunking.getChunkName(name, i)] = value.slice(
        i * CookieChunking.CHUNK_SIZE,
        (i + 1) * CookieChunking.CHUNK_SIZE,
      );
    }
    return chunks;
  }

  /**
   * Reassembles a cookie value that may have been split via {@link split}.
   * Calls `getCookie` with `name` first, then `${name}.0`, `${name}.1`, ...
   * until a lookup returns `undefined`.
   */
  static join(name: string, getCookie: (cookieName: string) => string | undefined): string | undefined {
    const unchunked: string | undefined = getCookie(name);
    if (unchunked !== undefined) return unchunked;

    const chunks: string[] = [];
    for (let i = 0; ; i += 1) {
      const chunk: string | undefined = getCookie(CookieChunking.getChunkName(name, i));
      if (chunk === undefined) break;
      chunks.push(chunk);
    }

    return chunks.length > 0 ? chunks.join('') : undefined;
  }
}

export default CookieChunking;
