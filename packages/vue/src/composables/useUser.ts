// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {inject} from 'vue';
import {USER_KEY} from '../keys';
import type {UserContextValue} from '../models/contexts';

/**
 * Composable for accessing user profile data.
 *
 * Must be called inside a component that is a descendant of `<ThunderIDProvider>`.
 *
 * @returns {UserContextValue} The user context containing profile, schemas, and update operations.
 * @throws {Error} If called outside of `<ThunderIDProvider>`.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useUser } from '@thunderid/vue';
 *
 * const { profile, flattenedProfile, schemas, updateProfile, revalidateProfile } = useUser();
 * </script>
 *
 * <template>
 *   <div v-if="profile">
 *     <p>Name: {{ flattenedProfile?.name }}</p>
 *     <button @click="revalidateProfile()">Refresh</button>
 *   </div>
 * </template>
 * ```
 */
const useUser = (): UserContextValue => {
  const context: unknown = inject(USER_KEY);

  if (!context) {
    throw new Error(
      '[ThunderID] useUser() was called outside of <ThunderIDProvider>. ' +
        'Make sure to install the ThunderIDPlugin or wrap your app with <ThunderIDProvider>.',
    );
  }

  return context as UserContextValue;
};

export default useUser;
