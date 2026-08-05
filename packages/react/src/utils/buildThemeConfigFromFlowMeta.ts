// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {
  FlowMetaTheme,
  FlowMetaThemeColorScheme,
  RecursivePartial,
  ThemeConfig,
  normalizeBorderRadius,
} from '@thunderid/browser';

/**
 * Converts a v2 `FlowMetaTheme` into a `RecursivePartial<ThemeConfig>` that
 * `createTheme` can consume.
 *
 * Only fields explicitly present in the FlowMeta response are included so that
 * `createTheme` can deep-merge them onto its base (light/dark) defaults without
 * accidentally dropping sibling keys that were not returned by the server.
 *
 * For example, when FlowMeta returns only `background.default` and
 * `background.paper`, only `body.main` and `surface` are set — the base
 * theme's `background.disabled` and `background.dark` are **not** overridden
 * and therefore keep their default CSS variable values.
 */
const buildThemeConfigFromFlowMeta = (
  flowMetaTheme: FlowMetaTheme,
  colorScheme: 'light' | 'dark',
): RecursivePartial<ThemeConfig> => {
  const scheme: FlowMetaThemeColorScheme | undefined = flowMetaTheme.colorSchemes?.[colorScheme];
  const borderRadiusConfig = normalizeBorderRadius(flowMetaTheme.shape?.borderRadius);

  // Build only the colors that the server actually provided.
  // Each nested object is constructed incrementally so that absent fields are
  // simply omitted rather than set to `undefined`, which would shadow the
  // base-theme defaults inside `createTheme`.
  let colors: RecursivePartial<ThemeConfig['colors']> | undefined;

  if (scheme?.palette) {
    colors = {};

    if (scheme.palette.primary) {
      colors.primary = scheme.palette.primary;
    }
    if (scheme.palette.secondary) {
      colors.secondary = scheme.palette.secondary;
    }
    if (scheme.palette.text) {
      colors.text = scheme.palette.text;
    }

    // Build background incrementally to avoid replacing the full base object.
    if (scheme.palette.background) {
      const bg: RecursivePartial<ThemeConfig['colors']['background']> = {};

      if (scheme.palette.background.default) {
        bg.body = {main: scheme.palette.background.default};
      }
      if (scheme.palette.background.paper) {
        bg.surface = scheme.palette.background.paper;
      }

      if (Object.keys(bg).length > 0) {
        colors.background = bg;
      }
    }
  }

  return {
    ...flowMetaTheme,
    ...(flowMetaTheme.direction ? {direction: flowMetaTheme.direction} : {}),
    ...(borderRadiusConfig ? {borderRadius: borderRadiusConfig} : {}),
    ...(colors && Object.keys(colors).length > 0 ? {colors} : {}),
    ...(flowMetaTheme.typography?.fontFamily ? {typography: {fontFamily: flowMetaTheme.typography.fontFamily}} : {}),
  };
};

export default buildThemeConfigFromFlowMeta;
