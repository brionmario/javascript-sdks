// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/** Default cookie configuration values. */
const CookieConfig = {
  defaultExpirySeconds: 86400,
  defaultHttpOnly: true,
  defaultSameSite: 'lax' as const,
  defaultSecure: false,
};

export default CookieConfig;
