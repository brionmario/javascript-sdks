// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, vi, afterEach} from 'vitest';
import {Config} from '../../models/config';
import getRedirectBasedSignUpUrl from '../getRedirectBasedSignUpUrl';
import isRecognizedBaseUrlPattern from '../isRecognizedBaseUrlPattern';

vi.mock('../isRecognizedBaseUrlPattern', () => ({default: vi.fn()}));

describe('getRedirectBasedSignUpUrl', () => {
  const baseUrl = 'https://api.thunderid.io/t/org';
  const expectedBaseUrl = 'https://accounts.thunderid.io/t/org';
  const clientId = 'client123';
  const applicationId = 'app456';

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct sign-up URL if baseUrl is recognized and both params are present', () => {
    (isRecognizedBaseUrlPattern as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const config: Config = {applicationId, baseUrl, clientId};
    const url: URL = new URL(`${expectedBaseUrl}/accountrecoveryendpoint/register.do`);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('spId', applicationId);
    expect(getRedirectBasedSignUpUrl(config)).toBe(url.toString());
  });

  it('should return the correct sign-up URL if only clientId is present', () => {
    (isRecognizedBaseUrlPattern as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const config: Config = {baseUrl, clientId};
    const url: URL = new URL(`${expectedBaseUrl}/accountrecoveryendpoint/register.do`);
    url.searchParams.set('client_id', clientId);
    expect(getRedirectBasedSignUpUrl(config)).toBe(url.toString());
  });

  it('should return the correct sign-up URL if only applicationId is present', () => {
    (isRecognizedBaseUrlPattern as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const config: Config = {applicationId, baseUrl, clientId: ''};
    const url: URL = new URL(`${expectedBaseUrl}/accountrecoveryendpoint/register.do`);
    url.searchParams.set('spId', applicationId);
    expect(getRedirectBasedSignUpUrl(config)).toBe(url.toString());
  });

  it('should return the correct sign-up URL if neither param is present', () => {
    (isRecognizedBaseUrlPattern as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const config: Config = {baseUrl, clientId: ''};
    const url: URL = new URL(`${expectedBaseUrl}/accountrecoveryendpoint/register.do`);
    expect(getRedirectBasedSignUpUrl(config)).toBe(url.toString());
  });

  it('should return empty string if baseUrl is not recognized', () => {
    (isRecognizedBaseUrlPattern as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const config: Config = {applicationId, baseUrl, clientId};
    expect(getRedirectBasedSignUpUrl(config)).toBe('');
  });
});
