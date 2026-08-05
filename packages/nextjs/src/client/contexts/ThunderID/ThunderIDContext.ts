// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import {ThunderIDContextProps as ReactContextProps} from '@thunderid/react';
import {Context, createContext} from 'react';
import {RefreshResult} from '../../../server/actions/refreshToken';

/**
 * Props interface of {@link ThunderIDContext}
 */
export type ThunderIDContextProps = Partial<ReactContextProps> & {
  clearSession?: () => Promise<void>;
  refreshToken?: () => Promise<RefreshResult>;
};

/**
 * Context object for managing the Authentication flow builder core context.
 */
const ThunderIDContext: Context<ThunderIDContextProps | null> = createContext<null | ThunderIDContextProps>({
  afterSignInUrl: undefined,
  applicationId: undefined,
  baseUrl: undefined,
  clearSession: () => Promise.resolve(),
  isInitialized: false,
  isLoading: true,
  isSignedIn: false,
  organizationHandle: undefined,
  refreshToken: () => Promise.resolve({expiresAt: 0}),
  signIn: () => Promise.resolve({} as any),
  signInUrl: undefined,
  signOut: () => Promise.resolve({} as any),
  signUp: () => Promise.resolve({} as any),
  signUpUrl: undefined,
  user: null,
});

ThunderIDContext.displayName = 'ThunderIDContext';

export default ThunderIDContext;
