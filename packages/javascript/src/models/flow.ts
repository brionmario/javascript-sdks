// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export enum FlowMode {
  /**
   * This mode is suitable for embedded sign-in, sign-up, etc. flows where the authentication
   * UIs are rendered within the application.
   */
  Embedded = 'DIRECT',
  /**
   * Traditional redirect based sign-in, sign-up, etc. flows where the authentication
   * UIs are from a external Identity Provider (ex: ThunderID).
   */
  Redirect = 'REDIRECTION',
}
