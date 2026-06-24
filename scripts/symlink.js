#!/usr/bin/env node
/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Builds SDK packages, then prints link: paths and catalog version entries for use in package.json.
//
// Usage:
//   node scripts/link.js              # all packages
//   node scripts/link.js react        # only packages/react
//   node scripts/link.js react browser
import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const packagesDir = join(root, "packages");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
};

const args = process.argv.slice(2);
const allPackages =
  args.length > 0
    ? args
    : readdirSync(packagesDir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);

const run = (cmd, cwd) =>
  execSync(cmd, { cwd, stdio: "inherit" });

// Collect valid packages first
const packageInfos = [];
for (const pkg of allPackages) {
  const pkgDir = join(packagesDir, pkg);
  if (!existsSync(join(pkgDir, "package.json"))) {
    console.error(`${c.yellow}⚠  Skipping '${pkg}': no package.json found${c.reset}`);
    continue;
  }
  const { name } = require(join(pkgDir, "package.json"));
  packageInfos.push({ pkg, pkgDir, name });
}

// Build all in one pnpm -r command so it respects workspace dependency order
const filterArgs = packageInfos.map(({ name }) => `--filter ${name}`).join(" ");
console.error(`${c.dim}▶ building ${packageInfos.map((i) => i.name).join(", ")}...${c.reset}`);
run(`pnpm -r ${filterArgs} build`, root);

for (const { name, pkgDir } of packageInfos) {
  console.error(`  ${c.green}✓${c.reset} ${c.gray}${pkgDir}${c.reset}`);
}

console.error("");
console.error(`${c.bold}${c.cyan}────────────────────────────────────────────${c.reset}`);
console.error(`${c.bold}${c.cyan}  file: entries — paste into package.json:${c.reset}`);
console.error(`${c.bold}${c.cyan}────────────────────────────────────────────${c.reset}`);
for (const { name, pkgDir } of packageInfos) {
  process.stdout.write(`  ${c.bold}"${name}"${c.reset}: ${c.green}"file:${pkgDir}"${c.reset}\n`);
}

console.error("");
console.error(`${c.bold}${c.cyan}────────────────────────────────────────────${c.reset}`);
console.error(`${c.bold}${c.cyan}  overrides — paste into pnpm-workspace.yaml:${c.reset}`);
console.error(`${c.bold}${c.cyan}────────────────────────────────────────────${c.reset}`);
process.stdout.write(`${c.bold}overrides:${c.reset}\n`);
for (const { name, pkgDir } of packageInfos) {
  process.stdout.write(`  ${c.bold}"${name}"${c.reset}: ${c.green}"file:${pkgDir}"${c.reset}\n`);
}

console.error("");
console.error(`${c.bold}${c.cyan}────────────────────────────────────────────${c.reset}`);
console.error(`${c.bold}${c.cyan}  catalog — paste into pnpm-workspace.yaml:${c.reset}`);
console.error(`${c.bold}${c.cyan}────────────────────────────────────────────${c.reset}`);
process.stdout.write(`${c.bold}catalog:${c.reset}\n`);
for (const { name, pkgDir } of packageInfos) {
  process.stdout.write(`  ${c.bold}"${name}"${c.reset}: ${c.green}"file:${pkgDir}"${c.reset}\n`);
}
