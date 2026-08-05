// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import ThunderIDNextClient from '../ThunderIDNextClient';

let _instance: ThunderIDNextClient | undefined;

/**
 * Returns the shared `ThunderIDNextClient` instance for this Node.js process.
 * Creates a new instance on first call; subsequent calls return the same instance.
 *
 * @returns The shared ThunderIDNextClient instance.
 */
const getClient = (): ThunderIDNextClient => {
  if (!_instance) {
    _instance = new ThunderIDNextClient();
  }
  return _instance;
};

export default getClient;
