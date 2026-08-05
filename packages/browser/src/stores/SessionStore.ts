// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Storage} from '@thunderid/javascript';

/**
 * `Storage` implementation backed by the browser's `sessionStorage`.
 */
class SessionStore implements Storage {
  public async setData(key: string, value: string): Promise<void> {
    sessionStorage.setItem(key, value);
  }

  public async getData(key: string): Promise<string> {
    return sessionStorage.getItem(key) ?? '{}';
  }

  public async removeData(key: string): Promise<void> {
    sessionStorage.removeItem(key);
  }
}

export default SessionStore;
