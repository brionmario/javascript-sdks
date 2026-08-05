// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {defineConfig} from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // Provide a bare-minimum #app alias so unit tests that import from it
      // can be mocked with vi.mock('#app', ...) without a Nuxt dev-server.
      '#app': new URL('./tests/__mocks__/nuxt-app.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
});
