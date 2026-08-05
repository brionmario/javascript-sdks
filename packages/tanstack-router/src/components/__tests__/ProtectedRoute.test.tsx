// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cleanup, render, screen} from '@testing-library/react';
import {useThunderID} from '@thunderid/react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import ProtectedRoute from '../ProtectedRoute';

vi.mock('@thunderid/react', () => ({
  ThunderIDRuntimeError: class ThunderIDRuntimeError extends Error {
    code: string;

    component: string;

    traceId: string | undefined;

    constructor(message: string, code: string, component: string, traceId?: string) {
      super(message);
      this.name = 'ThunderIDRuntimeError';
      this.code = code;
      this.component = component;
      this.traceId = traceId;
    }
  },
  useThunderID: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  Navigate: ({to}: {to: string}): JSX.Element => <div data-testid="navigate">Navigate to: {to}</div>,
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render loader when isLoading is true', () => {
    vi.mocked(useThunderID).mockReturnValue({
      isLoading: true,
      isSignedIn: false,
    } as any);

    render(
      <ProtectedRoute redirectTo="/signin" loader={<div data-testid="loader">Loading...</div>}>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId('loader')).toBeDefined();
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('should render children when user is authenticated', () => {
    vi.mocked(useThunderID).mockReturnValue({
      isLoading: false,
      isSignedIn: true,
    } as any);

    render(
      <ProtectedRoute redirectTo="/signin">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId('protected-content')).toBeDefined();
  });

  it('should render fallback when user is not authenticated and fallback is provided', () => {
    vi.mocked(useThunderID).mockReturnValue({
      isLoading: false,
      isSignedIn: false,
    } as any);

    render(
      <ProtectedRoute redirectTo="/signin" fallback={<div data-testid="fallback">Access Denied</div>}>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId('fallback')).toBeDefined();
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('should navigate to redirectTo when user is not authenticated and no fallback is provided', () => {
    vi.mocked(useThunderID).mockReturnValue({
      isLoading: false,
      isSignedIn: false,
    } as any);

    render(
      <ProtectedRoute redirectTo="/signin">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    const navigate: HTMLElement = screen.getByTestId('navigate');
    expect(navigate).toBeDefined();
    expect(navigate.textContent).toBe('Navigate to: /signin');
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('should throw error when neither fallback nor redirectTo is provided', () => {
    vi.mocked(useThunderID).mockReturnValue({
      isLoading: false,
      isSignedIn: false,
    } as any);

    expect(() => {
      render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>,
      );
    }).toThrow('"fallback" or "redirectTo" prop is required.');
  });

  it('should render null loader by default when isLoading is true and no loader is provided', () => {
    vi.mocked(useThunderID).mockReturnValue({
      isLoading: true,
      isSignedIn: false,
    } as any);

    const {container} = render(
      <ProtectedRoute redirectTo="/signin">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    expect(container.textContent).toBe('');
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('should prioritize fallback over redirectTo when both are provided', () => {
    vi.mocked(useThunderID).mockReturnValue({
      isLoading: false,
      isSignedIn: false,
    } as any);

    render(
      <ProtectedRoute redirectTo="/signin" fallback={<div data-testid="fallback">Custom Fallback</div>}>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId('fallback')).toBeDefined();
    expect(screen.queryByTestId('navigate')).toBeNull();
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });
});
