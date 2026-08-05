// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Strips the top-level `scopes` field from a payload and injects it as
 * `inputs.requested_permissions` (space-separated string).
 *
 * The backend reads requested_permissions from UserInputs (the `inputs` map), not a top-level field.
 */
const injectRequestedPermissions = (payload: Record<string, unknown>): Record<string, unknown> => {
  const {scopes, ...rest} = payload;

  const normalizedScopes: string = Array.isArray(scopes)
    ? scopes
        .map((s: unknown) => String(s).trim())
        .filter(Boolean)
        .join(' ')
    : typeof scopes === 'string'
      ? scopes.trim()
      : '';

  if (!normalizedScopes) {
    return rest;
  }

  const existingInputs =
    rest['inputs'] != null && typeof rest['inputs'] === 'object' && !Array.isArray(rest['inputs'])
      ? (rest['inputs'] as Record<string, unknown>)
      : {};

  return {
    ...rest,
    inputs: {
      ...existingInputs,
      requested_permissions: normalizedScopes,
    },
  };
};

export default injectRequestedPermissions;
