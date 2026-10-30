// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {DeviceGrant as ReactDeviceGrant} from '@thunderid/react';
import type {ReactElement} from 'react';
import {describe, expect, it} from 'vitest';
import DeviceGrant, {type DeviceGrantProps} from './DeviceGrant';

describe('DeviceGrant', () => {
  it('delegates browser verification to the React DeviceGrant component', () => {
    const props: DeviceGrantProps = {variant: 'default'};
    const element: ReactElement = DeviceGrant(props) as ReactElement;

    expect(element.type).toBe(ReactDeviceGrant);
    expect(element.props).toMatchObject(props);
  });
});
