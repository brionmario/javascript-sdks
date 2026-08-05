// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export {default} from './module';

// ── Types ──────────────────────────────────────────────────────────────────
export type {ThunderIDNuxtConfig, ThunderIDSessionPayload, ThunderIDAuthState} from './runtime/types';

// ── Composables ────────────────────────────────────────────────────────────
// The Nuxt-specific `useThunderID` layers navigation overrides over Vue's
// `useThunderID`. The rest are re-exports of `@thunderid/vue` composables —
// their contexts are mounted by `<ThunderIDRoot>` (see runtime/components).
export {useThunderID} from './runtime/composables/useThunderID';
export {useUser, useFlow, useFlowMeta, useTheme} from '@thunderid/vue';
export {useI18n as useThunderIDI18n} from '@thunderid/vue';

// ── Components ─────────────────────────────────────────────────────────────
export {default as ThunderIDRoot} from './runtime/components/ThunderIDRoot';

// ── Middleware ─────────────────────────────────────────────────────────────
export {defineThunderIDMiddleware} from './runtime/middleware/defineThunderIDMiddleware';
export type {ThunderIDMiddlewareOptions} from './runtime/middleware/defineThunderIDMiddleware';

// ── Composable types (re-exported from @thunderid/vue) ─────────────────────
// Only ThunderIDContext is exposed — it is the return type of useThunderID()
// and users may need it to type custom wrappers. The individual *ContextValue
// types are internal implementation details; use ReturnType<typeof useXxx> instead.
export type {ThunderIDContext} from '@thunderid/vue';

// ── Errors ─────────────────────────────────────────────────────────────────
export {ThunderIDError, ErrorCode} from './runtime/errors';
