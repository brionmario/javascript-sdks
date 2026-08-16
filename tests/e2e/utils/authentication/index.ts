// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Admin token acquisition for the E2E suite's own API calls (declarative config import, test user
 * creation/cleanup) — not the sample apps' own sign-in flow under test, which each Page Object
 * drives through the real UI instead.
 *
 * In CI, `run-e2e.sh`/the workflow mints a token via the CONSOLE app (OAuth2 authorization_code +
 * PKCE, same as thunderid's own `.github/actions/obtain-admin-token`) and passes it through
 * `ADMIN_TOKEN`. Locally, this mints its own the same way, following the exact sequence
 * thunderid/tests/e2e/run-e2e.sh's `mint_admin_token` uses: authorize -> flow/execute (SSO
 * check) -> flow/execute (credentials) -> oauth2/auth/callback -> oauth2/token.
 */

import {createHash, randomBytes} from 'node:crypto';

const CONSOLE_CLIENT_ID = 'CONSOLE';

function base64url(input: Buffer): string {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

let tokenPromise: Promise<string> | undefined;

/** One admin token per process, memoized — every helper in the suite shares it. */
export function getAdminToken(): Promise<string> {
  tokenPromise ??= mintAdminToken().catch((error: unknown) => {
    tokenPromise = undefined;
    throw error;
  });
  return tokenPromise;
}

async function mintAdminToken(): Promise<string> {
  if (process.env.ADMIN_TOKEN) {
    return process.env.ADMIN_TOKEN;
  }

  const serverUrl = process.env.SERVER_URL ?? 'https://localhost:8090';
  const adminUsername = process.env.ADMIN_USERNAME ?? 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin';
  const redirectUri = `${serverUrl}/console`;

  const codeVerifier = base64url(randomBytes(32)).slice(0, 43);
  const codeChallenge = base64url(createHash('sha256').update(codeVerifier).digest());

  // Self-signed local/CI certs — same allowance run-e2e.sh's curl calls make with `-k`.
  const dispatcher = await getInsecureDispatcher();

  const authorizeUrl = new URL(`${serverUrl}/oauth2/authorize`);
  authorizeUrl.searchParams.set('client_id', CONSOLE_CLIENT_ID);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'system');
  authorizeUrl.searchParams.set('resource', `${serverUrl}/mcp`);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('code_challenge', codeChallenge);
  authorizeUrl.searchParams.set('code_challenge_method', 'S256');

  const authorizeRes = await fetch(authorizeUrl, {dispatcher, redirect: 'manual'} as RequestInit);
  const location = authorizeRes.headers.get('location');
  if (!location) {
    throw new Error(`No Location header from ${authorizeUrl.pathname}: HTTP ${authorizeRes.status}`);
  }
  const locationUrl = new URL(location, serverUrl);
  const authId = locationUrl.searchParams.get('authId');
  const executionId = locationUrl.searchParams.get('executionId');
  if (!authId || !executionId) {
    throw new Error(`Failed to parse authId/executionId from authorize redirect: ${location}`);
  }

  // First execute advances past the SSO check (a fresh, cookie-less login) to the credentials
  // prompt and mints a challenge token.
  const promptRes = await fetch(`${serverUrl}/flow/execute`, {
    body: JSON.stringify({executionId}),
    dispatcher,
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
  } as RequestInit);
  const promptData = (await promptRes.json()) as {challengeToken?: string};
  if (!promptData.challengeToken) {
    throw new Error(`Flow execution did not return a challenge token: ${JSON.stringify(promptData)}`);
  }

  const credsRes = await fetch(`${serverUrl}/flow/execute`, {
    body: JSON.stringify({
      action: 'action_001',
      challengeToken: promptData.challengeToken,
      executionId,
      inputs: {password: adminPassword, username: adminUsername},
    }),
    dispatcher,
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
  } as RequestInit);
  const credsData = (await credsRes.json()) as {assertion?: string};
  if (!credsData.assertion) {
    throw new Error(`Admin authentication failed: ${JSON.stringify(credsData)}`);
  }

  const callbackRes = await fetch(`${serverUrl}/oauth2/auth/callback`, {
    body: JSON.stringify({assertion: credsData.assertion, authId}),
    dispatcher,
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
  } as RequestInit);
  const callbackData = (await callbackRes.json()) as {redirect_uri?: string};
  const authCode = callbackData.redirect_uri ? new URL(callbackData.redirect_uri).searchParams.get('code') : null;
  if (!authCode) {
    throw new Error(`OAuth2 callback did not return an authorization code: ${JSON.stringify(callbackData)}`);
  }

  const tokenRes = await fetch(`${serverUrl}/oauth2/token`, {
    body: new URLSearchParams({
      client_id: CONSOLE_CLIENT_ID,
      code: authCode,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      resource: `${serverUrl}/mcp`,
    }),
    dispatcher,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method: 'POST',
  } as RequestInit);
  const tokenData = (await tokenRes.json()) as {access_token?: string};
  if (!tokenData.access_token) {
    throw new Error(`Failed to obtain admin access token: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

// Node's global fetch (undici) needs an explicit dispatcher to skip TLS verification for the
// backend's self-signed local/CI cert — equivalent to curl's `-k` in run-e2e.sh. Loaded lazily so
// `undici` is only required when actually minting a token (not when ADMIN_TOKEN is preset).
async function getInsecureDispatcher(): Promise<unknown> {
  const {Agent} = await import('undici');
  return new Agent({connect: {rejectUnauthorized: false}});
}
