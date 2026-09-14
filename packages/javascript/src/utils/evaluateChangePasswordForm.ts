// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import evaluatePasswordPolicy, {PasswordPolicy, PasswordRuleResult} from './evaluatePasswordPolicy';

/**
 * The two values a change-password form collects.
 *
 * There is deliberately no `currentPassword` here. The self-service credential write
 * endpoint does not verify the account's existing value today, so a field the server
 * ignores would only teach the user a false sense of security; once server-side
 * current-value verification ships, this form gains that field back.
 */
export interface ChangePasswordFormValues {
  /**
   * The re-typed new password, used only to catch typos client-side.
   */
  confirmPassword: string;
  /**
   * The password to set.
   */
  newPassword: string;
}

/**
 * The derived state a change-password form needs to render and to gate submission.
 */
export interface ChangePasswordFormEvaluation {
  /**
   * Whether the new password and its confirmation match.
   */
  confirmMatches: boolean;
  /**
   * Whether the values are complete and internally consistent. Callers combine this with
   * their own in-flight flag, since whether a request is pending is UI state rather than
   * validation.
   */
  isValid: boolean;
  /**
   * Whether the new password satisfies every configured rule.
   */
  meetsPolicy: boolean;
  /**
   * Per-rule results, for the live requirement checklist.
   */
  ruleResults: PasswordRuleResult[];
}

/**
 * Evaluates a change-password form against a policy.
 *
 * Every predicate a change-password UI needs is derived here so the React and Vue
 * components stay pure rendering concerns and cannot drift apart on what counts as a
 * submittable form.
 *
 * @param values - The current field values.
 * @param policy - The rules the new password must satisfy.
 * @returns The derived flags plus the per-rule results.
 * @example
 * ```typescript
 * const {isValid, ruleResults} = evaluateChangePasswordForm(
 *   {confirmPassword, newPassword},
 *   {regex: '^.{12,}$'},
 * );
 * const canSubmit = !loading && isValid;
 * ```
 */
const evaluateChangePasswordForm = (
  values: ChangePasswordFormValues,
  policy: PasswordPolicy,
): ChangePasswordFormEvaluation => {
  const {confirmPassword, newPassword} = values;

  const ruleResults: PasswordRuleResult[] = evaluatePasswordPolicy(newPassword, policy);
  const meetsPolicy: boolean = ruleResults.every((rule: PasswordRuleResult) => rule.passed);
  const confirmMatches: boolean = newPassword === confirmPassword;

  const isValid: boolean = newPassword !== '' && confirmPassword !== '' && meetsPolicy && confirmMatches;

  return {confirmMatches, isValid, meetsPolicy, ruleResults};
};

export default evaluateChangePasswordForm;
