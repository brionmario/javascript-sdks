// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export const AVATAR_URI_SCHEME = 'avatar:';

/**
 * Checks whether a given URI uses the `avatar:` scheme
 * (e.g. `"avatar:style=rounded,text=Acme,colors=2"`).
 *
 * @param uri - The URI string to check.
 * @returns `true` if the URI starts with `"avatar:"`, `false` otherwise.
 *
 * @example
 * ```typescript
 * isAvatarUri("avatar:style=circle,text=Acme,colors=0"); // true
 * isAvatarUri("emoji:🐯");                                // false
 * ```
 */
const isAvatarUri = (uri: string): boolean => typeof uri === 'string' && uri.startsWith(AVATAR_URI_SCHEME);

export default isAvatarUri;
