// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {DEFAULT_THEME, ThemeMode} from '@thunderid/javascript';
import {BrowserThemeDetection, detectThemeMode} from './themeDetection';

/**
 * Gets the active theme based on the theme mode preference
 * @param mode - The theme mode preference ('light', 'dark', 'system', or 'class')
 * @param config - Additional configuration for theme detection
 * @returns 'light' or 'dark' based on the resolved theme
 */
const getActiveTheme = (mode: ThemeMode, config: BrowserThemeDetection = {}): ThemeMode => {
  if (mode === 'dark') {
    return 'dark';
  }

  if (mode === 'light') {
    return 'light';
  }

  if (mode === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Default to light mode if system detection is not available
    return DEFAULT_THEME;
  }

  if (mode === 'class') {
    return detectThemeMode(mode, config);
  }

  // Default to light mode for any unknown mode
  return DEFAULT_THEME;
};

export default getActiveTheme;
