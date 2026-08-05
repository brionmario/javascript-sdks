// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {IdToken} from '../models/token';

/**
 * Extracts the tenant domain from the ID token payload.
 *
 * @deprecated since v1.0.6 — This utility assumes a legacy tenant extraction pattern from the `sub` claim,
 * which may not be reliable. Will be removed in a future version.
 *
 * @param payload - The ID token payload containing the `sub` claim.
 * @param subjectSeparator - The separator used in the `sub` claim to split the user identifier and tenant domain.
 *
 * Consider extracting the tenant domain using a dedicated claim (e.g., `tenant_domain`) when available.
 */
const extractTenantDomainFromIdTokenPayload = (payload: IdToken, subjectSeparator = '@'): string => {
  const uid: string = payload.sub;

  if (!uid) return '';

  const tokens: string[] = uid.split(subjectSeparator);

  // This pattern assumes a format like: `<username>@<something>@<tenant_domain>`
  return tokens.length > 2 ? tokens[tokens.length - 1] : '';
};

export default extractTenantDomainFromIdTokenPayload;
