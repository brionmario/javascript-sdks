// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FC} from 'react';
import ArrowLeftRight from './ArrowLeftRight';
import ArrowRightLeft from './ArrowRightLeft';

export interface FlowIconProps {
  color?: string;
  size?: number;
}

/**
 * Registry of icon components keyed by their lucide-compatible name.
 * Add new icons here as needed by flow definitions.
 */
const flowIconRegistry: Record<string, FC<FlowIconProps>> = {
  ArrowLeftRight,
  ArrowRightLeft,
};

export default flowIconRegistry;
