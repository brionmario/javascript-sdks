// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {readFileSync} from 'fs';
import {rolldown} from 'rolldown';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const externalPackages = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
const external = (id) => externalPackages.some((dep) => id === dep || id.startsWith(dep + '/'));

const commonOptions = {
  external,
  input: 'src/index.ts',
  platform: 'browser',
};

const esmBundle = await rolldown(commonOptions);
await esmBundle.write({
  file: 'dist/index.js',
  format: 'esm',
  sourcemap: true,
});
await esmBundle.close();

const cjsBundle = await rolldown(commonOptions);
await cjsBundle.write({
  file: 'dist/cjs/index.cjs',
  format: 'cjs',
  sourcemap: true,
});
await cjsBundle.close();
