// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ThunderIDNodeConfig} from '@thunderid/node';

/**
 * Configuration type for the ThunderID Next.js SDK.
 * Extends ThunderIDNodeConfig to provide Next.js-specific authentication configuration.
 *
 * @remarks
 * Configuration options include:
 * - Authentication endpoints and parameters
 * - Next.js specific redirects and middleware settings
 * - Session configuration for Next.js apps
 * - Environment variable integration
 */
export type ThunderIDNextConfig = ThunderIDNodeConfig;
