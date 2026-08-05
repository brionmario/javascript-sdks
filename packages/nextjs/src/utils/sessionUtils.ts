// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {NextRequest} from 'next/server';
import SessionManager, {SessionTokenPayload} from './SessionManager';

/**
 * Checks if a request has a valid session cookie (JWT).
 * This verifies the JWT signature and expiration.
 *
 * @param request - The Next.js request object
 * @returns True if a valid session exists, false otherwise
 */
export const hasValidSession = async (request: NextRequest): Promise<boolean> => {
  try {
    const sessionToken: string | undefined = request.cookies.get(SessionManager.getSessionCookieName())?.value;
    if (!sessionToken) {
      return false;
    }

    await SessionManager.verifySessionToken(sessionToken);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets the session payload from the request cookies.
 * This includes user ID, session ID, and scopes.
 *
 * @param request - The Next.js request object
 * @returns The session payload if valid, undefined otherwise
 */
export const getSessionFromRequest = async (request: NextRequest): Promise<SessionTokenPayload | undefined> => {
  try {
    const sessionToken: string | undefined = request.cookies.get(SessionManager.getSessionCookieName())?.value;
    if (!sessionToken) {
      return undefined;
    }

    return await SessionManager.verifySessionToken(sessionToken);
  } catch {
    return undefined;
  }
};

/**
 * Gets the session ID from the request cookies (legacy support).
 * First tries to get from JWT session, then falls back to legacy session ID cookie.
 *
 * @param request - The Next.js request object
 * @returns The session ID if it exists, undefined otherwise
 */
export const getSessionIdFromRequest = async (request: NextRequest): Promise<string | undefined> => {
  try {
    const sessionPayload: SessionTokenPayload | undefined = await getSessionFromRequest(request);

    if (sessionPayload) {
      return sessionPayload.sessionId;
    }

    return await Promise.resolve(undefined);
  } catch {
    return Promise.resolve(undefined);
  }
};

/**
 * Gets the temporary session ID from request cookies.
 *
 * @param request - The Next.js request object
 * @returns The temporary session ID if valid, undefined otherwise
 */
export const getTempSessionFromRequest = async (request: NextRequest): Promise<string | undefined> => {
  try {
    const tempToken: string | undefined = request.cookies.get(SessionManager.getTempSessionCookieName())?.value;
    if (!tempToken) {
      return undefined;
    }

    const tempSession: {sessionId: string} = await SessionManager.verifyTempSession(tempToken);
    return tempSession.sessionId;
  } catch {
    return undefined;
  }
};
