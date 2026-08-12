// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {
  FlowMetadataResponse,
  FlowMetaType,
  getFlowMeta,
  I18nBundle,
  resolveResourceEndpoint,
  TranslationBundleConstants,
} from '@thunderid/browser';
import {FC, PropsWithChildren, ReactElement, RefObject, useCallback, useEffect, useRef, useState} from 'react';
import FlowMetaContext from './FlowMetaContext';
import {I18nContextValue} from '../I18n/I18nContext';
import useI18n from '../I18n/useI18n';
import useThunderID from '../ThunderID/useThunderID';

export interface FlowMetaProviderProps {
  /**
   * When false the provider skips fetching and provides null meta.
   * @default true
   */
  enabled?: boolean;

  /**
   * Flow metadata resolved ahead of time (e.g. fetched server-side during SSR) and used to seed
   * the provider's state. When present, the provider skips its own initial client-side fetch —
   * avoiding a redundant request and the flash of untranslated i18n keys while that fetch is in
   * flight — but still fetches normally on subsequent changes (e.g. an explicit language switch).
   */
  initialMeta?: FlowMetadataResponse | null;
}

/**
 * FlowMetaProvider fetches flow metadata from the `GET /flow/meta` endpoint
 * (v2 API) and makes it available to child components through `FlowMetaContext`.
 *
 * It is designed to be used in v2 embedded-flow scenarios and integrates with
 * `ThemeProvider` so that theme settings (colors, direction, typography, …)
 * from the server-side design configuration are applied automatically.
 *
 * @example
 * ```tsx
 * <FlowMetaProvider
 *   config={{
 *     baseUrl: 'https://localhost:8090',
 *     type: FlowMetaType.App,
 *     id: 'your-app-id',
 *   }}
 * >
 *   <ThemeProvider>
 *     <App />
 *   </ThemeProvider>
 * </FlowMetaProvider>
 * ```
 */
