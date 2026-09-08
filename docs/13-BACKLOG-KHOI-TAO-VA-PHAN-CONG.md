# Backlog khởi tạo và hướng dẫn phân công

## 1. Mục đích

Tài liệu này chuyển kiến trúc thành các work item có thể giao cho team tiếp nhận. Nó không thay sprint planning; estimate chi tiết chỉ thực hiện sau Discovery/PoC, capacity và D-023. Mỗi item dưới đây phải được tạo trong công cụ quản lý dự án với link đến acceptance/test evidence. Work item chưa xuất hiện trong [TASKS.md](../TASKS.md) hoặc tracker chính thức mặc định là `Not Started / 0%`; quy tắc trạng thái, roll-up và acceptance nằm trong [PMP control checklist](15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md).

Mức thực hiện:

- `J`: junior có thể làm với task rõ và reviewer được chỉ định.
- `M`: mid-level hoặc junior pair với mid/lead.
- `L`: Tech Lead/Security/Telephony/Data owner phải thiết kế hoặc trực tiếp review trước merge.
- `S`: specialist/business owner phải cung cấp evidence hoặc phê duyệt.

`J` không có nghĩa được tự merge. Mọi thay đổi authorization, external side effect, schema migration hoặc secret vẫn cần reviewer phù hợp.

## 2. Definition of Ready chung

Work item chỉ vào sprint khi có:

- [ ] Business outcome và non-goal.
- [ ] Owner module và public contract liên quan.
- [ ] Capability, resource scope, field classification và audit action.
- [ ] Success, validation, denied, timeout, duplicate và unknown-result cases.
- [ ] Dữ liệu/source of truth và migration/retention impact.
- [ ] Idempotency/concurrency/transaction boundary.
- [ ] UI states và accessibility nếu có frontend.
- [ ] Test layer, fixture và evidence cần nộp.
- [ ] Dependency/decision ID; không còn câu “tùy implementation” ở đường critical.
- [ ] Reviewer và người được phép approve production behavior.

Mẫu mô tả ticket:

```text
Why / user outcome:
In scope / out of scope:
Owner module:
API/event/data contract:
Capability/resource/field policy:
Happy path:
Negative/failure/duplicate/timeout path:
Observability/audit:
Acceptance tests:
Dependencies/decision IDs:
Rollout/flag/migration:
Reviewer(s):
```

## 3. Gate 0 — quyết định và scaffold

**Trạng thái phân công hiện tại:** D-010 vẫn `Pending`; chỉ Discovery/Feasibility PoC được phép chạy. Trước G0-01, team chỉ làm decision/evidence và thí nghiệm stack-neutral; không cài dependency hoặc tạo framework scaffold. G0-02 chỉ bắt đầu sau khi D-023 có outcome `Approved`, trong môi trường PoC với owner, stop condition và cleanup đã ghi. Kết quả PoC không tự trở thành production baseline. Product build, production credential/data, real outbound dial và thay đổi PortSIP effective configuration phải chờ D-010 có outcome `Approved`/gate `Go` cùng các security/telephony gate liên quan.

Junior mới hiện chưa được tự chọn một ticket business-code để bắt đầu. Starter duy nhất đang `Ready` là `DISC-HO-001` trong [Current Work Ledger](14-CONG-VIEC-HIEN-TAI.md); công việc này chỉ kiểm định tài liệu, không cần scaffold/credential/network. `G0-07` chỉ bắt đầu sau khi `G0-03` có Build Profile chạy thật. Nếu ticket không ghi rõ nó là `Discovery evidence`, `PoC-only` hay `Production build`, ticket chưa đạt Definition of Ready.

| ID | Mức | Deliverable | Acceptance |
|---|---:|---|---|
| G0-01 | L+S | Khóa D-023 reference stack/toolchain | Language/framework/package manager/DB access/migration/test/build/container/CI versions và owners được Approved |
| G0-02 | L | Tạo monorepo skeleton | Có `apps/web`, `apps/api`, `apps/worker`, modules/contracts/platform/test/tooling theo sổ tay; scaffold PoC chỉ được promote/recreate làm production baseline sau D-010 Go |
| G0-03 | M | Build Profile | Người mới clone → install → start dependency → migrate → seed → test → build bằng command đã kiểm chứng |
| G0-04 | M | CI baseline | Format/lint/type/unit/build chạy; artifact và test result lưu; protected branch/reviewer rules được cấu hình |
| G0-05 | L | Architecture dependency tests | Import nội bộ/cross-module repository/shared ORM/vendor DTO leak bị CI chặn bằng negative fixture |
| G0-06 | M | Local/CI synthetic environment | PostgreSQL/Redis/fake IdP/fake PortSIP/fake CRM start deterministic; không có route/secret Production |
| G0-07 | J | Contributor quick-start validation | Một junior không tham gia scaffold làm theo tài liệu và ghi mọi bước thiếu; Build Profile được sửa tới khi pass |

