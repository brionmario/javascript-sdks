// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {defineEventHandler} from 'h3';
import type {H3Event} from 'h3';
import {getValidAccessToken} from '../../../utils/token-refresh';

/**
 * GET /api/auth/token
 *
 * Returns a valid access token for the current session.
 * Proactively refreshes the token if it is within 60 seconds of expiry
 * (requires a refresh token stored in the session JWT).
 * Returns 401 if there is no active session or the token cannot be refreshed.
 */
export default defineEventHandler(async (event: H3Event): Promise<{accessToken: string}> => {
  const accessToken: string = await getValidAccessToken(event);
  return {accessToken};
});
