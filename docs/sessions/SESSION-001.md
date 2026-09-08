# Phiên làm việc 001 — Khởi tạo Discovery và scaffold

## 1. Metadata

| Trường | Giá trị |
|---|---|
| Session ID | `001` |
| Trạng thái | **Closed** |
| Bắt đầu | `2026-09-08` |
| Đóng phiên | `2026-09-08` |
| Executor | Codex implementation agent |
| Acceptance authority | Project Owner/user |
| Git tag cuối phiên | `session-001` |
| Phiên kế tiếp | `002` |

Lệnh tự nhiên để tiếp tục: **`triển khai tiếp phiên làm việc 002`**.

## 2. Yêu cầu đã nhận

1. Kickoff, phân vai và chỉ định owner.
2. Xác minh PortSIP version/API/SDK/license.
3. Chuẩn bị PoC inbound, outbound, event, recording và SIP trunk.
4. Chốt kiến trúc sẵn sàng mở rộng: data/feature/screen/field authorization, form/workflow/settings động và logic-pack registry.
5. Chốt stack, dựng repository scaffold.
6. Dùng WBS, PMP checklist, decision register và evidence log để quản lý.
7. Bàn giao cho Codex tiếp tục ở phiên sau.

## 3. Kết quả đã hoàn thành/được chấp nhận

- `DISC-PMP-001`: Accepted/100%; cơ chế PMP/WBS/live board đã được Project Owner chấp nhận.
- `G0-01`: Accepted/100% cho **Discovery scaffold**; D-023/ADR-001 đã khóa toolchain.
- Initial repository commit đã tạo trước bước đóng phiên: `4cad24e`.
- Scaffold gồm `apps/web`, `apps/api`, `apps/worker` và các contract package độc lập.
- PortSIP adapter boundary: UI ngoài `apps/web/src/telephony` không được import vendor SDK.
- Supply-chain policy chỉ cho `esbuild` chạy install script; Scarf telemetry bị từ chối.
- API smoke có liveness `ok`; readiness cố ý `degraded` khi dependency chưa cấu hình.
- Tài liệu junior handover, test/debug/runbook, outbound/trunk, architecture và PMP đã được liên kết.

## 4. Trạng thái work item khi đóng phiên

| Work item | Trạng thái | Đã có | Còn lại/điều kiện |
|---|---|---|---|
| `DISC-KO-001` | In Review / 90% | Kickoff và owner matrix tạm thời | Project Owner xác nhận account; bổ nhiệm Security/Telephony/QA-Ops |
| `DISC-PS-001` | Verification / 75% | Public PBX/SBC/REST/SDK/license scan | Exact customer binaries, browser SDK, OpenAPI/schema, order form, sandbox |
| `DISC-ARC-001` | In Review / 90% | D-016–D-022 Discovery baseline | Named reviewer + thin-slice negative/migration/rollback evidence |
| `G0-02` | Verification / 80% | Scaffold, lockfile, check/build/smoke pass | Independent review/clean-machine replay |
| `G0-03` | In Review / 90% | Build Profile chạy trên máy tạo | Independent clean-machine signature |
| `G0-05` | Verification / 80% | Initial architecture rule pass | Negative fixture + independent Architecture review |
| `DISC-HO-001` | Ready / 0% | Template và acceptance questions | Reviewer độc lập thực hiện |
| `G0-04` | Blocked / 0% | Backlog/acceptance có sẵn | CI provider/repository rule/DevOps owner |
| `G0-06` | Blocked / 0% | Boundary đã ghi | Docker/container runtime + DevOps/Security owners |
| `POC-TEL-001` | Blocked / 0% | PoC criteria/golden dataset | D-002 exact sandbox và Telephony/Security reviewer |
| `POC-OUT-001` | Blocked / 0% | Preview/progressive 1:1 design | D-002, D-008, D-013, G0-06 |
| `POC-TRUNK-001` | Blocked / 0% | Admin boundary/design | D-011 exact endpoint/role/ownership và sandbox |
| `POC-CONFIG-001` | Blocked / 0% | D-016–D-022 baseline | G0-06 + Security/Product/Ops review |
| `G0-07` | Blocked / 0% | Junior onboarding criteria | G0-03–G0-06 |
| `D-010` | Pending | Go/Adjust/Stop criteria | Toàn bộ Discovery/PoC evidence pack và Sponsor decision |

