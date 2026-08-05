// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Storage} from '@thunderid/javascript';

/**
 * `Storage` implementation backed by the browser's `localStorage`.
 */
class LocalStore implements Storage {
  public async setData(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  public async getData(key: string): Promise<string> {
    return localStorage.getItem(key) ?? '{}';
  }

  public async removeData(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

export default LocalStore;
