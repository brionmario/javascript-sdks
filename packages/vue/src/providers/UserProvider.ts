// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {UpdateMeProfileConfig, User, UserProfile} from '@thunderid/browser';
import {
  computed,
  defineComponent,
  h,
  provide,
  type Component,
  type PropType,
  type Ref,
  type SetupContext,
  type VNode,
} from 'vue';
import {USER_KEY} from '../keys';
import type {UserContextValue} from '../models/contexts';

/**
 * UserProvider manages user profile state and makes it available via `useUser()`.
 *
 * It is a thin wrapper that receives profile data from a parent (typically
 * `<ThunderIDProvider>`) and surfaces it through the Vue inject system.
 *
 * @internal — This provider is mounted automatically by `<ThunderIDProvider>`.
 */
interface UserProviderProps {
  onUpdateProfile: ((payload: User) => void) | undefined;
  profile: UserProfile | null;
  revalidateProfile: () => Promise<void>;
  updateProfile:
    | ((
        requestConfig: UpdateMeProfileConfig,
        sessionId?: string,
      ) => Promise<{data: {user: User}; error: string; success: boolean}>)
    | undefined;
}

const UserProvider: Component = defineComponent({
  name: 'UserProvider',
  props: {
    /** Callback to sync a successfully-saved profile back up to ThunderIDProvider. */
    onUpdateProfile: {default: undefined, type: Function as PropType<(payload: User) => void>},
    /** The full user profile data (nested + flat + schemas). */
    profile: {default: null, type: Object as PropType<UserProfile | null>},
    /** Re-fetch the user profile from the server. */
    revalidateProfile: {default: async () => {}, type: Function as PropType<() => Promise<void>>},
    /** Update the user profile via PATCH. */
    updateProfile: {
      default: undefined,
      type: Function as PropType<
        (
          requestConfig: UpdateMeProfileConfig,
          sessionId?: string,
        ) => Promise<{data: {user: User}; error: string; success: boolean}>
      >,
    },
  },
  setup(props: UserProviderProps, {slots}: SetupContext): () => VNode {
    // Derive flattenedProfile from the single profile prop,
    // matching the same pattern as the React SDK's UserProvider.
    const profileRef: Ref<UserProfile | null> = computed(() => props.profile);
    const flattenedProfileRef: Ref<User | null> = computed(() => props.profile?.flattenedProfile ?? null);

    const context: UserContextValue = {
      flattenedProfile: flattenedProfileRef as unknown as Readonly<Ref<User | null>>,
      onUpdateProfile: props.onUpdateProfile ?? ((): void => {}),
      profile: profileRef as unknown as Readonly<Ref<UserProfile | null>>,
      revalidateProfile: props.revalidateProfile,
      updateProfile:
        props.updateProfile ??
        (async (): Promise<{data: {user: User}; error: string; success: boolean}> => ({
          data: {user: {} as User},
          error: 'updateProfile callback not provided',
          success: false,
        })),
    };

    provide(USER_KEY, context);

    return (): VNode => h('div', {style: 'display:contents'}, slots['default']?.());
  },
});

export default UserProvider;
