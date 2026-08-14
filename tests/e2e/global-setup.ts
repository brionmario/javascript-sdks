// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Global Setup
 *
 * Runs once before the whole suite. Creates the one shared E2E test user every sample app spec
 * signs in as (see constants/timeouts.ts's SUITE_SETUP budget) — the OAuth *clients* are
 * per-app (thunderid-config/sample-apps.yaml), but there's no reason to provision a separate user
 * per app for the same identity signing into different client apps.
 *
 * Modeled on thunderid/tests/e2e/global-setup.ts.
 */

import path from 'node:path';
import dotenv from 'dotenv';
import {createUser} from './utils/users-api';

async function globalSetup(): Promise<void> {
  dotenv.config({path: path.resolve(import.meta.dirname, '.env')});
  dotenv.config({path: path.resolve(import.meta.dirname, 'defaults.env')});

  const required = ['SERVER_URL', 'ADMIN_USERNAME', 'ADMIN_PASSWORD', 'TEST_USER_USERNAME', 'TEST_USER_PASSWORD'];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Copy defaults.env to .env, or export these before running the suite.');
    process.exit(1);
  }

  console.log('🚀 Creating shared E2E test user...');
  const user = await createUser({
    email: `${process.env.TEST_USER_USERNAME}@example.com`,
    family_name: 'E2E',
    given_name: 'Test',
    password: process.env.TEST_USER_PASSWORD,
    username: process.env.TEST_USER_USERNAME,
  });
  console.log(`✓ Test user ready: ${user.id}`);
}

export default globalSetup;
