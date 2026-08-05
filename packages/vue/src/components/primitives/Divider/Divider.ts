// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix} from '@thunderid/browser';
import {type Component, type SetupContext, type VNode, defineComponent, h, type PropType} from 'vue';

type DividerProps = Readonly<{
  orientation: 'horizontal' | 'vertical';
}>;

const Divider: Component = defineComponent({
  name: 'Divider',
  props: {
    orientation: {
      default: 'horizontal',
      type: String as PropType<'horizontal' | 'vertical'>,
    },
  },
  setup(props: DividerProps, {slots, attrs}: SetupContext): () => VNode {
    return (): VNode => {
      const hasContent = !!slots['default'];
      const cssClass: string = [
        withVendorCSSClassPrefix('divider'),
        withVendorCSSClassPrefix(`divider--${props.orientation}`),
        hasContent ? withVendorCSSClassPrefix('divider--with-content') : '',
        (attrs.class as string) || '',
      ]
        .filter(Boolean)
        .join(' ');

      if (hasContent) {
        return h('div', {class: cssClass, role: 'separator', style: attrs.style}, [
          h('span', {class: withVendorCSSClassPrefix('divider__line')}),
          h('span', {class: withVendorCSSClassPrefix('divider__content')}, slots['default']?.()),
          h('span', {class: withVendorCSSClassPrefix('divider__line')}),
        ]);
      }

      return h('hr', {class: cssClass, role: 'separator', style: attrs.style});
    };
  },
});

export default Divider;
