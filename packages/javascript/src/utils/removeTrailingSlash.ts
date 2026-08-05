// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Removes a trailing slash from a path string if it exists.
 *
 * @param path - The string path to process
 * @returns The path without a trailing slash
 *
 * @example
 * ```typescript
 * removeTrailingSlash('/path/to/something/') // returns '/path/to/something'
 * removeTrailingSlash('/path/to/something') // returns '/path/to/something'
 * ```
 */
const removeTrailingSlash = (path: string): string => (path.endsWith('/') ? path.slice(0, -1) : path);

export default removeTrailingSlash;
