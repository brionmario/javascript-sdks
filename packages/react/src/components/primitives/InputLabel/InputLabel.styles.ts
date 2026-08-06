// Copyright 2024 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';
import {css} from '../../../styles/emotion';

export type InputLabelVariant = 'block' | 'inline';

/**
 * Creates styles for the InputLabel component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param variant - The display variant of the label
 * @param error - Whether the label has an error state
 * @param marginBottom - Custom margin bottom value
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (
  theme: Theme,
  colorScheme: string,
  variant: InputLabelVariant,
  error: boolean,
  marginBottom?: string,
): Record<string, string> =>
  useMemo(() => {
    const baseLabel: string = css`
      display: ${variant};
      margin-bottom: ${marginBottom || (variant === 'block' ? `calc(${theme.vars.spacing.unit} + 1px)` : '0')};
      color: ${error ? theme.vars.colors.error.main : theme.vars.colors.text.secondary};
      font-size: ${theme.vars.typography.fontSizes.sm};
      font-family: ${theme.vars.typography.fontFamily};
      font-weight: ${variant === 'block' ? 500 : 'normal'};
    `;

    const errorLabel: string = css`
      color: ${theme.vars.colors.error.main};
    `;

    const requiredIndicator: string = css`
      color: ${theme.vars.colors.error.main};
    `;

    const blockVariant: string = css`
      display: block;
      font-weight: 500;
      margin-bottom: ${marginBottom || `calc(${theme.vars.spacing.unit} + 1px)`};
    `;

    const inlineVariant: string = css`
      display: inline;
      font-weight: normal;
      margin-bottom: 0;
    `;

    return {
      block: blockVariant,
      error: errorLabel,
      inline: inlineVariant,
      label: baseLabel,
      requiredIndicator,
    };
  }, [theme, colorScheme, variant, error, marginBottom]);

export default useStyles;
