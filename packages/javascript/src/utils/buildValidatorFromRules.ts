// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import evaluateValidationRule from './evaluateValidationRule';
import {ValidationRule} from '../models/embedded-flow';

/**
 * Composes an array of `ValidationRule`s into a single validator function suitable for
 * `useForm`'s `FormField.validator` slot.
 *
 * The composed validator evaluates rules in declaration order and returns the **first**
 * failing rule's message — matching the SDK's render-prop shape of a single string per
 * field. When all rules pass it returns `null`.
 *
 * Returns `null` when no rules are supplied so callers can compose conditionally.
 */
const buildValidatorFromRules = (rules: ValidationRule[] | undefined): ((value: string) => string | null) | null => {
  if (!rules || rules.length === 0) {
    return null;
  }
  return (value: string): string | null => {
    for (const rule of rules) {
      const message: string | null = evaluateValidationRule(rule, value);
      if (message !== null) {
        return message;
      }
    }
    return null;
  };
};

export default buildValidatorFromRules;
