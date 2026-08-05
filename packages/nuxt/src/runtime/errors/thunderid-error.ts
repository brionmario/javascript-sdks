// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ErrorCode} from './error-codes';

/**
 * Structured error type for the ThunderID Nuxt SDK.
 *
 * Every error thrown by SDK internals should be an `ThunderIDError` so
 * that callers can branch on `err.code` instead of matching strings.
 *
 * @example
 * ```ts
 * try {
 *   const session = await requireServerSession(event);
 * } catch (err) {
 *   if (err instanceof ThunderIDError && err.code === ErrorCode.SessionMissing) {
 *     throw createError({ statusCode: 401 });
 *   }
 *   throw err;
 * }
 * ```
 */
export class ThunderIDError extends Error {
  readonly code: ErrorCode;

  readonly statusCode?: number;

  override readonly cause?: unknown;

  readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode,
    opts?: {
      cause?: unknown;
      context?: Record<string, unknown>;
      statusCode?: number;
    },
  ) {
    super(message);
    this.name = 'ThunderIDError';
    this.code = code;
    this.statusCode = opts?.statusCode;
    this.cause = opts?.cause;
    this.context = opts?.context;

    // Maintain correct prototype chain in transpiled environments
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
