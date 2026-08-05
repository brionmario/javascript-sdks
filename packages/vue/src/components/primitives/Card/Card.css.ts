// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Styles for the Card primitive component.
 *
 * BEM block: `.thunderid-card`
 *
 * Modifiers:
 *   --elevated  – medium drop shadow
 *   --outlined  – 1px border, no shadow
 *   --flat      – neither shadow nor border (default)
 */
const CARD_CSS = `
/* ============================================================
   Card
   ============================================================ */

.thunderid-card {
  background-color: var(--thunder-color-background-surface);
  border-radius: var(--thunder-card-borderRadius);
  padding: var(--thunder-card-padding);
  box-sizing: border-box;
  transition: box-shadow var(--thunder-transition-normal);
}

.thunderid-card--elevated {
  box-shadow: var(--thunder-card-shadow);
}

.thunderid-card--outlined {
  border: 1px solid var(--thunder-card-borderColor);
}

/* .thunderid-card--flat: no shadow or border */
`;

export default CARD_CSS;
