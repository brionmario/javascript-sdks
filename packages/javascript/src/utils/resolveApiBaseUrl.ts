// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {BackendEndpointConfig} from './resolveBackendEndpoints';

/**
 * Resolves the base URL the SDK builds API requests on, such as `/users/me` and the management APIs.
 *
 * When sign-in runs on a backend (`endpoints.backend`), `baseUrl` is the backend itself, so the API
 * base is `endpoints.backend.apiBaseUrl`, falling back to `baseUrl`. Requests under it are sent
 * through the backend's proxy. Otherwise the API base is `baseUrl`.
 *
 * @param config - The client config.
 * @returns The API base URL, or `undefined` when none is configured.
 *
 * @example
 * ```typescript
 * resolveApiBaseUrl({baseUrl: 'https://bff.example.com', endpoints: {backend: {apiBaseUrl: 'https://api.example.com'}}});
 * // 'https://api.example.com'
 * ```
 */
const resolveApiBaseUrl = (config: BackendEndpointConfig | undefined): string | undefined => {
  if (config?.endpoints?.backend) {
    // `||`, not `??`: an empty value falls back, as an empty baseUrl does elsewhere.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return config.endpoints.backend.apiBaseUrl || config.baseUrl;
  }

  return config?.baseUrl;
};

export default resolveApiBaseUrl;
