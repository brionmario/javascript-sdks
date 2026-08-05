// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@thunderid/browser';
import {Context, createContext} from 'react';

export interface ThemeContextValue {
  colorScheme: 'light' | 'dark';
  /**
   * The text direction for the UI.
   */
  direction: 'ltr' | 'rtl';
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext: Context<ThemeContextValue | null> = createContext<ThemeContextValue | null>(null);

ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;
