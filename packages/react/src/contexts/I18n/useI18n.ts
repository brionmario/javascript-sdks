// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import I18nContext, {I18nContextValue} from './I18nContext';

/**
 * Hook for accessing the I18n context directly.
 * Provides access to the full i18n context including bundles and all utilities.
 *
 * @returns The complete I18n context value
 * @throws Error if used outside of I18nProvider context
 */
const useI18n = (): I18nContextValue => {
  const context: I18nContextValue | null = useContext(I18nContext);

  if (!context) {
    throw new Error(
      'useI18n must be used within an I18nProvider. Make sure your component is wrapped with ThunderIDProvider which includes I18nProvider.',
    );
  }

  return context;
};

export default useI18n;
