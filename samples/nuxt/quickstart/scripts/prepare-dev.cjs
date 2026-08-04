// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

const PREFIX = 'NUXT_PUBLIC_THUNDERID_';
const NATIVE_FLOW_VARS = [`${PREFIX}APPLICATION_ID`, `${PREFIX}SIGN_IN_URL`, `${PREFIX}SIGN_UP_URL`];
const REDIRECT_FLOW_VARS = [`${PREFIX}CLIENT_ID`];

const flowArg = process.argv.find((arg) => arg.startsWith('--flow='));
const flowExplicitlyRequested = Boolean(flowArg);
const flow = flowArg ? flowArg.slice('--flow='.length) : 'native';

if (flowExplicitlyRequested && flow !== 'native' && flow !== 'redirect') {
  console.error(`Unknown --flow value "${flow}". Expected "native" or "redirect".`);
  process.exit(1);
}

/** Toggles the leading `# ` on env var lines to match the selected flow. */
function applyFlow(envContent, selectedFlow) {
  const varsToEnable = selectedFlow === 'redirect' ? REDIRECT_FLOW_VARS : NATIVE_FLOW_VARS;
  const varsToDisable = selectedFlow === 'redirect' ? NATIVE_FLOW_VARS : REDIRECT_FLOW_VARS;

  return envContent
    .split('\n')
    .map((line) => {
      const enable = varsToEnable.find((key) => line.replace(/^#\s*/, '').startsWith(`${key}=`));
      if (enable) return line.replace(/^#\s*/, '');

      const disable = varsToDisable.find((key) => line.startsWith(`${key}=`));
      if (disable) return `# ${line}`;

      return line;
    })
    .join('\n');
}

const envExample = path.join(root, '.env.example');
const envTarget = path.join(root, '.env');

// Only explicit `--flow=` invocations are allowed to (re)write an existing
// .env — a plain `npm run prepare-dev` (e.g. from .stackblitzrc's
// startCommand) stays a safe, idempotent copy-if-missing.
if (fs.existsSync(envExample) && (flowExplicitlyRequested || !fs.existsSync(envTarget))) {
  const envSource = fs.existsSync(envTarget) ? envTarget : envExample;
  const envContent = applyFlow(fs.readFileSync(envSource, 'utf8'), flow)
    // Blank placeholder values (e.g. `your-client-id-here`) so the copied .env
    // still trips the app's missing-env-var check until real values are filled in.
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
