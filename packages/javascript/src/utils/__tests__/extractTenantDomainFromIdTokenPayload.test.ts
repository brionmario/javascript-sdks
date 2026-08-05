// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import {IdToken} from '../../models/token';
import extractTenantDomainFromIdTokenPayload from '../extractTenantDomainFromIdTokenPayload';

describe('extractTenantDomainFromIdTokenPayload', (): void => {
  it('should extract tenant domain from sub claim with default separator', (): void => {
    const payload: IdToken = {
      sub: 'user@foo@tenant.com',
    };

    expect(extractTenantDomainFromIdTokenPayload(payload)).toBe('tenant.com');
  });

  it('should extract tenant domain with custom separator', (): void => {
    const payload: IdToken = {
      sub: 'user#foo#custom-tenant',
    };

    expect(extractTenantDomainFromIdTokenPayload(payload, '#')).toBe('custom-tenant');
  });

  it('should return empty string when sub claim is missing', (): void => {
    const payload: IdToken = {} as IdToken;

    expect(extractTenantDomainFromIdTokenPayload(payload)).toBe('');
  });

  it('should return empty string when sub claim has insufficient parts', (): void => {
    const payload: IdToken = {
      sub: 'user@tenant',
    };

    expect(extractTenantDomainFromIdTokenPayload(payload)).toBe('');
  });

  it('should extract the last part when multiple separators exist', () => {
    const payload: IdToken = {
      sub: 'user@foo@bar@tenant.org',
    };
    expect(extractTenantDomainFromIdTokenPayload(payload)).toBe('tenant.org');
  });

  it('should return empty string when sub ends with separator', () => {
    const payload: IdToken = {
      sub: 'user@foo@',
    };
    expect(extractTenantDomainFromIdTokenPayload(payload)).toBe('');
  });

  it('should return empty string when custom separator is not found', () => {
    const payload: IdToken = {
      sub: 'user@foo@tenant.com',
    };
    expect(extractTenantDomainFromIdTokenPayload(payload, '#')).toBe('');
  });

  it('should return empty string when sub is not a string', () => {
    const payload: IdToken = {sub: undefined} as unknown as IdToken;
    expect(extractTenantDomainFromIdTokenPayload(payload)).toBe('');
  });
});
