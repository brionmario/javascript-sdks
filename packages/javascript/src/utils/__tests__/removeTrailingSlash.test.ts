// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import removeTrailingSlash from '../removeTrailingSlash';

describe('removeTrailingSlash', (): void => {
  it('should remove trailing slash from a path', (): void => {
    expect(removeTrailingSlash('https://example.com/')).toBe('https://example.com');
  });

  it('should not modify path without trailing slash', (): void => {
    expect(removeTrailingSlash('https://example.com')).toBe('https://example.com');
  });

  it('should handle root path with just a slash', (): void => {
    expect(removeTrailingSlash('/')).toBe('');
  });

  it('should handle empty string', (): void => {
    expect(removeTrailingSlash('')).toBe('');
  });

  it('should remove only one trailing slash when multiple exist', (): void => {
    expect(removeTrailingSlash('https://example.com//')).toBe('https://example.com/');
  });
});
