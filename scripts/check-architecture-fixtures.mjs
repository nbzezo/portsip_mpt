import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const checker = join(scriptDirectory, "check-architecture.mjs");
const fixtureDirectory = join(
  scriptDirectory,
  "..",
  "tests",
  "architecture",
  "fixtures",
);

function runFixture(name) {
  return spawnSync(
    process.execPath,
    [checker, "--root", join(fixtureDirectory, name)],
    { encoding: "utf8" },
  );
}

const allowedResult = runFixture("allowed-imports");
if (allowedResult.error) throw allowedResult.error;

const allowedOutput = `${allowedResult.stdout}${allowedResult.stderr}`;
if (allowedResult.status !== 0) {
  console.error(
    `Expected the allowed-import fixture to exit with code 0, received ${String(allowedResult.status)}.`,
  );
  console.error(allowedOutput);
  process.exit(1);
}

const forbiddenResult = runFixture("forbidden-imports");
if (forbiddenResult.error) throw forbiddenResult.error;

const forbiddenOutput = `${forbiddenResult.stdout}${forbiddenResult.stderr}`;
const expectedViolations = [
  "packages/contracts/src/forbidden-nest-import.ts: contract/platform packages must not depend on NestJS",
  "apps/web/src/features/agent/forbidden-portsip-import.ts: only apps/web/src/telephony may import the browser PortSIP SDK",
  "apps/api/src/modules/campaigns/application/forbidden-people-repository-import.ts: modules may only import another module through contracts/public",
  "apps/api/src/shared/persistence/user-orm-entity.ts: shared/common must not own ORM models, persistence, or repositories",
  "apps/api/src/modules/interactions/domain/forbidden-vendor-dto-import.ts: domain/application/public contracts must not import adapters, vendor SDKs, or vendor DTOs",
];

if (forbiddenResult.status !== 1) {
  console.error(
    `Expected the forbidden-import fixture to exit with code 1, received ${String(forbiddenResult.status)}.`,
  );
  console.error(forbiddenOutput);
  process.exit(1);
}

const missingViolations = expectedViolations.filter(
  (violation) => !forbiddenOutput.replaceAll("\\", "/").includes(violation),
);

if (missingViolations.length > 0) {
  console.error(
    "Architecture checker did not report every expected violation:",
  );
  console.error(missingViolations.join("\n"));
  console.error(forbiddenOutput);
  process.exit(1);
}

console.info("Architecture allowed and forbidden fixtures passed");
