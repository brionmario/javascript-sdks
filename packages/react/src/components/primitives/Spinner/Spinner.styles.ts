// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {css, keyframes} from '@emotion/css';
import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';

export type SpinnerSize = 'small' | 'medium' | 'large';

/**
 * Creates styles for the Spinner component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param size - The size of the spinner
 * @param color - The color of the spinner
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string, size: SpinnerSize, color?: string): Record<string, string> =>
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

    return {
      spinner,
      spinnerLarge,
      spinnerMedium,
      spinnerSmall,
    };
  }, [theme, colorScheme, size, color]);

export default useStyles;
