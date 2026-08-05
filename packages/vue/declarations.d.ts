// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.vue' {
  import type {DefineComponent} from 'vue';

  const component: DefineComponent;
  export default component;
}
