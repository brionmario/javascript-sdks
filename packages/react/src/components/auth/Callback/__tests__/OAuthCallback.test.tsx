// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {OAuthCallback} from '../OAuthCallback';

describe('OAuthCallback', () => {
  let originalOpener: any;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
    originalOpener = window.opener;
  });

  afterEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
    window.opener = originalOpener;
  });

  it('sends postMessage to window.opener if it exists', async () => {
    const postMessageMock: any = vi.fn();
    window.opener = {postMessage: postMessageMock};
    window.history.replaceState(
      {},
      '',
      '/callback?code=test-code&state=test-state&nonce=test-nonce&error=test-error&error_description=test-desc',
    );

    render(<OAuthCallback />);

    await waitFor(() => {
      expect(postMessageMock).toHaveBeenCalledWith(
        {
          code: 'test-code',
          error: 'test-error',
          errorDescription: 'test-desc',
          nonce: 'test-nonce',
          state: 'test-state',
        },
        window.location.origin,
      );
    });
  });

  it('navigates with error if state is missing', async () => {
    const onError: any = vi.fn();
    const onNavigate: any = vi.fn();
    window.history.replaceState({}, '', '/callback?code=test-code');

    render(<OAuthCallback onError={onError} onNavigate={onNavigate} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({message: 'Missing OAuth state parameter - possible security issue'}),
      );
    });

    expect(onNavigate).toHaveBeenCalledWith(
      '/?error=callback_error&error_description=Missing+OAuth+state+parameter+-+possible+security+issue',
    );
  });

  it('navigates with error if state is invalid (not in sessionStorage)', async () => {
    const onError: any = vi.fn();
    const onNavigate: any = vi.fn();
    window.history.replaceState({}, '', '/callback?code=test-code&state=invalid-state');

    render(<OAuthCallback onError={onError} onNavigate={onNavigate} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({message: 'Invalid OAuth state - possible CSRF attack'}),
      );
    });

    expect(onNavigate).toHaveBeenCalledWith(
      '/?error=callback_error&error_description=Invalid+OAuth+state+-+possible+CSRF+attack',
    );
  });

  it('navigates with error and cleans up state if state is expired', async () => {
    const onError: any = vi.fn();
    const onNavigate: any = vi.fn();

    // Set timestamp to 11 minutes ago
    const expiredTimestamp: number = Date.now() - 11 * 60 * 1000;
    sessionStorage.setItem(
      'thunderid_oauth_test-state',
      JSON.stringify({path: '/custom-path', timestamp: expiredTimestamp}),
    );

    window.history.replaceState({}, '', '/callback?code=test-code&state=test-state');

    render(<OAuthCallback onError={onError} onNavigate={onNavigate} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({message: 'OAuth state expired - please try again'}),
      );
    });

    expect(sessionStorage.getItem('thunderid_oauth_test-state')).toBeNull();
    expect(onNavigate).toHaveBeenCalledWith(
      '/custom-path?error=callback_error&error_description=OAuth+state+expired+-+please+try+again',
    );
  });

  it('forwards oauth error to original component', async () => {
    const onError: any = vi.fn();
    const onNavigate: any = vi.fn();

    sessionStorage.setItem('thunderid_oauth_test-state', JSON.stringify({path: '/custom-path', timestamp: Date.now()}));
    window.history.replaceState(
      {},
      '',
      '/callback?state=test-state&error=access_denied&error_description=User+denied+access',
    );

    render(<OAuthCallback onError={onError} onNavigate={onNavigate} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({message: 'User denied access'}));
    });

    expect(sessionStorage.getItem('thunderid_oauth_test-state')).toBeNull();
    expect(onNavigate).toHaveBeenCalledWith('/custom-path?error=access_denied&error_description=User+denied+access');
  });

  it('navigates with code and nonce on normal flow', async () => {
    const onNavigate: any = vi.fn();

    sessionStorage.setItem('thunderid_oauth_test-state', JSON.stringify({path: '/custom-path', timestamp: Date.now()}));
    window.history.replaceState({}, '', '/callback?code=valid-code&state=test-state&nonce=test-nonce');

    render(<OAuthCallback onNavigate={onNavigate} />);

    await waitFor(() => {
      expect(onNavigate).toHaveBeenCalledWith('/custom-path?code=valid-code&nonce=test-nonce');
    });

    expect(sessionStorage.getItem('thunderid_oauth_test-state')).toBeNull();
  });

  it('navigates with error if code is missing', async () => {
    const onError: any = vi.fn();
    const onNavigate: any = vi.fn();

    sessionStorage.setItem('thunderid_oauth_test-state', JSON.stringify({path: '/custom-path', timestamp: Date.now()}));
    window.history.replaceState({}, '', '/callback?state=test-state');

    render(<OAuthCallback onError={onError} onNavigate={onNavigate} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({message: 'Missing OAuth authorization code'}));
    });

    expect(onNavigate).toHaveBeenCalledWith(
      '/custom-path?error=callback_error&error_description=Missing+OAuth+authorization+code',
    );
  });
});
