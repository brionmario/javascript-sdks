// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Constants describing why a set of consent decisions was submitted.
 *
 * @remarks
 * The reason travels on `ConsentDecisions.reason` and explains a submission the server cannot infer
 * from the decisions alone. It is omitted when the user approves.
 *
 * @example
 * ```typescript
 * const decisions: ConsentDecisions = {
 *   approved: false,
 *   reason: ConsentConstants.REASON_TIMEOUT,
 *   purposes: [],
 * };
 * ```
 */
const ConsentConstants: {
  REASON_TIMEOUT: string;
  REASON_USER_DENIED: string;
} = {
  /**
   * The prompt expired before the user acted on it.
   * The submission is automatic, so the server discards the decisions and records nothing.
   */
  REASON_TIMEOUT: 'timeout',

  /**
   * The user declined the prompt through a deny action.
   */
  REASON_USER_DENIED: 'user_denied',
};

export default ConsentConstants;
