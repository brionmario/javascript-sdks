// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * @vitest-environment jsdom
 */

import {vi, describe, it, expect, beforeEach, afterEach} from 'vitest';
import navigate from '../navigate';

describe('navigate', () => {
  const originalLocation: Location = window.location;

  beforeEach(() => {
    // @ts-ignore
    window.history.pushState = vi.fn();
    // @ts-ignore
    window.dispatchEvent = vi.fn();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      ...originalLocation,
      assign: vi.fn(),
      href: 'https://localhost:5173/',
      origin: 'https://localhost:5173',
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    window.location = originalLocation;
  });

  it('should call window.history.pushState with the correct arguments for same-origin', () => {
    navigate('/test-url');
    expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test-url');
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it('should dispatch a PopStateEvent with state null for same-origin', () => {
    navigate('/test-url');
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        state: null,
        type: 'popstate',
      }),
    );
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it('should use window.location.assign for cross-origin URLs', () => {
    const crossOriginUrl = 'https://localhost:8090/accountrecoveryendpoint/register.do';
    navigate(crossOriginUrl);
    expect(window.location.assign).toHaveBeenCalledWith(crossOriginUrl);
    expect(window.history.pushState).not.toHaveBeenCalled();
    expect(window.dispatchEvent).not.toHaveBeenCalled();
  });

  it('should use window.location.assign for malformed URLs', () => {
    const malformedUrl = 'http://[::1'; // Invalid URL
    navigate(malformedUrl);
    expect(window.location.assign).toHaveBeenCalledWith(malformedUrl);
    expect(window.history.pushState).not.toHaveBeenCalled();
    expect(window.dispatchEvent).not.toHaveBeenCalled();
  });
});
