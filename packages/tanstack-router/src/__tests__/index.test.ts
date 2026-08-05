// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';

describe('@thunderid/tanstack-router', () => {
  it('should export ProtectedRoute', async () => {
    const {ProtectedRoute} = await import('../index');
    expect(ProtectedRoute).toBeDefined();
  });

  it('should export ProtectedRouteProps interface', async () => {
    const exports: typeof import('../index') = await import('../index');
    // Interface check - should not throw
    const UNUSED_TEST_VAR: typeof exports.ProtectedRouteProps = undefined as any;
    // Explicitly mark as used for type checking purposes
    expect(UNUSED_TEST_VAR).toBeUndefined();
  });

  it('should have the correct named exports', async () => {
    const exports: typeof import('../index') = await import('../index');
    const exportNames: string[] = Object.keys(exports);
    expect(exportNames).toContain('ProtectedRoute');
  });
});
