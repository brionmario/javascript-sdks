// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Re-export of the active theme resolver from the Browser SDK.
 *
 * Gets the active theme based on the theme mode preference:
 * - `'light'` / `'dark'` → Returns the specified mode directly.
 * - `'system'` → Uses `matchMedia('(prefers-color-scheme: dark)')` to detect system preference.
 * - `'class'` → Inspects DOM element class list for dark/light classes.
 *
 * @see {@link @thunderid/browser#getActiveTheme}
 */
export {getActiveTheme, getActiveTheme as default} from '@thunderid/browser';
