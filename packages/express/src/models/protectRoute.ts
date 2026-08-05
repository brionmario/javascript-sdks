// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import express from 'express';

/**
 * Callback invoked when an unauthenticated request hits a protected route.
 */
export type UnauthenticatedCallback = (res: express.Response) => void;
