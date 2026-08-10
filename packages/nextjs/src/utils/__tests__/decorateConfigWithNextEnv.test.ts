// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {ThunderIDNextConfig} from '../../models/config';
import decorateConfigWithNextEnv from '../decorateConfigWithNextEnv';

describe('decorateConfigWithNextEnv', (): void => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    process.env = {...originalEnv};
    delete process.env['THUNDERID_FLOW_SECRET'];
    delete process.env['THUNDERID_CLIENT_SECRET'];
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  describe('flowSecret', (): void => {
    it('falls back to THUNDERID_FLOW_SECRET when not set on the config', (): void => {
      process.env['THUNDERID_FLOW_SECRET'] = 'flow-secret-from-env';

      expect(decorateConfigWithNextEnv({} as ThunderIDNextConfig).flowSecret).toBe('flow-secret-from-env');
    });

    it('prefers an explicitly configured flowSecret over the environment variable', (): void => {
      process.env['THUNDERID_FLOW_SECRET'] = 'flow-secret-from-env';

      const config: ThunderIDNextConfig = {flowSecret: 'flow-secret-from-config'} as ThunderIDNextConfig;

      expect(decorateConfigWithNextEnv(config).flowSecret).toBe('flow-secret-from-config');
    });

    it('leaves flowSecret undefined when neither the config nor the environment provides one', (): void => {
      expect(decorateConfigWithNextEnv({} as ThunderIDNextConfig).flowSecret).toBeUndefined();
    });

    // The Flow Secret and the OAuth2 client secret are separate credentials issued independently by
    // the server, so neither may stand in for the other.
    it('does not fall back to the client secret', (): void => {
      process.env['THUNDERID_CLIENT_SECRET'] = 'client-secret-from-env';

      const decorated: ThunderIDNextConfig = decorateConfigWithNextEnv({
        clientSecret: 'client-secret-from-config',
      } as ThunderIDNextConfig);

      expect(decorated.flowSecret).toBeUndefined();
      expect(decorated.clientSecret).toBe('client-secret-from-config');
    });

    it('does not leak the flow secret into the client secret', (): void => {
      process.env['THUNDERID_FLOW_SECRET'] = 'flow-secret-from-env';

      expect(decorateConfigWithNextEnv({} as ThunderIDNextConfig).clientSecret).toBeUndefined();
    });
  });
});
