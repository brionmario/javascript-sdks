// Copyright 2020 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export type AuthorizeRequestUrlParams = Omit<ExtendedAuthorizeRequestUrlParams, 'forceInit'>;

export interface KnownExtendedAuthorizeRequestUrlParams {
  fidp?: string;
  forceInit?: boolean;
}

export type ExtendedAuthorizeRequestUrlParams = KnownExtendedAuthorizeRequestUrlParams &
  Record<string, string | boolean>;
