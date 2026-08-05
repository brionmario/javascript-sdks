// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {User, get} from '@thunderid/browser';

/**
 * Retrieves a user profile value based on attribute mapping configuration.
 *
 * This function allows flexible mapping of component attribute names to actual
 * user profile field paths. It supports both simple string mappings and arrays
 * of potential field paths for fallback scenarios.
 *
 * @param key - The logical attribute name to retrieve (e.g., 'firstName', 'email')
 * @param mappings - Object mapping logical names to user profile field paths
 * @param user - The user object to extract values from
 * @returns The mapped value from the user profile, or undefined if not found
 *
 * @example
 * ```typescript
 * const mappings = {
 *   firstName: 'name.givenName',
 *   email: 'emails[0]',
 *   picture: ['profileUrl', 'profile', 'avatar'] // fallback options
 * };
 *
 * const user = {
 *   name: { givenName: 'John' },
 *   emails: ['john@example.com'],
 *   profileUrl: 'https://example.com/avatar.jpg'
 * };
 *
 * getMappedUserProfileValue('firstName', mappings, user); // 'John'
 * getMappedUserProfileValue('email', mappings, user); // 'john@example.com'
 * getMappedUserProfileValue('picture', mappings, user); // 'https://example.com/avatar.jpg'
 * ```
 */
const getMappedUserProfileValue = (key: string, mappings: Record<string, string | string[]>, user: User): any => {
  if (!key || !mappings || !user) {
    return undefined;
  }

  const mapping: string | string[] = mappings[key];

  if (!mapping) {
    // If no mapping defined, try to get the value directly from the user object
    return get(user, key);
  }

  // If mapping is an array, try each path until we find a value
  if (Array.isArray(mapping)) {
    let foundValue: any;
    let found = false;
    mapping.some((path: string) => {
      const value: any = get(user, path);
      if (value !== undefined && value !== null && value !== '') {
        foundValue = value;
        found = true;
        return true;
      }
      return false;
    });
    return found ? foundValue : undefined;
  }

  // For single string mapping, get the value directly
  return get(user, mapping);
};

export default getMappedUserProfileValue;
