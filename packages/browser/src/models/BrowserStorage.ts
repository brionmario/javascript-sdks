// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Supported browser storage backends for auth session data.
 */
export enum BrowserStorage {
  /** Store session data in `localStorage` (persists across tabs and sessions). */
  LocalStorage = 'localStorage',
  /** Store session data in `sessionStorage` (cleared when the tab is closed). */
  SessionStorage = 'sessionStorage',
  /** Store session data in in-memory (cleared on page reload). */
  BrowserMemory = 'browserMemory',
}

export default BrowserStorage;
