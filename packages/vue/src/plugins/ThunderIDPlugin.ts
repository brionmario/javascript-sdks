// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {App, Plugin} from 'vue';
import ThunderIDProvider from '../providers/ThunderIDProvider';
import {injectStyles} from '../styles/injectStyles';

/**
 * Options accepted by {@link ThunderIDPlugin}.
 *
 * @example Browser SPA (default behaviour — no options needed)
 * ```ts
 * app.use(ThunderIDPlugin);
 * ```
 *
 * @example Delegated mode (e.g. @thunderid/nuxt)
 * ```ts
 * // The host framework is responsible for providing all injection context
 * // via app.provide().  The plugin skips browser-only initialisation so it
 * // can run safely in SSR environments.
 * app.use(ThunderIDPlugin, { mode: 'delegated' });
 * ```
 */
export interface ThunderIDPluginOptions {
  /**
   * `'browser'` (default) — full browser PKCE flow, registers `<ThunderIDProvider>`.
   * `'delegated'` — the host framework (e.g. `@thunderid/nuxt`) provides all
   * injection context via `app.provide()`.  The plugin skips browser-only
   * initialisation so it is safe to call during SSR.
   */
  mode?: 'browser' | 'delegated';

  /**
   * Vendor/brand namespace used to prefix the injected `<style>` element's dedupe id.
   * Should match the `vendor` passed to `<ThunderIDProvider>`. Defaults to `VendorConstants.VENDOR_PREFIX`.
   */
  vendor?: string;

  /**
   * CSP nonce applied to the SDK's runtime-injected `<style>` tag, for apps that enforce
   * a strict `style-src` Content-Security-Policy directive (i.e. without `'unsafe-inline'`).
   */
  cspNonce?: string;
}

/**
 * Vue plugin for ThunderID authentication.
 *
 * Registers the `<ThunderIDProvider>` component globally so it can be used
 * anywhere in the application without explicit imports.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue';
 * import { ThunderIDPlugin } from '@thunderid/vue';
 * import App from './App.vue';
 *
 * const app = createApp(App);
 * app.use(ThunderIDPlugin);
 * app.mount('#app');
 * ```
 *
 * Then in your root component:
 * ```vue
 * <template>
 *   <ThunderIDProvider :base-url="baseUrl" :client-id="clientId">
 *     <router-view />
 *   </ThunderIDProvider>
 * </template>
 * ```
 */
const ThunderIDPlugin: Plugin<[ThunderIDPluginOptions?]> = {
  install(app: App, options?: ThunderIDPluginOptions): void {
    injectStyles(options?.vendor, options?.cspNonce);

    if (options?.mode === 'delegated') {
      // In delegated mode the host framework is responsible for providing all
      // injection context (THUNDERID_KEY, USER_KEY, …) via app.provide() and
      // for registering its own root component.
      return;
    }
    app.component('ThunderIDProvider', ThunderIDProvider);
  },
};

export default ThunderIDPlugin;
