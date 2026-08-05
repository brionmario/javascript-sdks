// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {NextRequest} from 'next/server';

/**
 * Creates a route matcher function that tests if a request matches any of the given patterns.
 *
 * @param patterns - Array of route patterns to match. Supports glob-like patterns.
 * @returns Function that tests if a request matches any of the patterns
 *
 * @example
 * ```typescript
 * const isProtectedRoute = createRouteMatcher([
 *   '/dashboard(.*)',
 *   '/admin(.*)',
 *   '/profile'
 * ]);
 *
 * if (isProtectedRoute(req)) {
 *   // Route is protected
 * }
 * ```
 */
export const createRouteMatcher = (patterns: string[]): ((req: NextRequest) => boolean) => {
  const regexPatterns: RegExp[] = patterns.map((pattern: string) => {
    // Convert glob-like patterns to regex
    const regexPattern: string = pattern
      .replace(/\./g, '\\.') // Escape dots
      .replace(/\*/g, '.*') // Convert * to .*
      .replace(/\(\.\*\)/g, '(.*)'); // Handle explicit (.*) patterns

    return new RegExp(`^${regexPattern}$`);
  });

  return (req: NextRequest): boolean => {
    const {pathname} = req.nextUrl;
    return regexPatterns.some((regex: RegExp) => regex.test(pathname));
  };
};
