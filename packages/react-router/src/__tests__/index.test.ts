// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';

describe('@thunderid/react-router', () => {
  it('should export ProtectedRoute', async () => {
    const {ProtectedRoute} = await import('../index');
    expect(ProtectedRoute).toBeDefined();
  });
});
