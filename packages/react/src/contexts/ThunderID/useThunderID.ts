// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {resolveFlowTemplateLiterals} from '@thunderid/browser';
import {useContext} from 'react';
import ThunderIDContext, {ThunderIDContextProps} from './ThunderIDContext';
import FlowMetaContext, {FlowMetaContextValue} from '../FlowMeta/FlowMetaContext';
import I18nContext, {I18nContextValue} from '../I18n/I18nContext';

const useThunderID = (): ThunderIDContextProps => {
  const context: ThunderIDContextProps | null = useContext(ThunderIDContext);

  if (!context) {
    throw new Error('useThunderID must be used within an ThunderIDProvider');
  }

  // FlowMetaContext lives inside ThunderIDProvider, so it is always present in
  // normal usage.  Optional chaining keeps the hook safe in unit tests that
  // don't render FlowMetaProvider.
  const flowMetaContext: FlowMetaContextValue | null = useContext(FlowMetaContext);

  // I18nContext provides the translation function.  Direct useContext (rather
  // than useTranslation) avoids throwing in test environments without I18nProvider.
  const i18nContext: I18nContextValue | null = useContext(I18nContext);

  const meta: FlowMetaContextValue['meta'] = flowMetaContext?.meta ?? null;
  const isMetaLoading: boolean = flowMetaContext?.isLoading ?? false;

  return {
    ...context,
    isMetaLoading,
    meta,
    resolveFlowTemplateLiterals: (text: string | undefined): string =>
      resolveFlowTemplateLiterals(text, {
        meta,
        t: i18nContext?.t ?? ((key: string): string => key),
      }),
  };
};

export default useThunderID;
