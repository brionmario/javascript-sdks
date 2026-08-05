// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Shared CSS keyframe animations used by multiple primitive components.
 *
 * `thunder-spin`          - used by Spinner (__svg) and Button (__spinner)
 * `thunder-spinner-dash`  - used by Spinner (__circle)
 *
 * Defined once here rather than in each component's CSS file to avoid
 * duplicate `@keyframes` blocks in the injected stylesheet.
 */
const ANIMATIONS_CSS = `
/* ============================================================
   ThunderID Vue SDK – shared keyframe animations
   ============================================================ */

@keyframes thunder-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes thunder-spinner-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
`;

export default ANIMATIONS_CSS;
