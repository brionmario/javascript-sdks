// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {navigateTo} from '#app';
import {BaseSignIn} from '@thunderid/vue';
import {type Component, type PropType, type SetupContext, type VNode, defineComponent, h} from 'vue';
import {useThunderID} from '#imports';

/**
 * Nuxt-specific SignIn container for the embedded (app-native) sign-in flow.
 *
 * Mirrors the Vue SDK's `SignIn` container but replaces all `window.location`
 * navigation with Nuxt's `navigateTo` so redirects after a successful embedded
 * sign-in are SSR-safe.
 *
 * Uses `useThunderID()` from the Nuxt auto-import layer — the Nuxt-specific
 * wrapper that provides Nitro-route-aware `signIn`, `signOut`, `signUp`.
 *
 * Delegates all UI rendering to {@link BaseSignIn} from `@thunderid/vue`, which
 * itself is platform-aware (routes to V1 authenticator or V2 component flow).
 *
 * @example
 * ```vue
 * <ThunderIDSignIn @success="onSignIn" @error="onError" />
 * ```
 */
const SignIn: Component = defineComponent({
  emits: ['error', 'success'],
  name: 'SignIn',
  props: {
    className: {default: '', type: String},
    size: {
      default: 'medium',
      type: String as PropType<'small' | 'medium' | 'large'>,
    },
    variant: {
      default: 'outlined',
      type: String as PropType<'elevated' | 'outlined' | 'flat'>,
    },
  },
  setup(
    props: Readonly<{className: string; size: 'small' | 'medium' | 'large'; variant: 'elevated' | 'outlined' | 'flat'}>,
    {emit, attrs}: SetupContext,
  ): () => VNode {
    const {signIn, afterSignInUrl, isInitialized, isLoading} = useThunderID();

    const handleInitialize = async (): Promise<any> =>
      // Pass flowId='' to trigger the embedded-flow initiation path in useThunderID.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await signIn({flowId: ''} as any, {} as any);

    const handleOnSubmit = async (payload: any, request: any): Promise<any> => await signIn(payload, request);

    const handleSuccess = async (authData: Record<string, any>): Promise<void> => {
      emit('success', authData);

      if (authData && afterSignInUrl) {
        if (import.meta.client) {
          // Build the full URL with auth data params (client-only: needs window.location.origin).
          const url: URL = new URL(afterSignInUrl as string, window.location.origin);
          Object.entries(authData).forEach(([key, value]: [string, any]) => {
            if (value !== undefined && value !== null) {
              url.searchParams.append(key, String(value));
            }
          });
          await navigateTo(url.pathname + url.search + url.hash);
        } else {
          // On SSR, just navigate to the base afterSignInUrl (no auth data params).
          await navigateTo(afterSignInUrl as string);
        }
      }
    };

    return (): VNode =>
      h(BaseSignIn, {
        ...attrs,
        afterSignInUrl,
        class: props.className,
        isLoading: (isLoading?.value ?? false) || !(isInitialized?.value ?? true),
        onError: (err: Error) => emit('error', err),
        onInitialize: handleInitialize,
        onSubmit: handleOnSubmit,
        onSuccess: handleSuccess,
        showLogo: true,
        showSubtitle: true,
        showTitle: true,
        size: props.size,
        variant: props.variant,
      });
  },
});

export default SignIn;
