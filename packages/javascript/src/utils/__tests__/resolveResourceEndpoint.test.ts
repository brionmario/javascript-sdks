/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {describe, expect, it} from 'vitest';
import resolveResourceEndpoint, {RESOURCE_ENDPOINT_KEYS} from '../resolveResourceEndpoint';

describe('resolveResourceEndpoint', (): void => {
  it('returns undefined when no explicit URL and no override are set (fallback to baseUrl)', (): void => {
    expect(resolveResourceEndpoint('flowExecute', {})).toBeUndefined();
    expect(resolveResourceEndpoint('flowExecute', {endpoints: {}})).toBeUndefined();
    expect(resolveResourceEndpoint('flowExecute', undefined)).toBeUndefined();
  });

  it('returns the config override when set', (): void => {
    const config = {endpoints: {flowExecute: 'https://rs.example.com/flow/execute'}};

    expect(resolveResourceEndpoint('flowExecute', config)).toBe('https://rs.example.com/flow/execute');
  });

  it('resolves each supported resource endpoint key independently', (): void => {
    const config = {
      endpoints: {
        flowExecute: 'https://rs.example.com/flow/execute',
        flowMeta: 'https://rs.example.com/flow/meta',
        usersMe: 'https://rs.example.com/users/me',
      },
    };

    expect(resolveResourceEndpoint('flowExecute', config)).toBe('https://rs.example.com/flow/execute');
    expect(resolveResourceEndpoint('flowMeta', config)).toBe('https://rs.example.com/flow/meta');
    expect(resolveResourceEndpoint('usersMe', config)).toBe('https://rs.example.com/users/me');
  });

  it('prefers an explicit per-call URL over the config override', (): void => {
    const config = {endpoints: {flowExecute: 'https://rs.example.com/flow/execute'}};

    expect(resolveResourceEndpoint('flowExecute', config, 'https://explicit.example.com/flow/execute')).toBe(
      'https://explicit.example.com/flow/execute',
    );
  });

  it('falls back to the config override when the explicit URL is undefined', (): void => {
    const config = {endpoints: {flowExecute: 'https://rs.example.com/flow/execute'}};

    expect(resolveResourceEndpoint('flowExecute', config, undefined)).toBe('https://rs.example.com/flow/execute');
  });

  it('exposes the resource endpoint keys for filtering OIDC metadata', (): void => {
    expect([...RESOURCE_ENDPOINT_KEYS].sort()).toEqual(['flowExecute', 'flowMeta', 'usersMe']);
  });
});
