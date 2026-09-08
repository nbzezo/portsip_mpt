# Evidence — DISC-ARC-001 Extensible architecture baseline

- Date: `2026-09-08`
- Status: `In Review / 90%`
- Assignee: `Codex implementation agent`
- Accountable/approver for Discovery baseline: `Project Owner/user`
- Required before product build: named Security, Product/Data và Operations reviewers

## Baseline đã chốt cho Discovery/PoC

| Decision | Outcome |
|---|---|
| D-016 Authorization | Deny-by-default; RBAC capability + ABAC + resource relationship; server PEP/PDP; field/action obligations trên API/realtime/export |
| D-017 Data scope | `tenant → business unit → team` và resource relationships; mọi tenant-owned record/event có `app_tenant_id`; không default tenant khi mapping lỗi |
| D-018 Field/form | Core typed columns; versioned JSON Schema + JSONB custom data; typed projection/index có quota; legacy instance pin schema version |
| D-019 Workflow/logic | Declarative DSL + allowlisted action/guard/timer registry; không arbitrary JS/SQL/URL/plugin; auth/compliance/call FSM là code-owned invariant |
| D-020 Settings | Typed server catalog, scope/precedence/effective chain; frontend expose operator-safe trước, approval cho advanced, secret write-only, system root không expose |
| D-021 Lifecycle | Draft → validate → simulate → approve → publish/schedule → effective → rollback; immutable published revision; migration explicit/dry-run |
| D-022 Extension | Typed ports/registry + conformance/architecture/compatibility tests; logic pack có owner/version/health/timeout/kill switch |

## Artifact

- Thiết kế chi tiết: `docs/08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md`.
- Code boundary: contract packages, telephony wrapper và architecture check trong scaffold.
- Test bắt buộc: `docs/04-DISCOVERY-POC.md`, `docs/10-CHUAN-CODE-REVIEW-VA-DEFINITION-OF-DONE.md` và `docs/12-CHIEN-LUOC-TEST-DEBUG-VA-RUNBOOK.md`.

## Acceptance còn thiếu

- Representative data-access matrix và field masking/export negative tests.
- Config/form/workflow thin slice với publish, version pin, restart, migration và rollback evidence.
- Named Security/Product/Ops sign-off. Vì thiếu các bằng chứng này, task tối đa 90% và các decision vẫn có verification condition trước D-010.
