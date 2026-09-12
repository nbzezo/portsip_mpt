# Current Work Ledger — công việc được phép bắt đầu

## 1. Mục đích và trạng thái

Ledger này trả lời câu hỏi đầu tiên của người tiếp nhận: **“Tôi được làm việc nào ngay bây giờ?”** Đây là nguồn chuẩn cho authorization/dependency của work item tới khi issue tracker chính thức được chọn và liên kết trong D-010. Chỉ item có `Status = Ready`, assignee rõ và đủ Definition of Ready mới được bắt đầu. Sau khi activate, trạng thái hằng ngày nằm ở [TASKS.md](../TASKS.md); quy tắc progress/acceptance/reporting nằm ở [PMP control checklist](15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md).

Snapshot: `2026-09-12` — giai đoạn `Provisional synthetic build / PortSIP parallel discovery`; Project Owner đã cho phép dựng khung nghiệp vụ/CRM bằng synthetic adapters. D-010 `Adjust`; real PortSIP/CRM/IdP integration vẫn chưa được authorize.

Phiên làm việc `001` đã Closed; hồ sơ bất biến tại [SESSION-001](sessions/SESSION-001.md). Phiên `002` đang In Progress; hồ sơ tại [SESSION-002](sessions/SESSION-002.md).

Named owner/reviewer dùng alias trong [Role Registry](ROLE-REGISTRY.md) theo D-024. Alias là project identity để điều phối code, không phải tên người thật hoặc bằng chứng phê duyệt; review độc lập vẫn phải chạy ở execution/task tách biệt và ghi evidence. Khi task cần vendor, legal, carrier, CI provider hoặc production authority, phải bổ sung account/reference thật trước khi mở external side effect.

## 2. Bảng công việc hiện tại

