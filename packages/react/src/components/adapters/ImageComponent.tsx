// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {resolveLogoUri, ResolvedLogo} from '@thunderid/browser';
import {CSSProperties, FC, SyntheticEvent} from 'react';
import useTheme from '../../contexts/Theme/useTheme';
import {AdapterProps} from '../../models/adapters';

const DEFAULT_EMOJI_CONTAINER_HEIGHT = '4em';

/**
 * Image component for sign-up forms.
 */
const ImageComponent: FC<AdapterProps> = ({component}: AdapterProps) => {
  const {theme} = useTheme();
  const config: Record<string, unknown> = component.config || {};
  const src: string = (config['src'] as string) || '';
  const alt: string = (config['alt'] as string) || (config['label'] as string) || 'Image';
  const width: string = (config['width'] as string) || '100%';
  const height: string = (config['height'] as string) || 'auto';
  const variant: string = component.variant?.toLowerCase() || 'image_block';

  const imageStyle: CSSProperties = {
    borderRadius: theme.vars.borderRadius.small,
    display: 'block',
    margin: variant === 'image_block' ? '1rem auto' : '0',
  };

  if (!src) {
    return null;
  }

  const resolvedIcon: ResolvedLogo = resolveLogoUri(src, alt);

  if (resolvedIcon.kind === 'emoji') {
    // Bare numbers (e.g. "48") are valid for <img> width/height attributes but
    // are unit-less and ignored as CSS properties — normalize them to px.
    const toCSSLength = (value: string): string => (/^\d+(\.\d+)?$/.test(value) ? `${value}px` : value);
    const cssWidth: string = toCSSLength(width);
    const cssHeight: string = toCSSLength(height);

    // container-type: size needs a concrete block dimension — percentage and
    // 'auto' values both collapse to 0 when the parent has no defined height.
    // Priority: explicit height → explicit width (square) → fallback constant.
    const isConcrete = (v: string): boolean => v !== 'auto' && !v.endsWith('%');
    let containerHeight: string;
    if (isConcrete(cssHeight)) {
      containerHeight = cssHeight;
    } else if (isConcrete(cssWidth)) {
      containerHeight = cssWidth;
    } else {
      containerHeight = DEFAULT_EMOJI_CONTAINER_HEIGHT;
    }

    return (
      <div key={component.id} style={{textAlign: 'center'}}>
        {/*
         * container-type: size lets the inner span use cqmin (= min(cqw, cqh))
         * so the emoji font-size tracks the rendered container dimensions
         * rather than the parent's font-size.
         */}
        <span
          style={{
            ...imageStyle,
            containerType: 'size',
            display: 'inline-grid',
            height: containerHeight,
            placeItems: 'center',
            width: cssWidth,
          }}
        >
          <span aria-label={alt} role="img" style={{fontSize: '100cqmin', lineHeight: 1}}>
            {resolvedIcon.glyph}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div key={component.id} style={{textAlign: 'center'}}>
      <img
        src={resolvedIcon.imgSrc}
        alt={alt}
        height={height}
        width={width}
        style={imageStyle}
        onError={(e: SyntheticEvent<HTMLImageElement>): void => {
          // Hide broken images
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default ImageComponent;
