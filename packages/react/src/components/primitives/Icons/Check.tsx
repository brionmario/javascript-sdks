// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FC} from 'react';

export interface CheckProps {
  /**
   * Color of the icon.
   */
  color?: string;
  /**
   * Height of the icon.
   */
  height?: number | string;
  /**
   * Width of the icon.
   */
  width?: number | string;
}

/**
 * Check Icon component.
 *
 * @param props - Props injected to the component.
 * @returns Check Icon component.
 */
const Check: FC<CheckProps> = ({color = 'currentColor', height = 24, width = 24}: CheckProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6 9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

Check.displayName = 'Check';

export default Check;
