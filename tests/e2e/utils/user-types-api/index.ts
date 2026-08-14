// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * User Types API Helper
 *
 * Thin wrapper over the backend `/user-types` endpoint. Owns the "resolve a user type by name"
 * lookup that the users API needs to create the shared E2E test user.
 *
 * Modeled on thunderid/tests/e2e/utils/user-types-api/index.ts.
 */

import {sendOk} from '../api-request';

export interface ApiUserType {
  id: string;
  name: string;
  ouId: string;
}

/** Every user type in the system. The list endpoint has no name filter, so this pages until done. */
export async function listUserTypes(): Promise<ApiUserType[]> {
  const pageSize = 100;
  const all: ApiUserType[] = [];

  for (let offset = 0; ; ) {
    const response = await sendOk('GET', `/user-types?limit=${pageSize}&offset=${offset}`);
    const body = (await response.json()) as {types?: ApiUserType[]; totalResults?: number};
    const page = body.types ?? [];
    all.push(...page);
    offset += page.length;
    if (page.length < pageSize || offset >= (body.totalResults ?? offset)) {
      return all;
    }
  }
}

export async function findUserTypeByName(name: string): Promise<ApiUserType | undefined> {
  const types = await listUserTypes();
  return types.find((type) => type.name === name);
}