Không làm Agent UI hay campaign CRUD trước G0-01 đến G0-06; nếu không, module boundary, auth context và contract sẽ bị vá ngược.

## 4. Epic A — Platform Kernel

| ID | Mức | Deliverable | Acceptance |
|---|---:|---|---|
| A-01 | M | Request context + correlation middleware | Server tạo request/trace ID; tenant/subject từ authenticated mapping; body/header giả tenant bị bỏ qua/reject |
| A-02 | J | Stable problem response mapper | Các canonical domain/infrastructure errors map đúng status/code; không stack/SQL/vendor secret; contract fixtures pass |
| A-03 | L+M | Unit of Work + transaction boundary | Application handler commit aggregate/outbox atomically; rollback không để orphan event |
| A-04 | M | Outbox publisher | At-least-once; giữ nguyên event ID qua retry; crash trước publish và sau publish/trước mark, hai relay tranh row đều có test; lag/DLQ metrics và shutdown drain |
| A-05 | M | Inbox consumer base | Unique consumer+event ID; version/schema validation; duplicate ack; poison message quarantine |
| A-06 | M | Durable job scheduler | Lease, heartbeat, attempt/max, idempotency, retry/DLQ/reconcile state; restart test pass |
| A-07 | J | Health/readiness endpoints | Phân biệt liveness/readiness/degraded; không lộ config/secret; dependency status có owner/action |
| A-08 | M | Audit writer | Append-only canonical schema; high-risk allow/deny coverage; PII/secret redaction tests |
| A-09 | J+M | Observability helpers | Structured log/trace/event metrics có correlation; cardinality/PII lint tests |
| A-10 | M | Feature-flag adapter | Provider-neutral port, typed defaults, scope/expiry/owner/kill switch; flag không cấp quyền |

## 5. Epic B — Identity, organization và authorization

| ID | Mức | Deliverable | Acceptance |
|---|---:|---|---|
| B-01 | L+S | Capability catalog + role templates | Naming/owner/risk/data actions được duyệt; Agent/Supervisor/Campaign/Compliance/Telephony/Platform templates không cấp PII mặc định |
| B-02 | M | OIDC identity adapter | Token/session validation, user mapping, clock skew/logout và no-local-password production policy có tests |
| B-03 | M | Organization + membership model | Tenant→BU→Team; user membership có effective dates; cross-tenant edge constraint |
| B-04 | M | Resource relationship graph | Queue/campaign/owner/assigned/participant relations; multi-membership và orphan behavior theo D-017 |
| B-05 | L+M | PDP/PIP contract và engine | Deny default; hard deny→explicit deny→allow; reason/policy version/scope/obligations deterministic |
| B-06 | M | BFF/application PEP | Route/command/query capability enforcement; hidden UI/deep link/direct API negative tests |
| B-07 | M | Authorized query builder | Scope áp trước lookup/count/facet/pagination; empty filter không biến thành all; IDOR matrix pass |
| B-08 | M | Field obligation serializer/validator | Hide/mask/read-only/unmask/export nhất quán; browser không nhận forbidden field |
| B-09 | M | Realtime PEP + revoke | Subscribe/reconnect/publish theo scope; policy invalidation thu hẹp stream trong measured target |
| B-10 | M | Export/file/recording authorization | Recheck request/execute/download; play khác download; TTL/encryption/watermark/audit |
| B-11 | J | Role/access read UI | Effective capability/scope/expiry/why-locked hiển thị rõ; không cho edit nếu chưa có command path |
| B-12 | M+L | Grant/policy admin + SoD/break-glass | Maker không self-approve; step-up/TTL/alert/review; policy simulator và immutable versions |

Junior có thể nhận B-11 và từng test fixture của B-03/B-07/B-08; B-05, B-09, B-10 và B-12 không giao junior làm một mình.

## 6. Epic C — Configuration, metadata và workflow

