// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {TokenExchangeRequestConfig} from '@thunderid/javascript';

/**
 * Browser-specific token exchange configuration extending the base token exchange config.
 */
export interface SPATokenExchangeConfig extends TokenExchangeRequestConfig {
  /**
   * When `true`, the sign-out URL is not updated after this token exchange
   * (preserves the original sign-out URL across org switches).
   */
  preventSignOutURLUpdate?: boolean;
}

export default SPATokenExchangeConfig;
