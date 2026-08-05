// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Generic translation function type.
 *
 * The default parameter type (`Record<string, string | number>`) matches the
 * common i18n signature used throughout the SDK. Consumers can supply a more
 * specific type when integrating with third-party i18n libraries.
 *
 * @template TParams - The type of the optional interpolation parameters object.
 *
 * @example
 * // Using the default (SDK-native) signature
 * const t: TranslationFn = (key, params) => i18n.t(key, params);
 *
 * // Using react-i18next's TFunction as TParams
 * const t: TranslationFn<Record<string, unknown>> = i18nextT;
 */
export type TranslationFn<TParams = Record<string, string | number>> = (key: string, params?: TParams) => string;
