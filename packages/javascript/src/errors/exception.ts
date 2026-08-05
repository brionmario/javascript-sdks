// Copyright 2020 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * @deprecated Use `ThunderIDRuntimeError` for runtime errors and `ThunderIDAPIError` for API errors.
 */
export class ThunderIDAuthException extends Error {
  public code: string | undefined;

  public constructor(code: string, name: string, message: string) {
    super(message);
    this.name = name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
