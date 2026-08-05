// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@thunderid/browser';

/**
 * Writes all CSS custom properties from a resolved `Theme` onto the document root.
 * Called inside a `useEffect` whenever the active theme changes.
 */
const applyThemeToDOM = (theme: Theme): void => {
  Object.entries(theme.cssVariables).forEach(([key, value]: [string, string]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

export default applyThemeToDOM;