| ID | Mức | Deliverable | Acceptance |
|---|---:|---|---|
| C-01 | L+M | Configuration Registry | Typed definition, owner, scopes/resolver, constraints, capability, risk, activation và UI metadata |
| C-02 | M | Effective-value resolver | Inheritance chain giải thích được; ambiguous team/queue/campaign match fail; cache invalidation test |
| C-03 | M | Publication lifecycle | Draft→validate→simulate→approve→publish/schedule→effective→rollback; ETag và immutable revision |
| C-04 | J | Settings read UI | Search/category/basic-advanced/effective source/why locked/history; loading/empty/error/a11y states |
| C-05 | M | Settings edit/publish UI | Typed controls, inline validation, impact/diff/test/approval; secret/system-only không xuống browser |
| C-06 | L+M | Custom field/schema registry | Entity/type/quota/classification/index rules; JSON Schema validation; stable keys và version/deprecation |
| C-07 | M | Form definition/runtime | Approved components, layout/binding/conditional rules; frontend/backend cùng checksum/schema |
| C-08 | J+M | Form preview UI | View-as persona/scope/state + synthetic data; hidden/masked/read-only/required behavior và a11y |
| C-09 | L+M | Workflow definition + validator | States/transitions/guards/actions/approval/timer; chặn loop/unreachable/action lạ/dependency thiếu |
| C-10 | M | Workflow execution runtime | Instance pin version; transition log; authorization/idempotency; unknown action result reconcile |
| C-11 | M | Timer/business calendar | wait-until/event/callback, timezone/DST/pause/resume/outage catch-up; restart/failover test |
| C-12 | M | Simulator/decision trace | Cùng input/version luôn cùng result; giải thích guard/rule/action; không external side effect |
| C-13 | J+M | Guided workflow editor | Chỉ registered action/guard; validate/simulate/diff/approval; no arbitrary code/URL/component |
| C-14 | L+M | Version migration/backfill | Schema/workflow mappings, dry-run, impact, batch resume, rollback; record/instance cũ vẫn đọc được |

P0 không bao gồm arbitrary JavaScript/SQL, tenant plugin upload, remote component hoặc BPMN/DMN đầy đủ.

## 7. Epic D — PortSIP integration foundation

| ID | Mức | Deliverable | Acceptance |
|---|---:|---|---|
| D-01 | L+S | Exact version/license/contract pack | PBX/SBC/SDK/OpenAPI/WSI/webhook/license matrix và anonymized fixtures được vendor/Telephony xác nhận |
| D-02 | L+M | `TelephonyGateway` port | Canonical methods/results/errors, timeout/idempotency/unknown semantics; domain không import vendor DTO |
| D-03 | M | REST client adapter | Backend-only token refresh, timeout, safe retry, rate limit, circuit breaker, redaction và contract tests |
| D-04 | M | WSI subscriber | Reconnect/re-auth/resubscribe/backoff/jitter/gap detection; raw inbox durable trước ack |
| D-05 | M | Webhook receiver | Authentication/replay protection, durable write, fast response, dedupe và DLQ |
| D-06 | M | Event normalizer | Exact vendor fixture→canonical versioned event; optional/unknown field behavior documented |
| D-07 | M | REST/CDR reconciliation | Missing/gap/late CDR repair idempotently; mismatch/correction audit |
| D-08 | L+M | Frontend SDK Wrapper | Registration/device/call FSM; UI không gọi SDK trực tiếp; refresh/network/device tests |
| D-09 | J | Adapter health UI | Auth/WSI/webhook/CDR/trunk status + last success/lag/correlation/runbook; không secret/raw response |
| D-10 | L+S | Sandbox golden call suite | Inbound + manual/preview/progressive + failure fixtures; exact correlation/session/CDR/recording evidence |

D-01, D-02, credential/auth, call-create và trunk mutation require Telephony/Security review; junior không tự suy contract từ tài liệu public khác version.

## 8. Epic E — Agent, inbound và CRM

| ID | Mức | Deliverable | Acceptance |
|---|---:|---|---|
| E-01 | M | PortSIP user/extension mapping | Unique theo tenant/environment; drift/unmapped event vào review/DLQ, không tenant mặc định |
| E-02 | M | Interaction/call-leg aggregate | Duplicate/out-of-order guard; correlation keys; terminal state không bị event cũ ghi đè |
| E-03 | M | Contact/Case port + first CRM adapter | Cache/read model/conflict/retry/degraded path; CRM remains master theo D-004 |
| E-04 | J+M | Agent shell/device page | Permission/device states, test audio, clear recovery text và keyboard access |
| E-05 | M | Inbound offer/screen-pop | Chỉ assigned agent nhận authorized/masked contact; event→UI latency được đo |
| E-06 | M | Call controls | Commands theo SDK FSM, chống double click, canonical result/audit và error recovery |
| E-07 | J+M | Contact/timeline UI | Field manifest/obligations, pagination/loading/empty/error; no raw vendor state |
| E-08 | J+M | Note/case/disposition form | Autosave/idempotency, pinned schema, conditional required và ACW flow |
| E-09 | M | Queue callback reference | Phân biệt PortSIP queue callback với app scheduled follow-up; correlation/report tests |
| E-10 | L+S | Inbound UAT pack | DID→IVR→queue→agent→CDR/recording cùng failures/transfer/monitor và KPI reconciliation |

