# Mục lục bàn giao dự án Portsip CC

## 1. Mục đích

Đây là điểm bắt đầu cho người tiếp nhận dự án. Bộ tài liệu tách rõ `đã quyết định`, `giả định`, `thiết kế mục tiêu`, `hợp đồng code` và `bằng chứng cần chứng minh`; không được hiểu mọi câu trong tài liệu là chức năng đã được PortSIP hoặc team xác nhận.

Trạng thái dùng chung:

- `Approved`: đã có accountable owner phê duyệt và ghi evidence trong Decision Register.
- `Verified`: đã chứng minh bằng exact sandbox/build/test hoặc văn bản vendor.
- `Hypothesis`: baseline để lập kế hoạch, phải xác nhận ở gate.
- `Proposed target`: mục tiêu để đo, chưa phải SLA/vendor commitment.
- `Open`: chưa được quyết định; developer không tự chọn âm thầm.

## 2. Bộ tài liệu và owner

| Tài liệu | Nội dung chuẩn | Audience chính | Accountable owner đề xuất | Cập nhật khi |
|---|---|---|---|---|
| [README](../README.md) | Trạng thái, scope và link nhanh | Tất cả | Product Owner | Scope/version/ROM đổi |
| [01 — Kế hoạch triển khai](01-KE-HOACH-TRIEN-KHAI.md) | Scope, roadmap, staffing, NFR, risk, go-live | Sponsor, PM, Lead | Product Owner | D-010/scope/timeline/team đổi |
| [02 — Feature catalog](02-DANH-MUC-TINH-NANG.md) | P0/P1/P2 và acceptance cấp cao | Product, BA, QA, Dev | Product Owner | Feature priority/ownership đổi |
| [03 — Kiến trúc tích hợp](03-KIEN-TRUC-TICH-HOP.md) | PortSIP/app boundaries, modules, data flow, FSM | Architect, Dev, SRE | Solution Architect | Integration/topology/contract đổi |
| [04 — Discovery/PoC](04-DISCOVERY-POC.md) | Inputs, must-prove tests, golden dataset và gate | Discovery squad | Tech Lead + PO | PoC evidence/gate đổi |
| [05 — Nguồn tham khảo](05-NGUON-THAM-KHAO.md) | Primary/vendor sources và điểm cần xác minh | Dev, Architect | Tech Lead | Version/source/review date đổi |
| [06 — Decision register](06-DECISION-REGISTER.md) | Quyết định, status, owner, due, evidence | Tất cả | Solution Architect | Bất kỳ decision/gate outcome nào |
| [07 — Outbound và SIP Trunk Admin](07-OUTBOUND-VA-SIPTRUNK-ADMIN.md) | Campaign/dialer/trunk/DID/routing chi tiết | Outbound/Telephony squad | Telephony Lead + Product | Mode/carrier/API/write boundary đổi |
| [08 — Nền tảng mở rộng](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md) | Module extension, auth, config/form/workflow và Admin UX | Platform/Security/Dev | Solution Architect + Security | Policy/runtime/self-service boundary đổi |
| [09 — Sổ tay hiện thực](09-SO-TAY-HIEN-THUC-CHO-DEVELOPER.md) | Cách biến story thành module/code end-to-end | Developer | Engineering Lead | Stack/layout/implementation pattern đổi |
| [10 — Chuẩn code và DoD](10-CHUAN-CODE-REVIEW-VA-DEFINITION-OF-DONE.md) | Quy tắc code/review/checklist merge | Developer, Reviewer | Engineering Lead | Tooling/quality/security policy đổi |
| [11 — Hợp đồng API/event/data](11-HOP-DONG-API-EVENT-VA-DU-LIEU.md) | Wire contract, version, persistence và adapter mapping | Developer, Integrator | API/Data Architect | Contract/version/migration rule đổi |
| [12 — Test/debug/runbook](12-CHIEN-LUOC-TEST-DEBUG-VA-RUNBOOK.md) | Test matrix, evidence, diagnosis và safe recovery | Dev, QA, SRE | QA Lead + SRE | Failure mode/command/dashboard đổi |
| [13 — Backlog khởi tạo](13-BACKLOG-KHOI-TAO-VA-PHAN-CONG.md) | Work breakdown, dependency và mức phân công | PM, Lead, Dev | Delivery Lead | Discovery/sprint dependencies đổi |
| [14 — Current Work Ledger](14-CONG-VIEC-HIEN-TAI.md) | Work item đang Ready/Blocked, assignee/reviewer/evidence và starter ticket | Người tiếp nhận, Lead | Engineering Lead | Mỗi lần authorization/dependency/assignment đổi |
| [15 — PMP control checklist](15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md) | Governance, phase gate, RACI, RAID/change, progress/RAG và completion audit | Sponsor, PM, Leads | Project Manager | Baseline/gate/cadence/status rule đổi |
| [16 — Kickoff và handoff](16-KICKOFF-VA-BAN-GIAO-PHIEN-TIEP-THEO.md) | Trạng thái kickoff, thứ tự tiếp tục và prompt bàn giao Codex | Người tiếp nhận, Codex | Delivery Lead | Mỗi phiên bàn giao hoặc gate đổi |
| [Build Profile](BUILD-PROFILE.md) | Exact tool versions và command đã kiểm chứng | Developer, CI | Engineering Lead | Manifest/toolchain/command đổi |
| [ADR-001](adr/ADR-001-IMPLEMENTATION-STACK.md) | Quyết định D-023 về stack, boundary và reopen conditions | Architecture, Engineering, Security/DevOps | Engineering Lead | Stack/security/support condition đổi |
| [Session registry](sessions/README.md) | Phiên tuần tự, trạng thái, Git tag và cú pháp tiếp tục | Tất cả/Codex | Delivery Lead | Mỗi lần mở/đóng phiên |
| [Session 001](sessions/SESSION-001.md) | Snapshot, kiểm chứng, blocker và next action cuối phiên 001 | Người tiếp nhận/Codex | Delivery Lead | Immutable sau khi tag; đính chính ở phiên sau |
| [TASKS.md](../TASKS.md) | Active/Waiting/Someday/Done hằng ngày | Tất cả | Project Manager/Delivery Lead | Cùng ngày khi task đổi trạng thái |
| [Role Registry](ROLE-REGISTRY.md) | Named Codex role aliases, authority và separation-of-duties theo D-024 | Tất cả | Project Owner | Assignment/authority/review model đổi |
| [Synthetic image policy](../infra/local/IMAGE-POLICY.md) | Image source/version/digest/isolation cho G0-06 theo D-025 | DevOps/Security/QA | `Forge` + `Sentinel` | Runtime/image policy đổi |
| [Parallel delivery roadmap](ROADMAP-PARALLEL-TRACKS.md) | Track song song cho synthetic product/CRM và PortSIP discovery/integration | Product/Engineering | `Owner` + `Atlas` | Scope/dependency/priority đổi |
| [AGENTS.md](../AGENTS.md) | Working agreement bắt buộc cho người/agent sửa repository | Contributor/automation | Engineering Lead | Gate/task-tracking/repo rule đổi |

