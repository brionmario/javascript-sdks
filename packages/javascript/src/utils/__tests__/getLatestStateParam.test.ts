// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, vi} from 'vitest';
import PKCEConstants from '../../constants/PKCEConstants';

import generateStateParamForRequestCorrelation from '../generateStateParamForRequestCorrelation';
import getLatestStateParam from '../getLatestStateParam';

vi.mock('../generateStateParamForRequestCorrelation', () => ({
  default: vi.fn((pkceKey: string, state?: string) => `${state || ''}_request_${pkceKey.split('_').pop()}`),
}));

describe('getLatestStateParam', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const codeVerifierKey: string = PKCEConstants.Storage.StorageKeys.CODE_VERIFIER;

  it('should return the latest state param using the most recent PKCE key', () => {
    const tempStore: Record<string, string> = {
      [`${codeVerifierKey}_1`]: 'value1',
      [`${codeVerifierKey}_2`]: 'value2',
      unrelated_key: 'ignore',
    };

    const result: string | null = getLatestStateParam(tempStore, 'customState');

    expect(result).toBe('customState_request_2');
    expect(generateStateParamForRequestCorrelation).toHaveBeenCalledWith(`${codeVerifierKey}_2`, 'customState');
  });

  it('should handle a single PKCE key correctly', () => {
    const tempStore: Record<string, string> = {
      [`${codeVerifierKey}_5`]: 'someValue',
    };

    const result: string | null = getLatestStateParam(tempStore, 'stateX');

    expect(result).toBe('stateX_request_5');
    expect(generateStateParamForRequestCorrelation).toHaveBeenCalledWith(`${codeVerifierKey}_5`, 'stateX');
  });

  it('should return null if no PKCE keys exist in tempStore', () => {
    const tempStore: Record<string, string> = {
      randomKey: 'data',
      something_else: 'ignore',
    };

    const result: string | null = getLatestStateParam(tempStore, 'mystate');

    expect(result).toBeNull();
    expect(generateStateParamForRequestCorrelation).not.toHaveBeenCalled();
  });

  it('should return null for empty store', () => {
    const tempStore: Record<string, string> = {};
    const result: string | null = getLatestStateParam(tempStore);
    expect(result).toBeNull();
    expect(generateStateParamForRequestCorrelation).not.toHaveBeenCalled();
  });

  it('should work even when no state is provided', () => {
    const tempStore: Record<string, string> = {
      [`${codeVerifierKey}_3`]: 'x',
    };

    const result: string | null = getLatestStateParam(tempStore);

    expect(result).toBe('_request_3');
    expect(generateStateParamForRequestCorrelation).toHaveBeenCalledWith(`${codeVerifierKey}_3`, undefined);
  });

  it('should select the lexicographically last key when numeric suffixes are mixed (string-based sorting)', () => {
    const tempStore: Record<string, string> = {
      [`${codeVerifierKey}_10`]: 'v10',
      [`${codeVerifierKey}_2`]: 'v2',
      [`${codeVerifierKey}_9`]: 'v9',
    };

    const result: string | null = getLatestStateParam(tempStore, 'mix');

    expect(result).toBe('mix_request_9');
    expect(generateStateParamForRequestCorrelation).toHaveBeenCalledWith(`${codeVerifierKey}_9`, 'mix');
  });

  it('should ignore non-PKCE keys entirely', () => {
    const tempStore: Record<string, string> = {
      session_id: 'abc',
      token: 'xyz',
    };

    const result: string | null = getLatestStateParam(tempStore);

    expect(result).toBeNull();
  });
});
