// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Global Teardown
 *
 * Deletes the shared E2E test user and the dedicated credential-test users created in
 * global-setup.ts. Looked up by username rather than carried over in memory — global-setup and
 * global-teardown run in separate processes.
 */

import {CredentialTestUserApps, credentialTestUser} from './constants/credential-test-users';
import {send} from './utils/api-request';

async function deleteUserByUsername(username: string | undefined, label: string): Promise<void> {
  const filter = `username eq "${username}"`;
  const searchRes = await send('GET', `/users?filter=${encodeURIComponent(filter)}`);
  if (!searchRes.ok) {
    throw new Error(
      `Failed to look up ${label} "${username}" for cleanup: HTTP ${searchRes.status}: ${await searchRes.text()}`,
    );
  }
  const {users} = (await searchRes.json()) as {users?: {attributes?: {username?: string}; id: string}[]};
  const matches = (users ?? []).filter((candidate) => candidate.attributes?.username === username);
  if (matches.length === 0) {
    console.warn(`⚠️  ${label} "${username}" not found — nothing to clean up`);
    return;
  }
  const user = matches[0];

  const deleteRes = await send('DELETE', `/users/${user.id}`);
  if (!deleteRes.ok) {
    // A leaked user breaks the *next* run outright — global-setup's createUser call hits a
    // username conflict with no clue why — so fail loudly here, at the point the leak actually
    // happens, instead of letting it surface as a confusing failure days later.
    throw new Error(`Failed to delete ${label} ${user.id}: HTTP ${deleteRes.status}: ${await deleteRes.text()}`);
  }
  console.log(`✓ ${label} deleted: ${user.id}`);
}

async function globalTeardown(): Promise<void> {
  console.log('🧹 Deleting shared E2E test user...');
  await deleteUserByUsername(process.env.TEST_USER_USERNAME, 'Test user');

  console.log('🧹 Deleting dedicated credential-test users...');
  await Promise.all(
    CredentialTestUserApps.map((app) =>
      deleteUserByUsername(credentialTestUser(app).username, `Credential test user (${app})`),
    ),
  );
}

export default globalTeardown;
