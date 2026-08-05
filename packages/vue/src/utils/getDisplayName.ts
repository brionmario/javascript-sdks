// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {User} from '@thunderid/browser';
import getMappedUserProfileValue from './getMappedUserProfileValue';

const getDisplayName = (
  mergedMappings: Record<string, string | string[] | undefined>,
  user: User,
  displayAttributes?: string[],
): string => {
  if (displayAttributes && displayAttributes.length > 0) {
    let foundValue: string | undefined;
    displayAttributes.some((attr: string) => {
      const value: any = getMappedUserProfileValue(attr, mergedMappings as Record<string, string | string[]>, user);
      if (value !== undefined && value !== null && value !== '') {
        foundValue = String(value);
        return true;
      }
      return false;
    });
    if (foundValue !== undefined) return foundValue;
  }

  const mappings: Record<string, string | string[]> = mergedMappings as Record<string, string | string[]>;
  const firstName: any = getMappedUserProfileValue('firstName', mappings, user);
  const lastName: any = getMappedUserProfileValue('lastName', mappings, user);

  if (firstName && lastName) return `${firstName} ${lastName}`;

  return (
    getMappedUserProfileValue('username', mappings, user) ||
    getMappedUserProfileValue('email', mappings, user) ||
    getMappedUserProfileValue('name', mappings, user) ||
    'User'
  );
};

export default getDisplayName;
