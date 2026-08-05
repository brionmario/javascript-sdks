// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FlowMetadataResponse} from '@thunderid/browser';
import {resolveTranslationsInObject} from './resolveTranslationsInObject';
import {UseTranslation} from '../hooks/useTranslation';

/**
 * Recursively resolves translation and meta template strings in an array of objects.
 * @param items - Array of objects to process
 * @param t - The translation function from useTranslation
 * @param properties - Array of property names to resolve (optional)
 * @param meta - Optional flow metadata for resolving meta() expressions
 * @returns A new array with resolved translations
 */
const resolveTranslationsInArray = <T extends Record<string, any>>(
  items: T[],
  t: UseTranslation['t'],
  properties?: string[],
  meta?: FlowMetadataResponse | null,
): T[] =>
  items.map((item: T) => {
    const resolved: T = resolveTranslationsInObject(item, t, properties, meta);

    // If the item has nested components (like BLOCK or STACK type), resolve those too
    if (resolved['components'] && Array.isArray(resolved['components'])) {
      (resolved as any).components = resolveTranslationsInArray(resolved['components'], t, properties, meta);
    }

    return resolved;
  });

export default resolveTranslationsInArray;