## 9. Epic F — Outbound campaign và dialer

| ID | Mức | Deliverable | Acceptance |
|---|---:|---|---|
| F-01 | M | Campaign/version lifecycle | Valid FSM, ETag, immutable publish snapshot, approval/audit và clone/version |
| F-02 | J+M | CSV/API import dry-run | Mapping/encoding/E.164/validation/dedupe/idempotency; downloadable redacted error report |
| F-03 | L+M+S | Consent/DNC/suppression model | Provenance/purpose/expiry/market; fail-closed decision và Legal-approved reasons |
| F-04 | M | Timezone/quiet-hours evaluator | IANA/DST/unknown behavior deterministic; boundary fixtures |
| F-05 | M | Eligibility pipeline | Rule versions/reasons, schedule + immediate pre-dispatch recheck; no PBX call on deny |
| F-06 | L+M | Agent/contact reservation | Atomic reservation/lease; exactly one Ready agent for progressive; crash/stale tests |
| F-07 | M | Logical dial-attempt FSM | Client/idempotency/correlation, event/CDR mapping và `reconcile_pending` unknown path |
| F-08 | J+M | Manual/preview UI | Script/history/consent, Dial/Skip+reason; no command before explicit preview confirmation |
| F-09 | L+M | Progressive 1:1 executor | Reserve before dial, effective ratio ≤1.0, zero answered-no-agent in test |
| F-10 | M | Retry/callback logic pack | Outcome→cooldown/max/terminal, version pin, timezone/ownership and unknown-result guard |
| F-11 | L+M+S | CPS/concurrency/caller-ID guards | Provider/trunk/tenant/campaign limit + allowlisted DID; carrier evidence và kill switch |
| F-12 | M | Blended inbound protection | Auto-pause on inbound thresholds, hysteresis/cooldown/manual override; active calls finish |
| F-13 | J+M | Campaign dashboard | Loaded/eligible/suppressed/attempted/PBX accepted/SIP answered/right-party/conversion tách đúng |
| F-14 | L+S | Outbound compliance/resilience UAT | 0 prohibited attempt, duplicate, caller-ID/limit breach và answered-no-agent trên approved dataset |

## 10. Epic G — SIP trunk/DID/routing Admin

| ID | Mức | Deliverable | Acceptance |
|---|---:|---|---|
| G-01 | L+S | Exact ownership/capability matrix | Tenant-owned vs system/shared/IP-based và rule reference behavior được chứng minh trên exact build |
| G-02 | M | Trunk/DID/rule read models | PortSIP effective state, assigned ownership, health, dependency và drift; secret omitted |
| G-03 | M | Typed trunk wizard | Approved auth/transport/host/DID fields, inline/domain validation; no raw vendor JSON |
| G-04 | J+M | DID/rule editors | Duplicate/range/prefix/priority/transform/caller-ID conflicts; read-only/deep-link boundary rõ |
| G-05 | L+M | Change-request orchestrator | Draft/diff/preflight/approval/drain/apply/read-back/test/activate/rollback FSM |
| G-06 | L+S | Secret rotate path | Write-only, vault version, step-up/approval, no placeholder overwrite và retained/manual recovery |
| G-07 | L+M | Dependency/drain/compensation | Active call/campaign/rule graph; partial apply recovery; không quảng bá rollback atomic |
| G-08 | S+L | Synthetic test and activation gate | Registration/status nếu có + inbound/outbound test number; failure giữ disabled và có evidence |

Mutation G-05 đến G-08 không giao junior làm một mình. Junior có thể xây view/validation UI sau khi contract và fake adapter đã ổn định.

## 11. Epic H — Supervisor, reporting và hardening

