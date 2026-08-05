// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, vi, beforeEach} from 'vitest';

const loadWithPrefix = async (prefix: string): Promise<(typeof import('../withVendorCSSClassPrefix'))['default']> => {
  vi.resetModules();
  vi.doMock('../../constants/VendorConstants', () => ({
    default: {VENDOR_PREFIX: prefix},
  }));
  const mod: typeof import('../withVendorCSSClassPrefix') = await import('../withVendorCSSClassPrefix');
  return mod.default;
};

describe('withVendorCSSClassPrefix', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should prefix a simple class name with the vendor prefix', async () => {
    const withVendorCSSClassPrefix: (className: string) => string = await loadWithPrefix('custom');
    expect(withVendorCSSClassPrefix('sign-in-button')).toBe('custom-sign-in-button');
  });

  it('should work with BEM-style class names unchanged after the hyphen', async () => {
    const withVendorCSSClassPrefix: (className: string) => string = await loadWithPrefix('custom');
    expect(withVendorCSSClassPrefix('card__title--large')).toBe('custom-card__title--large');
  });

  it('should respect different vendor prefixes', async () => {
    const withVendorCSSClassPrefix: (className: string) => string = await loadWithPrefix('acme');
    expect(withVendorCSSClassPrefix('foo')).toBe('acme-foo');
  });

  it('should handle an empty class name by returning just the prefix and hyphen', async () => {
    const withVendorCSSClassPrefix: (className: string) => string = await loadWithPrefix('custom');
    expect(withVendorCSSClassPrefix('')).toBe('custom-');
  });

  it('should not mutate or trim the provided class name (preserve spaces/characters as-is)', async () => {
    const withVendorCSSClassPrefix: (className: string) => string = await loadWithPrefix('custom');
    const original = '  spaced name  ';
    const result: string = withVendorCSSClassPrefix(original);
    expect(result).toBe('custom-  spaced name  ');
    expect(original).toBe('  spaced name  ');
  });
});
