// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AttributeSchema, UpdateMeProfileConfig, User, UserProfile} from '@thunderid/browser';
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
  userSchema?: Record<string, AttributeSchema> | null;
}

const UserProvider: Component = defineComponent({
  name: 'UserProvider',
  props: {
    /** Callback to sync a successfully-saved profile back up to ThunderIDProvider. */
    onUpdateProfile: {default: undefined, type: Function as PropType<(payload: User) => void>},
    /** The full user profile data (nested + flat). */
    profile: {default: null, type: Object as PropType<UserProfile | null>},
    /** Re-fetch the user profile from the server. */
    revalidateProfile: {default: async () => {}, type: Function as PropType<() => Promise<void>>},
    /** Update the user profile via PUT. */
    updateProfile: {
      default: undefined,
      type: Function as PropType<
        (
          requestConfig: UpdateMeProfileConfig,
          sessionId?: string,
        ) => Promise<{data: {user: User}; error: string; success: boolean}>
      >,
    },
    /** User schema metadata. */
    userSchema: {default: null, type: Object as PropType<Record<string, AttributeSchema> | null>},
  },
  setup(props: UserProviderProps, {slots}: SetupContext): () => VNode {
    // Derive flattenedProfile and userSchema from props
    const profileRef: Ref<UserProfile | null> = computed(() => props.profile);
    const flattenedProfileRef: Ref<User | null> = computed(() => props.profile?.flattenedProfile ?? null);
    const userSchemaRef: Ref<Record<string, AttributeSchema> | null> = computed(
      () => (props.profile as any)?.userSchema ?? props.userSchema ?? null,
    );

    const context: UserContextValue = {
      flattenedProfile: flattenedProfileRef as unknown as Readonly<Ref<User | null>>,
      onUpdateProfile: props.onUpdateProfile ?? ((): void => {}),
      profile: profileRef as unknown as Readonly<Ref<UserProfile | null>>,
      revalidateProfile: props.revalidateProfile,
      updateProfile: props.updateProfile,
      userSchema: userSchemaRef as unknown as Readonly<Ref<Record<string, AttributeSchema> | null>>,
    };

    provide(USER_KEY, context);

    return (): VNode => h('div', {style: 'display:contents'}, slots['default']?.());
  },
});

export default UserProvider;