| ID | Mức | Deliverable | Acceptance |
|---|---:|---|---|
| H-01 | M | Policy-scoped realtime projection | Queue/agent/call state, reconnect/gap/revoke và no tenant-wide browser filtering |
| H-02 | J+M | Wallboard/alerts | Correct timezone/formula/scope; stale/degraded/empty states và alert cooldown |
| H-03 | L+M+S | Monitor/whisper/barge | Exact PortSIP/role/monitor-group capability, audit/notice và cross-scope negative tests |
| H-04 | M+S | KPI projections/data dictionary | Formula/source/grain/cutoff/correction; golden CDR/app/CRM reconciliation |
| H-05 | M | Export/report job | Scoped rows/fields, re-authorization, encrypted short-lived artifact, watermark/audit |
| H-06 | L+M | Load/resilience/security suite | Forecast +30%, reconnect storm, worker/PDP/cache/DB/CRM failures và kill-switch evidence |
| H-07 | M+S | Operator usability/UAT | Role grant, form/workflow publish, setting rollback và trunk change task completion |
| H-08 | L+S | Production readiness | Backup/restore, failover, dashboards, alerts, runbooks, on-call, training và sign-offs |

## 12. Trình tự increment khuyến nghị

Sau khi Discovery/PoC `Go`, không triển khai từng epic hoàn toàn tuần tự. Dùng vertical increments có contract và observability từ đầu:

1. **Skeleton slice:** request context → one protected API → PostgreSQL → outbox → worker → read UI.
2. **Policy slice:** hai persona, một resource relationship, row scope, masked field, direct API + realtime deny.
3. **Config slice:** typed setting → effective chain → draft/approve/publish → cache invalidation → rollback.
4. **Metadata/workflow slice:** custom field/form → transition/timer/action → restart/version pin → simulator.
5. **PortSIP inbound slice:** SDK/WSI/webhook → interaction → screen-pop → CDR reconciliation.
6. **Outbound slice:** list/eligibility/reservation → manual/preview/progressive 1:1 → event/CDR/reconcile.
7. **Trunk change slice:** read model → draft/diff → apply-disabled/test/read-back → compensating rollback.
8. **Blended operations slice:** supervisor/reports/inbound protection → security/load/UAT/pilot.

Mỗi increment phải có một demo có evidence, không chỉ UI mock hoặc unit tests rời rạc.

## 13. Quy tắc phân công cho junior

### Có thể giao khi contract đã rõ

- Read-only page/component và explicit UI states.
- DTO/schema fixture, safe mapper hoặc deterministic validator nhỏ.
- Unit/negative/contract tests cho behavior đã thiết kế.
- Settings/form display control đã có registry contract.
- Health/status view đã redact.
- Additive field qua đủ API/event/test/generated client path.
- Documentation/runbook/fixture cập nhật kèm code.

### Bắt buộc pair/review trước khi bắt đầu

- PDP/PEP, tenant/scope query và field masking.
- Database migration/backfill/retention.
- Outbox/inbox/job retry/idempotency.
- Workflow engine/action/timer recovery.
- PortSIP auth/event/call-create/trunk mutation.
- Consent/DNC/timezone/caller-ID/CPS/concurrency.
- Secret, recording/export hoặc break-glass.
- Production deploy/replay/rollback/purge.

Junior phải được cung cấp fixture, expected contract, reviewer và failure cases; không giao yêu cầu “làm giống màn hình cũ” hoặc “tự đọc PortSIP rồi làm”.

## 14. Handover giữa developer

Trước khi đổi người phụ trách, developer bàn giao:

```text
Work item / branch / PR:
Current behavior and last passing commit:
Decisions/assumptions:
Files/modules/contracts changed:
Migration/config/flag state:
Fixtures/test commands/results:
Open failures with request/correlation IDs:
External sandbox resources created:
Security/PII/secret considerations:
Safe next step:
Actions that MUST NOT be retried/run:
Reviewer/owner needed:
```

Không bàn giao chỉ bằng tin nhắn “code gần xong”. Người nhận phải có thể tái tạo trạng thái từ repository, Build Profile, fixtures và evidence.

## 15. Cập nhật tiến độ và hoàn thành

- Chỉ activate task sau khi đủ Definition of Ready và được Current Work Ledger/tracker cho phép.
- Khi task đổi trạng thái, cập nhật tracker hoặc [TASKS.md](../TASKS.md) trong cùng ngày: status, % chuẩn, actual/forecast, blocker, next action và evidence.
- `Done` do assignee báo tối đa 90%; chỉ `Accepted` có approver/date/evidence mới tính 100%.
- Task blocked giữ % đã earned, ghi `waiting since`, blocker owner và escalation date; không tăng % theo thời gian.
- Parent epic/milestone chỉ roll up theo approved weight sau baseline; trước baseline báo số lượng theo status và `N/A`, không bịa phần trăm.
- Xem đầy đủ checklist PMP, RACI, RAID/change control, weekly status và completion audit tại [tài liệu 15](15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md).
