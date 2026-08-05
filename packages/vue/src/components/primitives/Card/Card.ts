// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix} from '@thunderid/browser';
import {type Component, type SetupContext, type VNode, defineComponent, h, type PropType} from 'vue';

type CardProps = Readonly<{
  variant: 'elevated' | 'outlined' | 'flat';
}>;

const Card: Component = defineComponent({
  name: 'Card',
  props: {
    variant: {
      default: 'elevated',
      type: String as PropType<'elevated' | 'outlined' | 'flat'>,
    },
  },
  setup(props: CardProps, {slots, attrs}: SetupContext): () => VNode {
    return (): VNode =>
      h(
        'div',
        {
          class: [
            withVendorCSSClassPrefix('card'),
            withVendorCSSClassPrefix(`card--${props.variant}`),
            (attrs.class as string) || '',
          ]
            .filter(Boolean)
            .join(' '),
          style: attrs.style,
        },
        slots['default']?.(),
      );
  },
});

export default Card;
