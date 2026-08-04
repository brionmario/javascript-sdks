// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

const envExample = path.join(root, '.env.example');
const envTarget = path.join(root, '.env');
if (fs.existsSync(envExample) && !fs.existsSync(envTarget)) {
  // Blank placeholder values (e.g. `your-client-id-here`) so the copied .env
  // still trips the app's missing-env-var check until real values are filled in.
  const envContent = fs
    .readFileSync(envExample, 'utf8')
    .replace(/^([A-Z0-9_]+)=(your-\S*|generate-with-\S*)$/gm, '$1=');
  fs.writeFileSync(envTarget, envContent);
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
