// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FC} from 'react';

export interface BuildingProps {
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
 * Building Icon component.
 *
 * @param props - Props injected to the component.
 * @returns Building Icon component.
 */
const Building: FC<BuildingProps> = ({color = 'currentColor', height = 24, width = 24}: BuildingProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 12h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 8h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 12h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 18h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 18h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

Building.displayName = 'Building';

export default Building;
