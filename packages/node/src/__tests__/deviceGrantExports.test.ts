// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {executeEmbeddedDeviceGrantFlow as executeFromJavaScript} from '@thunderid/javascript';
import {describe, expect, it} from 'vitest';
import {executeEmbeddedDeviceGrantFlow} from '../index';

describe('Device Grant exports', () => {
  it('exposes the framework-agnostic executor without reimplementing it', () => {
    expect(executeEmbeddedDeviceGrantFlow).toBe(executeFromJavaScript);
  });
});