| Work item | Status | Assignee | Accountable owner | Required reviewer | Due | Evidence |
|---|---|---|---|---|---|---|
| `DISC-PMP-001` — PMP control + live tracking | Accepted / 100% | Codex documentation maintainer | Project owner/user | Project owner/user | 2026-09-08 | [Evidence record](evidence/DISC-PMP-001.md) |
| `DISC-KO-001` — kickoff + owner assignment | Accepted / 100% | `Ledger` | `Owner`/Project owner user | `Owner`/Project owner user | 2026-09-09 | [Role Registry](ROLE-REGISTRY.md), [evidence record](evidence/DISC-KO-001.md) |
| `DISC-PS-001` — PortSIP contract scan | Verification / 75% | `Ledger` | `Echo` | `Echo` + `Sentinel` + `Atlas` | Discovery Day 3 | [Evidence record](evidence/DISC-PS-001.md) |
| `DISC-ARC-001` — extensible architecture baseline | In Review / 90% | `Atlas` | `Owner`/Project owner user | `Sentinel` + `Compass` + `Beacon` | Discovery Day 5 | [Architecture evidence](evidence/DISC-ARC-001.md) |
| `DISC-HO-001` — fresh-reader validation | **Ready / Discovery review** | `Scout` separate execution | `Atlas` | `Atlas` + `Beacon` | T+1 ngày làm việc từ lúc nhận repo | [Evidence record](evidence/DISC-HO-001.md) |
| `G0-01` — Approve D-023 cho Discovery scaffold | Accepted / 100% | `Atlas` | `Owner` | `Sentinel` + `Forge` review là điều kiện trước D-010 | 2026-09-08 | [ADR-001](adr/ADR-001-IMPLEMENTATION-STACK.md) |
| `G0-02` — monorepo scaffold | Verification / 80% | `Atlas` | `Atlas` | `Scout` + `Beacon` + `Sentinel` | 2026-09-09 | [Scaffold evidence](evidence/G0-002.md), [clean-machine template](evidence/G0-CLEAN-MACHINE-REVIEW.md), [Gate 0 review pack](evidence/GATE-0-REVIEW-PACK.md) |
| `G0-03` — Build Profile | In Review / 90% | `Atlas` | `Atlas` | `Scout` + `Forge` | Discovery Day 5 | [Build Profile](BUILD-PROFILE.md), [clean-machine template](evidence/G0-CLEAN-MACHINE-REVIEW.md), [Gate 0 review pack](evidence/GATE-0-REVIEW-PACK.md); independent execution còn thiếu |
| `G0-04` — CI baseline | Blocked / 30%; main đã push, hosted run và branch protection còn thiếu | `Forge` | `Forge` + `Atlas` | `Beacon` | Gate 0 | [Environment preflight](evidence/G0-004-G0-006-PREFLIGHT.md); CI artifacts + protected-branch evidence còn thiếu |
| `G0-05` — architecture tests | In Review / 90%; source scan + allowed/forbidden fixtures PASS | `Atlas` | `Atlas` | `Sentinel` + `Beacon` | Gate 0 | [Architecture-test evidence](evidence/G0-005.md), [Gate 0 review pack](evidence/GATE-0-REVIEW-PACK.md); separate review còn thiếu |
| `G0-06` — synthetic environment | Blocked / 45%; runtime replay healthy and candidate reviewer acceptance PASS, Sentinel/Beacon sign-off còn thiếu | `Forge` | `Forge` | `Sentinel` + `Beacon` | Gate 0 | [Image policy](../infra/local/IMAGE-POLICY.md), [Compose scaffold](../infra/local/compose.synthetic.yml), [review evidence](evidence/G0-06-REVIEW.md), [environment preflight](evidence/G0-004-G0-006-PREFLIGHT.md); named reviewer sign-off còn thiếu |
| `PROD-SYN-001` — provisional synthetic Agent Workspace vertical slice | In Review / 90%; shell và quality gate PASS 2026-09-12, chờ reviewer độc lập | `Atlas` | `Owner` | `Sentinel` + `Beacon` | 2026-09-15 | [Evidence](evidence/PROD-SYN-001.md); synthetic adapters only, real integration remains blocked |
| `PROD-CORE-001` — synthetic authorization/configuration contracts | Ready / 0%; parallel track, vendor-independent typed contracts | `Atlas` | `Owner` | `Sentinel` + `Compass` + `Beacon` | 2026-09-19 | [Roadmap](../ROADMAP-PARALLEL-TRACKS.md); real vendor writes remain blocked |
| `PROD-CRM-001` — synthetic CRM business workflow | Ready / 0%; parallel track, synthetic contacts/cases only | `Compass` | `Owner` | `Atlas` + `Sentinel` + `Beacon` | 2026-09-19 | [Roadmap](../ROADMAP-PARALLEL-TRACKS.md); real CRM integration remains blocked |
| `G0-07` — contributor quick-start | Blocked by `G0-03–G0-06` | `Scout` | `Atlas` | `Beacon` | Trước D-010 decision pack | Onboarding evidence theo 12 |
| `POC-TEL-001` — inbound/event/CDR/recording | Blocked by D-002/sandbox | `Echo` | `Echo` | `Sentinel` + `Beacon` + `Atlas` | Day 6 | PoC evidence pack theo 04 |
| `POC-OUT-001` — preview/progressive 1:1 | Blocked by D-002/D-008/D-013/G0-06 | `Echo` + `Compass` | `Compass` | `Sentinel` + `Beacon` | Day 8 | Golden attempt evidence theo 04/07 |
| `POC-TRUNK-001` — trunk/DID/rule Admin | Blocked by D-011 exact contract/sandbox | `Echo` | `Echo` | `Sentinel` + `Beacon` | Day 8 | Draft/read-back/test/rollback evidence |
| `POC-CONFIG-001` — auth/config/form/workflow | Blocked by G0-06 | `Atlas` | `Atlas` | `Sentinel` + `Compass` + `Beacon` | Day 9 | Thin-slice/version/migration/rollback evidence |
| `D-010` — product build authorization | **Adjust selected / conditional — build not authorized** | `Owner` | `Owner` | `Compass` + `Atlas` + `Sentinel` + `Echo` + `Beacon` | Final gate after evidence | [Adjust evidence](evidence/D-010-ADJUST.md); signed final gate + evidence pack còn thiếu |

Không tự đổi `Not Ready/Blocked` thành `Ready`. Accountable owner phải kiểm tra dependency, ghi named assignee/reviewer/due/evidence location và cập nhật Decision Register hoặc tracker trước.

## 3. Starter ticket `DISC-HO-001`

### 3.1 Outcome

Chứng minh một developer mới hiểu đúng phạm vi, gate, kiến trúc và safety boundary của bộ tài liệu mà không cần đoán stack, API vendor hoặc quyền được làm. Tìm và ghi mâu thuẫn trước khi chúng trở thành code.

### 3.2 In scope

