// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Styles for the Checkbox primitive component.
 *
 * BEM block: `.thunderid-checkbox`
 *
 * Modifiers:
 *   --error  – shows validation error state
 *
 * Elements:
 *   __wrapper | __input | __label | __error
 */
const CHECKBOX_CSS = `
/* ============================================================
   Checkbox
   ============================================================ */

.thunderid-checkbox {
  display: flex;
  flex-direction: column;
  gap: calc(var(--thunder-spacing-unit) * 0.5);
  font-family: var(--thunder-typography-fontFamily);
}

.thunderid-checkbox__wrapper {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--thunder-spacing-unit) * 0.75);
  cursor: pointer;
  user-select: none;
}

.thunderid-checkbox__input {
  width: var(--thunder-checkbox-size);
  height: var(--thunder-checkbox-size);
  cursor: pointer;
  accent-color: var(--thunder-color-primary-main);
  flex-shrink: 0;
  border-radius: var(--thunder-border-radius-xs);
}
.thunderid-checkbox__input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--thunder-focus-ring-width) var(--thunder-focus-ring-color);
}
.thunderid-checkbox__input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.thunderid-checkbox__label {
  font-size: var(--thunder-typography-fontSize-md);
  color: var(--thunder-color-text-primary);
  line-height: var(--thunder-typography-lineHeight-normal);
}

.thunderid-checkbox__error {
  font-size: var(--thunder-typography-fontSize-xs);
  color: var(--thunder-color-error-contrastText);
  line-height: var(--thunder-typography-lineHeight-normal);
}
`;

export default CHECKBOX_CSS;
