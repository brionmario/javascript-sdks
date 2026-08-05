// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, cleanup} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {Callback} from '../Callback';

vi.mock('../TokenCallback', () => ({
  TokenCallback: () => <div data-testid="token-callback">TokenCallback</div>,
}));

vi.mock('../OAuthCallback', () => ({
  OAuthCallback: () => <div data-testid="oauth-callback">OAuthCallback</div>,
}));

describe('Callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', '/');
  });

  it('renders TokenCallback when token is present in the URL', () => {
    window.history.replaceState({}, '', '/callback?token=secret-token');
    render(<Callback />);
    expect(screen.getByTestId('token-callback')).toBeDefined();
    expect(screen.queryByTestId('oauth-callback')).toBeNull();
  });

  it('renders OAuthCallback when token is not present in the URL', () => {
    window.history.replaceState({}, '', '/callback?code=oauth-code');
    render(<Callback />);
    expect(screen.getByTestId('oauth-callback')).toBeDefined();
    expect(screen.queryByTestId('token-callback')).toBeNull();
  });

  it('maintains the initial flow type even if URL changes later', () => {
    // Start with token in URL
    window.history.replaceState({}, '', '/callback?token=secret-token');
    const {rerender} = render(<Callback />);
    expect(screen.getByTestId('token-callback')).toBeDefined();

    // Simulate URL change (like what TokenCallback does when it cleans the URL)
    window.history.replaceState({}, '', '/callback');
    rerender(<Callback />);

    // It should STILL render TokenCallback because flowType is locked in state
    expect(screen.getByTestId('token-callback')).toBeDefined();
    expect(screen.queryByTestId('oauth-callback')).toBeNull();
  });
});
