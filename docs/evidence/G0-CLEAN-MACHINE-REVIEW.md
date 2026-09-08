# Independent clean-machine review — G0-02/G0-03

> Execution template. A reviewer who did not create the scaffold must complete a new record below. Do not let the implementation agent sign the reviewer fields.

## 1. Execution metadata

```text
Repository URL/reference:
Commit reviewed:
Reviewer name/account:
Reviewer role:
Machine/OS:
Started at:
Finished at:
Network/package-registry policy:
Status: NOT STARTED | RUNNING | NOT PASS | PASS
```

## 2. Safety and independence prerequisites

- [ ] Reviewer did not author the scaffold or its Build Profile.
- [ ] Checkout is new or otherwise proven free of implementation-agent build output and untracked files.
- [ ] No PortSIP, CRM, IdP or Production credential/data is present or required.
- [ ] No Docker/Podman, Playwright browser, migration, seed or E2E step is inferred; those remain outside the current Build Profile until G0-06.
- [ ] Package access follows the organization's approved registry/proxy policy.
- [ ] Commit and lockfile checksum/reference are recorded before dependency installation.

## 3. Authoritative command replay

Run only the commands defined in [Build Profile](../BUILD-PROFILE.md):

```powershell
node --version
pnpm --version
git --version
pnpm install --frozen-lockfile
pnpm run check
```

For a headless runner without a TTY, set `CI=true` using the shell's normal syntax before invoking pnpm, as documented in the Build Profile. Do not change the lockfile, approve additional install scripts or suppress a failing gate.

## 4. Results

| Check | Expected | Actual/evidence reference | PASS/FAIL |
|---|---|---|---|
| Node.js | `>=24.15.0 <25` | | |
| pnpm | `>=11.19.0 <12`; project pins `11.19.0` | | |
| Frozen install | No manifest/lockfile mutation; only approved install scripts | | |
| Format | PASS | | |
| ESLint | PASS, zero warnings | | |
| TypeScript strict | PASS for all declared workspace projects | | |
| Unit tests | PASS | | |
| Architecture source scan | PASS | | |
| Architecture allowed/forbidden fixtures | PASS | | |
| Production build | PASS for packages/API/worker/web | | |
| Working tree after replay | Clean; generated output ignored as designed | | |

## 5. Failure capture

For every failure, record the exact command, exit code, relevant redacted output, reproducibility and proposed owner. Never paste tokens, private registry credentials, proprietary SDK binaries or machine secrets.

| Severity | Command/check | Redacted evidence | Reproduces? | Owner | Due | Retest |
|---|---|---|---|---|---|---|
| | | | | | | |

Stop and mark `NOT PASS` when:

- install needs an undeclared script approval or mutates the lockfile;
- the documented Node/pnpm range cannot execute the gate;
- an allowed architecture fixture is rejected or a forbidden fixture is accepted;
- lint/typecheck/test/build fails;
- the replay requires undocumented credentials, service dependencies or commands.

## 6. Independent conclusion

```text
G0-02 scaffold result: PASS | NOT PASS
G0-03 Build Profile result: PASS | NOT PASS
Reviewer rationale:
Evidence location:
Findings with owner/due:
Recommended status change:
Reviewer signature/account and date:
Engineering Lead acceptance and date:
Security/DevOps comments and date:
```

`PASS` from the reviewer is evidence for acceptance review, not automatic `100%`. Engineering Lead/required approvers must confirm the evidence and update the live board according to the PMP completion rules.
