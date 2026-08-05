// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {inject} from 'vue';
import {THEME_KEY} from '../keys';
import type {ThemeContextValue} from '../models/contexts';

/**
 * Composable for accessing and controlling the active theme.
 *
 * Must be called inside a component that is a descendant of `<ThunderIDProvider>`.
 *
 * @returns {ThemeContextValue} The theme context with the active theme, color scheme, and toggle function.
 * @throws {Error} If called outside of `<ThunderIDProvider>`.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useTheme } from '@thunderid/vue';
 *
 * const { theme, colorScheme, toggleTheme } = useTheme();
 * </script>
 *
 * <template>
 *   <button @click="toggleTheme()">
 *     Switch to {{ colorScheme === 'light' ? 'dark' : 'light' }} mode
 *   </button>
 * </template>
 * ```
 */
const useTheme = (): ThemeContextValue => {
  const context: unknown = inject(THEME_KEY);

  if (!context) {
    throw new Error(
      '[ThunderID] useTheme() was called outside of <ThunderIDProvider>. ' +
        'Make sure to install the ThunderIDPlugin or wrap your app with <ThunderIDProvider>.',
    );
  }

  return context as ThemeContextValue;
};

export default useTheme;
