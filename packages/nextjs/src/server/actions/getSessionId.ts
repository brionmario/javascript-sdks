// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use server';

import {cookies} from 'next/headers';
import {getChunkedCookie} from '../../utils/chunkedCookie';
import SessionManager, {SessionTokenPayload} from '../../utils/SessionManager';

type RequestCookies = Awaited<ReturnType<typeof cookies>>;

/**
 * Get the session ID from cookies.
 * Tries JWT session first, then falls back to legacy session ID.
 *
 * @returns The session ID if it exists, undefined otherwise
 */
const getSessionId = async (): Promise<string | undefined> => {
  const cookieStore: RequestCookies = await cookies();

  const sessionToken: string | undefined = getChunkedCookie(cookieStore, SessionManager.getSessionCookieName());

  if (sessionToken) {
    try {
      const sessionPayload: SessionTokenPayload = await SessionManager.verifySessionToken(sessionToken);

      return sessionPayload.sessionId;
    } catch (error) {
      return undefined;
    }
  }

  return undefined;
};

export default getSessionId;