Product WBS vẫn `Not Started / 0%`: 86 work package A–H, cộng 7 Gate-0 package thành 93 package. Không bắt đầu product feature trước D-010.

## 5. PortSIP facts và giới hạn xác minh

Nguồn công khai chính thức đã xác nhận:

- PBX `22.6.3`, SBC `11.2.8`;
- public REST/WSI reference `22.3`;
- native SDK download chủ yếu `19.6.2`, macOS `19.6.1`;
- PortSIP mô tả WebRTC/browser support và SDK bundled với PBX license.

Chưa được xem là exact product contract vì chưa có customer portal/order form, browser artifact/version/checksum, sandbox và vendor compatibility statement. Không commit proprietary SDK binary hoặc secret.

## 6. Verification cuối phiên

- `pnpm run check`: PASS.
- Format và ESLint zero-warning: PASS.
- TypeScript strict: PASS cho 9 workspace projects.
- Vitest: 2/2 tests PASS.
- Architecture dependency test: PASS.
- API/worker/web/packages build: PASS.
- API HTTP smoke: PASS.
- Markdown validation tại thời điểm kiểm tra: 31 files, 0 broken relative links, 0 unbalanced code fences.
- Không real dial/send, không PortSIP/CRM/IdP credential, không trunk mutation, không Production data.

Exact command xem tại [Build Profile](../BUILD-PROFILE.md). Trong headless shell của Codex, đặt `CI=true` trước pnpm nếu package manager yêu cầu TTY.

## 7. Artifact quan trọng

- [Live task board](../../TASKS.md)
- [Current Work Ledger](../14-CONG-VIEC-HIEN-TAI.md)
- [PMP control checklist](../15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md)
- [Decision register](../06-DECISION-REGISTER.md)
- [Discovery/PoC](../04-DISCOVERY-POC.md)
- [ADR-001 implementation stack](../adr/ADR-001-IMPLEMENTATION-STACK.md)
- [Build Profile](../BUILD-PROFILE.md)
- [Kickoff evidence](../evidence/DISC-KO-001.md)
- [PortSIP evidence](../evidence/DISC-PS-001.md)
- [Architecture evidence](../evidence/DISC-ARC-001.md)
- [Scaffold evidence](../evidence/G0-002.md)

## 8. Kế hoạch bắt đầu phiên 002

1. Kiểm tra tag `session-001`, Git working tree và đọc toàn bộ file trong mục 7.
2. Tạo hồ sơ `SESSION-002.md` trạng thái In Progress.
3. Chạy clean install/check; cập nhật G0-02/G0-03 evidence.
4. Nếu chưa có external PortSIP inputs, ưu tiên G0-06 bằng fake PortSIP/IdP/CRM hoàn toàn synthetic và không dial.
5. Viết negative architecture fixture và CI-local command cho G0-05/G0-04; không tự nhận CI-hosted setup nếu chưa có remote/provider.
6. Chuẩn bị vendor evidence request cho D-002; khi user cung cấp sandbox/license, mới mở PoC TEL/OUT/TRUNK.
7. Thực hiện authorization/config/form/workflow thin slice trước hoặc song song với vendor waiting nếu G0-06 đủ điều kiện.
8. Cập nhật TASKS, decision, risk/blocker và evidence ngay khi trạng thái thay đổi.

## 9. Stop conditions cho Codex phiên sau

- Không có named Security/Telephony reviewer nhưng thao tác cần credential, call, recording hoặc trunk write.
- Yêu cầu dùng Production data/secret hay số điện thoại thật mà chưa có explicit approval/sandbox policy.
- Contract PortSIP exact build khác public docs; dừng suy đoán và mở lại D-002/ADR nếu cần.
- Dependency/gate chưa đạt; không chuyển task sang Ready hoặc 100% để hợp thức hóa việc đã làm.
