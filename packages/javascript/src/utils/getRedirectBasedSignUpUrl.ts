// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import isRecognizedBaseUrlPattern from './isRecognizedBaseUrlPattern';
import logger from './logger';
import {Config} from '../models/config';

/**
 * Utility to generate the redirect-based sign-up URL for ThunderID.
 *
 * If the baseUrl is recognized (standard ThunderID pattern), constructs the sign-up URL.
 * Otherwise, returns an empty string.
 *
 * @param config - The ThunderID client configuration
 * @returns The sign-up URL if baseUrl is recognized, otherwise an empty string
 */
const getRedirectBasedSignUpUrl = (config: Config): string => {
  const {baseUrl} = config;

  if (!isRecognizedBaseUrlPattern(baseUrl)) return '';

  let signUpBaseUrl: string = baseUrl!;

  try {
    const url: URL = new URL(baseUrl!);

    // Replace 'api.' with 'accounts.' in the hostname, preserving subdomains like 'dev.'
    if (/([a-z0-9-]+\.)*api\.thunderid\.io$/i.test(url.hostname)) {
      url.hostname = url.hostname.replace('api.', 'accounts.');
      signUpBaseUrl = url.toString().replace(/\/$/, '');
    }
  } catch {
    logger.debug(
      `[getRedirectBasedSignUpUrl] Could not parse base URL to replace 'api.' with 'accounts.'. Base URL: ${baseUrl}`,
    );
  }

  const url: URL = new URL(`${signUpBaseUrl}/accountrecoveryendpoint/register.do`);

  if (config.clientId) {
    url.searchParams.set('client_id', config.clientId);
  }

  if (config.applicationId) {
    url.searchParams.set('spId', config.applicationId);
  }

  logger.debug(`[getRedirectBasedSignUpUrl] Generated sign-up URL: ${url.toString()}`);

  return url.toString();
};

export default getRedirectBasedSignUpUrl;
