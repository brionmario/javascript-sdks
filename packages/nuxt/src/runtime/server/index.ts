// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * @thunderid/nuxt/server
 *
 * Public server-only barrel. Import from this subpath to access
 * server utilities without bundling them into the client.
 *
 * @example
 * ```ts
 * import { useServerSession, requireServerSession } from '@thunderid/nuxt/server';
 * ```
 */

export {useServerSession, requireServerSession} from './utils/serverSession';
export {getValidAccessToken} from './utils/token-refresh';
export {getThunderIDContext} from './utils/event-context';
export type {ThunderIDEventContext} from './utils/event-context';

export type {ThunderIDSessionPayload, ThunderIDNuxtConfig} from '../types';
