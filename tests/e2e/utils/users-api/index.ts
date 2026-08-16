// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Users API Helper
 *
 * Thin wrapper over the backend `/users` endpoint for E2E setup/teardown — creating the shared
 * test user before the suite runs and deleting it afterward.
 *
 * Modeled on thunderid/tests/e2e/utils/users-api/index.ts.
 */

import {send, sendOk} from '../api-request';
import {findUserTypeByName} from '../user-types-api';

export interface ApiUser {
  id: string;
  ouId: string;
  type: string;
}

/** Create a user directly via the API, bypassing any UI. */
export async function createUser(attributes: Record<string, unknown>, type = 'Person'): Promise<ApiUser> {
  const userType = await findUserTypeByName(type);
  if (!userType) {
    throw new Error(`GET /user-types returned no "${type}" user type`);
  }
  const response = await sendOk('POST', '/users', {
    attributes,
    ouId: userType.ouId,
    type: userType.name,
  });
  return (await response.json()) as ApiUser;
}

/** Delete a user by id. Returns false (rather than throwing) if the delete failed. */
export async function deleteUser(userId: string): Promise<boolean> {
  const response = await send('DELETE', `/users/${userId}`);
  return response.ok;
}
