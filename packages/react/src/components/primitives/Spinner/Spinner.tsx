// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix, bem} from '@thunderid/browser';
import {FC} from 'react';
import useStyles from './Spinner.styles';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '../../../styles/emotion';

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
   * Optional explicit width/height (CSS length, e.g. `'24px'` or `'calc(...)'`) that overrides
   * the `size`-based default dimensions. Generates its own Emotion class internally rather than
   * accepting an inline `style` object, so it participates in the shared CSP nonce automatically.
   */
  widthOverride?: string;
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
const Spinner: FC<SpinnerProps> = ({size = 'medium', color, className, widthOverride = undefined}: SpinnerProps) => {
  const {theme, colorScheme}: ReturnType<typeof useTheme> = useTheme();
  const styles: Record<string, string> = useStyles(theme, colorScheme, size, color, widthOverride);

  const spinnerClassName: string = cx(
    withVendorCSSClassPrefix(bem('spinner')),
    styles['spinner'],
    size === 'small' && styles['spinnerSmall'],
    size === 'medium' && styles['spinnerMedium'],
    size === 'large' && styles['spinnerLarge'],
    widthOverride && styles['spinnerCustomSize'],
    className,
  );

  return <span className={spinnerClassName} role="status" aria-label="Loading" />;
};

export default Spinner;
