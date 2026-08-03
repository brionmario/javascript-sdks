// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

const envExample = path.join(root, '.env.example');
const envTarget = path.join(root, '.env.local');
if (fs.existsSync(envExample) && !fs.existsSync(envTarget)) {
  fs.copyFileSync(envExample, envTarget);
}

const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

for (const field of ['dependencies', 'devDependencies']) {
  const deps = pkg[field];
  if (!deps) continue;
  for (const [name, version] of Object.entries(deps)) {
    if (version.startsWith('workspace:')) {
      deps[name] = 'latest';
    }
  }
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
