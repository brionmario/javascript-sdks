// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FC} from 'react';

export interface ArrowLeftRightProps {
  /** Color of the icon stroke */
  color?: string;
  /** Icon size in pixels */
  size?: number;
}

/**
 * ArrowLeftRight Icon component (lucide-compatible).
 */
const ArrowLeftRight: FC<ArrowLeftRightProps> = ({color = 'currentColor', size = 24}: ArrowLeftRightProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </svg>
);

ArrowLeftRight.displayName = 'ArrowLeftRight';

export default ArrowLeftRight;
