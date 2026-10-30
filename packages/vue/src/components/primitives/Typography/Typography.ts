// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix} from '@thunderid/browser';
import {type Component, type SetupContext, type VNode, defineComponent, h, type PropType} from 'vue';

type TypographyProps = Readonly<{
  color:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
    | 'textPrimary'
    | 'textSecondary'
    | 'inherit'
    | undefined;
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
    color: {
      default: undefined,
      type: String as PropType<
        'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'textPrimary' | 'textSecondary' | 'inherit'
      >,
    },
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

      const tag: string = props.component ?? tagMap[props.variant] ?? 'p';
      const colorVar: Record<NonNullable<TypographyProps['color']>, string> = {
        error: 'var(--thunderid-color-error-main)',
        info: 'var(--thunderid-color-info-main)',
        inherit: 'inherit',
        primary: 'var(--thunderid-color-primary-main)',
        secondary: 'var(--thunderid-color-secondary-main)',
        success: 'var(--thunderid-color-success-main)',
        textPrimary: 'var(--thunderid-color-text-primary)',
        textSecondary: 'var(--thunderid-color-text-secondary)',
        warning: 'var(--thunderid-color-warning-main)',
      };
      const style: Record<string, unknown> = {
        ...(attrs.style as Record<string, unknown> | undefined),
        ...(props.color ? {color: colorVar[props.color]} : {}),
      };

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
          style,
        },
        slots['default']?.(),
      );
    };
  },
});

export default Typography;
