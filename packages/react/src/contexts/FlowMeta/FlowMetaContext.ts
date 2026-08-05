// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FlowMetadataResponse} from '@thunderid/browser';
import {Context, createContext} from 'react';

export interface FlowMetaContextValue {
  /**
   * Error from the flow meta fetch, if any
   */
  error: Error | null;
  /**
   * Manually re-fetch flow metadata
   */
  fetchFlowMeta: () => Promise<void>;
  /**
   * Whether flow metadata is currently being fetched
   */
  isLoading: boolean;
  /**
   * The fetched flow metadata response, or null while loading / on error
   */
  meta: FlowMetadataResponse | null;
  /**
   * Fetches flow metadata for the given language and activates it in the i18n system.
   * Use this to switch the UI language at runtime.
   */
  switchLanguage: (language: string) => Promise<void>;
}

const FlowMetaContext: Context<FlowMetaContextValue | null> = createContext<FlowMetaContextValue | null>(null);

FlowMetaContext.displayName = 'FlowMetaContext';

export default FlowMetaContext;
