// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import resolveApiBaseUrl from './resolveApiBaseUrl';
import {BackendEndpoints, ResolvedBackendEndpoints} from '../models/backend';

const DEFAULT_BACKEND_BASE_PATH = '/api/auth';

/**
 * Minimal shape of the config needed to resolve the backend endpoints.
 */
export interface BackendEndpointConfig {
  baseUrl?: string;
  endpoints?: {backend?: BackendEndpoints};
}

/**
 * Resolves the backend endpoints from `endpoints.backend`, or returns `undefined` when it is not set
 * and sign-in does not run on a backend.
 *
 * In backend mode `baseUrl` is the backend. Each endpoint given as a path (starting with `/`) is
 * resolved against it, and an absolute URL is used as it is. Without `baseUrl` the paths stay
 * relative to the app's origin. The API base, whose requests go through the proxy, is
 * `endpoints.backend.apiBaseUrl`, falling back to `baseUrl` and then to the app's origin.
 *
 * @param config - The client config.
 * @param origin - The app's origin, the API base when neither `apiBaseUrl` nor `baseUrl` is set.
 * @returns The resolved endpoints, or `undefined` when `endpoints.backend` is not set.
 *
 * @example
 * ```typescript
 * resolveBackendEndpoints({baseUrl: 'https://bff.example.com', endpoints: {backend: {}}}, window.location.origin);
 * // {signIn: 'https://bff.example.com/api/auth/signin', ..., apiBaseUrl: 'https://bff.example.com'}
 * ```
 */
const resolveBackendEndpoints = (
  config: BackendEndpointConfig | undefined,
  origin: string,
): ResolvedBackendEndpoints | undefined => {
  const endpoints: BackendEndpoints | undefined = config?.endpoints?.backend;

  if (!endpoints) {
    return undefined;
  }

  const backendBase: string = (config?.baseUrl ?? '').replace(/\/+$/, '');
  const resolve = (endpoint: string | undefined, fallback: string): string => {
    const value: string = endpoint ?? `${DEFAULT_BACKEND_BASE_PATH}/${fallback}`;

    return value.startsWith('/') && !value.startsWith('//') ? `${backendBase}${value}` : value;
  };

  return {
    // `||`, not `??`: an empty base, which the providers default to, falls back to the origin too.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    apiBaseUrl: (resolveApiBaseUrl(config) || origin).replace(/\/+$/, ''),
    bypass: {
      attachToken: endpoints.bypass?.attachToken ?? true,
      urls: (endpoints.bypass?.urls ?? []).map((url: string) => url.replace(/\/+$/, '')),
    },
    checkSession: resolve(endpoints.checkSession, 'checksession'),
    proxy: resolve(endpoints.proxy, 'proxy').replace(/\/+$/, ''),
    refresh: resolve(endpoints.refresh, 'refresh'),
    session: resolve(endpoints.session, 'session'),
    signIn: resolve(endpoints.signIn, 'signin'),
    signOut: resolve(endpoints.signOut, 'signout'),
    token: resolve(endpoints.token, 'token'),
  };
};

export default resolveBackendEndpoints;
