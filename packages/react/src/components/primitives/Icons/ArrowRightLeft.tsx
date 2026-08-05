// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FC} from 'react';

export interface ArrowRightLeftProps {
  /** Color of the icon stroke */
  color?: string;
  /** Icon size in pixels */
  size?: number;
}

/**
 * ArrowRightLeft Icon component (lucide-compatible).
 */
const ArrowRightLeft: FC<ArrowRightLeftProps> = ({color = 'currentColor', size = 24}: ArrowRightLeftProps) => (
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
    <path d="m16 3 4 4-4 4" />
    <path d="M20 7H4" />
    <path d="m8 21-4-4 4-4" />
    <path d="M4 17h16" />
  </svg>
);

ArrowRightLeft.displayName = 'ArrowRightLeft';

export default ArrowRightLeft;
