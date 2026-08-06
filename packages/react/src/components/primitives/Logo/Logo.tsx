// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix, bem, resolveLogoUri, ResolvedLogo} from '@thunderid/browser';
import {FC} from 'react';
import useStyles from './Logo.styles';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '../../../styles/emotion';

export type LogoSize = 'small' | 'medium' | 'large';

/**
 * Props for the Logo component.
 */
export interface LogoProps {
  /**
   * Custom alt text for the logo.
   */
  alt?: string;
  /**
   * Custom CSS class name for the logo.
   */
  className?: string;
  /**
   * Size of the logo.
   */
  size?: LogoSize;
  /**
   * Custom logo URL to override theme logo.
   */
  src?: string;
  /**
   * Custom title for the logo.
   */
  title?: string;
}

/**
 * Logo component that displays the brand logo from theme or custom source.
 *
 * @param props - The props for the Logo component.
 * @returns The rendered Logo component.
 */
const Logo: FC<LogoProps> = ({className, src, alt, title, size = 'medium'}: LogoProps) => {
  const {theme, colorScheme}: ReturnType<typeof useTheme> = useTheme();
  const styles: Record<string, string> = useStyles(theme, colorScheme, size);

  const logoConfig: Record<string, string> | undefined = theme.images?.logo as Record<string, string> | undefined;

  const logoSpec: string | undefined = src || logoConfig?.['url'];

  const logoAlt: string = alt || logoConfig?.['alt'] || 'Logo';

  const logoTitle: string | undefined = title || logoConfig?.['title'];

  if (!logoSpec) {
    return null;
  }

  const resolvedLogo: ResolvedLogo = resolveLogoUri(logoSpec, logoAlt);

  if (resolvedLogo.kind === 'emoji') {
    return (
      <span
        role="img"
        aria-label={logoAlt}
        title={logoTitle}
        className={cx(
          withVendorCSSClassPrefix(bem('logo')),
          withVendorCSSClassPrefix(bem('logo', size)),
          styles['emoji'],
          styles['emojiSize'],
          className,
        )}
      >
        {resolvedLogo.glyph}
      </span>
    );
  }

  return (
    <img
      src={resolvedLogo.imgSrc}
      alt={logoAlt}
      title={logoTitle}
      className={cx(
        withVendorCSSClassPrefix(bem('logo')),
        withVendorCSSClassPrefix(bem('logo', size)),
        styles['logo'],
        styles['size'],
        className,
      )}
    />
  );
};

export default Logo;
