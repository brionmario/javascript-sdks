// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * 32-bit unsigned polynomial hash (`h = h*31 + charCode`), used to deterministically derive
 * avatar colors/icons from a seed string. Shared by every avatar util that needs the same
 * hash so seeds map identically across them.
 *
 * @example
 * ```typescript
 * hashStr('session-abc123');
 * ```
 */
const hashStr = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
};

export default hashStr;
