// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/require-await */
import {describe, expect, it} from 'vitest';
import AuthenticationHelper from '../AuthenticationHelper';
import resolveApiBaseUrl from '../resolveApiBaseUrl';
import resolveBackendEndpoints from '../resolveBackendEndpoints';

const ORIGIN = 'https://app.example.com';

describe('resolveBackendEndpoints', () => {
  it('returns undefined when sign-in does not run on a backend', () => {
    expect(resolveBackendEndpoints({baseUrl: 'https://auth.example.com'}, ORIGIN)).toBeUndefined();
    expect(resolveBackendEndpoints(undefined, ORIGIN)).toBeUndefined();
  });

  it('defaults every unset endpoint under /api/auth and the API base to the app origin', () => {
    expect(resolveBackendEndpoints({endpoints: {backend: {}}}, ORIGIN)).toEqual({
      apiBaseUrl: ORIGIN,
      bypass: {attachToken: true, urls: []},
      checkSession: '/api/auth/checksession',
      proxy: '/api/auth/proxy',
      refresh: '/api/auth/refresh',
      session: '/api/auth/session',
      signIn: '/api/auth/signin',
      signOut: '/api/auth/signout',
      token: '/api/auth/token',
    });
  });

  it('resolves endpoint paths against baseUrl, the backend, and uses it as the API base by default', () => {
    const resolved = resolveBackendEndpoints(
      {
        baseUrl: 'https://bff.example.com/',
        endpoints: {backend: {proxy: '/gateway/api/', session: '/gateway/me', signIn: '/gateway/signin'}},
      },
      ORIGIN,
    );

    expect(resolved?.signIn).toBe('https://bff.example.com/gateway/signin');
    expect(resolved?.session).toBe('https://bff.example.com/gateway/me');
    expect(resolved?.proxy).toBe('https://bff.example.com/gateway/api');
    expect(resolved?.signOut).toBe('https://bff.example.com/api/auth/signout');
    expect(resolved?.apiBaseUrl).toBe('https://bff.example.com');
  });

  it('uses absolute endpoint URLs as they are', () => {
    const resolved = resolveBackendEndpoints(
      {
        baseUrl: 'https://bff.example.com',
        endpoints: {backend: {checkSession: '//auth.example.com/check', session: 'https://auth.example.com/me'}},
      },
      ORIGIN,
    );

    expect(resolved?.session).toBe('https://auth.example.com/me');
    expect(resolved?.checkSession).toBe('//auth.example.com/check');
    expect(resolved?.refresh).toBe('https://bff.example.com/api/auth/refresh');
  });

  it('keeps endpoint paths relative to the app origin without baseUrl', () => {
    const resolved = resolveBackendEndpoints({baseUrl: '', endpoints: {backend: {session: '/gateway/me'}}}, ORIGIN);

    expect(resolved?.session).toBe('/gateway/me');
    expect(resolved?.apiBaseUrl).toBe(ORIGIN);
  });

  it('uses endpoints.backend.apiBaseUrl as the API base when set', () => {
    const resolved = resolveBackendEndpoints(
      {baseUrl: 'https://bff.example.com', endpoints: {backend: {apiBaseUrl: 'https://api.example.com/v1/'}}},
      ORIGIN,
    );

    expect(resolved?.apiBaseUrl).toBe('https://api.example.com/v1');
    expect(resolved?.proxy).toBe('https://bff.example.com/api/auth/proxy');
  });

  it('applies the token endpoint and the bypass, trimming its URLs', () => {
    const resolved = resolveBackendEndpoints(
      {
        endpoints: {
          backend: {bypass: {attachToken: false, urls: ['https://dp.example.com/api/']}, token: '/gateway/token'},
        },
      },
      ORIGIN,
    );

    expect(resolved?.token).toBe('/gateway/token');
    expect(resolved?.bypass).toEqual({attachToken: false, urls: ['https://dp.example.com/api']});
  });
});

describe('resolveApiBaseUrl', () => {
  it('is endpoints.backend.apiBaseUrl in backend mode, falling back to baseUrl', () => {
    expect(
      resolveApiBaseUrl({
        baseUrl: 'https://bff.example.com',
        endpoints: {backend: {apiBaseUrl: 'https://api.example.com'}},
      }),
    ).toBe('https://api.example.com');
    expect(resolveApiBaseUrl({baseUrl: 'https://bff.example.com', endpoints: {backend: {}}})).toBe(
      'https://bff.example.com',
    );
  });

  it('is baseUrl outside backend mode', () => {
    expect(resolveApiBaseUrl({baseUrl: 'https://auth.example.com'})).toBe('https://auth.example.com');
    expect(resolveApiBaseUrl(undefined)).toBeUndefined();
  });
});

describe('AuthenticationHelper OIDC endpoint overrides', () => {
  it('keeps the backend overrides out of the OIDC provider metadata', async () => {
    const storageManager = {
      getConfigData: async (): Promise<unknown> => ({
        endpoints: {backend: {session: '/x'}, token: 'https://auth.example.com/token'},
      }),
    };
    const helper = new AuthenticationHelper<any>(storageManager as any, {} as any);

    const resolved = await helper.resolveEndpoints({});

    expect(resolved.token).toBe('https://auth.example.com/token');
    expect(resolved).not.toHaveProperty('backend');
  });
});
