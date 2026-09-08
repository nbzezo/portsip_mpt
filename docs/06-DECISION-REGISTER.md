# Decision register

## Cách sử dụng

Đây là nguồn chuẩn cho các quyết định làm thay đổi scope, chi phí hoặc kiến trúc. `Hypothesis` chỉ dùng để lập kế hoạch; không được coi là yêu cầu đã duyệt. Mỗi quyết định phải có evidence link/biên bản, người phê duyệt và ngày cập nhật.

## Gate Discovery/PoC

| ID | Quyết định | Baseline hiện tại | Status | Accountable owner | Due | Evidence/exit |
|---|---|---|---|---|---|---|
| D-001 | MVP product scope | Single-tenant, web-first, voice-only blended inbound + outbound; extensibility kernel + bounded self-service access/config/form/workflow | Hypothesis | Product Owner | Day 2 | Scope sign-off; P0 modes, self-service boundary và impact estimate được duyệt |
| D-002 | PortSIP contract | Public scan xác nhận PBX v22.6.3 + SBC v11.2.8, REST/WSI public v22.3, SDK native v19.6.2; browser artifact/customer entitlement còn thiếu | Verification 75% / Go-no-go | `Echo` + PortSIP vendor | Day 3 | [Public evidence](evidence/DISC-PS-001.md), [prepared exact-evidence request](evidence/PORTSIP-EXACT-CONTRACT-REQUEST.md); còn cần `Echo` dùng approved external account gửi request và nhận exact artifacts/license/sandbox response |
| D-003 | Authentication | OIDC-compatible IdP; không local password ở production | Hypothesis | Security Owner | Day 2 | IdP được chọn, sandbox/test account, session/MFA policy |
| D-004 | CRM master/connector | Một CRM là source of truth cho contact/case và có một connector trong MVP | Hypothesis | Product Owner + CRM Owner | Day 2 | CRM được chọn, sync direction/conflict rules, sandbox và API quota |
| D-005 | Deployment/HA | App plane HA; PortSIP topology TBD | Open | Solution Architect + Infrastructure Owner | Day 4 | Cloud/on-prem, zones, SBC/PBX topology, BIA, vendor sizing |
| D-006 | Recording | Reference-only tại PortSIP ở MVP | Hypothesis / Compliance gate | Security/Compliance Owner | Day 2 | Notice/consent, eligible calls, access, retention/delete, RPO/RTO, legal-hold decision |
| D-007 | Capacity/SLO/KPI | Các con số trong plan là proposed targets | Open | Operations Owner + Data/BA | Day 5 | Peak agents/calls/events, formulas, measurement plan và baseline schedule |
| D-008 | Outbound modes | P0: manual/click-to-call + preview + progressive 1:1; “power-safe” chỉ auto-next với effective dial ratio ≤1,0 | Hypothesis / Compliance gate | Product + Legal/Compliance | Day 2 | Thuật ngữ/mode ký duyệt; multi-line power/predictive/AMD bị loại khỏi P0 |
| D-009 | Reporting authority | PortSIP CDR/Data Flow cho voice; app/CRM cho ACW/FCR/cross-channel | Hypothesis | Data Owner + Operations Owner | Day 5 | Data dictionary, timezone/cutoff/correction policy và golden dataset |
| D-010 | Build authorization | Chỉ Discovery/Feasibility PoC được Go hiện tại | Pending | Executive Sponsor | Day 10 | Demo/evidence pack, TCO/business case, revised estimate; signed Go/Adjust/Stop để bắt đầu Integration Hardening/Build |
| D-011 | SIP Trunk Admin UI boundary | P0 write tenant-owned trunk/DID + tenant rules; system/shared/IP-based trunk object/DID-pool assignment read-only, nhưng tenant rule có thể dùng assigned trunk nếu contract cho phép | Hypothesis / Security gate | Architecture + Security + Telephony | Scope decision Day 5; PoC proof Day 8 | Chốt write UI có bắt buộc go-live; exact endpoint/schema/role/ownership/reference; secret-version behavior; drain và config lifecycle PoC |
| D-012 | Progressive execution topology | Reserve 1 Ready agent trước dial; SDK agent-originated hoặc authenticated Call Control API do PoC chọn | Open / Go-no-go | Architecture + Telephony + QA | Day 8 | Idempotency/correlation, timeout-reconcile, worker-crash và zero-no-agent golden tests |
| D-013 | Outbound compliance/carrier | Fail closed cho consent/DNC/timezone; DID allowlist; provider/trunk/tenant/campaign CPS/concurrency limits | Open / Compliance gate | Legal/Compliance + Carrier Owner + Product | Day 5 | Market memo, consent/DNC policy, carrier limits, caller-ID proof và emergency-stop owner |
| D-014 | Campaign data governance | App là master cho campaign/list/policy/attempt; lead/consent source và CRM outcome sync còn mở; PortSIP là master session/CDR | Hypothesis | Data Owner + CRM Owner + Security | Day 5 | Source/sync direction, import schema, dedupe/retention/erasure, PII access/export, business KPI và reconciliation policy |
| D-015 | Blended operating policy | Chung hay riêng agent pool còn mở; nếu chung, outbound auto-pause theo inbound SLA/queue thresholds và resume có hysteresis | Open | Operations Owner + Product | Day 8 | Agent-pool decision, thresholds, cooldown/hysteresis, mixed-load result và manual override policy |
| D-016 | Authorization model | Deny-by-default; RBAC capability bundle + ABAC conditions + resource relationships; backend PDP/PEP trả obligations cho field/action | Approved Discovery baseline / Security verification gate | Security + Architecture + Product | PoC Day 9 | [Baseline evidence](evidence/DISC-ARC-001.md); còn capability/role matrix, negative API/realtime/export, masking/cache/threat-model evidence |
| D-017 | Organization và resource scope graph | Cây `tenant → business unit → team`; user là subject gắn bằng membership; queue/campaign gắn bằng relationship; `own/assigned/participant` là predicate | Approved Discovery baseline / verification open | Product + Operations + Security | Day 5 | [Baseline evidence](evidence/DISC-ARC-001.md); còn multi-membership/precedence và representative access matrix sign-off |
| D-018 | Dynamic field/form model | Core fields là typed columns; custom data dùng versioned schema + JSONB và typed projection/index có kiểm soát; P0 giới hạn Contact/Case/Interaction/Campaign Member/Disposition | Approved Discovery baseline / verification open | Product + Architecture + Data + Security | Day 8 | [Baseline evidence](evidence/DISC-ARC-001.md); còn quota/classification/index/publish/rollback/backfill PoC |
| D-019 | Workflow/rule boundary và P0 extensibility depth | Business workflow/rule/timer có DSL/action allowlist; call/session/dial-attempt, authorization và compliance hard-stop do code sở hữu; không arbitrary code/BPMN/runtime plugin | Approved Discovery boundary / scope verification gate | Product + Architecture + Security | Day 10 | [Baseline evidence](evidence/DISC-ARC-001.md); còn thin-slice/restart/version demo và ROM selection |
| D-020 | Settings exposure và inheritance | Typed server-side catalog; frontend ưu tiên setting an toàn; effective-value/resolution chain; advanced/secret có approval/test/rollback; infra/security root không expose | Approved Discovery baseline / Security verification gate | Operations + Architecture + Security | Day 8 | [Baseline evidence](evidence/DISC-ARC-001.md); còn catalog inventory, resolver, secret-browser và usability tests |
| D-021 | Version, promotion, migration và sandbox | Published config/schema/workflow immutable; draft→validate→simulate→approve→publish; in-flight pin version; migration explicit; sandbox không được dial/send/ghi Prod | Approved Discovery baseline / verification open | Architecture + QA + Operations | Day 9 | [Baseline evidence](evidence/DISC-ARC-001.md); còn checksum/dry-run/rollback/isolation/N-1 evidence |
| D-022 | Extension và contract governance | Extension qua typed registry/ports, trusted compiled module và CI; API/event/database additive-first, breaking change có version/deprecation; không tenant-uploaded code P0 | Approved Discovery baseline / verification open | Architecture + Engineering Lead + Security | Day 9 | [Baseline evidence](evidence/DISC-ARC-001.md); initial architecture test PASS; adapter/event/API/logic-pack proof còn mở |
| D-023 | Implementation stack và repository toolchain | Node 24 LTS + pnpm workspace + TypeScript strict; React/Vite; NestJS/Fastify + worker; PostgreSQL/pg/node-pg-migrate; Redis; OpenAPI/Zod; Vitest/Playwright/ESLint/Prettier | **Approved for Discovery scaffold / conditional before D-010** | Project Owner + Engineering/Architecture interim; Security/DevOps review còn mở | Approved 2026-09-08; clean-machine Day 5 | [ADR-001](adr/ADR-001-IMPLEMENTATION-STACK.md), [Build Profile](BUILD-PROFILE.md), [scaffold evidence](evidence/G0-002.md); mở lại nếu clean-machine/security/dependency review fail |
| D-024 | Code-delivery role identity | Dùng alias `Owner/Ledger/Atlas/Sentinel/Forge/Beacon/Echo/Compass/Scout` làm named project identity; independent approval phải ở execution/task tách biệt; external/legal/vendor authority không được giả lập | **Approved** | Project Owner/user | 2026-09-09 | [Role Registry](ROLE-REGISTRY.md), [kickoff evidence](evidence/DISC-KO-001.md); assignment không tự bỏ dependency/gate |

