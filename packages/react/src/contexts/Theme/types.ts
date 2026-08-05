// Copyright 2024 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export interface ThemeColors {
  background: {
    body: {
      main: string;
    };
    disabled: string;
    surface: string;
  };
  border: string;
  error: {
    contrastText: string;
    main: string;
  };
  primary: {
    contrastText: string;
    main: string;
  };
  secondary: {
    contrastText: string;
    main: string;
  };
  success: {
    contrastText: string;
    main: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  warning: {
    contrastText: string;
    main: string;
  };
}

export interface ThemeConfig {
  borderRadius: {
    large: string;
    medium: string;
    small: string;
  };
  colors: ThemeColors;
  /**
   * The prefix used for CSS variables.
   * @default 'thunderid' (from VendorConstants.VENDOR_PREFIX)
   */
  cssVarPrefix?: string;
  /**
   * The text direction for the UI.
   * @default 'ltr'
   */
  direction?: 'ltr' | 'rtl';
  shadows: {
    large: string;
    medium: string;
    small: string;
  };
  spacing: {
    unit: number;
  };
}

export interface ThemeVars {
  borderRadius: {
    large: string;
    medium: string;
    small: string;
  };
  colors: {
    background: {
      body: {
        main: string;
      };
      disabled: string;
      surface: string;
    };
    border: string;
    error: {
      contrastText: string;
      main: string;
    };
    primary: {
      contrastText: string;
      main: string;
    };
    secondary: {
      contrastText: string;
      main: string;
    };
    success: {
      contrastText: string;
      main: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    warning: {
      contrastText: string;
      main: string;
    };
  };
  shadows: {
    large: string;
    medium: string;
    small: string;
  };
  spacing: {
    unit: string;
  };
}

export interface Theme extends ThemeConfig {
  cssVariables: Record<string, string>;
  vars: ThemeVars;
}
