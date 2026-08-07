// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import createEmotion, {ClassNamesArg, CSSInterpolation} from '@emotion/css/create-instance';
import {getVendorPrefix} from '@thunderid/browser';

/**
 * The vendor/nonce this module was last configured with, tracked so repeated calls with the
 * same values (e.g. on every render of {@link ThunderIDProvider}) are cheap no-ops instead of
 * recreating the Emotion cache - and the `<style>` tags it owns - on every render.
 */
let configuredVendor: string | undefined;
let configuredNonce: string | undefined;

/**
 * Module-level, mutable Emotion instance. Recreated only when {@link configureEmotionNonce}
 * is called with a vendor or nonce different from the ones currently configured.
 */
let instance: ReturnType<typeof createEmotion> = createEmotion({key: getVendorPrefix(configuredVendor)});

/**
 * (Re)configures the shared Emotion instance to inject styles under the given vendor's cache
 * key (emitted as the `data-emotion` attribute on its `<style>` tags, so a white-labeled
 * consumer's generated styles stay under their own namespace rather than `thunderid`) and
 * with the given CSP nonce.
 *
 * This must be called synchronously from a component's render body - never from inside a
 * `useEffect`/`useLayoutEffect` - and as early as possible in the render tree (e.g. as the
 * first statement in `ThunderIDProvider`). React's render phase calls function components
 * synchronously and depth-first: a top-level call here runs, and returns, before any
 * descendant component's `css()`/`cx()`/`keyframes()` calls execute during that same render
 * pass. That ordering is what lets the very first paint's injected `<style>` tags already
 * carry the nonce. A `useEffect` runs after commit, once the first (un-nonced) `<style>`
 * tags have already been inserted into `<head>` - by the time the effect fires it is too
 * late to protect that initial paint.
 *
 * Calling this repeatedly with the same vendor/nonce (e.g. once per render) is a cheap no-op:
 * the underlying Emotion cache/instance is only recreated when either actually changes.
 *
 * @param nonce - The CSP nonce to apply to runtime-injected `<style>` tags, or `undefined`
 * to use no nonce.
 * @param vendor - The configured vendor/brand namespace (defaults to the ThunderID vendor
 * prefix, same as every other vendor-scoped key in the SDK).
 */
export function configureEmotionNonce(nonce?: string, vendor?: string): void {
  if (nonce === configuredNonce && vendor === configuredVendor) {
    return;
  }

  configuredNonce = nonce;
  configuredVendor = vendor;
  instance = createEmotion({key: getVendorPrefix(vendor), nonce});
}

export const css: {
  (template: TemplateStringsArray, ...args: CSSInterpolation[]): string;
  (...args: CSSInterpolation[]): string;
} = (...args: [TemplateStringsArray | CSSInterpolation, ...CSSInterpolation[]]): string =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (instance.css as (...cssArgs: any[]) => string)(...args);

export function cx(...classNames: ClassNamesArg[]): string {
  return instance.cx(...classNames);
}

export const keyframes: {
  (template: TemplateStringsArray, ...args: CSSInterpolation[]): string;
  (...args: CSSInterpolation[]): string;
} = (...args: [TemplateStringsArray | CSSInterpolation, ...CSSInterpolation[]]): string =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (instance.keyframes as (...keyframesArgs: any[]) => string)(...args);
