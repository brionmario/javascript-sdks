// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix} from '@thunderid/browser';
import {type Component, type SetupContext, type VNode, defineComponent, h, type PropType} from 'vue';

type SpinnerProps = Readonly<{
  size: 'small' | 'medium' | 'large';
}>;

const Spinner: Component = defineComponent({
  name: 'Spinner',
  props: {
    size: {
      default: 'medium',
      type: String as PropType<'small' | 'medium' | 'large'>,
    },
  },
  setup(props: SpinnerProps, {attrs}: SetupContext): () => VNode {
    return (): VNode =>
      h(
        'div',
        {
          'aria-label': 'Loading',
          class: [
            withVendorCSSClassPrefix('spinner'),
            withVendorCSSClassPrefix(`spinner--${props.size}`),
            (attrs.class as string) || '',
          ]
            .filter(Boolean)
            .join(' '),
          role: 'status',
          style: attrs.style,
        },
        [
          h(
            'svg',
            {
              class: withVendorCSSClassPrefix('spinner__svg'),
              fill: 'none',
              viewBox: '0 0 24 24',
              xmlns: 'http://www.w3.org/2000/svg',
            },
            [
              h('circle', {
                class: withVendorCSSClassPrefix('spinner__circle'),
                cx: '12',
                cy: '12',
                r: '10',
                stroke: 'currentColor',
                'stroke-dasharray': '31.4 31.4',
                'stroke-linecap': 'round',
                'stroke-width': '3',
              }),
            ],
          ),
        ],
      );
  },
});

export default Spinner;
