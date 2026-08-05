// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {VendorConstants} from '@thunderid/node';
import type {H3Event} from 'h3';
import type {ThunderIDNuxtConfig, ThunderIDSessionPayload, ThunderIDSSRData} from '../../types';
import {useRuntimeConfig} from '#imports';

/**
 * The typed shape of `event.context[vendor]` (default vendor: `'thunderid'`,
 * i.e. `event.context.thunderid`) set by the ThunderID Nitro plugin on every
 * SSR request.
 */
export interface ThunderIDEventContext {
  /** Convenience boolean derived from the session presence. */
  isSignedIn: boolean;
  /** The decoded session payload, or null when the user is not signed in. */
  session: ThunderIDSessionPayload | null;
  /** SSR-prefetched data (user profile, orgs, branding). Present only after the SSR plugin runs. */
  ssr?: ThunderIDSSRData;
}

/**
 * Typed accessor for `event.context[vendor]` (default: `event.context.thunderid`).
 *
 * Resolves the vendor namespace from `runtimeConfig.public.thunderid.vendor`
 * (falling back to `'thunderid'`) so this always reads the same key the
 * ThunderID Nitro plugin (`thunderid-ssr.ts`) writes to.
 *
 * Returns null when called before the ThunderID SSR plugin has populated
 * the context (e.g. in non-Nuxt Nitro routes that run before the plugin).
 *
 * @example
 * ```ts
 * import { getThunderIDContext } from '@thunderid/nuxt/server';
 *
 * export default defineEventHandler((event) => {
 *   const ctx = getThunderIDContext(event);
 *   if (!ctx?.isSignedIn) throw createError({ statusCode: 401 });
 *   return { userId: ctx.session!.sub };
 * });
 * ```
 */
export function getThunderIDContext(event: H3Event): ThunderIDEventContext | null {
  const publicConfig: ThunderIDNuxtConfig | undefined = useRuntimeConfig(event).public.thunderid as
    | ThunderIDNuxtConfig
    | undefined;
  const vendor: string = publicConfig?.vendor ?? VendorConstants.VENDOR_PREFIX;

  return ((event.context as Record<string, unknown>)[vendor] as ThunderIDEventContext | undefined) ?? null;
}
