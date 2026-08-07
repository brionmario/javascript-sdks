// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {afterEach, describe, expect, it} from 'vitest';
import {injectStyles} from '../injectStyles';

describe('injectStyles', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('injects a single <style> element into document.head', () => {
    injectStyles();

    const styles: NodeListOf<HTMLStyleElement> = document.head.querySelectorAll('style');
    expect(styles.length).toBe(1);
  });

  it('does not set a nonce attribute when no nonce is provided', () => {
    injectStyles();

    const style: HTMLStyleElement | null = document.head.querySelector('style');
    expect(style).not.toBeNull();
    expect(style?.hasAttribute('nonce')).toBe(false);
    expect(style?.getAttribute('nonce')).toBeNull();
  });

  it('sets the nonce attribute on the injected <style> element when provided', () => {
    injectStyles(undefined, 'abc123');

    const style: HTMLStyleElement | null = document.head.querySelector('style');
    expect(style).not.toBeNull();
    expect(style?.getAttribute('nonce')).toBe('abc123');
  });

  it('is idempotent even when a nonce is passed (does not insert a duplicate <style> tag)', () => {
    injectStyles(undefined, 'abc123');
    injectStyles(undefined, 'abc123');

    const styles: NodeListOf<HTMLStyleElement> = document.head.querySelectorAll('style');
    expect(styles.length).toBe(1);
  });
});
