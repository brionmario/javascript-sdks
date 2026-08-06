// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix, bem} from '@thunderid/browser';
import {FC, HTMLAttributes, ReactNode} from 'react';
import useStyles from './Divider.styles';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '../../../styles/emotion';
import Typography from '../Typography/Typography';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Text to display in the center of the divider
   */
  children?: ReactNode;

  /**
   * Custom color for the divider
   */
  color?: string;

  /**
   * The orientation of the divider
   */
  orientation?: DividerOrientation;

  /**
   * The variant style of the divider
   */
  variant?: DividerVariant;
}

/**
 * Divider component for separating content sections.
 *
 * @example
 * ```tsx
 * // Basic horizontal divider
 * <Divider />
 *
 * // Divider with text
 * <Divider>OR</Divider>
 *
 * // Vertical divider
 * <Divider orientation="vertical" />
 *
 * // Custom styled divider
 * <Divider variant="dashed" color="#ccc">Continue with</Divider>
 * ```
 */
const Divider: FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  children,
  color,
  className,
  style,
  ...rest
}: DividerProps) => {
  const {theme, colorScheme}: ReturnType<typeof useTheme> = useTheme();
  const styles: Record<string, string> = useStyles(theme, colorScheme, orientation, variant, color, !!children);

  if (orientation === 'vertical') {
    return (
      <div
        className={cx(
          withVendorCSSClassPrefix(bem('divider')),
          withVendorCSSClassPrefix(bem('divider', 'vertical')),
          styles['divider'],
          styles['vertical'],
          className,
        )}
        style={style}
        role="separator"
        aria-orientation="vertical"
        {...rest}
      />
    );
  }

  if (children) {
    return (
      <div
        className={cx(
          withVendorCSSClassPrefix(bem('divider')),
          withVendorCSSClassPrefix(bem('divider', 'horizontal')),
          withVendorCSSClassPrefix(bem('divider', 'with-text')),
          styles['divider'],
          styles['horizontal'],
          className,
        )}
        style={style}
        role="separator"
        aria-orientation="horizontal"
        {...rest}
      >
        <div className={cx(withVendorCSSClassPrefix(bem('divider', 'line')), styles['line'])} />
        <Typography
          variant="body2"
          color="textSecondary"
          className={cx(withVendorCSSClassPrefix(bem('divider', 'text')), styles['text'])}
          inline
        >
          {children}
        </Typography>
        <div className={cx(withVendorCSSClassPrefix(bem('divider', 'line')), styles['line'])} />
      </div>
    );
  }

  return (
    <div
      className={cx(
        withVendorCSSClassPrefix(bem('divider')),
        withVendorCSSClassPrefix(bem('divider', 'horizontal')),
        styles['divider'],
        styles['horizontal'],
        className,
      )}
      style={style}
      role="separator"
      aria-orientation="horizontal"
      {...rest}
    />
  );
};

export default Divider;
