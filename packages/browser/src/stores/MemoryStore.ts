// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Storage} from '@thunderid/javascript';

/**
 * `Storage` implementation backed by an in-memory `Map`. Data does not survive page reloads.
 */
class MemoryStore implements Storage {
  private _data: Map<string, string>;

  public constructor() {
    this._data = new Map();
  }

  public async setData(key: string, value: string): Promise<void> {
    this._data.set(key, value);
  }

  public async getData(key: string): Promise<string> {
    return this._data?.get(key) ?? '{}';
  }

  public async removeData(key: string): Promise<void> {
    this._data.delete(key);
  }
}

export default MemoryStore;
