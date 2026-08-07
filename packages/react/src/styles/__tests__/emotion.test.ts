// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import {configureEmotionNonce, css, cx, keyframes} from '../emotion';

/**
 * Finds the `<style>` tag Emotion's sheet inserted the given class's rule into, by looking
 * for a `data-emotion`-tagged tag whose CSS text defines that class.
 */
function findStyleTagForClassName(className: string): HTMLStyleElement | null {
  return (
    Array.from(document.querySelectorAll<HTMLStyleElement>('style[data-emotion]')).find((tag: HTMLStyleElement) =>
      (tag.textContent ?? '').includes(`.${className}{`),
    ) ?? null
  );
}

/**
 * Counts how many `<style>` tags currently contain a rule for the given raw CSS body (the
 * literal text between the class selector's braces).
 */
function countStyleTagsWithRule(className: string): number {
  return Array.from(document.querySelectorAll<HTMLStyleElement>('style[data-emotion]')).filter(
    (tag: HTMLStyleElement) => (tag.textContent ?? '').includes(`.${className}{`),
  ).length;
}

describe('emotion', () => {
  it('css/cx/keyframes work before configureEmotionNonce is ever called', () => {
    const animation: string = keyframes`
      from { opacity: 0; }
      to { opacity: 1; }
    `;
    const className: string = css`
      color: red;
      animation-name: ${animation};
    `;
    const combined: string = cx(className, 'extra-class');

    expect(typeof className).toBe('string');
    expect(className.length).toBeGreaterThan(0);
    expect(combined).toContain(className);
    expect(combined).toContain('extra-class');

    const styleTag: HTMLStyleElement | null = findStyleTagForClassName(className);

    expect(styleTag).not.toBeNull();
  });

  it('applies the configured nonce to subsequently-inserted style tags', () => {
    configureEmotionNonce('abc123');

    const className: string = css`
      color: blue;
    `;
    const styleTag: HTMLStyleElement | null = findStyleTagForClassName(className);

    expect(styleTag).not.toBeNull();
    expect(styleTag?.getAttribute('nonce')).toBe('abc123');
  });

  it('is a no-op when called again with the same nonce', () => {
    configureEmotionNonce('idempotent-nonce');

    // Emotion's cache deduplicates by tracking which serialized styles it has already
    // inserted (`cache.inserted`). If configureEmotionNonce recreated the instance below,
    // the new cache would have no memory of this rule and would insert it a second time
    // under a fresh style tag. Because the nonce is unchanged, the second call must reuse
    // the same, still-live instance, so re-requesting the identical style is a pure cache
    // hit: same class name, no additional tag/rule inserted.
    const className: string = css`
      color: teal;
    `;

    expect(countStyleTagsWithRule(className)).toBe(1);

    // Same nonce as above - must be a no-op, not a recreation.
    configureEmotionNonce('idempotent-nonce');

    const repeatedClassName: string = css`
      color: teal;
    `;

    expect(repeatedClassName).toBe(className);
    expect(countStyleTagsWithRule(className)).toBe(1);
  });

  it('recreates the instance when the nonce actually changes, losing prior cache dedup', () => {
    configureEmotionNonce('nonce-before-change');

    const className: string = css`
      color: coral;
    `;

    expect(countStyleTagsWithRule(className)).toBe(1);

    // Different nonce - must recreate the instance, discarding the old cache's memory of
    // which styles were already inserted.
    configureEmotionNonce('nonce-after-change');

    const repeatedClassName: string = css`
      color: coral;
    `;

    expect(repeatedClassName).toBe(className);
    expect(countStyleTagsWithRule(className)).toBe(2);
  });

  it('updates the nonce used for subsequently-inserted styles when it changes', () => {
    configureEmotionNonce('nonce-one');

    const beforeClassName: string = css`
      color: purple;
    `;
    const beforeStyleTag: HTMLStyleElement | null = findStyleTagForClassName(beforeClassName);

    expect(beforeStyleTag?.getAttribute('nonce')).toBe('nonce-one');

    configureEmotionNonce('nonce-two');

    const afterClassName: string = css`
      color: orange;
    `;
    const afterStyleTag: HTMLStyleElement | null = findStyleTagForClassName(afterClassName);

    expect(afterStyleTag?.getAttribute('nonce')).toBe('nonce-two');
    expect(afterStyleTag).not.toBe(beforeStyleTag);
  });
});
