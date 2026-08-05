// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {inject} from 'vue';
import {FLOW_KEY} from '../keys';
import type {FlowContextValue} from '../models/contexts';

/**
 * Composable for managing authentication flow UI state.
 *
 * Must be called inside a component that is a descendant of `<ThunderIDProvider>`.
 *
 * @returns {FlowContextValue} The flow context with step navigation, messages, and loading state.
 * @throws {Error} If called outside of `<ThunderIDProvider>`.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useFlow } from '@thunderid/vue';
 *
 * const { currentStep, isLoading, messages, navigateToFlow, reset } = useFlow();
 * </script>
 *
 * <template>
 *   <div>
 *     <p v-if="isLoading">Loading...</p>
 *     <component :is="currentStep?.component" v-else />
 *     <p v-for="msg in messages" :key="msg.id">{{ msg.content }}</p>
 *   </div>
 * </template>
 * ```
 */
const useFlow = (): FlowContextValue => {
  const context: unknown = inject(FLOW_KEY);

  if (!context) {
    throw new Error(
      '[ThunderID] useFlow() was called outside of <ThunderIDProvider>. ' +
        'Make sure to install the ThunderIDPlugin or wrap your app with <ThunderIDProvider>.',
    );
  }

  return context as FlowContextValue;
};

export default useFlow;
