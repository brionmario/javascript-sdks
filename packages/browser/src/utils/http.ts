// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import ThunderIDBrowserClient from '../ThunderIDBrowserClient';

/**
 * Creates an HTTP utility for making authenticated requests using a `ThunderIDBrowserClient` instance.
 *
 * @param client - The browser client instance to use for requests.
 * @returns An object with `request` and `requestAll` methods bound to the provided client.
 *
 * @example
 * ```typescript
 * const auth = new ThunderIDBrowserClient();
 * await auth.initialize(config);
 * const httpClient = http(auth);
 * const response = await httpClient.request({ url: '/api/data', method: 'GET' });
 * ```
 */
const http = (
  client: ThunderIDBrowserClient,
): {
  request: typeof ThunderIDBrowserClient.prototype.httpRequest;
  requestAll: typeof ThunderIDBrowserClient.prototype.httpRequestAll;
} => {
  return {
    request: client.httpRequest.bind(client),
    requestAll: client.httpRequestAll.bind(client),
  };
};

export default http;
