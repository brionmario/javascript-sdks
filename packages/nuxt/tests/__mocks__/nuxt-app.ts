// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ref} from 'vue';

export const navigateTo = async (...args: unknown[]): Promise<void> => {
  if (args.length) {
    // noop
  }
};

export const useState = <T>(key: string, init?: () => T): {value: T} => {
  const defaultValue: T = init ? init() : (undefined as unknown as T);
  return ref<T>(defaultValue) as {value: T};
};

export const defineNuxtRouteMiddleware = (fn: Function): Function => fn;

export const useRuntimeConfig = (): Record<string, unknown> => ({});

export const useNuxtApp = (): Record<string, unknown> => ({});
