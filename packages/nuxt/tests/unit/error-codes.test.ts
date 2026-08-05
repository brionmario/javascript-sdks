// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/typedef, sort-keys, no-restricted-syntax */

import {describe, it, expect} from 'vitest';
import {ThunderIDError, ErrorCode} from '../../src/runtime/errors';

describe('ErrorCode', () => {
  it('has stable string values for known codes', () => {
    expect(ErrorCode.ConfigMissingBaseUrl).toBe('config/missing-base-url');
    expect(ErrorCode.ConfigMissingClientId).toBe('config/missing-client-id');
    expect(ErrorCode.ConfigMissingSecret).toBe('config/missing-session-secret');
    expect(ErrorCode.SessionMissing).toBe('session/missing');
    expect(ErrorCode.SessionInvalid).toBe('session/invalid');
    expect(ErrorCode.SessionExpired).toBe('session/expired');
    expect(ErrorCode.OAuthCallbackError).toBe('oauth/callback-error');
    expect(ErrorCode.TokenExchangeFailed).toBe('oauth/token-exchange-failed');
    expect(ErrorCode.OpenRedirectBlocked).toBe('security/open-redirect-blocked');
  });

  it('has at least 14 distinct values', () => {
    const values = Object.values(ErrorCode);
    const unique = new Set(values);
    expect(unique.size).toBeGreaterThanOrEqual(14);
    for (const v of values) {
      expect(typeof v).toBe('string');
      expect(v.length).toBeGreaterThan(0);
    }
  });

  it('all values follow a namespaced path format (category/code)', () => {
    for (const v of Object.values(ErrorCode)) {
      expect(v).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
    }
  });
});

describe('ThunderIDError', () => {
  it('constructs with message and code', () => {
    const err = new ThunderIDError('Something went wrong', ErrorCode.SessionMissing);
    expect(err.message).toBe('Something went wrong');
    expect(err.code).toBe(ErrorCode.SessionMissing);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ThunderIDError);
    expect(err.name).toBe('ThunderIDError');
  });

  it('accepts optional statusCode, cause, and context', () => {
    const cause = new Error('original');
    const context = {userId: 'abc'};
    const err = new ThunderIDError('Token is expired', ErrorCode.SessionExpired, {
      statusCode: 401,
      cause,
      context,
    });
    expect(err.statusCode).toBe(401);
    expect(err.cause).toBe(cause);
    expect(err.context).toEqual({userId: 'abc'});
  });

  it('maintains correct prototype chain', () => {
    const err = new ThunderIDError('fail', ErrorCode.OAuthCallbackError);
    expect(Object.getPrototypeOf(err)).toBe(ThunderIDError.prototype);
  });

  it('is throwable and catchable as Error', () => {
    const fn = (): never => {
      throw new ThunderIDError('fail', ErrorCode.OAuthCallbackError);
    };
    expect(fn).toThrowError('fail');
    try {
      fn();
    } catch (e) {
      expect(e).toBeInstanceOf(ThunderIDError);
      if (e instanceof ThunderIDError) {
        expect(e.code).toBe(ErrorCode.OAuthCallbackError);
      }
    }
  });
});
