// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {RecursivePartial, ThemeConfig} from '@thunderid/browser';

interface ColorWithMain {
  [key: string]: unknown;
  main: string;
}

/**
 * Normalizes a single color value that may have been supplied as a shorthand
 * CSS color string (`'#2563eb'`) instead of the expected object form
 * (`{ main: '#2563eb' }`).
 *
 * This makes the `preferences.theme.overrides.colors.*` API forgiving for
 * JavaScript callers who don't have TypeScript's type-checker to catch the
 * mismatch at compile time.
 */
const normalizeColorValue = (color: string | ColorWithMain): ColorWithMain =>
  typeof color === 'string' ? {main: color} : color;

/**
 * Normalizes a `RecursivePartial<ThemeConfig>` so that color fields which are
 * supplied as plain CSS color strings are coerced into `{ main: string }`
 * objects before being handed to `createTheme`.
 *
 * Only the color groups that `toCssVariables` in `createTheme` actually reads
 * individual sub-keys from are normalized here (`primary`, `secondary`,
 * `error`, `success`, `warning`, `info`).  `border` is left alone because it
 * IS a plain string in `ThemeConfig`.
 */
const normalizeThemeConfig = (
  config: RecursivePartial<ThemeConfig> | undefined,
): RecursivePartial<ThemeConfig> | undefined => {
  if (!config?.colors) {
    return config;
  }

  const {primary, secondary, error, success, warning, info, ...restColors} = config.colors as any;

  return {
    ...config,
    colors: {
      ...restColors,
      ...(primary !== undefined ? {primary: normalizeColorValue(primary)} : {}),
      ...(secondary !== undefined ? {secondary: normalizeColorValue(secondary)} : {}),
      ...(error !== undefined ? {error: normalizeColorValue(error)} : {}),
      ...(success !== undefined ? {success: normalizeColorValue(success)} : {}),
      ...(warning !== undefined ? {warning: normalizeColorValue(warning)} : {}),
      ...(info !== undefined ? {info: normalizeColorValue(info)} : {}),
    },
  };
};

export default normalizeThemeConfig;
