// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Interface defining the internal API routes for authentication.
 * These routes are used internally by the ThunderID Next.js SDK for handling authentication flows.
 */
export interface InternalAuthAPIRoutes {
  /**
   * Route for handling session management.
   * This route should return the current signed-in status.
   */
  session: string;
  /**
   * Route for handling sign-in requests.
   * This route should handle the sign-in flow and redirect users to the appropriate authentication endpoint.
   */
  signIn: string;

  /**
   * Route for handling sign-out requests.
   * This route should handle the sign-out flow and clean up any authentication state.
   */
  signOut: string;

  /**
   * Route for handling sign-up requests.
   * This route should handle the sign-up flow and redirect users to the appropriate registration endpoint.
   */
  signUp?: string;

  /**
   * Route for handling user information retrieval.
   * This route should return the current user's information, such as username, email, etc.
   */
  user: string;
}
