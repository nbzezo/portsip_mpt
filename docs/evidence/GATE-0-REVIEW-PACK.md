# Gate 0 review pack

- Prepared: `2026-09-09`
- Prepared by: Codex implementation agent
- Phase authority: Discovery scaffold only
- Product build authority: **Not granted** — `D-010` remains Pending
- Review target: reviewer records the exact `git rev-parse HEAD` containing this pack

## 1. Review outcome requested

This pack asks named reviewers to independently assess `G0-02`, `G0-03` and `G0-05`. It does not request approval for product implementation, hosted CI, synthetic infrastructure, PortSIP access or external side effects.

Expected reviewer decisions:

```text
G0-02: Accept | Return for rework | Remain in verification
G0-03: Accept | Return for rework | Remain in review
G0-05: Accept | Return for rework | Remain in review
Gate 0 overall: Not ready | Ready for next blocked-item assignment
```

Gate 0 overall cannot pass while `G0-04`, `G0-06` and `G0-07` remain blocked.

## 2. Current gate matrix

| Item | Current status | Evidence available | Required authority/gap |
|---|---|---|---|
| `G0-01` — D-023/stack | Accepted / 100% for Discovery scaffold | [ADR-001](../adr/ADR-001-IMPLEMENTATION-STACK.md) | Security/DevOps conditions still apply before D-010 |
| `G0-02` — scaffold | Verification / 80% | [Scaffold and clean-replay evidence](G0-002.md) | Independent Architecture + Security review |
| `G0-03` — Build Profile | In Review / 90% | [Build Profile](../BUILD-PROFILE.md), [independent replay template](G0-CLEAN-MACHINE-REVIEW.md) | Developer independent of scaffold + DevOps sign-off |
| `G0-04` — CI baseline | Blocked / 0% | Acceptance defined in backlog | Named DevOps/QA, repository provider/rules and G0-02 dependency |
| `G0-05` — architecture tests | In Review / 90% | [Architecture-test evidence](G0-005.md) | Engineering Lead + Security rule/path-convention review |
| `G0-06` — synthetic environment | Blocked / 0% | Boundary documented | Docker/container runtime and named DevOps/Security/QA |
| `G0-07` — contributor quick-start | Blocked / 0% | Acceptance defined | G0-03–G0-06 plus junior independent of scaffold |

## 3. Reproducible baseline

Implementation-agent evidence currently shows:

- Node.js `v24.15.0`, pnpm `11.19.0`;
- frozen install and supply-chain policy PASS;
- format and ESLint zero-warning PASS;
- TypeScript strict PASS for declared workspace projects;
- unit tests 2/2 PASS;
- architecture source scan and allowed/forbidden fixtures PASS;
- packages/API/worker/web build PASS;
- same-host clean checkout with `core.autocrlf=true` PASS after `.gitattributes` fixed the Windows CRLF portability defect;
- no PortSIP/CRM/IdP credential, real dial/send, trunk mutation or Production data used.

The independent reviewer must reproduce the authoritative commands from the [Build Profile](../BUILD-PROFILE.md) and complete [G0-CLEAN-MACHINE-REVIEW](G0-CLEAN-MACHINE-REVIEW.md). Same-host evidence is not an independent signature.

## 4. G0-02/G0-03 reviewer focus

- [ ] Exact commit, OS, Node, pnpm and package-registry policy recorded.
- [ ] Fresh/frozen install leaves manifest and lockfile unchanged.
- [ ] Only declared install-script policy is used; no ad hoc package approval.
- [ ] `.gitattributes` keeps tracked text at LF even when Windows Git has `core.autocrlf=true`.
- [ ] `pnpm run check` passes without undocumented service, credential, migration, seed or browser installation.
- [ ] Working tree remains clean after install and gate.
- [ ] Build Profile describes every executed command accurately.

## 5. G0-05 reviewer focus

- [ ] Source scan covers the current `apps` and `packages` trees.
- [ ] Another module's `contracts/public` import is allowed; internal domain/adapter/repository import is denied.
- [ ] Shared primitives are allowed; shared/common persistence, ORM model and repository ownership are denied.
- [ ] Owned DTO paths are allowed; adapter/vendor SDK/vendor DTO dependencies are denied from core layers.
- [ ] Browser PortSIP SDK import is allowed only under `apps/web/src/telephony`.
- [ ] Contract/platform packages cannot depend on NestJS.
- [ ] Fixture harness fails when a forbidden violation disappears and fails when an allowed fixture is rejected.
- [ ] Path conventions match the approved module layout; any change updates checker, fixtures and architecture documentation together.

## 6. Known finding and correction

| Finding | Impact | Correction | Retest |
|---|---|---|---|
| Clean Windows clone converted 55 tracked text files to CRLF and failed Prettier | G0-03 portability/reproducibility failure | Added `.gitattributes`: `* text=auto eol=lf` | Same-host clean clone with `core.autocrlf=true`, frozen install and full gate PASS at `bf760f6` |

No finding above may be silently removed. Reviewer records new findings with severity, owner, due date and retest evidence.

## 7. Open blockers outside this review

| Blocker | Owner needed | Effect |
|---|---|---|
| Named Security, Telephony and QA/Ops accounts absent | Project Owner | Prevents acceptance and any side-effect PoC |
| Exact PortSIP SDK/API/license/sandbox response absent | Telephony Owner + vendor | Blocks `D-002` and TEL/OUT/TRUNK PoCs |
| Git remote, CI provider/definition and protected-branch policy absent | Engineering Lead + DevOps + QA | Keeps `G0-04` blocked; [local preflight evidence](G0-004-G0-006-PREFLIGHT.md) |
| Docker/Podman/nerdctl and synthetic isolation policy absent | DevOps + Security + QA | Keeps `G0-06` and configuration thin slice blocked; [local preflight evidence](G0-004-G0-006-PREFLIGHT.md) |
| Independent junior/fresh reader absent | Engineering Lead + QA | Keeps `DISC-HO-001`/`G0-07` unaccepted |

## 8. Sign-off record

```text
Commit reviewed:
Engineering Lead reviewer/account/date:
Architecture reviewer/account/date:
Security reviewer/account/date:
DevOps reviewer/account/date:
QA reviewer/account/date:

G0-02 outcome and rationale:
G0-03 outcome and rationale:
G0-05 outcome and rationale:
Findings with severity/owner/due/evidence:
Overall Gate 0 state:
Next item authorized as Ready, with assignee/reviewer/due:
```

Acceptance requires named authority, date and reproducible evidence. The implementation agent must not sign both delivery and independent acceptance.
