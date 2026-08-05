// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix} from '@thunderid/browser';
import {type Component, type SetupContext, type VNode, defineComponent, h, type PropType} from 'vue';

type AlertProps = Readonly<{
  dismissible: boolean;
  severity: 'success' | 'error' | 'warning' | 'info';
}>;

const Alert: Component = defineComponent({
  name: 'Alert',
  props: {
    dismissible: {default: false, type: Boolean},
    severity: {
      default: 'info',
      type: String as PropType<'success' | 'error' | 'warning' | 'info'>,
    },
  },
  emits: ['dismiss'],
  setup(props: AlertProps, {slots, emit, attrs}: SetupContext): () => VNode {
    return (): VNode =>
      h(
        'div',
        {
          class: [
            withVendorCSSClassPrefix('alert'),
            withVendorCSSClassPrefix(`alert--${props.severity}`),
            (attrs.class as string) || '',
          ]
            .filter(Boolean)
            .join(' '),
          role: 'alert',
          style: attrs.style,
        },
        [
          h('div', {class: withVendorCSSClassPrefix('alert__content')}, slots['default']?.()),
          props.dismissible
            ? h(
                'button',
                {
                  'aria-label': 'Dismiss',
                  class: withVendorCSSClassPrefix('alert__dismiss'),
                  onClick: () => emit('dismiss'),
                  type: 'button',
                },
                '\u00d7',
              )
            : null,
        ],
      );
  },
});

export default Alert;
