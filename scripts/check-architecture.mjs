import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const violations = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if ([".ts", ".tsx"].includes(extname(path))) await inspect(path);
  }
}

async function inspect(path) {
  const source = await readFile(path, "utf8");
  const normalized = path.replaceAll("\\", "/");
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
      violations.push(`${relative(root, path)}: ${rule.message}`);
    }
  }
}

for (const directory of ["apps", "packages"]) await walk(join(root, directory));

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.info("Architecture dependency checks passed");
}
