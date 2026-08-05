// Copyright 2020 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {IdToken} from '../models/token';

/**
 * Removes standard protocol-specific claims from the ID token payload
 * and returns an object of user-specific claims with original attribute names preserved.
 *
 * @param payload The raw ID token payload.
 * @returns A cleaned-up object containing only user-specific claims with original attribute names.
 *
 * @example
 * ````typescript
 * const idTokenPayload = {
 *   iss: 'https://example.com',
 *   aud: 'client_id',
 *   exp: 1712345678,
 *   iat: 1712345670,
 *   email: 'user@example.com',
 *   given_name: 'John'
 *  };
 *
 * const userClaims = extractUserClaimsFromIdToken(idTokenPayload);
 * // userClaims will be:
 * // {
 * //   email: 'user@example.com',
 * //   given_name: 'John'
 * // }
 * ```
 */
const extractUserClaimsFromIdToken = (payload: IdToken): Record<string, unknown> => {
  const filteredPayload: Partial<IdToken> = {...payload};

  const protocolClaims: string[] = [
    'iss',
    'aud',
    'exp',
    'iat',
    'acr',
    'amr',
    'azp',
    'auth_time',
    'nonce',
    'c_hash',
    'at_hash',
    'nbf',
    'isk',
    'sid',
    'jti',
    'sub',
  ];

  protocolClaims.forEach((claim: string) => {
    delete filteredPayload[claim as keyof IdToken];
  });

  return filteredPayload as Record<string, unknown>;
};

export default extractUserClaimsFromIdToken;
