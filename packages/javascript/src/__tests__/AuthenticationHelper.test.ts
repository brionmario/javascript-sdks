/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import {describe, expect, it, beforeEach} from 'vitest';
import type {IsomorphicCrypto} from '../IsomorphicCrypto';
import type {AuthClientConfig} from '../models/config';
import type {Storage} from '../models/store';
import StorageManager from '../StorageManager';
import AuthenticationHelper from '../utils/AuthenticationHelper';

class MemoryStore implements Storage {
  private store = new Map<string, string>();

  getData(key: string): Promise<string> {
    return Promise.resolve(this.store.get(key) ?? null!);
  }

  setData(key: string, value: string): Promise<void> {
    this.store.set(key, value);

    return Promise.resolve();
  }

  removeData(key: string): Promise<void> {
    this.store.delete(key);

    return Promise.resolve();
  }
}

const BASE_URL = 'https://localhost:8090';

async function initHelper(config: Partial<AuthClientConfig<unknown>>): Promise<AuthenticationHelper<unknown>> {
  const storageManager = new StorageManager<unknown>('test-instance', new MemoryStore());
  await storageManager.setConfigData(config);

  return new AuthenticationHelper<unknown>(storageManager, {} as unknown as IsomorphicCrypto<unknown>);
}

describe('AuthenticationHelper', () => {
  let helper: AuthenticationHelper<unknown>;

  beforeEach(async () => {
    helper = await initHelper({baseUrl: BASE_URL, clientId: 'test-client'});
  });

  describe('resolveEndpointsByBaseURL()', () => {
    it('derives every endpoint under the base URL', async () => {
      const endpoints = await helper.resolveEndpointsByBaseURL();

      expect(endpoints.authorization_endpoint).toBe(`${BASE_URL}/oauth2/authorize`);
      expect(endpoints.token_endpoint).toBe(`${BASE_URL}/oauth2/token`);
      expect(endpoints.jwks_uri).toBe(`${BASE_URL}/oauth2/jwks`);
      expect(endpoints.revocation_endpoint).toBe(`${BASE_URL}/oauth2/revoke`);
      expect(endpoints.userinfo_endpoint).toBe(`${BASE_URL}/oauth2/userinfo`);
      expect(endpoints.issuer).toBe(BASE_URL);
    });

    it('derives the end session endpoint on the path the server actually serves', async () => {
      const endpoints = await helper.resolveEndpointsByBaseURL();

      expect(endpoints.end_session_endpoint).toBe(`${BASE_URL}/oauth2/logout`);
    });

    it('lets explicitly configured endpoints override the derived defaults', async () => {
      const configuredHelper = await initHelper({
        baseUrl: BASE_URL,
        clientId: 'test-client',
        endpoints: {endSessionEndpoint: 'https://idp.example.com/custom/logout'},
      });

      const endpoints = await configuredHelper.resolveEndpointsByBaseURL();

      expect(endpoints.end_session_endpoint).toBe('https://idp.example.com/custom/logout');
      expect(endpoints.token_endpoint).toBe(`${BASE_URL}/oauth2/token`);
    });

    it('throws when no base URL is configured', async () => {
      const helperWithoutBaseUrl = await initHelper({clientId: 'test-client'});

      await expect(helperWithoutBaseUrl.resolveEndpointsByBaseURL()).rejects.toMatchObject({
        code: 'JS-AUTH_HELPER_REBO-NF01',
      });
    });
  });
});
