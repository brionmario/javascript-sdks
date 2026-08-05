// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cx} from '@emotion/css';
import {withVendorCSSClassPrefix, bem} from '@thunderid/browser';
import {FC, CSSProperties} from 'react';
import useStyles from './Spinner.styles';
import useTheme from '../../../contexts/Theme/useTheme';

export type SpinnerSize = 'small' | 'medium' | 'large';

export interface SpinnerProps {
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Custom color for the spinner
   */
  color?: string;
  /**
   * Size of the spinner
   */
  size?: SpinnerSize;
  /**
   * Custom styles
   */
  style?: CSSProperties;
}

/**
 * Spinner component for loading states
 *
 * @example
 * ```tsx
 * // Basic spinner
 * <Spinner />
 *
 * // Large spinner with custom color
 * <Spinner size="large" color="#3b82f6" />
 *
 * // Small spinner
 * <Spinner size="small" />
 * ```
 */
const Spinner: FC<SpinnerProps> = ({size = 'medium', color, className, style}: SpinnerProps) => {
  const {theme, colorScheme}: ReturnType<typeof useTheme> = useTheme();
  const styles: Record<string, string> = useStyles(theme, colorScheme, size, color);

  const spinnerClassName: string = cx(
    withVendorCSSClassPrefix(bem('spinner')),
    styles['spinner'],
    size === 'small' && styles['spinnerSmall'],
    size === 'medium' && styles['spinnerMedium'],
    size === 'large' && styles['spinnerLarge'],
    className,
  );

  return <span className={spinnerClassName} style={style} role="status" aria-label="Loading" />;
};

export default Spinner;
