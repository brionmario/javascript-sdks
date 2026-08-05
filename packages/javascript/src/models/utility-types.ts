// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
