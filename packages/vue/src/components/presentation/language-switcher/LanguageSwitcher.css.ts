// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Styles for the LanguageSwitcher presentation component.
 *
 * BEM block: `.thunderid-language-switcher`
 *
 * The root element is a Card (`.thunderid-card`). We override its default
 * padding to 0 so the trigger button fills the surface edge-to-edge,
 * and apply `position: relative` to anchor the absolute dropdown.
 * The Card's border-radius and shadow are intentionally kept.
 *
 * Elements:
 *   __trigger        – compact trigger button (globe icon + language label + chevron)
 *   __trigger-label  – the current language name Typography inside the trigger
 *   __dropdown       – absolute-positioned dropdown listbox
 *   __item           – each selectable language row
 *   __item--active   – the currently selected language
 */
const LANGUAGE_SWITCHER_CSS = `
/* ============================================================
   LanguageSwitcher
   ============================================================ */

/* Override Card's default padding so the trigger fills the surface */
.thunderid-language-switcher.thunderid-card {
  padding: 0;
  position: relative;
  display: inline-block;
}

/* Trigger ---------------------------------------------------- */

.thunderid-language-switcher__trigger {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--thunder-spacing-unit) * 0.5);
  padding: var(--thunder-dropdown-itemPaddingY) var(--thunder-dropdown-itemPaddingX);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--thunder-color-text-primary);
  font-family: var(--thunder-typography-fontFamily);
  font-size: var(--thunder-typography-fontSize-md);
  border-radius: var(--thunder-dropdown-borderRadius);
  transition: background-color var(--thunder-transition-fast);
  white-space: nowrap;
  box-sizing: border-box;
}

.thunderid-language-switcher__trigger:hover {
  background-color: var(--thunder-color-action-hover);
}

.thunderid-language-switcher__trigger:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 var(--thunder-focus-ring-width) var(--thunder-focus-ring-color);
  border-radius: var(--thunder-dropdown-borderRadius);
}

.thunderid-language-switcher__trigger-label {
  flex: 0 0 auto;
}

/* Dropdown --------------------------------------------------- */

.thunderid-language-switcher__dropdown {
  position: absolute;
  top: calc(100% + calc(var(--thunder-spacing-unit) * 0.5));
  right: 0;
  z-index: 1000;
  background-color: var(--thunder-color-background-surface);
  border: 1px solid var(--thunder-color-border);
  border-radius: var(--thunder-dropdown-borderRadius);
  box-shadow: var(--thunder-dropdown-shadow);
  overflow: hidden;
  min-width: 130px;
  display: flex;
  flex-direction: column;
  padding: calc(var(--thunder-spacing-unit) * 0.5) 0;
}

/* Items ----------------------------------------------------- */

.thunderid-language-switcher__item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--thunder-dropdown-itemPaddingY) var(--thunder-dropdown-itemPaddingX);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--thunder-typography-fontFamily);
  font-size: var(--thunder-typography-fontSize-md);
  color: var(--thunder-color-text-primary);
  transition: background-color var(--thunder-transition-fast);
  box-sizing: border-box;
}

.thunderid-language-switcher__item:hover {
  background-color: var(--thunder-color-action-hover);
}

.thunderid-language-switcher__item--active {
  background-color: var(--thunder-color-action-selected);
  color: var(--thunder-color-primary-main);
  font-weight: var(--thunder-typography-fontWeight-medium);
}

.thunderid-language-switcher__item--active:hover {
  background-color: var(--thunder-color-action-focus);
}
`;

export default LANGUAGE_SWITCHER_CSS;
