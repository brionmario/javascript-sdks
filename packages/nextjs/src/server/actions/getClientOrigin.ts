// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use server';

import {ReadonlyHeaders} from 'next/dist/server/web/spec-extension/adapters/headers';
import {headers} from 'next/headers';

const getClientOrigin = async (): Promise<string> => {
  const headersList: ReadonlyHeaders = await headers();
  const host: string | null = headersList.get('host');
  const protocol: string = headersList.get('x-forwarded-proto') ?? 'http';
  return `${protocol}://${host}`;
};

export default getClientOrigin;
