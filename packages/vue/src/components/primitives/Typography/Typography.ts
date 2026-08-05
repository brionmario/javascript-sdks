// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix} from '@thunderid/browser';
import {type Component, type SetupContext, type VNode, defineComponent, h, type PropType} from 'vue';

type TypographyProps = Readonly<{
  component: string | undefined;
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'overline';
}>;

const Typography: Component = defineComponent({
  name: 'Typography',
  props: {
    component: {
      default: undefined,
      type: String as PropType<string>,
    },
    variant: {
      default: 'body1',
      type: String as PropType<
        'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline'
      >,
    },
  },
  setup(props: TypographyProps, {slots, attrs}: SetupContext): () => VNode {
    return (): VNode => {
      const tagMap: Record<string, string> = {
        body1: 'p',
        body2: 'p',
        caption: 'span',
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        overline: 'span',
        subtitle1: 'h6',
        subtitle2: 'h6',
      };

      const tag: string = props.component || tagMap[props.variant] || 'p';

      return h(
        tag,
        {
          class: [
            withVendorCSSClassPrefix('typography'),
            withVendorCSSClassPrefix(`typography--${props.variant}`),
            (attrs.class as string) || '',
          ]
            .filter(Boolean)
            .join(' '),
          style: attrs.style,
        },
        slots['default']?.(),
      );
    };
  },
});

export default Typography;
