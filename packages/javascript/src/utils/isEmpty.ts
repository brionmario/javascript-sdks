// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Checks if a value is considered empty.
 *
 * A value is considered empty if it is:
 * - null
 * - undefined
 * - empty string ("")
 * - string containing only whitespace characters
 * - empty array ([])
 * - empty object ({})
 *
 * @param value - The value to check
 * @returns true if the value is empty, false otherwise
 *
 * @example
 * ```typescript
 * isEmpty(null);              // true
 * isEmpty(undefined);         // true
 * isEmpty("");                // true
 * isEmpty("   ");             // true
 * isEmpty("hello");           // false
 * isEmpty([]);                // true
 * isEmpty([1, 2, 3]);         // false
 * isEmpty({});                // true
 * isEmpty({ name: "John" });  // false
 * isEmpty(0);                 // false
 * isEmpty(false);             // false
 * ```
 */
const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object' && value.constructor === Object) {
    return Object.keys(value).length === 0;
  }

  return false;
};

export default isEmpty;
