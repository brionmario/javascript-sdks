// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Styles for the OtpField primitive component.
 *
 * BEM block: `.thunderid-otp-field`
 *
 * Elements:
 *   __label | __required | __inputs | __digit | __error
 */
const OTP_FIELD_CSS = `
/* ============================================================
   OtpField
   ============================================================ */

.thunderid-otp-field {
  display: flex;
  flex-direction: column;
  gap: calc(var(--thunder-spacing-unit) * 0.75);
  font-family: var(--thunder-typography-fontFamily);
}

.thunderid-otp-field__label {
  font-size: var(--thunder-typography-fontSize-sm);
  font-weight: var(--thunder-typography-fontWeight-medium);
  color: var(--thunder-color-text-primary);
  display: block;
  line-height: var(--thunder-typography-lineHeight-normal);
}

.thunderid-otp-field__required {
  color: var(--thunder-color-error-main);
  margin-left: 2px;
}

.thunderid-otp-field__inputs {
  display: flex;
  gap: calc(var(--thunder-spacing-unit) * 0.75);
}

.thunderid-otp-field__digit {
  width: var(--thunder-input-height);
  height: var(--thunder-input-height);
  text-align: center;
  border: 1px solid var(--thunder-input-borderColor);
  border-radius: var(--thunder-input-borderRadius);
  font-family: var(--thunder-typography-fontFamily);
  font-size: var(--thunder-typography-fontSize-lg);
  font-weight: var(--thunder-typography-fontWeight-semibold);
  color: var(--thunder-color-text-primary);
  background-color: var(--thunder-color-background-surface);
  box-sizing: border-box;
  outline: none;
  transition:
    border-color var(--thunder-transition-fast),
    box-shadow var(--thunder-transition-fast);
}
.thunderid-otp-field__digit:focus {
  border-color: var(--thunder-input-focusBorderColor);
  box-shadow: var(--thunder-input-focusRing);
}
.thunderid-otp-field__digit:disabled {
  background-color: var(--thunder-color-background-disabled);
  color: var(--thunder-color-action-disabled);
  cursor: not-allowed;
}

.thunderid-otp-field__error {
  font-size: var(--thunder-typography-fontSize-xs);
  color: var(--thunder-color-error-contrastText);
  line-height: var(--thunder-typography-lineHeight-normal);
}
`;

export default OTP_FIELD_CSS;
