// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import ThunderIDContext, {ThunderIDContextProps} from '../ThunderIDContext';
import useThunderID from '../useThunderID';

function createMockContext(overrides: Partial<ThunderIDContextProps> = {}): ThunderIDContextProps {
  return {
    afterSignInUrl: undefined,
    applicationId: undefined,
    baseUrl: undefined,
    clientId: undefined,
    scopes: undefined,
    discovery: {wellKnown: null},
    exchangeToken: vi.fn(),
    getAccessToken: vi.fn(),
    getDecodedIdToken: vi.fn(),
    getIdToken: vi.fn(),
    getStorageManager: vi.fn(),
    http: {request: vi.fn(), requestAll: vi.fn()},
    instanceId: 0,
    isInitialized: false,
    isLoading: false,
    isMetaLoading: false,
    isSignedIn: false,
    meta: null,
    organizationHandle: undefined,
    reInitialize: vi.fn(),
    recover: vi.fn(),
    resolveFlowTemplateLiterals: vi.fn((t: string | undefined) => t ?? ''),
    signIn: vi.fn(),
    signInOptions: undefined,
    signInSilently: vi.fn(),
    signInUrl: undefined,
    signOut: vi.fn(),
    signUp: vi.fn(),
    signUpUrl: undefined,
    storage: undefined,
    user: null,
    ...overrides,
  } as unknown as ThunderIDContextProps;
}

function TestConsumer({onResult}: {onResult: (ctx: ThunderIDContextProps) => void}) {
  const ctx = useThunderID();
  onResult(ctx);
  return <div data-testid="consumer">ok</div>;
}

afterEach(() => {
  cleanup();
});

describe('useThunderID', () => {
  it('returns the context value when inside a provider', () => {
    const ctx = createMockContext();
    let captured: ThunderIDContextProps | undefined;

    render(
      <ThunderIDContext.Provider value={ctx}>
        <TestConsumer onResult={(c) => (captured = c)} />
      </ThunderIDContext.Provider>,
    );

    expect(screen.getByTestId('consumer')).toBeDefined();
    expect(captured).toBeDefined();
    expect(captured!.isSignedIn).toBe(false);
    expect(captured!.isInitialized).toBe(false);
  });

  it('exposes scopes from context', () => {
    const ctx = createMockContext({scopes: ['openid', 'profile']});
    let captured: ThunderIDContextProps | undefined;

    render(
      <ThunderIDContext.Provider value={ctx}>
        <TestConsumer onResult={(c) => (captured = c)} />
      </ThunderIDContext.Provider>,
    );

    expect(captured!.scopes).toEqual(['openid', 'profile']);
  });

  it('exposes scopes as undefined when not configured', () => {
    const ctx = createMockContext();
    let captured: ThunderIDContextProps | undefined;

    render(
      <ThunderIDContext.Provider value={ctx}>
        <TestConsumer onResult={(c) => (captured = c)} />
      </ThunderIDContext.Provider>,
    );

    expect(captured!.scopes).toBeUndefined();
  });
});
