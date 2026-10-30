// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {DeviceGrant} from '@thunderid/vue';

/**
 * Nuxt adapter for the Vue Device Grant verification component.
 *
 * ThunderIDRoot supplies the Vue SDK contexts; the delegated component owns
 * the browser flow lifecycle and does not create a Nuxt authentication session.
 */
export default DeviceGrant;
