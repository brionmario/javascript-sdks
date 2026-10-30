// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {DeviceGrant as VueDeviceGrant} from '@thunderid/vue';
import {describe, expect, it} from 'vitest';
import DeviceGrant from '../../src/runtime/components/auth/DeviceGrant';

describe('DeviceGrant', () => {
  it('delegates browser verification to the Vue DeviceGrant component', () => {
    expect(DeviceGrant).toBe(VueDeviceGrant);
  });
});
