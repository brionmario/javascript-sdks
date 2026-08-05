// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {TokenExchangeRequestConfig, TokenResponse} from '@thunderid/node';
import getSessionIdAction from './actions/getSessionId';
import getClient from './getClient';
import {ThunderIDNextConfig} from '../models/config';

const thunderid = async (): Promise<{
  exchangeToken: (config: TokenExchangeRequestConfig, sessionId: string) => Promise<TokenResponse | Response>;
  getAccessToken: (sessionId: string) => Promise<string>;
  getSessionId: () => Promise<string | undefined>;
  reInitialize: (config: Partial<ThunderIDNextConfig>) => Promise<boolean>;
}> => {
  const getAccessToken = async (sessionId: string): Promise<string> => {
    const client = getClient();
    return client.getAccessToken(sessionId);
  };

  const getSessionId = async (): Promise<string | undefined> => getSessionIdAction();

  const exchangeToken = async (
    config: TokenExchangeRequestConfig,
    sessionId: string,
  ): Promise<TokenResponse | Response> => {
    const client = getClient();
    return client.exchangeToken(config, sessionId);
  };

  const reInitialize = async (config: Partial<ThunderIDNextConfig>): Promise<boolean> => {
    const client = getClient();
    return client.reInitialize(config);
  };

  return {
    exchangeToken,
    getAccessToken,
    getSessionId,
    reInitialize,
  };
};

export default thunderid;
