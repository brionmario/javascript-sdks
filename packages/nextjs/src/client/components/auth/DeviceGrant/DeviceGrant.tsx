// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import {DeviceGrant as ReactDeviceGrant} from '@thunderid/react';
import type {DeviceGrantProps as ReactDeviceGrantProps} from '@thunderid/react';
import type {FC, ReactElement} from 'react';

/** Props supported by the Next.js Device Grant verification component. */
export type DeviceGrantProps = ReactDeviceGrantProps;

/**
 * Next.js client adapter for Device Grant verification.
 *
 * The React component owns the browser flow lifecycle. The Next.js provider's
 * existing React context bridge supplies its base URL, metadata and theme.
 */
const DeviceGrant: FC<DeviceGrantProps> = (props: DeviceGrantProps): ReactElement => <ReactDeviceGrant {...props} />;

DeviceGrant.displayName = 'DeviceGrant';

export default DeviceGrant;
