// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {UpdateMeProfileConfig, User, UserProfile, AttributeSchema} from '@thunderid/browser';
import {FC, PropsWithChildren, ReactElement, useMemo} from 'react';
import UserContext from './UserContext';

/**
 * Props interface of {@link UserProvider}
 */
export interface UserProviderProps {
  onUpdateProfile?: (payload: User) => void;
  profile: UserProfile & {userSchema?: Record<string, AttributeSchema> | null};
  revalidateProfile?: () => Promise<void>;
  updateProfile?: (
    requestConfig: UpdateMeProfileConfig,
    sessionId?: string,
  ) => Promise<{data: {user: User}; error: string; success: boolean}>;
  userSchema?: Record<string, AttributeSchema> | null;
}

/**
 * UserProvider component that manages user profile data and provides it through UserContext.
 *
 * This provider:
 * - Fetches user profile data from the ME endpoint
 * - Generates both nested and flattened user profiles
 * - Provides functions for refreshing and updating user data
 * - Handles loading states and errors
 *
 * @example
 * ```tsx
 * // Basic usage
 * <UserProvider>
 *   <App />
 * </UserProvider>
 *
 * // With custom error handling
 * <UserProvider onError={(error) => console.error('User error:', error)}>
 *   <App />
 * </UserProvider>
 *
 * // Disable auto-fetch (fetch manually using refreshUser)
 * <UserProvider autoFetch={false}>
 *   <App />
 * </UserProvider>
 * ```
 */
const UserProvider: FC<PropsWithChildren<UserProviderProps>> = ({
  children,
  profile,
  revalidateProfile,
  onUpdateProfile,
  updateProfile,
  userSchema,
}: PropsWithChildren<UserProviderProps>): ReactElement => {
  const contextValue: any = useMemo(
    () => ({
      flattenedProfile: profile?.flattenedProfile,
      onUpdateProfile,
      profile: profile?.profile,
      revalidateProfile,
      updateProfile,
      userSchema: profile?.userSchema ?? userSchema ?? null,
    }),
    [profile, onUpdateProfile, revalidateProfile, updateProfile, userSchema],
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default UserProvider;
