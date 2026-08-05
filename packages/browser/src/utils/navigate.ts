// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Navigates to a new URL within the browser.
 *
 * - For same-origin URLs (relative paths or absolute URLs with the same origin),
 *   uses the History API and dispatches a `popstate` event (SPA navigation).
 * - For cross-origin URLs, performs a full page load using `window.location.assign`.
 *
 * This allows seamless navigation for both SPA routes and external links.
 *
 * @param url - The target URL to navigate to. Can be a path, query, or absolute URL.
 *
 * @example
 * ```typescript
 * // SPA navigation (same origin)
 * navigate('/dashboard');
 *
 * // SPA navigation with query
 * navigate('/search?q=thunderid');
 *
 * // Cross-origin navigation (full page load)
 * navigate('https://localhost:8090/accountrecoveryendpoint/register.do');
 * ```
 */
const navigate = (url: string): void => {
  try {
    const targetUrl: URL = new URL(url, window.location.origin);
    if (targetUrl.origin === window.location.origin) {
      window.history.pushState(null, '', targetUrl.pathname + targetUrl.search + targetUrl.hash);
      window.dispatchEvent(new PopStateEvent('popstate', {state: null}));
    } else {
      window.location.assign(targetUrl.href);
    }
  } catch {
    // If URL constructor fails (e.g., malformed URL), fallback to location.assign
    window.location.assign(url);
  }
};

export default navigate;
