// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FlowMetadataResponse} from './flow-meta';
import {TranslationFn} from './translation';

/**
 * Options for the resolveFlowTemplateLiterals function.
 *
 * @template TFn - The concrete translation function type.
 *   Defaults to the SDK-native {@link TranslationFn} signature.
 */
export interface ResolveFlowTemplateLiteralsOptions<TFn extends TranslationFn = TranslationFn> {
  /**
   * Optional flow metadata for resolving `{{ meta(path) }}` expressions.
   */
  meta?: FlowMetadataResponse | null;
  /**
   * i18n translation function for resolving `{{ t(key) }}` expressions.
   */
  t: TFn;
}
