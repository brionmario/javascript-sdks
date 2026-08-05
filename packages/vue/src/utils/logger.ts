// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {createPackageComponentLogger, createPackageLogger} from '@thunderid/browser';

const PACKAGE_NAME = '@thunderid/vue';

/**
 * Package-level logger for `@thunderid/vue`.
 * Use this when logging is not tied to a specific component.
 */
const logger: ReturnType<typeof createPackageLogger> = createPackageLogger(PACKAGE_NAME);

/**
 * Creates a component-scoped logger prefixed with `@thunderid/vue - <component>`.
 *
 * @param component - The component or module name (e.g. `'ThunderIDProvider'`).
 */
export const createVueLogger = (component: string): ReturnType<typeof createPackageComponentLogger> =>
  createPackageComponentLogger(PACKAGE_NAME, component);

export default logger;
