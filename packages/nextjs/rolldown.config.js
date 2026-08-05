// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {readFileSync} from 'fs';
import {join} from 'path';
import {defineConfig} from 'rolldown';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const externalPackages = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
const external = (id) => externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

const commonOptions = {
  input: [join('src', 'index.ts'), join('src', 'server', 'index.ts')],
  external,
  platform: 'node',
};

export default defineConfig([
  // ESM build
  {
    ...commonOptions,
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
  // CommonJS build
  {
    ...commonOptions,
    output: {
      dir: join('dist', 'cjs'),
      entryFileNames: '[name].cjs',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
]);
