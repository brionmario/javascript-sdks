// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import isAvatarUri, {AVATAR_URI_SCHEME} from './isAvatarUri';

export type AvatarShape = 'circle' | 'rounded';

export type AvatarVariant = 'anonymous_animal' | 'anonymous_entity' | 'blank' | 'one_letter' | 'two_letter';

export interface AvatarParams {
  /**
   * Explicit flat background color override (e.g. `#FF5733`). When set, replaces the
   * derived gradient (letter variants) or the curated icon color (`anonymous_animal`/
   * `anonymous_entity`).
   */
  bg?: string;
  /**
   * Gradient rotation index for letter variants (ignored by `anonymous_animal`/`anonymous_entity`).
   */
  colors: number;
  /**
   * The rendered payload: pre-computed initials (e.g. `"BM"`) for `one_letter`/`two_letter`,
   * a lowercase animal key (e.g. `"jackalope"`) for `anonymous_animal`, a lowercase entity key
   * (e.g. `"hexagon"`) for `anonymous_entity`, or unused (empty) for `blank`.
   */
  content: string;
  /**
   * Background shape.
   */
  shape: AvatarShape;
  /**
   * What's drawn on the background.
   */
  variant: AvatarVariant;
}

const DEFAULT_PARAMS: AvatarParams = {colors: 0, content: '', shape: 'rounded', variant: 'two_letter'};

/**
 * Parses the comma-separated `key=value` pairs of an `avatar:` URI, e.g.
 * `"avatar:shape=circle,variant=two_letter,content=BM,colors=2,bg=#FF5733"`.
 *
 * @param uri - A URI string in the form `"avatar:shape=...,variant=...,content=...,colors=...,bg=..."`.
 * @returns The parsed avatar parameters, falling back to defaults for any missing/invalid field.
 *
 * @example
 * ```typescript
 * extractAvatarParamsFromUri("avatar:shape=circle,variant=anonymous_animal,content=jackalope");
 * // { shape: "circle", variant: "anonymous_animal", content: "jackalope", colors: 0 }
 * ```
 */
const extractAvatarParamsFromUri = (uri: string): AvatarParams => {
  if (!isAvatarUri(uri)) {
    return {...DEFAULT_PARAMS};
  }

  const raw: string = uri.slice(AVATAR_URI_SCHEME.length);
  const params: Record<string, string> = {};

  raw.split(',').forEach((pair: string) => {
    const [key, ...rest] = pair.split('=');
    if (key) {
      params[key.trim()] = rest.join('=').trim();
    }
  });

  const shape: AvatarShape = ['circle', 'rounded'].includes(params['shape'])
    ? (params['shape'] as AvatarShape)
    : DEFAULT_PARAMS.shape;
  const variant: AvatarVariant = ['anonymous_animal', 'anonymous_entity', 'blank', 'one_letter', 'two_letter'].includes(
    params['variant'],
  )
    ? (params['variant'] as AvatarVariant)
    : DEFAULT_PARAMS.variant;
  const colors: number = Number.parseInt(params['colors'], 10);

  return {
    ...(params['bg'] ? {bg: params['bg']} : {}),
    colors: Number.isFinite(colors) ? colors : DEFAULT_PARAMS.colors,
    content: params['content'] ?? DEFAULT_PARAMS.content,
    shape,
    variant,
  };
};

export default extractAvatarParamsFromUri;
