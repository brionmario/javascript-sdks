// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {InternalAuthAPIRoutes} from '../models/api';

const InternalAuthAPIRoutesConfig: InternalAuthAPIRoutes = {
  session: '/api/auth/session',
  signIn: '/api/auth/signin',
  signOut: '/api/auth/signout',
  signUp: undefined,
  user: '/api/auth/user',
};

export default InternalAuthAPIRoutesConfig;
