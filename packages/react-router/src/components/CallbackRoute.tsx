// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Callback} from '@thunderid/react';
import {FC} from 'react';
import {useLocation, useNavigate} from 'react-router';

/**
 * Props for the CallbackRoute component.
 */
export interface CallbackRouteProps {
  /**
   * Callback function called when an error occurs during OAuth processing.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;

  /**
   * Optional custom navigation handler.
   * If provided, this will be called instead of the default navigate() behavior.
   * Useful for apps that need custom navigation logic.
   * @param path - The path to navigate to
   */
  onNavigate?: (path: string) => void;
}

/**
 * Handles OAuth callback redirects for React Router applications.
 * Processes authorization code, validates CSRF state, and navigates back to the original path.
 * Automatically handles React Router basename when configured.
 *
 * @example
 * ```tsx
 * <Route path="/callback" element={<CallbackRoute />} />
 * ```
 */
const CallbackRoute: FC<CallbackRouteProps> = ({onError, onNavigate}: CallbackRouteProps) => {
  const navigate: ReturnType<typeof useNavigate> = useNavigate();
  const location: ReturnType<typeof useLocation> = useLocation();

  const handleNavigate = (path: string): void => {
    if (onNavigate) {
      onNavigate(path);
      return;
    }

    const fullPath: string = window.location.pathname;
    const relativePath: string = location.pathname;
    const basename: string = fullPath.endsWith(relativePath)
      ? fullPath.slice(0, -relativePath.length).replace(/\/$/, '')
      : '';

    const navigationPath: string = basename && path.startsWith(basename) ? path.slice(basename.length) || '/' : path;

    navigate(navigationPath);
  };

  return (
    <Callback
      onNavigate={handleNavigate}
      onError={
        onError ||
        ((error: Error): void => {
          // eslint-disable-next-line no-console
          console.error('OAuth callback error:', error);
        })
      }
    />
  );
};

export default CallbackRoute;
