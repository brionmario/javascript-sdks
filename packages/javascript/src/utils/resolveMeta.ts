// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FlowMetadataResponse} from '../models/flow-meta';

/**
 * Resolves a dot-path expression against a FlowMetadataResponse object.
 *
 * Supports both camelCase paths (e.g. `logoUrl`) and snake_case API responses
 * (e.g. `logo_url`). When a camelCase segment is not found directly, the
 * function falls back to its snake_case equivalent.
 *
 * @example
 * resolveMeta('application.name', meta) // → 'My App'
 * resolveMeta('ou.name', meta)           // → 'My Org'
 *
 * @param path - Dot-separated path into the meta object (e.g. 'application.name')
 * @param meta - The FlowMetadataResponse to look up
 * @returns The resolved string value, or empty string if not found
 */
export default function resolveMeta(path: string, meta: FlowMetadataResponse): string {
  const value: unknown = path.split('.').reduce<unknown>((current: unknown, part: string) => {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }

    const obj: Record<string, unknown> = current as Record<string, unknown>;
    const snakePart: string = part.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`);

    return part in obj ? obj[part] : obj[snakePart];
  }, meta);

  return value != null ? String(value) : '';
}