1. Đọc theo đường dẫn Developer trong [Mục lục bàn giao](00-MUC-LUC-BAN-GIAO.md).
2. Mở mọi relative Markdown link trong README, TASKS, AGENTS và docs 00–15; ghi link hỏng.
3. Kiểm tra code fence/bảng có đóng đúng và ví dụ dùng thống nhất `/api/v1`, `app_tenant_id`, canonical event envelope và dial-attempt FSM.
4. Trả lời chín câu hỏi acceptance ở mục 3.5 bằng link tới nguồn chuẩn.
5. Ghi finding theo `P0/P1/P2`, owner đề xuất và cách tái kiểm tra vào [evidence record](evidence/DISC-HO-001.md).
6. Nếu có lỗi, chỉ tạo change tài liệu nhỏ hoặc gửi finding cho owner; chạy lại toàn bộ acceptance sau sửa.

### 3.3 Out of scope và stop condition

- Không cài dependency, chọn framework/version, tạo scaffold hoặc viết product feature.
- Không truy cập PortSIP/CRM/IdP, không dùng credential và không gọi số điện thoại.
- Không thay effective trunk/DID/routing/config hoặc dùng production data.
- Dừng và báo Engineering Lead nếu tài liệu xung đột về quyền, tenant boundary, DNC/consent, external side effect, destructive migration hoặc gate status.
- Hoàn tất khi evidence được hai reviewer ký `PASS`, hoặc dừng ở `NOT PASS` với owner/due cho mọi P0/P1 còn mở.

### 3.4 Inputs và reviewer

- Inputs: README, docs 00–14 và trạng thái git của snapshot nhận bàn giao.
- Assignee: `Scout`, chạy ở execution/task tách biệt từ committed snapshot và ghi execution reference vào evidence trước khi bắt đầu.
- Accountable: `Atlas`.
- Review: `Atlas` kiểm tra contract/boundary; `Beacon` kiểm tra tính lặp lại và evidence ở execution review riêng.
- Không có named reviewer: item chuyển `Blocked`, không tự duyệt kết quả của mình.

### 3.5 Acceptance questions

Người thực hiện phải trả lời đúng và dẫn link:

1. P0, non-goal và decision nào hiện cho phép/không cho phép product build?
2. D-023/G0-01, G0-02, G0-03 và D-010 chạy theo thứ tự nào; command thật sẽ nằm ở đâu?
3. Một nested/custom field update đi qua write obligations và authorized patch thế nào?
4. Vì sao crash sau broker publish/trước outbox mark có thể tạo duplicate nhưng không được tạo hai logical effect?
5. Authorization khác nhau thế nào giữa user-intent job, factual projection và external side effect?
6. PortSIP create-call timeout/unknown được trace và reconcile thế nào mà không blind redial?
7. Progressive 1:1 reserve agent ra sao; xử lý thế nào khi attempt `>0` nhưng valid reservation `=0`?
8. Với một ticket mới, tìm owner, capability/scope, contract, test evidence, reviewer, runbook và escalation ở đâu?
9. Khi task bắt đầu, block, vào review và hoàn tất thì cập nhật ở đâu; vì sao chưa có approver/evidence chỉ được tối đa 90%?

### 3.6 Definition of Done

- [ ] Evidence ghi snapshot/commit, người thực hiện, thời gian bắt đầu/kết thúc và tài liệu đã đọc.
- [ ] Chín câu trả lời có source link; không dùng “theo em nghĩ”.
- [ ] Link, fence, table và canonical-name checks có kết quả tái lập được.
- [ ] Mọi P0/P1 đã sửa và re-test, hoặc có explicit owner/due/blocker; không đánh `PASS` khi còn P0/P1.
- [ ] `Atlas` và `Beacon` ký review ở execution tách biệt; `Atlas` đóng item sau khi acceptance đạt.
- [ ] Không có scaffold/dependency/credential/vendor/production side effect phát sinh.

## 4. Sau khi `DISC-HO-001` pass

`Atlas` chỉ đóng `DISC-HO-001` sau khi `Scout` và `Beacon` có evidence tách biệt. Item pass chỉ chứng minh tài liệu Discovery đọc được; nó **không** Approve D-023, D-010, PortSIP contract hay product build. Khi issue tracker được chọn, migrate ledger bằng stable work-item IDs, thêm tracker URL vào đây và giữ file này làm landing page trạng thái.
