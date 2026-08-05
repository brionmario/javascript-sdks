// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {inject} from 'vue';
import {FLOW_META_KEY} from '../keys';
import type {FlowMetaContextValue} from '../models/contexts';

/**
 * Composable for accessing flow metadata.
 *
 * Must be called inside a component that is a descendant of `<ThunderIDProvider>`.
 *
 * @returns {FlowMetaContextValue} The flow meta context with metadata, loading state, and language switching.
 * @throws {Error} If called outside of `<ThunderIDProvider>`.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useFlowMeta } from '@thunderid/vue';
 *
 * const { meta, isLoading, switchLanguage } = useFlowMeta();
 *
 * async function changeLanguage(lang: string) {
 *   await switchLanguage(lang);
 * }
 * </script>
 * ```
 */
const useFlowMeta = (): FlowMetaContextValue => {
  const context: unknown = inject(FLOW_META_KEY);

  if (!context) {
    throw new Error(
      '[ThunderID] useFlowMeta() was called outside of <ThunderIDProvider>. ' +
        'Make sure to install the ThunderIDPlugin or wrap your app with <ThunderIDProvider>.',
    );
  }

  return context as FlowMetaContextValue;
};

export default useFlowMeta;
