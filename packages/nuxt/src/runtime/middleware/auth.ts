// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {defineThunderIDMiddleware} from './defineThunderIDMiddleware';

/**
 * Named route middleware for protecting pages.
 *
 * Registered under the name `'auth'` by the Nuxt module, so pages can
 * opt in by string reference:
 *
 * ```vue
 * <script setup>
 * definePageMeta({ middleware: ['auth'] });
 * </script>
 * ```
 *
 * Equivalent to `defineThunderIDMiddleware()` with no options: redirects
 * unauthenticated users to `/api/auth/signin?returnTo=<path>`. For scope
 * or organization gating, use `defineThunderIDMiddleware({ ... })` directly.
 */
export default defineThunderIDMiddleware();