D-023 đã Approved có điều kiện cho Discovery scaffold; G0-02/G0-03 đã tạo scaffold và `docs/BUILD-PROFILE.md`. File này hiện là nguồn chuẩn cho exact tool versions và runnable commands, nhưng G0-03 vẫn chờ independent clean-machine review trước khi đạt 100%.

## 3. Thứ tự ưu tiên khi tài liệu xung đột

1. Decision outcome `Approved` trong [Decision Register](06-DECISION-REGISTER.md) kèm evidence mới nhất.
2. Security/compliance hard invariant đã duyệt; không bị setting/workflow/feature flag ghi đè.
3. Contract/schema/version đã publish trong repo và CI evidence của build đang triển khai.
4. Tài liệu domain chuyên biệt: [07](07-OUTBOUND-VA-SIPTRUNK-ADMIN.md) cho outbound/trunk, [08](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md) cho platform/auth/config.
5. [03](03-KIEN-TRUC-TICH-HOP.md) cho kiến trúc tích hợp tổng thể.
6. Code example trong [09](09-SO-TAY-HIEN-THUC-CHO-DEVELOPER.md)–[12](12-CHIEN-LUOC-TEST-DEBUG-VA-RUNBOOK.md); ví dụ minh họa không được thắng contract/decision đã publish.

Nếu vẫn mâu thuẫn: dừng phần bị ảnh hưởng, tạo/ cập nhật decision hoặc ADR, gắn owner/due/evidence. Không chọn tài liệu thuận tiện nhất rồi code.

## 4. Reading path

### Người quản lý/sponsor

1. README.
2. Tóm tắt, roadmap, risk và go-live trong 01.
3. P0/P1/P2 trong 02.
4. D-001 đến D-024 trong 06 và alias trách nhiệm trong Role Registry.
5. Go/Adjust/Stop trong 04.
6. PMP control snapshot và weekly status trong 15; Active/Waiting tại TASKS.

### Product/BA/Operations

1. 01 và 02.
2. 07 cho outbound/trunk.
3. Admin Center/operator UX trong 08.
4. Discovery questions/golden dataset trong 04.
5. Backlog/acceptance trong 13.
6. Work item hiện được phép bắt đầu trong 14.
7. Quy tắc progress/acceptance/reporting trong 15 và TASKS.

### Developer mới

1. README và file này.
2. Nguyên tắc, component, data ownership và FSM trong 03.
3. Toàn bộ 08 để hiểu authorization/config/form/workflow boundary.
4. 09 theo thứ tự onboarding và use-case walkthrough.
5. 10 trước PR đầu tiên.
6. 11 trước khi thêm API/event/table.
7. 12 trước khi test sandbox hoặc xử lý lỗi.
8. Đọc Build Profile, ADR-001 và handoff 16; chạy quality gate trước khi sửa code.
9. Xác nhận ticket được giao trong 13, được phép ở 14 và có live status trong TASKS; dùng 15 để cập nhật progress/acceptance; đọc domain 07 nếu liên quan outbound/trunk.

