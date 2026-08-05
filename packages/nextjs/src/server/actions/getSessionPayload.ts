// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use server';

import {cookies} from 'next/headers';
import SessionManager, {SessionTokenPayload} from '../../utils/SessionManager';

type RequestCookies = Awaited<ReturnType<typeof cookies>>;

/**
 * Get the session payload from JWT session cookie.
 * This includes user ID, session ID, scopes, and organization ID.
 *
 * @returns The session payload if valid JWT session exists, undefined otherwise
 */
const getSessionPayload = async (): Promise<SessionTokenPayload | undefined> => {
  const cookieStore: RequestCookies = await cookies();

  const sessionToken: string | undefined = cookieStore.get(SessionManager.getSessionCookieName())?.value;
  if (!sessionToken) {
    return undefined;
  }

  try {
    return await SessionManager.verifySessionToken(sessionToken);
  } catch {
    return undefined;
  }
};

export default getSessionPayload;
