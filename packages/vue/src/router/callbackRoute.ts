// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {type Component, defineComponent, h} from 'vue';
import Callback from '../components/auth/Callback';

/**
 * Options for creating a callback route.
 */
export interface CallbackRouteOptions {
  /**
   * The route name. If not provided, no name is set on the route record.
   */
  name?: string;

  /**
   * Optional error handler called when the OAuth callback encounters an error.
   */
  onError?: (error: Error) => void;

  /**
   * The URL path for the callback route.
   * @default '/callback'
   */
  path?: string;
}

/**
 * A minimal route record type compatible with Vue Router's `RouteRecordRaw`.
 *
 * This avoids a hard dependency on `vue-router` while remaining structurally compatible.
 */
export interface ThunderIDRouteRecord {
  component: ReturnType<typeof defineComponent>;
  meta?: Record<string, unknown>;
  name?: string;
  path: string;
}

/**
 * Creates a Vue Router route record for the OAuth2 callback.
 *
 * The generated route renders the `<Callback>` component which extracts OAuth parameters
 * (code, state, error) from the URL and redirects the user back to the original path.
 *
 * **Requires `vue-router` as a peer dependency.**
 *
 * @param options - Callback route configuration.
 * @returns A route record compatible with Vue Router's `RouteRecordRaw`.
 *
 * @example
 * ```typescript
 * import { createRouter, createWebHistory } from 'vue-router';
 * import { createCallbackRoute } from '@thunderid/vue';
 *
 * const router = createRouter({
 *   history: createWebHistory(),
 *   routes: [
 *     createCallbackRoute({ path: '/callback' }),
 *     { path: '/', component: Home },
 *     { path: '/dashboard', component: Dashboard },
 *   ],
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With error handling and Vue Router navigation
 * import { useRouter } from 'vue-router';
 *
 * createCallbackRoute({
 *   path: '/auth/callback',
 *   name: 'oauth-callback',
 *   onError: (error) => console.error('OAuth error:', error),
 * });
 * ```
 */
export const createCallbackRoute = (options: CallbackRouteOptions = {}): ThunderIDRouteRecord => {
  const {path = '/callback', name, onError} = options;

  const CallbackWrapper: Component = defineComponent({
    name: 'ThunderIDCallbackRoute',
    setup() {
      return (): ReturnType<typeof h> =>
        h(Callback, {
          ...(onError && {onError}),
        });
    },
  });

  return {
    ...(name && {name}),
    component: CallbackWrapper,
    meta: {isThunderIDCallback: true},
    path,
  };
};

export default createCallbackRoute;
