// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {inject} from 'vue';
import {I18N_KEY} from '../keys';
import type {I18nContextValue} from '../models/contexts';

/**
 * Composable for accessing internationalization utilities.
 *
 * Must be called inside a component that is a descendant of `<ThunderIDProvider>`.
 *
 * @returns {I18nContextValue} The i18n context with translation function, language management, and bundle injection.
 * @throws {Error} If called outside of `<ThunderIDProvider>`.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useI18n } from '@thunderid/vue';
 *
 * const { t, currentLanguage, setLanguage } = useI18n();
 * </script>
 *
 * <template>
 *   <p>{{ t('common.welcome') }}</p>
 *   <select :value="currentLanguage" @change="setLanguage($event.target.value)">
 *     <option value="en-US">English</option>
 *     <option value="fr-FR">Français</option>
 *   </select>
 * </template>
 * ```
 */
const useI18n = (): I18nContextValue => {
  const context: unknown = inject(I18N_KEY);

  if (!context) {
    throw new Error(
      '[ThunderID] useI18n() was called outside of <ThunderIDProvider>. ' +
        'Make sure to install the ThunderIDPlugin or wrap your app with <ThunderIDProvider>.',
    );
  }

  return context as I18nContextValue;
};

export default useI18n;
