// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ThunderIDNextConfig} from '../models/config';

const decorateConfigWithNextEnv = (config: ThunderIDNextConfig): ThunderIDNextConfig => {
  const {
    organizationHandle,
    scopes,
    applicationId,
    baseUrl,
    clientId,
    clientSecret,
    flowSecret,
    signInUrl,
    signUpUrl,
    afterSignInUrl,
    afterSignOutUrl,
    vendor,
    ...rest
  } = config;

  const envExpiryTime = process.env['THUNDERID_SESSION_COOKIE_EXPIRY_TIME']
    ? parseInt(process.env['THUNDERID_SESSION_COOKIE_EXPIRY_TIME'], 10)
    : undefined;

  return {
    ...rest,
    afterSignInUrl: afterSignInUrl || process.env['NEXT_PUBLIC_THUNDERID_AFTER_SIGN_IN_URL']!,
    afterSignOutUrl: afterSignOutUrl || process.env['NEXT_PUBLIC_THUNDERID_AFTER_SIGN_OUT_URL']!,
    applicationId: applicationId || process.env['NEXT_PUBLIC_THUNDERID_APPLICATION_ID']!,
    baseUrl: baseUrl || process.env['NEXT_PUBLIC_THUNDERID_BASE_URL']!,
    clientId: clientId || process.env['NEXT_PUBLIC_THUNDERID_CLIENT_ID']!,
    clientSecret: clientSecret || process.env['THUNDERID_CLIENT_SECRET']!,
    flowSecret: flowSecret || process.env['THUNDERID_FLOW_SECRET'],
    organizationHandle: organizationHandle || process.env['NEXT_PUBLIC_THUNDERID_ORGANIZATION_HANDLE']!,
    scopes: scopes || process.env['NEXT_PUBLIC_THUNDERID_SCOPES']!,
    sessionCookie: {
      ...rest.sessionCookie,
      expiryTime: rest.sessionCookie?.expiryTime || envExpiryTime,
    },
    signInUrl: signInUrl || process.env['NEXT_PUBLIC_THUNDERID_SIGN_IN_URL']!,
    signUpUrl: signUpUrl || process.env['NEXT_PUBLIC_THUNDERID_SIGN_UP_URL']!,
    vendor: vendor || process.env['NEXT_PUBLIC_THUNDERID_VENDOR'],
  };
};

export default decorateConfigWithNextEnv;
