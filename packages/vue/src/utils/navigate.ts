// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Re-export of the navigation helper from the Browser SDK.
 *
 * Navigates to a new URL within the browser:
 * - For same-origin URLs: Uses the History API and dispatches a `popstate` event (SPA navigation).
 * - For cross-origin URLs: Performs a full page load using `window.location.assign`.
 *
 * @see {@link @thunderid/browser#navigate}
 */
export {navigate, navigate as default} from '@thunderid/browser';
