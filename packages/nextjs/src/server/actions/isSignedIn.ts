// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use server';

import getSessionId from './getSessionId';
import getSessionPayload from './getSessionPayload';
import {SessionTokenPayload} from '../../utils/SessionManager';
import getClient from '../getClient';

/**
 * Check if the user is currently signed in.
 *
 * For JWT-based sessions: the session JWT exp claim is now tied to the access
 * token expiry. A successful jwtVerify (inside getSessionPayload) already proves
 * exp > now, so no separate timestamp comparison is needed here.
 *
 * Falls back to the legacy SDK in-memory check when no JWT session cookie exists.
 *
 * @param sessionId - Optional session ID (used only for the legacy fallback path)
 * @returns True if the user is signed in with a valid, non-expired token
 */
const isSignedIn = async (sessionId?: string): Promise<boolean> => {
  try {
    const sessionPayload: SessionTokenPayload | undefined = await getSessionPayload();

    if (sessionPayload) {
      return true;
    }

    // No JWT session — fall back to the legacy SDK in-memory store check.
    const resolvedSessionId: string | undefined = sessionId || (await getSessionId());

    if (!resolvedSessionId) {
      return false;
    }

    const client = getClient();

    try {
      const accessToken: string = await client.getAccessToken(resolvedSessionId);
      return !!accessToken;
    } catch {
      return false;
    }
  } catch {
    return false;
  }
};

export default isSignedIn;
