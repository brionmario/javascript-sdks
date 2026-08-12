// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import ThunderIDBrowserClient from '../ThunderIDBrowserClient';

vi.mock('../utils/navigate', () => ({default: vi.fn()}));

const BASE_CONFIG = {
  baseUrl: 'https://example.com',
  clientId: 'test-client',
  rpInitiatedLogout: false,
  signInUrl: 'https://example.com/sign-in',
  storage: 'browserMemory',
} as any;

const REVOCATION_ENDPOINT = 'https://example.com/oauth2/revoke';

async function initClient(overrides: Record<string, unknown> = {}): Promise<ThunderIDBrowserClient> {
  const client = new ThunderIDBrowserClient();
  await client.initialize({...BASE_CONFIG, ...overrides});
  const sm = (client as any).getStorageManager();
  await sm.setOIDCProviderMetaData({revocation_endpoint: REVOCATION_ENDPOINT});
  await sm.setTemporaryDataParameter('op_config_initiated', true);
  await sm.setSessionData({access_token: 'stored-access-token'});

  return client;
}

function mockFetchOnce(ok = true, status = 200): {resolve: () => void} {
  let resolveFetch: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    resolveFetch = resolve;
  });

  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          pending.then(() =>
            resolve({
              json: () => Promise.resolve({}),
              ok,
              status,
              statusText: ok ? 'OK' : 'Bad Request',
            }),
          );
        }),
    ),
  );

  return {resolve: resolveFetch};
}

describe('ThunderIDBrowserClient signOut()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('completes sign out without waiting for a slow revocation_endpoint to respond', async () => {
    const client = await initClient({tokenLifecycle: {revokeToken: {revokeOnSignOut: true}}});
    // Never resolved during this test — if signOut() awaited the revocation response, it would hang.
    mockFetchOnce();

    const afterSignOutUrl = await client.signOut();

    expect(afterSignOutUrl).toBe(window.location.origin);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it('sends the access token captured before session clearing, not a post-clear read', async () => {
    const client = await initClient({tokenLifecycle: {revokeToken: {revokeOnSignOut: true}}});
    const {resolve} = mockFetchOnce();

    await client.signOut();
    resolve();
    await vi.waitFor(() => expect((fetch as any).mock.calls.length).toBe(1));

    const [, requestInit] = (fetch as any).mock.calls[0];
    expect(requestInit.body).toContain('token=stored-access-token');
  });

  it('does not call the revocation endpoint when revokeOnSignOut is not enabled', async () => {
    const client = await initClient();
    mockFetchOnce();

    await client.signOut();

    expect(fetch).not.toHaveBeenCalled();
  });
});
