// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import ThunderIDError from './ThunderIDError';

/**
 * Base class for all runtime errors in ThunderID. This class extends ThunderIDError
 * and adds support for additional error details. Use this class for errors that occur
 * during runtime execution that are not related to API calls.
 *
 * @example
 * ```typescript
 * throw new ThunderIDRuntimeError(
 *   "Failed to parse configuration",
 *   "CONFIG_PARSE_ERROR",
 *   { invalidField: "redirectUri" }
 * );
 * ```
 */
export default class ThunderIDRuntimeError extends ThunderIDError {
  /**
   * Creates an instance of ThunderIDRuntimeError.
   *
   * @param message - Human-readable description of the error
   * @param code - A unique error code that identifies the error type
   * @param details - Additional details about the error that might be helpful for debugging
   * @param origin - Optional. The SDK origin (e.g. 'react', 'vue'). Defaults to generic 'ThunderID'
   * @constructor
   */
  constructor(
    message: string,
    code: string,
    origin: string,
    public readonly details?: unknown,
  ) {
    super(message, code, origin);

    Object.defineProperty(this, 'name', {
      configurable: true,
      value: 'ThunderIDRuntimeError',
      writable: true,
    });
  }

  /**
   * Returns a string representation of the runtime error
   * @returns Formatted error string with name, code, details, and message
   */
  public override toString(): string {
    const details: string = this.details ? `\nDetails: ${JSON.stringify(this.details, null, 2)}` : '';
    return `[${this.name}] (code="${this.code}")${details}\nMessage: ${this.message}`;
  }
}
