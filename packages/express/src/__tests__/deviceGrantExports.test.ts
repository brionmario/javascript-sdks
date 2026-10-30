// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {executeEmbeddedDeviceGrantFlow as executeFromNode} from '@thunderid/node';
import {describe, expect, it} from 'vitest';
import {executeEmbeddedDeviceGrantFlow} from '../index';

describe('Device Grant exports', () => {
  it('exposes the Node SDK executor without reimplementing it', () => {
    expect(executeEmbeddedDeviceGrantFlow).toBe(executeFromNode);
  });
});
