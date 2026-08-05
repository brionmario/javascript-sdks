// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {UserProfile} from '@thunderid/node';
import {defineEventHandler, createError} from 'h3';
import type {H3Event} from 'h3';
import ThunderIDNuxtClient from '../../../ThunderIDNuxtClient';
import {verifyAndRehydrateSession} from '../../../utils/serverSession';
import {useRuntimeConfig} from '#imports';

/**
 * GET /api/auth/user/profile
 *
 * Returns the full {@link UserProfile} (with `flattenedProfile`) for the authenticated user.  Used by `ThunderIDRoot.revalidateProfile`
 * to refresh client-side state after a profile update.
 *
 * Mirrors `getUserProfileAction` in the Next.js SDK.
 */
export default defineEventHandler(async (event: H3Event): Promise<UserProfile> => {
  const config: ReturnType<typeof useRuntimeConfig> = useRuntimeConfig();
  const sessionSecret: string | undefined = config.thunderid?.sessionSecret;

  const session: Awaited<ReturnType<typeof verifyAndRehydrateSession>> = await verifyAndRehydrateSession(
    event,
    sessionSecret,
  );
  if (!session) {
    throw createError({statusCode: 401, statusMessage: 'Unauthorized: Invalid or expired session.'});
  }

  try {
    const client: ThunderIDNuxtClient = ThunderIDNuxtClient.getInstance();
    return await client.getUserProfile(session.sessionId);
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to retrieve user profile: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
});
