// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {User} from '@thunderid/browser';
import getMappedUserProfileValue from './getMappedUserProfileValue';

/**
 * Get the display name of a user by mapping their profile attributes.
 *
 * @param mergedMappings - The merged attribute mappings.
 * @param user - The user object containing profile information.
 * @param displayAttributes - Optional array of attribute keys or paths to try first.
 *   Each entry is resolved via `getMappedUserProfileValue`. The first non-empty
 *   value found is returned. If none resolve, the default fallback chain is used.
 *
 * @example
 * ```ts
 * // Default behavior — tries firstName+lastName, then username, email, name
 * const displayName = getDisplayName(mergedMappings, user);
 *
 * // Custom attributes — try 'nickname' first, then fall back to defaults
 * const displayName = getDisplayName(mergedMappings, user, ['nickname']);
 *
 * // Multiple custom attributes
 * const displayName = getDisplayName(mergedMappings, user, ['preferred_username', 'nickname']);
 * ```
 *
 * @returns The display name of the user.
 */
const getDisplayName = (
  mergedMappings: Record<string, string | string[] | undefined>,
  user: User,
  displayAttributes?: string[],
): string => {
  const mappings: Record<string, string | string[]> = mergedMappings as Record<string, string | string[]>;
  if (displayAttributes && displayAttributes.length > 0) {
    let foundValue: string | undefined;
    displayAttributes.some((attr: string) => {
      const value: any = getMappedUserProfileValue(attr, mappings, user);

      if (value !== undefined && value !== null && value !== '') {
        foundValue = String(value);
        return true;
      }
      return false;
    });
    if (foundValue !== undefined) {
      return foundValue;
    }
  }

  const firstName: any = getMappedUserProfileValue('firstName', mappings, user);
  const lastName: any = getMappedUserProfileValue('lastName', mappings, user);

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return (
    getMappedUserProfileValue('username', mappings, user) ||
    getMappedUserProfileValue('email', mappings, user) ||
    getMappedUserProfileValue('name', mappings, user) ||
    'User'
  );
};

export default getDisplayName;
