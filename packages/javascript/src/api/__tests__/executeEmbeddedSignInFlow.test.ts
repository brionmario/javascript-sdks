// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {beforeEach, describe, expect, it, vi} from 'vitest';
import {EmbeddedSignInFlowResponse, EmbeddedSignInFlowStatus} from '../../models/embedded-signin-flow';
import executeEmbeddedSignInFlow from '../executeEmbeddedSignInFlow';

const URL = 'https://localhost:8090/flow/execute';

const mockFlowResponse = (overrides: Partial<EmbeddedSignInFlowResponse> = {}): EmbeddedSignInFlowResponse =>
  ({
    flowStatus: EmbeddedSignInFlowStatus.Incomplete,
    ...overrides,
  }) as EmbeddedSignInFlowResponse;

const captureRequestBody = (): Record<string, unknown> => {
  const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
  const requestInit = calls[calls.length - 1][1] as RequestInit;
  return JSON.parse(requestInit.body as string) as Record<string, unknown>;
};

const captureRequestHeaders = (): Record<string, string> => {
  const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
  const requestInit = calls[calls.length - 1][1] as RequestInit;
  return requestInit.headers as Record<string, string>;
};

describe('executeEmbeddedSignInFlow', (): void => {
  beforeEach((): void => {
    vi.resetAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockFlowResponse()),
      ok: true,
    });
  });

  describe('verbose: true injection', (): void => {
    it('injects verbose:true for a new flow start with applicationId and flowType', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {applicationId: 'app-1', flowType: 'AUTHENTICATION'},
        url: URL,
      });

      expect(captureRequestBody()).toMatchObject({verbose: true});
    });

    it('injects verbose:true for a new flow start that also includes scopes', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {applicationId: 'app-1', flowType: 'AUTHENTICATION', scopes: ['openid', 'profile']},
        url: URL,
      });

      const body = captureRequestBody();
      expect(body).toMatchObject({verbose: true, inputs: {requested_permissions: 'openid profile'}});
      expect(body).not.toHaveProperty('scopes');
    });

    it('injects verbose:true for a bare flow resumption (executionId only)', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {executionId: 'exec-abc'},
        url: URL,
      });

      expect(captureRequestBody()).toMatchObject({verbose: true});
    });

    it('does NOT inject verbose:true for a step submission (executionId + inputs)', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {action: 'submit', executionId: 'exec-abc', inputs: {password: 'secret', username: 'user'}},
        url: URL,
      });

      expect(captureRequestBody()).not.toHaveProperty('verbose');
    });

    it('strips a user-supplied verbose before applying internal logic', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {action: 'submit', executionId: 'exec-abc', inputs: {}, verbose: false},
        url: URL,
      });

      expect(captureRequestBody()).not.toHaveProperty('verbose');
    });

    it('strips user-supplied verbose:true from step submissions', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {action: 'submit', executionId: 'exec-abc', inputs: {}, verbose: true},
        url: URL,
      });

      expect(captureRequestBody()).not.toHaveProperty('verbose');
    });
  });

  describe('scopes → inputs.requested_permissions translation', (): void => {
    it('translates scopes to a space-separated inputs.requested_permissions string', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {applicationId: 'app-1', flowType: 'AUTHENTICATION', scopes: ['openid', 'profile', 'email']},
        url: URL,
      });

      const body = captureRequestBody();
      expect(body).toMatchObject({inputs: {requested_permissions: 'openid profile email'}});
      expect(body).not.toHaveProperty('scopes');
    });

    it('does not add requested_permissions when scopes is absent', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {applicationId: 'app-1', flowType: 'AUTHENTICATION'},
        url: URL,
      });

      expect(captureRequestBody()).not.toHaveProperty('inputs');
    });

    it('does not add requested_permissions when scopes is an empty array', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {applicationId: 'app-1', flowType: 'AUTHENTICATION', scopes: []},
        url: URL,
      });

      const body = captureRequestBody();
      expect(body).not.toHaveProperty('scopes');
      expect(body).not.toHaveProperty('inputs');
    });
  });

  describe('Flow-Secret header', (): void => {
    it('sends the Flow Secret header on a new flow start', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        flowSecret: 'flow-secret-123',
        payload: {applicationId: 'app-1', flowType: 'AUTHENTICATION'},
        url: URL,
      });

      expect(captureRequestHeaders()).toMatchObject({'Flow-Secret': 'flow-secret-123'});
    });

    it('does NOT send the Flow Secret header on a step submission', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        flowSecret: 'flow-secret-123',
        payload: {action: 'submit', executionId: 'exec-abc', inputs: {password: 'secret', username: 'user'}},
        url: URL,
      });

      expect(captureRequestHeaders()).not.toHaveProperty('Flow-Secret');
    });

    it('does NOT send the Flow Secret header when no flowSecret is provided', async (): Promise<void> => {
      await executeEmbeddedSignInFlow({
        payload: {applicationId: 'app-1', flowType: 'AUTHENTICATION'},
        url: URL,
      });

      expect(captureRequestHeaders()).not.toHaveProperty('Flow-Secret');
    });
  });

  it('throws when payload is missing', async (): Promise<void> => {
    await expect(executeEmbeddedSignInFlow({url: URL})).rejects.toThrow('Authorization payload is required');
  });

  it('uses baseUrl to construct the endpoint when url is not provided', async (): Promise<void> => {
    await executeEmbeddedSignInFlow({
      baseUrl: 'https://localhost:8090',
      payload: {applicationId: 'app-1', flowType: 'AUTHENTICATION'},
    });

    expect(fetch).toHaveBeenCalledWith('https://localhost:8090/flow/execute', expect.any(Object));
  });
});
