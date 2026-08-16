// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Global Teardown
 *
 * Deletes the shared E2E test user created in global-setup.ts. Looked up by username rather than
 * carried over in memory — global-setup and global-teardown run in separate processes.
 */

import {send} from './utils/api-request';

async function globalTeardown(): Promise<void> {
  const username = process.env.TEST_USER_USERNAME;
  if (!username) return;

  console.log('🧹 Deleting shared E2E test user...');
  const searchRes = await send('GET', `/users?attribute=username&value=${encodeURIComponent(username)}`);
  if (!searchRes.ok) {
    console.warn(`⚠️  Could not look up test user "${username}" for cleanup (HTTP ${searchRes.status})`);
    return;
  }
  const {users} = (await searchRes.json()) as {users?: {id: string}[]};
  const user = users?.[0];
  if (!user) {
    console.warn(`⚠️  Test user "${username}" not found — nothing to clean up`);
    return;
  }

  const deleteRes = await send('DELETE', `/users/${user.id}`);
  if (!deleteRes.ok) {
    // A leaked user breaks the *next* run outright — global-setup's createUser call hits a
    // username conflict with no clue why — so fail loudly here, at the point the leak actually
    // happens, instead of letting it surface as a confusing failure days later.
    throw new Error(`Failed to delete test user ${user.id}: HTTP ${deleteRes.status}: ${await deleteRes.text()}`);
  }
  console.log(`✓ Test user deleted: ${user.id}`);
}

export default globalTeardown;
