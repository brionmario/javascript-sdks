// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import ThunderIDRuntimeError from '../../errors/ThunderIDRuntimeError';
import processOpenIDScopes from '../processOpenIDScopes';

vi.mock('../../constants/OIDCRequestConstants', () => ({
  default: {
    SignIn: {
      Payload: {
        DEFAULT_SCOPES: ['openid', 'email'],
      },
    },
  },
}));

describe('processOpenIDScopes', () => {
  it('should return user-configured string scopes exactly as provided (no default injection)', () => {
    const input = 'email openid profile';
    const out: string = processOpenIDScopes(input);
    expect(out).toBe('email openid profile');
  });

  it('should return user-configured string scopes without injecting defaults', () => {
    const input = 'profile';
    const out: string = processOpenIDScopes(input);
    expect(out).toBe('profile');
  });

  it('should return user-configured array scopes joined as a string without injecting defaults', () => {
    const input: string[] = ['profile', 'email'];
    const out: string = processOpenIDScopes(input);
    expect(out).toBe('profile email');
  });

  it('should return user-configured array scopes without duplicating values', () => {
    const input: string[] = ['openid', 'email'];
    const out: string = processOpenIDScopes(input);
    expect(out).toBe('openid email');
  });

  it('should return only defaults for an empty string (not configured)', () => {
    const input = '';
    const out: string = processOpenIDScopes(input);
    expect(out).toBe('openid email');
  });

  it('should return only defaults for an empty array (not configured)', () => {
    const input: string[] = [];
    const out: string = processOpenIDScopes(input);
    expect(out).toBe('openid email');
  });

  it('should return only defaults when scopes is undefined (not configured)', () => {
    const out: string = processOpenIDScopes(undefined);
    expect(out).toBe('openid email');
  });

  it('should return only defaults when scopes is null (not configured)', () => {
    const out: string = processOpenIDScopes(null);
    expect(out).toBe('openid email');
  });

  it('should throw ThunderIDRuntimeError for non-string/array input (number)', () => {
    expect(() => processOpenIDScopes(123)).toThrow(ThunderIDRuntimeError);
  });

  it('should throw ThunderIDRuntimeError for non-string/array input (object)', () => {
    expect(() => processOpenIDScopes({})).toThrow(ThunderIDRuntimeError);
  });

  it('should return custom scopes exactly without appending defaults', () => {
    const input = 'custom-scope another';
    const out: string = processOpenIDScopes(input);
    expect(out).toBe('custom-scope another');
  });
});
