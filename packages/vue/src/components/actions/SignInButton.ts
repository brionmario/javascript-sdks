// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ThunderIDRuntimeError, navigate} from '@thunderid/browser';
import {
  Fragment,
  defineComponent,
  h,
  ref,
  type Component,
  type PropType,
  type Ref,
  type SetupContext,
  type VNode,
} from 'vue';
import BaseSignInButton from './BaseSignInButton';
import useThunderID from '../../composables/useThunderID';

/**
 * SignInButton — triggers `signIn()` from the ThunderID context.
 *
 * If a custom `signInUrl` is configured, navigates to it instead.
 * Falls back to i18n translation for the button text.
 */
const SignInButton: Component = defineComponent({
  name: 'SignInButton',
  props: {
    signInOptions: {default: undefined, type: Object as PropType<Record<string, any>>},
  },
  emits: ['click', 'error'],
  setup(props: {signInOptions?: Record<string, any>}, {slots, emit, attrs}: SetupContext): () => VNode {
    const {signIn, signInUrl, signInOptions: contextSignInOptions} = useThunderID();
    const isLoading: Ref<boolean> = ref(false);

    const handleSignIn = async (e?: MouseEvent): Promise<void> => {
      try {
        isLoading.value = true;
        if (signInUrl) {
          navigate(signInUrl);
        } else {
          await signIn(props.signInOptions ?? contextSignInOptions);
        }
        if (e) emit('click', e);
      } catch (error) {
        emit('error', error);
        throw new ThunderIDRuntimeError(
          `Sign in failed: ${error instanceof Error ? error.message : String(error)}`,
          'SignInButton-handleSignIn-RuntimeError-001',
          'vue',
          'Something went wrong while trying to sign in. Please try again later.',
        );
      } finally {
        isLoading.value = false;
      }
    };

    return (): VNode => {
      if (slots['default']) {
        const nodes: VNode[] = slots['default']({isLoading: isLoading.value, signIn: handleSignIn});
        return nodes.length === 1 ? nodes[0] : h(Fragment, null, nodes);
      }

      return h(BaseSignInButton, {
        class: attrs.class,
        isLoading: isLoading.value,
        onClick: handleSignIn,
        style: attrs.style,
      });
    };
  },
});

export default SignInButton;
