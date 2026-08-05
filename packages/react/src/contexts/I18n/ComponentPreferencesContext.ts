// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Preferences} from '@thunderid/browser';
import {Context, createContext} from 'react';

/**
 * Context for component-level preferences overrides.
 * Presentational components can provide this context to override the global i18n
 * and theme settings for their entire subtree, including all nested components.
 */
const ComponentPreferencesContext: Context<Preferences | undefined> = createContext<Preferences | undefined>(undefined);

export default ComponentPreferencesContext;
