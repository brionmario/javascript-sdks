// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';
import {css, keyframes} from '../../../styles/emotion';

export type SpinnerSize = 'small' | 'medium' | 'large';

/**
 * Creates styles for the Spinner component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param size - The size of the spinner
 * @param color - The color of the spinner
 * @param customSize - Optional explicit width/height (CSS length) that overrides the size-based
 * default, e.g. when a parent component (like `Button`) needs the spinner to track a
 * theme-derived dimension instead of one of the fixed `size` presets.
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (
  theme: Theme,
  colorScheme: string,
  size: SpinnerSize,
  color?: string,
  customSize?: string,
): Record<string, string> =>
  useMemo(() => {
    const spinnerColor: string = color || theme.vars.colors.primary.main;

    const spinnerSizes: Record<string, string> = {
      large: '32px',
      medium: '20px',
      small: '16px',
    };

    const spinnerSize: string = spinnerSizes[size];

    const spinAnimation: string = keyframes`
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    `;

    const spinner: string = css`
      width: ${spinnerSize};
      height: ${spinnerSize};
      border: 2px solid transparent;
      border-top: 2px solid ${spinnerColor};
      border-radius: 50%;
      animation: ${spinAnimation} 1s linear infinite;
      display: inline-block;
    `;

    const spinnerSmall: string = css`
      width: ${spinnerSizes['small']};
      height: ${spinnerSizes['small']};
    `;

    const spinnerMedium: string = css`
      width: ${spinnerSizes['medium']};
      height: ${spinnerSizes['medium']};
    `;

    const spinnerLarge: string = css`
      width: ${spinnerSizes['large']};
      height: ${spinnerSizes['large']};
    `;

    const spinnerCustomSize: string = customSize
      ? css`
          width: ${customSize};
          height: ${customSize};
        `
      : '';

    return {
      spinner,
      spinnerCustomSize,
      spinnerLarge,
      spinnerMedium,
      spinnerSmall,
    };
  }, [theme, colorScheme, size, color, customSize]);

export default useStyles;