## Decision outcomes

Mẫu ghi kết luận:

```text
Decision ID:
Outcome: Approved | Rejected | Deferred
Date:
Approver:
Evidence:
Impact on scope/timeline/cost/risk:
Follow-up owner and due date:
```

## Change control

Các thay đổi sau đây bắt buộc cập nhật estimate và D-010 trước khi vào build:

- thêm multi-tenant/white-label ở first release;
- thêm SMS/WhatsApp/email/webchat vào go-live;
- thay browser Agent Desktop bằng hoặc bổ sung native client;
- tăng dial ratio vượt `1,0`, thêm multi-line power, predictive hoặc AMD;
- mở tenant-admin UI cho global transport/SBC/firewall/certificate, raw advanced routing hoặc queue/skill/IVR write;
- thay đổi consent/DNC/timezone/caller-ID market hoặc carrier CPS/concurrency class;
- bắt buộc sao chép/archive recording hoặc legal hold trong app plane;
- thêm CRM connector thứ hai hoặc two-way workflow phức tạp;
- thay đổi peak concurrency, availability hoặc DR class vượt baseline đã duyệt.
- thay đổi authorization từ policy model đã duyệt, bỏ server-side enforcement hoặc cho scope/field policy tùy biến không qua security gate;
- cho custom field tác động trực tiếp PortSIP CDR/session/trunk hoặc consent/DNC/tenant-security core;
- đưa visual low-code/BPMN đầy đủ, arbitrary JavaScript/SQL/HTML/URL, tenant-uploaded plugin hoặc remote UI component vào P0;
- thêm entity/type custom field, workflow action, setting scope/precedence hoặc self-service builder vượt giới hạn D-018 đến D-021;
- phá API/event/schema compatibility window, thay event envelope hoặc migration/rollback policy đã chốt;
- muốn giữ ROM `24–26 tuần` nhưng vẫn giữ đầy đủ self-service form/workflow editor trong P0.
- đổi runtime/framework/package manager/database access/migration/event transport hoặc testing toolchain sau scaffold mà không có ADR, compatibility/migration impact và Build Profile cập nhật.
