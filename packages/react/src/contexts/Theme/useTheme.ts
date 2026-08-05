// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import ThemeContext, {ThemeContextValue} from './ThemeContext';

const useTheme = (): ThemeContextValue => {
  const context: ThemeContextValue | null = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default useTheme;
