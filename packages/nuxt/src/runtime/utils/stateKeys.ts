// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {VendorConstants} from '@thunderid/node';

/**
 * Shared `useState` key for the ThunderID auth state (`ThunderIDAuthState`).
 *
 * Must stay in sync across `runtime/plugins/thunderid.ts`,
 * `runtime/components/ThunderIDRoot.ts`, and
 * `runtime/middleware/defineThunderIDMiddleware.ts` — all three must resolve
 * the same `vendor` (from `useRuntimeConfig().public.thunderid.vendor`) to
 * read/write the same reactive state.
 */
export const getAuthStateKey = (vendor: string = VendorConstants.VENDOR_PREFIX): string => `${vendor}:auth`;

/**
 * Shared `useState` key for the SSR-hydrated user profile (`UserProfile | null`).
 *
 * Must stay in sync across the same three files as {@link getAuthStateKey}.
 */
export const getUserProfileStateKey = (vendor: string = VendorConstants.VENDOR_PREFIX): string =>
  `${vendor}:user-profile`;
