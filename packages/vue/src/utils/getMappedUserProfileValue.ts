// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {User, get} from '@thunderid/browser';

const getMappedUserProfileValue = (key: string, mappings: Record<string, string | string[]>, user: User): any => {
  if (!key || !mappings || !user) return undefined;

  const mapping: string | string[] = mappings[key];

  if (!mapping) return get(user, key);

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

  return get(user, mapping);
};

export default getMappedUserProfileValue;