### QA/Security/SRE

1. NFR/risk/go-live trong 01.
2. Enforcement, failure handling, observability và test strategy trong 03.
3. Authorization/config acceptance trong 08.
4. Must-prove/golden data trong 04.
5. Contract checks trong 11 và runbooks trong 12.
6. Evidence/completion audit và gate dashboard trong 15.

## 5. Handover entry checklist

Người nhận chưa nên bắt đầu build cho đến khi xác nhận:

- [ ] Hiểu P0 là single-tenant, web-first, voice blended inbound + outbound, một CRM connector và bounded self-service.
- [ ] Hiểu PortSIP sở hữu SIP/media/queue/trunk/session/CDR; app sở hữu interaction/campaign/policy/config/workflow theo bảng source of truth.
- [ ] Hiểu manual, preview, progressive 1:1; predictive/multi-line power/AMD không thuộc P0.
- [ ] Hiểu tenant-owned trunk/rules write boundary và system/shared/IP-based boundary read-only/deep-link mặc định.
- [ ] Hiểu bốn lớp quyền và việc menu ẩn không thay backend enforcement.
- [ ] Hiểu call/session/dial-attempt, tenant, DNC/consent, secret và carrier limits là code-owned invariants.
- [ ] Hiểu published config/schema/workflow pin version, không sửa tại chỗ.
- [ ] Đã đọc các decision `Open/Hypothesis` và không coi chúng là Approved.
- [ ] Có quyền truy cập repo, issue tracker, CI, non-production environments, vendor contacts và evidence store phù hợp vai trò.
- [ ] Biết ai là Product, Architecture, Security, Telephony, Data/CRM, QA và Operations owner.
- [ ] Sau scaffold: đã tự chạy Build Profile và onboarding exercises thành công.

## 6. Handover evidence checklist

Team bàn giao phải cung cấp hoặc ghi rõ `Not available + owner + due`:

```text
Repository/branch/tag and release manifest:
Approved decision outcomes and ADRs:
Exact PBX/SBC/SDK/API/license matrix:
Build Profile and local/CI commands:
Environment/topology/IaC references:
Config/schema/workflow versions per environment:
Database migration/backfill status:
Feature flags/kill switches and expiry:
Service identities and secret owners (never plaintext):
PortSIP/CRM/IdP sandbox resources:
OpenAPI/event/schema/adapter fixtures:
Golden test and pilot evidence:
Dashboards/alerts/on-call/runbooks:
Known risks/debt/incidents/workarounds:
Pending jobs/workflows/config changes:
Open tickets with owner/priority/due:
Next safe milestone and stop conditions:
```

Không đính kèm token/password/private key vào tài liệu hoặc ticket. Chỉ ghi secret path/owner/rotation procedure theo policy.

## 7. Cách cập nhật tài liệu cùng code

- Scope/P0/P1/P2 đổi: cập nhật 01, 02, 06 và README trong cùng change set.
- API/event/table/version đổi: cập nhật 11, generated contract/fixture và compatibility test.
- Module/flow/source of truth đổi: cập nhật 03 và ADR/06.
- Authorization/config/form/workflow behavior đổi: cập nhật 08, 10–12 và policy/golden fixtures.
- Outbound/trunk behavior đổi: cập nhật 07, 04 và carrier/vendor evidence.
- Command/tooling đổi: cập nhật Build Profile và CI trong cùng PR.
- Failure/recovery/alert đổi: cập nhật 12 trước production rollout.
- Work breakdown/dependency đổi: cập nhật issue tracker trước; 13 chỉ giữ baseline handover và mapping lớn.
- Task được activate/block/accept: cập nhật tracker hoặc TASKS trong cùng ngày; 14 phản ánh authorization/dependency, 15 phản ánh weekly roll-up/gate/RAG.
- Scope/schedule/cost baseline, RAID, RACI, cadence hoặc completion rule đổi: cập nhật 15 và communication tới audience theo plan.

Mỗi tài liệu SHOULD có owner, version/review date sau khi project governance được khởi tạo. Link hỏng, stale command hoặc ví dụ không còn khớp contract là defect, không phải “việc viết tài liệu sau”.

## 8. Điều kiện bộ tài liệu đủ để bàn giao

- Reader mới trả lời đúng source of truth, P0 boundary, security invariants và Go/Adjust/Stop.
- Junior thực hiện được một additive change + negative authorization test theo 09–12 mà không hỏi “file nào sửa”.
- Reviewer truy ra được contract, decision, test fixture và runbook của một critical flow.
- Operator hiểu effective config, approval, test, rollback và lý do một field/action bị khóa.
- Không có decision Open bị trình bày như commitment, command không tồn tại hoặc secret/PII trong ví dụ.
- Fresh-reader test và Markdown/link/table/code-fence check đều pass sau thay đổi lớn.
