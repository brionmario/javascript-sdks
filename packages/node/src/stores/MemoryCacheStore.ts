// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Storage} from '@thunderid/javascript';
import cache from 'memory-cache';

/**
 * In-memory key-value store backed by `memory-cache`.
 * Used as the default storage when no custom store is provided to `ThunderIDNodeClient`.
 */
class MemoryCacheStore implements Storage {
  public async setData(key: string, value: string): Promise<void> {
    cache.put(key, value);
  }

  public async getData(key: string): Promise<string> {
    return cache.get(key) ?? '{}';
  }

  public async removeData(key: string): Promise<void> {
    cache.del(key);
  }
}

export default MemoryCacheStore;
