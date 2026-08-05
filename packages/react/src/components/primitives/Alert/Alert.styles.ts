// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {css} from '@emotion/css';
import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Creates styles for the Alert component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param variant - The alert variant
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string, variant: AlertVariant): Record<string, string> =>
  useMemo(() => {
    const baseAlert: string = css`
      padding: calc(${theme.vars.spacing.unit} * 2);
      border-radius: ${theme.vars.borderRadius.medium};
      border: 1px solid;
      font-family: ${theme.vars.typography.fontFamily};
      display: flex;
      gap: calc(${theme.vars.spacing.unit} * 1.5);
      align-items: flex-start;
    `;

    const variantStyles: Record<string, string> = {
      error: css`
        background-color: color-mix(in srgb, ${theme.vars.colors.error.main} 20%, white);
        border-color: ${theme.vars.colors.error.main};
        color: ${theme.vars.colors.error.main};
      `,
      info: css`
        background-color: color-mix(in srgb, ${theme.vars.colors.info.main} 20%, white);
        border-color: ${theme.vars.colors.info.main};
        color: ${theme.vars.colors.info.main};
      `,
      success: css`
        background-color: color-mix(in srgb, ${theme.vars.colors.success.main} 20%, white);
        border-color: ${theme.vars.colors.success.main};
        color: ${theme.vars.colors.success.main};
      `,
      warning: css`
        background-color: color-mix(in srgb, ${theme.vars.colors.warning.main} 20%, white);
        border-color: ${theme.vars.colors.warning.main};
        color: ${theme.vars.colors.warning.main};
      `,
    };

    const iconStyles: string = css`
      flex-shrink: 0;
      margin-top: calc(${theme.vars.spacing.unit} * 0.25);
      width: calc(${theme.vars.spacing.unit} * 2.5);
      height: calc(${theme.vars.spacing.unit} * 2.5);
      color: ${theme.vars.colors[variant]?.contrastText};
    `;

    const contentStyles: string = css`
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: ${theme.vars.spacing.unit};
    `;

    const titleStyles: string = css`
      margin: 0;
      font-size: ${theme.vars.typography.fontSizes.sm};
      font-weight: 600;
      line-height: 1.4;
      color: ${theme.vars.colors[variant]?.contrastText};
    `;

    const descriptionStyles: string = css`
      margin: 0;
      font-size: ${theme.vars.typography.fontSizes.sm};
      line-height: 1.4;
      color: ${theme.vars.colors.text.secondary};
    `;

    return {
      alert: baseAlert,
      content: contentStyles,
      description: descriptionStyles,
      icon: iconStyles,
      title: titleStyles,
      variant: variantStyles[variant],
    };
  }, [theme, colorScheme, variant]);

export default useStyles;
