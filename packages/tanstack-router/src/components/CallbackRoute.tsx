// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRouter, useRouterState} from '@tanstack/react-router';
import {Callback} from '@thunderid/react';
import {FC} from 'react';

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
 * Handles OAuth callback redirects for TanStack Router applications.
 * Processes authorization code, validates CSRF state, and navigates back to the original path.
 * Automatically handles TanStack Router basepath when configured.
 *
 * @example
 * ```tsx
 * const callbackRoute = createRoute({
 *   getParentRoute: () => rootRoute,
 *   path: '/callback',
 *   component: CallbackRoute,
 * });
 * ```
 */
const CallbackRoute: FC<CallbackRouteProps> = ({onError, onNavigate}: CallbackRouteProps) => {
  const router: ReturnType<typeof useRouter> = useRouter();
  const routerState: ReturnType<typeof useRouterState> = useRouterState();
  const {pathname}: {pathname: string} = routerState.location;

  const handleNavigate = (path: string): void => {
    if (onNavigate) {
      onNavigate(path);
      return;
    }

    const fullPath: string = window.location.pathname;
    const basename: string = fullPath.endsWith(pathname) ? fullPath.slice(0, -pathname.length).replace(/\/$/, '') : '';

    const navigationPath: string = basename && path.startsWith(basename) ? path.slice(basename.length) || '/' : path;

    router.navigate({to: navigationPath}).catch(() => {});
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
