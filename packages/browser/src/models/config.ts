// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Config} from '@thunderid/javascript';

export type ThunderIDBrowserConfig = Config<'sessionStorage' | 'localStorage' | 'browserMemory'>;
