// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export class DefaultCacheStore implements Storage {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map<string, string>();
  }

  public get length(): number {
    return this.cache.size;
  }

  public getItem(key: string): string | null {
    return this.cache.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.cache.set(key, value);
  }

  public removeItem(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public key(index: number): string | null {
    const keys: string[] = Array.from(this.cache.keys());
    return keys[index] ?? null;
  }

  public async setData(key: string, value: string): Promise<void> {
    this.cache.set(key, value);
  }

  public async getData(key: string): Promise<string> {
    return this.cache.get(key) ?? '{}';
  }

  public async removeData(key: string): Promise<void> {
    this.cache.delete(key);
  }
}
