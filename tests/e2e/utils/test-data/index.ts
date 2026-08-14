// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Test data generators, so parallel runs never collide on username/email.
 *
 * Modeled on thunderid/tests/e2e/utils/test-data/index.ts.
 */

import {randomBytes} from 'node:crypto';

export interface UserData {
  email: string;
  family_name: string;
  given_name: string;
  password: string;
  username: string;
}

function generateUniqueId(prefix: string): string {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString('hex')}`;
}

export const TestDataFactory = {
  createUser(overrides?: Partial<UserData>): UserData {
    const uniqueId = generateUniqueId('e2e');
    return {
      email: `${uniqueId}@example.com`,
      family_name: `Last_${uniqueId}`,
      given_name: `First_${uniqueId}`,
      password: process.env.TEST_USER_PASSWORD ?? 'E2ePassword@123',
      username: `${uniqueId}`,
      ...overrides,
    };
  },
};
