// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';
import {css} from '../../../styles/emotion';

export type MultiInputType = 'text' | 'email' | 'tel' | 'url' | 'password' | 'date' | 'boolean';
export type MultiInputFieldType = 'STRING' | 'DATE_TIME' | 'BOOLEAN';

/**
 * Creates styles for the MultiInput component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param disabled - Whether the component is disabled
 * @param hasError - Whether the component has an error
 * @param canAddMore - Whether more items can be added
 * @param canRemove - Whether items can be removed
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (
  theme: Theme,
  colorScheme: string,
  disabled: boolean,
  hasError: boolean,
  canAddMore: boolean,
  canRemove: boolean,
): Record<string, string> =>
  useMemo(() => {
    const container: string = css`
      display: flex;
      flex-direction: column;
      gap: ${theme.vars.spacing.unit};
    `;

    const inputRow: string = css`
      display: flex;
      align-items: center;
      gap: ${theme.vars.spacing.unit};
      position: relative;
    `;

    const inputWrapper: string = css`
      flex: 1;
    `;

    const plusIcon: string = css`
      background: ${theme.vars.colors.secondary.main};
      border-radius: 50%;
      outline: 4px ${theme.vars.colors.secondary.main} auto;
      color: ${theme.vars.colors.secondary.contrastText};
    `;

    const listContainer: string = css`
      display: flex;
      flex-direction: column;
      gap: 0;
    `;

    const listItem: string = css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: ${theme.vars.spacing.unit} calc(${theme.vars.spacing.unit} * 1.5);
      background-color: ${theme.vars.colors.background.surface};
      border-radius: ${theme.vars.borderRadius.medium};
      font-size: 1rem;
      font-family: ${theme.vars.typography.fontFamily};
      color: ${theme.vars.colors.text.primary};
      margin-bottom: calc(${theme.vars.spacing.unit} / 2);

      &:last-child {
        margin-bottom: 0;
      }
    `;

    const listItemText: string = css`
      flex: 1;
      word-break: break-word;
    `;

    const removeButton: string = css`
      padding: calc(${theme.vars.spacing.unit} / 2);
      min-width: auto;
      color: ${theme.vars.colors.error.main};
      background: transparent;
      border: none;
      border-radius: ${theme.vars.borderRadius.small};
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover:not(:disabled) {
        background-color: ${theme.vars.colors.action.hover};
      }

      &:disabled {
        opacity: 0.6;
      }
    `;

    const icon: string = css`
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    `;

    return {
      container,
      icon,
      inputRow,
      inputWrapper,
      listContainer,
      listItem,
      listItemText,
      plusIcon,
      removeButton,
    };
  }, [theme, colorScheme, disabled, hasError, canAddMore, canRemove]);

export default useStyles;
