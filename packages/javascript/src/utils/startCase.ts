// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Converts the first character of `string` to upper case.
 *
 * @param string - The string to convert.
 * @returns The converted string.
 */
const upperFirst = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts `string` to start case.
 *
 * @param string - The string to convert.
 * @returns The start cased string.
 */
const startCase = (str: string): string => {
  if (!str) return '';

  const words = str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/);

  return words.map((word) => upperFirst(word)).join(' ');
};

export default startCase;
