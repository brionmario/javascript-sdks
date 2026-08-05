// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import CookieConfig from '../constants/CookieConfig';
import {SessionCookieConfig} from '../models/config';

const getSessionCookieOptions = (options: Partial<SessionCookieConfig>): Omit<SessionCookieConfig, 'expiryTime'> => ({
  httpOnly: options.httpOnly ?? CookieConfig.DEFAULT_HTTP_ONLY,
  sameSite: options.sameSite ?? CookieConfig.DEFAULT_SAME_SITE,
  secure: options.secure ?? CookieConfig.DEFAULT_SECURE,
});

export default getSessionCookieOptions;
