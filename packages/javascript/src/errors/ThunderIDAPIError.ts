// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import ThunderIDError from './ThunderIDError';
import parseApiErrorMessage from '../utils/parseApiErrorMessage';

/**
 * Base class for all API-related errors in ThunderID. This class extends ThunderIDError
 * and adds support for HTTP status codes and status text.
 *
 * The `message` parameter may be either a plain string or a raw JSON error body from the
 * ThunderID API — the constructor will extract a human-readable message automatically.
 * An optional `prefix` is prepended to the resolved message (e.g. "Failed to fetch user profile").
 *
 * @example
 * ```typescript
 * throw new ThunderIDAPIError(
 *   "Failed to fetch user data",
 *   "API_FETCH_ERROR",
 *   "javascript",
 *   404,
 *   "Not Found"
 * );
 * ```
 */
export default class ThunderIDAPIError extends ThunderIDError {
  /**
   * Creates an instance of ThunderIDAPIError.
   *
   * @param message - Human-readable description or raw API error response body
   * @param code - A unique error code that identifies the error type
   * @param origin - The SDK origin (e.g. 'react', 'vue')
   * @param statusCode - HTTP status code of the failed request
   * @param statusText - HTTP status text of the failed request
   * @param prefix - Optional prefix prepended to the resolved message
   * @constructor
   */
  constructor(
    message: string,
    code: string,
    origin: string,
    public readonly statusCode?: number,
    public readonly statusText?: string,
    prefix?: string,
  ) {
    const parsed: string = parseApiErrorMessage(message);
    const resolvedMessage: string = prefix ? `${prefix}: ${parsed}` : parsed;
    super(resolvedMessage, code, origin);

    Object.defineProperty(this, 'name', {
      configurable: true,
      value: 'ThunderIDAPIError',
      writable: true,
    });
  }

  /**
   * Returns a string representation of the API error
   * @returns Formatted error string with name, code, status, and message
   */
  public override toString(): string {
    const status: string = this.statusCode ? ` (HTTP ${this.statusCode} - ${this.statusText})` : '';
    return `[${this.name}] (code="${this.code}")${status}\nMessage: ${this.message}`;
  }
}
