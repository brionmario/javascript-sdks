// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';
import {css} from '../../../styles/emotion';

export type FormControlHelperTextAlign = 'left' | 'center';

/**
 * Creates styles for the FormControl component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param helperTextAlign - The alignment for helper text
 * @param helperTextMarginLeft - Custom margin left for helper text
 * @param hasError - Whether the form control has an error
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (
  theme: Theme,
  colorScheme: string,
  helperTextAlign: FormControlHelperTextAlign,
  helperTextMarginLeft?: string,
  hasError?: boolean,
): Record<string, string> =>
  useMemo(() => {
    const formControl: string = css`
      text-align: start;
      font-family: ${theme.vars.typography.fontFamily};
    `;

    const helperText: string = css`
      margin-top: calc(${theme.vars.spacing.unit} / 2);
      text-align: ${helperTextAlign === 'left' ? 'start' : helperTextAlign};
      ${helperTextMarginLeft && `margin-inline-start: ${helperTextMarginLeft};`}
    `;

    const helperTextError: string = css`
      color: ${theme.vars.colors.error.main};
    `;

    return {
      formControl,
      helperText,
      helperTextError,
    };
  }, [theme, colorScheme, helperTextAlign, helperTextMarginLeft, hasError]);

export default useStyles;
