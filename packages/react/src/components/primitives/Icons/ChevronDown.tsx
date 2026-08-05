// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FC} from 'react';

export interface ChevronDownProps {
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
 * ChevronDown Icon component.
 *
 * @param props - Props injected to the component.
 * @returns ChevronDown Icon component.
 */
const ChevronDown: FC<ChevronDownProps> = ({color = 'currentColor', height = 24, width = 24}: ChevronDownProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m6 9 6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

ChevronDown.displayName = 'ChevronDown';

export default ChevronDown;
