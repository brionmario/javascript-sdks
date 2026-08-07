// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {User, UpdateMeProfileConfig, AttributeSchema} from '@thunderid/browser';
import {Context, createContext} from 'react';

/**
 * Props interface of {@link UserContext}
 */
export interface UserContextProps {
  flattenedProfile: User | null;
  onUpdateProfile: (payload: User) => void;
  profile: User | null;
  revalidateProfile: () => Promise<void>;
  updateProfile: (
    requestConfig: UpdateMeProfileConfig,
    sessionId?: string,
  ) => Promise<{data: {user: User}; error: string; success: boolean}>;
  userSchema?: Record<string, AttributeSchema> | null;
}

/**
 * Context object for managing user profile data and related operations.
 */
const UserContext: Context<UserContextProps | null> = createContext<null | UserContextProps>({
  flattenedProfile: null,
  onUpdateProfile: () => null,
  profile: null,
  revalidateProfile: () => null as unknown as Promise<void>,
  updateProfile: () => null as unknown as Promise<{data: {user: User}; error: string; success: boolean}>,
  userSchema: null,
});

UserContext.displayName = 'UserContext';

export default UserContext;
