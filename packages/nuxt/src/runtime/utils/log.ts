// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

const PREFIX = '@thunderid/nuxt';

/**
 * Mask a token so it is safe to include in logs and error messages.
 * Shows the first 4 and last 4 characters, replacing the middle with "…".
 *
 * @example
 * maskToken('eyJhbGciOiJIUzI1NiJ9.abc.xyz') // 'eyJh….xyz'
 */
export function maskToken(token: string): string {
  if (!token) return '(empty)';
  if (token.length <= 8) return '***';
  return `${token.slice(0, 4)}…${token.slice(-4)}`;
}

/**
 * Create a namespaced logger for a specific SDK subsystem.
 *
 * Debug output is suppressed unless the `THUNDERID_DEBUG` environment
 * variable is set (any truthy value).
 *
 * @example
 * ```ts
 * const log = createLogger('session');
 * log.info('Session created for', maskToken(accessToken));
 * log.debug('Full payload', payload); // only logged when THUNDERID_DEBUG=true
 * ```
 */
export function createLogger(subsystem: string): {
  debug: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
} {
  const tag = `[${PREFIX}:${subsystem}]`;
  return {
    debug: (...args: unknown[]): void => {
      if (process.env.THUNDERID_DEBUG) {
        console.log(tag, ...args);
      }
    },
    error: (...args: unknown[]): void => {
      console.error(tag, ...args);
    },
    info: (...args: unknown[]): void => {
      console.log(tag, ...args);
    },
    warn: (...args: unknown[]): void => {
      console.warn(tag, ...args);
    },
  };
}

/* eslint-enable no-console */
