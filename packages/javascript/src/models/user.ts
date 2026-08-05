// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export interface KnownUser {
  displayName?: string;
  email?: string;
  familyName?: string;
  givenName?: string;
  username?: string;
}

export interface User extends KnownUser {
  [key: string]: any;
}

export interface UserProfile {
  flattenedProfile: User;
  profile: User;
}
