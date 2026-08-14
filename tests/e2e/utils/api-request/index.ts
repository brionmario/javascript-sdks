// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Authenticated Backend Request Helpers
 *
 * The plumbing every API helper needs: the backend base URL, an admin bearer token, the
 * self-signed-cert allowance, and one consistent error carrying the status and body.
 *
 * Exported as functions rather than a base class: the helpers are peers, not a hierarchy, and
 * the only shared state (the token) lives in `utils/authentication`, memoized process-wide.
 *
 * Modeled on thunderid/tests/e2e/utils/api-request/index.ts.
 */

import {getAdminToken} from '../authentication';

export const serverUrl = process.env.SERVER_URL ?? 'https://localhost:8090';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

let dispatcherPromise: Promise<unknown> | undefined;

async function insecureDispatcher(): Promise<unknown> {
  dispatcherPromise ??= import('undici').then(({Agent}) => new Agent({connect: {rejectUnauthorized: false}}));
  return dispatcherPromise;
}

/** Authenticated call against the backend. Returns the response as-is, non-2xx included. */
export async function send(method: Method, path: string, data?: unknown): Promise<Response> {
  const token = await getAdminToken();
  return fetch(`${serverUrl}${path}`, {
    body: data === undefined ? undefined : JSON.stringify(data),
    dispatcher: await insecureDispatcher(),
    headers: {
      Authorization: `Bearer ${token}`,
      ...(data === undefined ? {} : {'Content-Type': 'application/json'}),
    },
    method,
  } as RequestInit);
}

/** Same as `send`, but a non-2xx becomes an error carrying the status and response body. */
export async function sendOk(method: Method, path: string, data?: unknown): Promise<Response> {
  const response = await send(method, path, data);
  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${await response.text()}`);
  }
  return response;
}
