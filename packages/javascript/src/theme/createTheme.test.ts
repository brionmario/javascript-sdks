// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import createTheme from './createTheme';
import {Theme} from './types';

describe('createTheme', () => {
  it('should include vars property with CSS variable references', () => {
    const theme: Theme = createTheme();

    expect(theme.vars).toBeDefined();
    expect(theme.vars.colors.primary.main).toBe('var(--thunderid-color-primary-main)');
    expect(theme.vars.colors.primary.contrastText).toBe('var(--thunderid-color-primary-contrastText)');
    expect(theme.vars.spacing.unit).toBe('var(--thunderid-spacing-unit)');
    expect(theme.vars.borderRadius.small).toBe('var(--thunderid-border-radius-small)');
    expect(theme.vars.shadows.medium).toBe('var(--thunderid-shadow-medium)');
  });

  it('should have matching structure between cssVariables and vars', () => {
    const theme: Theme = createTheme();

    // Check that cssVariables has corresponding entries for vars
    expect(theme.cssVariables['--thunderid-color-primary-main']).toBeDefined();
    expect(theme.cssVariables['--thunderid-spacing-unit']).toBeDefined();
    expect(theme.cssVariables['--thunderid-border-radius-small']).toBeDefined();
    expect(theme.cssVariables['--thunderid-shadow-medium']).toBeDefined();
  });

  it('should work with custom theme configurations', () => {
    const customTheme: Theme = createTheme({
      colors: {
        primary: {
          main: '#custom-color',
        },
      },
    });

    // vars should still reference CSS variables, not the actual values
    expect(customTheme.vars.colors.primary.main).toBe('var(--thunderid-color-primary-main)');
    // but cssVariables should have the custom value
    expect(customTheme.cssVariables['--thunderid-color-primary-main']).toBe('#custom-color');
  });

  it('should work with dark theme', () => {
    const darkTheme: Theme = createTheme({}, true);

    expect(darkTheme.vars.colors.primary.main).toBe('var(--thunderid-color-primary-main)');
    expect(darkTheme.vars.colors.background.surface).toBe('var(--thunderid-color-background-surface)');

    // Should have dark theme values in cssVariables
    expect(darkTheme.cssVariables['--thunderid-color-background-surface']).toBe('#121212');
  });

  it('should use custom CSS variable prefix when provided', () => {
    const customTheme: Theme = createTheme({
      colors: {
        primary: {
          main: '#custom-color',
        },
      },
      cssVarPrefix: 'custom-app',
    });

    // Should use custom prefix in CSS variables
    expect(customTheme.cssVariables['--custom-app-color-primary-main']).toBe('#custom-color');
    expect(customTheme.cssVariables['--custom-app-spacing-unit']).toBe('8px');

    // Should use custom prefix in vars
    expect(customTheme.vars.colors.primary.main).toBe('var(--custom-app-color-primary-main)');
    expect(customTheme.vars.spacing.unit).toBe('var(--custom-app-spacing-unit)');

    // Should not have old thunderid prefixed variables
    expect(customTheme.cssVariables['--thunderid-color-primary-main']).toBeUndefined();
  });

  it('should use VendorConstants.VENDOR_PREFIX as default prefix', () => {
    const theme: Theme = createTheme();

    // Should use default prefix from VendorConstants
    expect(theme.cssVariables['--thunderid-color-primary-main']).toBeDefined();
    expect(theme.vars.colors.primary.main).toBe('var(--thunderid-color-primary-main)');
  });
});
