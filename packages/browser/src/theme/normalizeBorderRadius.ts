// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FlowMetaThemeShape} from '@thunderid/javascript';

/**
 * Size configuration in the v2 theme.
 *
 * @experimental This API may change in future versions
 */
interface FlowMetaThemeSize {
  small?: string;
  medium?: string;
  large?: string;
}
/**
 * Normalizes a raw `shape.borderRadius` value into per-size tokens suitable
 * for `ThemeConfig.borderRadius`.
 *
 * - Object with `small`/`medium`/`large` → used directly.
 * - Bare number or numeric string (e.g. `8` or `"8"`) → appended with `px` and applied uniformly.
 * - Pixel string (e.g. `"8px"`) → used as-is and applied uniformly.
 */
const normalizeBorderRadius = (raw: FlowMetaThemeShape['borderRadius']): FlowMetaThemeSize | undefined => {
  if (raw === undefined) return undefined;

  if (typeof raw === 'object') {
    const {small, medium, large}: FlowMetaThemeSize = raw;
    if (small === undefined && medium === undefined && large === undefined) return undefined;
    return {
      ...(large !== undefined && {large}),
      ...(medium !== undefined && {medium}),
      ...(small !== undefined && {small}),
    };
  }

  const trimmed: string = String(raw).trim();
  const radiusStr: string =
    typeof raw === 'number' ? `${raw}px` : /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
  return {large: radiusStr, medium: radiusStr, small: radiusStr};
};

export default normalizeBorderRadius;
