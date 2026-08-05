// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {readFileSync} from 'fs';
import {rolldown} from 'rolldown';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const externalPackages = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
const external = (id) => externalPackages.some((dep) => id === dep || id.startsWith(dep + '/'));

const preserveDirectivesPlugin = () => {
  const moduleDirectives = new Map();

  return {
    name: 'preserve-directives',
    transform(code, id) {
      if (!/\.(js|ts|jsx|tsx)$/.test(id) || /node_modules/.test(id)) return null;

      const directives = [];
      let remaining = code;
      const re = /^(['"])use ([^'"]+)\1;?\r?\n/;
      let match;
      while ((match = re.exec(remaining))) {
        directives.push(`"use ${match[2]}"`);
        remaining = remaining.slice(match[0].length);
      }

      if (directives.length === 0) return null;

      moduleDirectives.set(id, directives);
      return {code: remaining, map: null};
    },
    renderChunk(code, chunk) {
      const seen = new Set();
      for (const id of chunk.moduleIds) {
        for (const d of moduleDirectives.get(id) ?? []) seen.add(d);
      }
      if (seen.size === 0) return null;
      return {code: `${[...seen].map((d) => `${d};`).join('\n')}\n${code}`, map: null};
    },
  };
};

const commonOptions = {
  external,
  input: 'src/index.ts',
  platform: 'browser',
  plugins: [preserveDirectivesPlugin()],
};

const esmBundle = await rolldown(commonOptions);
await esmBundle.write({
  dir: 'dist',
  format: 'esm',
  preserveModules: true,
  preserveModulesRoot: 'src',
  sourcemap: true,
});
await esmBundle.close();

const cjsBundle = await rolldown(commonOptions);
await cjsBundle.write({
  dir: 'dist/cjs',
  entryFileNames: '[name].cjs',
  format: 'cjs',
  preserveModules: true,
  preserveModulesRoot: 'src',
  sourcemap: true,
});
await cjsBundle.close();
