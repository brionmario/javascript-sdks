// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Create a route matcher function from an array of glob-like patterns.
 *
 * Patterns support:
 * - Literal paths: `/dashboard`
 * - Wildcard segments: `/admin/*` matches `/admin/users` but not `/admin/users/1`
 * - Deep wildcards: `/admin/**` matches `/admin/users` and `/admin/users/1`
 * - Explicit regex groups: `/api/(users|posts)` stays as-is
 *
 * @example
 * ```ts
 * const isProtectedRoute = createRouteMatcher(['/dashboard/**', '/admin/**']);
 * const isPublicRoute = createRouteMatcher(['/', '/about', '/sign-in']);
 *
 * // In a global middleware:
 * export default defineNuxtRouteMiddleware((to) => {
 *   if (isProtectedRoute(to.path) && !authState.value?.isSignedIn) {
 *     return navigateTo('/api/auth/signin', { external: true });
 *   }
 * });
 * ```
 */
export function createRouteMatcher(patterns: string[]): (path: string) => boolean {
  const regexes: RegExp[] = patterns.map((pattern: string) => {
    // Escape regex special characters except * and groups in parentheses
    const regexStr: string = pattern
      .replace(/[.+^${}|[\]\\]/g, '\\$&') // escape regex chars (but not *, ?, ())
      .replace(/\*\*/g, '___DOUBLE_STAR___') // placeholder for **
      .replace(/\*/g, '[^/]*') // single * matches one segment
      .replace(/___DOUBLE_STAR___/g, '.*'); // ** matches everything

    return new RegExp(`^${regexStr}$`);
  });

  return (path: string): boolean => regexes.some((regex: RegExp) => regex.test(path));
}