const FlowMetaProvider: FC<PropsWithChildren<FlowMetaProviderProps>> = ({
  children,
  enabled = true,
  initialMeta = null,
}: PropsWithChildren<FlowMetaProviderProps>): ReactElement => {
  const {baseUrl, endpoints, applicationId, isInitialized} = useThunderID();
  const i18nContext: I18nContextValue = useI18n();

  const [meta, setMeta] = useState<FlowMetadataResponse | null>(initialMeta);
  const [isLoading, setIsLoading] = useState<boolean>(!initialMeta);
  const [error, setError] = useState<Error | null>(null);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

  // Track the request actually dispatched (and in flight), keyed by its real parameters rather
  // than the fetchFlowMeta reference. This prevents redundant fetches for the same request:
  //   1. React StrictMode simulates unmount+remount — the re-mount fires the effect again with an
  //      unchanged request; without this guard the else-branch would issue a redundant second
  //      network request.
  //   2. Rapid dependency changes that don't change the request itself — e.g. `endpoints` or
  //      `i18nContext` being a new object with equivalent content — recreate fetchFlowMeta's
  //      reference on every render. Keying on identity alone (rather than the resolved URL/id/
  //      language) would treat each of those as a distinct request and refire the same fetch.
  const lastRequestKeyRef: RefObject<string | null> = useRef<string | null>(null);
  const inFlightRequestKeyRef: RefObject<string | null> = useRef<string | null>(null);
  const initialMetaConsumedRef: RefObject<boolean> = useRef(false);

  const getRequestKey = useCallback(
    (language?: string): string => {
      const url = resolveResourceEndpoint('flowMeta', {endpoints});
      return JSON.stringify([baseUrl, url, applicationId ?? null, language ?? i18nContext?.currentLanguage ?? null]);
    },
    [baseUrl, endpoints, applicationId, i18nContext?.currentLanguage],
  );

  const fetchFlowMeta: () => Promise<void> = useCallback(async (): Promise<void> => {
    if (!enabled) {
      setMeta(null);
      setIsLoading(false);
      return;
    }

    // Defer until ThunderID finishes initializing (e.g. loading applicationId
    // from storage on refresh). Once initialized, proceed even if applicationId
    // is absent — some flows (e.g. AcceptInvite) have no applicationId by design.
    if (!isInitialized && !applicationId) {
      return;
    }

    const requestKey = getRequestKey();

    if (inFlightRequestKeyRef.current === requestKey || lastRequestKeyRef.current === requestKey) {
      return;
    }

    inFlightRequestKeyRef.current = requestKey;
    setIsLoading(true);
    setError(null);

    try {
      const result: FlowMetadataResponse = await getFlowMeta({
        baseUrl,
        url: resolveResourceEndpoint('flowMeta', {endpoints}),
        ...(applicationId ? {id: applicationId, type: FlowMetaType.App} : {}),
        language: i18nContext?.currentLanguage,
      });
      setMeta(result);
      lastRequestKeyRef.current = requestKey;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      inFlightRequestKeyRef.current = null;
      setIsLoading(false);
    }
  }, [enabled, baseUrl, endpoints, applicationId, isInitialized, i18nContext?.currentLanguage, getRequestKey]);

  const switchLanguage: (language: string) => Promise<void> = useCallback(
    async (language: string): Promise<void> => {
      if (!enabled) return;

      setIsLoading(true);
      setError(null);

      try {
        const result: FlowMetadataResponse = await getFlowMeta({
          baseUrl,
          url: resolveResourceEndpoint('flowMeta', {endpoints}),
          ...(applicationId ? {id: applicationId, type: FlowMetaType.App} : {}),
          language,
        });

        // Inject translations for the new language before switching
        if (result.i18n?.translations && i18nContext?.injectBundles) {
          const flatTranslations: Record<string, string> = {};
          Object.entries(result.i18n.translations).forEach(([namespace, keys]: [string, Record<string, string>]) => {
            Object.entries(keys).forEach(([key, value]: [string, string]) => {
              flatTranslations[`${namespace}.${key}`] = value;
            });
          });
          const bundle: I18nBundle = {translations: flatTranslations} as unknown as I18nBundle;
          i18nContext.injectBundles({[language]: bundle});
        }

        // Defer setLanguage to the next effect cycle so injectBundles state
        // is committed before I18nProvider's setLanguage checks mergedBundles.
        setPendingLanguage(language);
        setMeta(result);
        // Record this as the last-fetched request so fetchFlowMeta doesn't refetch once
        // i18nContext.currentLanguage catches up to the language just switched to.
        lastRequestKeyRef.current = getRequestKey(language);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [enabled, baseUrl, endpoints, applicationId, i18nContext, getRequestKey],
  );

  // After injectBundles + setPendingLanguage are batched and committed, this
  // effect fires with the updated i18nContext (mergedBundles now includes the
  // new language), so setLanguage succeeds on the first switch.
  useEffect(() => {
    if (pendingLanguage && i18nContext?.setLanguage) {
      i18nContext.setLanguage(pendingLanguage);
      setPendingLanguage(null);
    }
  }, [pendingLanguage, i18nContext?.setLanguage]);

  useEffect(() => {
    if (!initialMetaConsumedRef.current) {
      initialMetaConsumedRef.current = true;

      if (initialMeta) {
        // Seeded from SSR (or another caller) — record its request key so a later effect firing
        // for the same request (e.g. a StrictMode re-mount) skips the redundant first
        // client-side fetch. Later dependency changes (e.g. an explicit language switch) still
        // fetch normally, since their request key differs.
        lastRequestKeyRef.current = getRequestKey();
        return;
      }
    }

    fetchFlowMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFlowMeta]);

  // When meta loads with i18n translations, inject them into the i18n system.
  // Meta translations act as the base layer — prop-provided bundles still take precedence.
  useEffect(() => {
    if (!meta?.i18n?.translations || !i18nContext?.injectBundles) {
      return;
    }

    const metaLanguage: string = meta.i18n.language || TranslationBundleConstants.FALLBACK_LOCALE;

    // Flatten namespace-keyed translations to dot-path keys:
    // { "signin": { "heading": "Sign In" } } → { "signin.heading": "Sign In" }
    const flatTranslations: Record<string, string> = {};
    Object.entries(meta.i18n.translations).forEach(([namespace, keys]: [string, Record<string, string>]) => {
      Object.entries(keys).forEach(([key, value]: [string, string]) => {
        flatTranslations[`${namespace}.${key}`] = value;
      });
    });

    const bundle: I18nBundle = {translations: flatTranslations} as unknown as I18nBundle;

    // Inject under the meta language code and the i18n current language so
    // lookups succeed regardless of whether the system uses "en" or "en-US".
    const bundlesToInject: Record<string, I18nBundle> = {[metaLanguage]: bundle};
    if (i18nContext.currentLanguage && i18nContext.currentLanguage !== metaLanguage) {
      bundlesToInject[i18nContext.currentLanguage] = bundle;
    }
    if (i18nContext.fallbackLanguage && i18nContext.fallbackLanguage !== metaLanguage) {
      bundlesToInject[i18nContext.fallbackLanguage] = bundle;
    }

    i18nContext.injectBundles(bundlesToInject);
  }, [meta?.i18n?.translations, i18nContext?.injectBundles]);

  const value: any = {
    error,
    fetchFlowMeta,
    isLoading,
    meta,
    switchLanguage,
  };

  return <FlowMetaContext.Provider value={value}>{children}</FlowMetaContext.Provider>;
};

export default FlowMetaProvider;
