// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cleanup, render, waitFor} from '@testing-library/react';
import {ReactNode} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import I18nContext, {I18nContextValue} from '../../I18n/I18nContext';
import ThunderIDContext, {ThunderIDContextProps} from '../../ThunderID/ThunderIDContext';
import FlowMetaProvider from '../FlowMetaProvider';

const mockGetFlowMeta = vi.fn();

vi.mock('@thunderid/browser', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@thunderid/browser')>()),
  getFlowMeta: (...args: unknown[]): unknown => mockGetFlowMeta(...args),
}));

function createThunderIDContext(overrides: Partial<ThunderIDContextProps> = {}): ThunderIDContextProps {
  return {
    applicationId: 'app-id',
    baseUrl: 'https://localhost:8090',
    endpoints: {},
    isInitialized: true,
    ...overrides,
  } as unknown as ThunderIDContextProps;
}

function createI18nContext(overrides: Partial<I18nContextValue> = {}): I18nContextValue {
  return {
    bundles: {},
    currentLanguage: 'en-US',
    fallbackLanguage: 'en-US',
    injectBundles: vi.fn(),
    setLanguage: vi.fn(),
    t: (key: string) => key,
    ...overrides,
  };
}

function Providers({
  thunderID,
  i18n,
  children,
}: {
  thunderID: ThunderIDContextProps;
  i18n: I18nContextValue;
  children: ReactNode;
}) {
  return (
    <ThunderIDContext.Provider value={thunderID}>
      <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>
    </ThunderIDContext.Provider>
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('FlowMetaProvider', () => {
  it('fetches flow meta once on mount', async () => {
    mockGetFlowMeta.mockResolvedValue({});

    render(
      <Providers thunderID={createThunderIDContext()} i18n={createI18nContext()}>
        <FlowMetaProvider>content</FlowMetaProvider>
      </Providers>,
    );

    await waitFor(() => {
      expect(mockGetFlowMeta).toHaveBeenCalledTimes(1);
    });
  });

  it('does not refetch when re-rendered with a new-but-equivalent endpoints object', async () => {
    mockGetFlowMeta.mockResolvedValue({});

    const {rerender} = render(
      <Providers thunderID={createThunderIDContext({endpoints: {}})} i18n={createI18nContext()}>
        <FlowMetaProvider>content</FlowMetaProvider>
      </Providers>,
    );

    await waitFor(() => {
      expect(mockGetFlowMeta).toHaveBeenCalledTimes(1);
    });

    // A fresh `endpoints` object with the same content: this is what a re-render of a consumer
    // that doesn't memoize its config (e.g. deep-merging a config object on every render) would
    // pass down, and previously caused a spurious refetch.
    rerender(
      <Providers thunderID={createThunderIDContext({endpoints: {}})} i18n={createI18nContext()}>
        <FlowMetaProvider>content</FlowMetaProvider>
      </Providers>,
    );
    rerender(
      <Providers thunderID={createThunderIDContext({endpoints: {}})} i18n={createI18nContext()}>
        <FlowMetaProvider>content</FlowMetaProvider>
      </Providers>,
    );

    await waitFor(() => {
      expect(mockGetFlowMeta).toHaveBeenCalledTimes(1);
    });
  });

  it('refetches when the language actually changes', async () => {
    mockGetFlowMeta.mockResolvedValue({});

    const {rerender} = render(
      <Providers thunderID={createThunderIDContext()} i18n={createI18nContext({currentLanguage: 'en-US'})}>
        <FlowMetaProvider>content</FlowMetaProvider>
      </Providers>,
    );

    await waitFor(() => {
      expect(mockGetFlowMeta).toHaveBeenCalledTimes(1);
    });

    rerender(
      <Providers thunderID={createThunderIDContext()} i18n={createI18nContext({currentLanguage: 'fr-FR'})}>
        <FlowMetaProvider>content</FlowMetaProvider>
      </Providers>,
    );

    await waitFor(() => {
      expect(mockGetFlowMeta).toHaveBeenCalledTimes(2);
    });
  });
});
