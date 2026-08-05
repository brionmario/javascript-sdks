// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {I18nBundle} from '@thunderid/browser';
import {Context, createContext} from 'react';

export interface I18nContextValue {
  /**
   * All available i18n bundles (default + user provided)
   */
  bundles: Record<string, I18nBundle>;

  /**
   * The current language code (e.g., 'en-US', 'fr-FR')
   */
  currentLanguage: string;

  /**
   * The fallback language code
   */
  fallbackLanguage: string;

  /**
   * Injects additional bundles into the i18n system (e.g., from flow metadata).
   * Injected bundles take precedence over defaults but are overridden by prop-provided bundles.
   */
  injectBundles: (bundles: Record<string, I18nBundle>) => void;

  /**
   * Function to change the current language
   */
  setLanguage: (language: string) => void;

  /**
   * Function to get a translation by key with optional parameters
   */
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext: Context<I18nContextValue | null> = createContext<I18nContextValue | null>(null);

I18nContext.displayName = 'I18nContext';

export default I18nContext;
