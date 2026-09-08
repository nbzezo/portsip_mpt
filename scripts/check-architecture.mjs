import { readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const rootArgumentIndex = process.argv.indexOf("--root");
if (rootArgumentIndex !== -1 && !process.argv[rootArgumentIndex + 1]) {
  throw new Error("--root requires a directory path");
}
const root = resolve(
  rootArgumentIndex === -1
    ? process.cwd()
    : process.argv[rootArgumentIndex + 1],
);
/** @type {string[]} */
const violations = [];

/** @param {string} directory */
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if ([".ts", ".tsx"].includes(extname(path))) await inspect(path);
  }
}

/** @param {string} path */
async function inspect(path) {
  const source = await readFile(path, "utf8");
  const normalized = path.replaceAll("\\", "/");
  const relativePath = relative(root, path).replaceAll("\\", "/");
  const importSpecifiers = extractImportSpecifiers(source);
  const rules = [
    {
      applies: normalized.includes("/packages/"),
      pattern: /from ["']@nestjs\//,
      message: "contract/platform packages must not depend on NestJS",
    },
    {
      applies: !normalized.includes("/apps/web/src/telephony/"),
      pattern: /from ["'](?!@portsip-cc\/)[^"']*portsip[^"']*["']/i,
      message: "only apps/web/src/telephony may import the browser PortSIP SDK",
    },
  ];
  for (const rule of rules) {
    if (rule.applies && rule.pattern.test(source)) {
      addViolation(relativePath, rule.message);
    }
  }

  inspectModuleBoundary(path, relativePath, importSpecifiers);
  inspectSharedKernel(relativePath);
  inspectCoreLayerImports(relativePath, importSpecifiers);
}

/**
 * @param {string} source
 * @returns {string[]}
 */
function extractImportSpecifiers(source) {
  /** @type {string[]} */
  const specifiers = [];
  const pattern =
    /(?:from\s+|import\s*\(\s*|require\s*\(\s*|import\s+)["']([^"']+)["']/g;
  for (const match of source.matchAll(pattern)) specifiers.push(match[1]);
  return specifiers;
}

/**
 * @param {string} path
 * @param {string} relativePath
 * @param {string[]} importSpecifiers
 */
function inspectModuleBoundary(path, relativePath, importSpecifiers) {
  const sourceModule = relativePath.match(
    /^apps\/api\/src\/modules\/([^/]+)\//,
  )?.[1];
  if (!sourceModule) return;

  for (const specifier of importSpecifiers) {
    if (!specifier.startsWith(".")) continue;
    const target = relative(root, resolve(dirname(path), specifier)).replaceAll(
      "\\",
      "/",
    );
    const targetMatch = target.match(
      /^apps\/api\/src\/modules\/([^/]+)\/(.+)$/,
    );
    if (!targetMatch || targetMatch[1] === sourceModule) continue;

    const targetSurface = targetMatch[2];
    if (/^contracts\/public(?:[/.]|$)/.test(targetSurface)) continue;

    addViolation(
      relativePath,
      "modules may only import another module through contracts/public",
    );
  }
}

/** @param {string} relativePath */
function inspectSharedKernel(relativePath) {
  const isSharedSource = /\/(?:shared|common)\//.test(`/${relativePath}`);
  const ownsPersistenceDetail =
    /\/(?:persistence|database|repositories?)\//i.test(`/${relativePath}`) ||
    /(?:^|\/)[^/]*(?:orm|repository|\.entity)\.[cm]?[jt]sx?$/i.test(
      relativePath,
    );

  if (isSharedSource && ownsPersistenceDetail) {
    addViolation(
      relativePath,
      "shared/common must not own ORM models, persistence, or repositories",
    );
  }
}

/**
 * @param {string} relativePath
 * @param {string[]} importSpecifiers
 */
function inspectCoreLayerImports(relativePath, importSpecifiers) {
  const isCoreLayer =
    /^apps\/api\/src\/modules\/[^/]+\/(?:domain|application|contracts)\//.test(
      relativePath,
    ) ||
    /^packages\/(?:api|authorization|configuration|event)-contracts\//.test(
      relativePath,
    );
  if (!isCoreLayer) return;

  for (const specifier of importSpecifiers) {
    if (specifier.startsWith("@portsip-cc/")) continue;
    if (
      /(?:^|[/@_-])portsip(?:[/_-]|$)|\/(?:adapters?|infrastructure)\/|(?:^|[/_-])vendor(?:[/_-]|$)|(?:^|[/_-])sdk(?:[/_-]|$)/i.test(
        specifier,
      )
    ) {
      addViolation(
        relativePath,
        "domain/application/public contracts must not import adapters, vendor SDKs, or vendor DTOs",
      );
    }
  }
}

/**
 * @param {string} relativePath
 * @param {string} message
 */
function addViolation(relativePath, message) {
  const violation = `${relativePath}: ${message}`;
  if (!violations.includes(violation)) violations.push(violation);
}

for (const directory of ["apps", "packages"]) await walk(join(root, directory));

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.info("Architecture dependency checks passed");
}
