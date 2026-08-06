// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';
import {css} from '../../../styles/emotion';

/**
 * Creates styles for the PasswordField component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param showPassword - Whether the password is currently visible
 * @param disabled - Whether the component is disabled
 * @param hasError - Whether the component has an error
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (
  theme: Theme,
  colorScheme: string,
  showPassword: boolean,
  disabled: boolean,
  hasError: boolean,
): Record<string, string> =>
  useMemo(() => {
    const toggleIcon: string = css`
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      color: ${theme.vars.colors.text.secondary};
      opacity: ${disabled ? 0.6 : 1};
      transition: color 0.2s ease;

      &:hover {
        color: ${!disabled ? theme.vars.colors.text.primary : theme.vars.colors.text.secondary};
      }
    `;

    const visibleIcon: string = css`
      color: ${theme.vars.colors.primary.main};
    `;

    const hiddenIcon: string = css`
      color: ${theme.vars.colors.text.secondary};
    `;

    return {
      hiddenIcon,
      toggleIcon,
      visibleIcon,
    };
  }, [theme, colorScheme, showPassword, disabled, hasError]);

export default useStyles;
