// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix, bem} from '@thunderid/browser';
import {CSSProperties, FC, ReactNode, ElementType} from 'react';
import useStyles, {TypographyVariant, TypographyAlign, TypographyColor} from './Typography.styles';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '../../../styles/emotion';

export interface TypographyProps {
  /**
   * Text alignment
   */
  align?: TypographyAlign;
  /**
   * The content to be rendered
   */
  children: ReactNode;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Color variant
   */
  color?: TypographyColor;
  /**
   * The HTML element or React component to render
   */
  component?: ElementType;
  /**
   * Custom font size (overrides variant sizing)
   */
  fontSize?: string | number;
  /**
   * Custom font weight
   */
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | number;
  /**
   * Whether to disable gutters (margin bottom)
   */
  gutterBottom?: boolean;
  /**
   * HTML id attribute
   */
  id?: string;
  /**
   * Whether the text should be displayed inline
   */
  inline?: boolean;
  /**
   * Line height
   */
  lineHeight?: string | number;
  /**
   * Whether the text should be clipped with ellipsis when it overflows
   */
  noWrap?: boolean;
  /**
   * Custom styles
   */
  style?: CSSProperties;
  /**
   * The typography variant to apply
   */
  variant?: TypographyVariant;
}

// Default component mapping for variants
const variantMapping: Record<TypographyVariant, ElementType> = {
  body1: 'p',
  body2: 'p',
  button: 'span',
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

/**
 * Typography component for consistent text rendering throughout the application.
 * Integrates with the theme system and provides semantic HTML elements.
 */
const Typography: FC<TypographyProps> = ({
  children,
  variant = 'body1',
  component,
  align = 'left',
  color = 'textPrimary',
  noWrap = false,
  className,
  style = {},
  inline = false,
  fontWeight,
  fontSize,
  lineHeight,
  gutterBottom = false,
  ...rest
}: TypographyProps) => {
  const {theme, colorScheme}: ReturnType<typeof useTheme> = useTheme();
  const styles: Record<string, string> = useStyles(
    theme,
    colorScheme,
    variant,
    align,
    color,
    noWrap,
    inline,
    gutterBottom,
    fontWeight,
    fontSize,
    lineHeight,
  );

  const Component: ElementType = component || variantMapping[variant] || 'span';

  const getVariantClass = (variantName: TypographyVariant): string => {
    switch (variantName) {
      case 'h1':
        return styles['typographyH1'];
      case 'h2':
        return styles['typographyH2'];
      case 'h3':
        return styles['typographyH3'];
      case 'h4':
        return styles['typographyH4'];
      case 'h5':
        return styles['typographyH5'];
      case 'h6':
        return styles['typographyH6'];
      case 'subtitle1':
        return styles['typographySubtitle1'];
      case 'subtitle2':
        return styles['typographySubtitle2'];
      case 'body1':
        return styles['typographyBody1'];
      case 'body2':
        return styles['typographyBody2'];
      case 'caption':
        return styles['typographyCaption'];
      case 'overline':
        return styles['typographyOverline'];
      case 'button':
        return styles['typographyButton'];
      default:
        return '';
    }
  };

  const typographyClassName: string = cx(
    withVendorCSSClassPrefix(bem('typography')),
    withVendorCSSClassPrefix(bem('typography', variant)),
    styles['typography'],
    getVariantClass(variant),
    noWrap && styles['typographyNoWrap'],
    inline && styles['typographyInline'],
    gutterBottom && styles['typographyGutterBottom'],
    className,
  );

  return (
    <Component className={typographyClassName} style={style} {...rest}>
      {children}
    </Component>
  );
};

export default Typography;
