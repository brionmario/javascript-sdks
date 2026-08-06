// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';
import {css} from '../../../styles/emotion';

export type LogoSize = 'small' | 'medium' | 'large';

/**
 * Creates styles for the Logo component using BEM methodology
 * @param theme - The theme object containing design tokens
 * @param colorScheme - The current color scheme (used for memoization)
 * @param size - The size of the logo
 * @returns Object containing CSS class names for component styling
 */
const useStyles = (theme: Theme, colorScheme: string, size: LogoSize): Record<string, string> =>
  useMemo(() => {
    const baseLogo: string = css`
      width: auto;
      object-fit: contain;
      display: block;
    `;

    const smallLogo: string = css`
      height: 32px;
      max-width: 120px;
    `;

    const mediumLogo: string = css`
      height: 48px;
      max-width: 180px;
    `;

    const largeLogo: string = css`
      height: 64px;
      max-width: 240px;
    `;

    const sizeStyles: Record<string, string> = {
      large: largeLogo,
      medium: mediumLogo,
      small: smallLogo,
    };

    const baseEmoji: string = css`
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    `;

    const emojiSizeStyles: Record<LogoSize, string> = {
      large: css`
        width: 64px;
        height: 64px;
        font-size: 36px;
      `,
      medium: css`
        width: 48px;
        height: 48px;
        font-size: 28px;
      `,
      small: css`
        width: 32px;
        height: 32px;
        font-size: 20px;
      `,
    };

    return {
      emoji: baseEmoji,
      emojiSize: emojiSizeStyles[size],
      large: largeLogo,
      logo: baseLogo,
      medium: mediumLogo,
      size: sizeStyles[size],
      small: smallLogo,
    };
  }, [theme, colorScheme, size]);

export default useStyles;
