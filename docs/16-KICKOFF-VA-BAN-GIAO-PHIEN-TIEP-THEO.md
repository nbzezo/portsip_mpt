# Kickoff và bàn giao cho phiên Codex tiếp theo

## 1. Trạng thái tại thời điểm bàn giao

Ngày `2026-09-08`, Project Owner đã yêu cầu bắt đầu ngay và tiếp tục triển khai bằng Codex. Discovery được khởi động; D-023 được chốt có điều kiện cho scaffold. Scaffold TypeScript modular monolith đã build/test pass. Chưa có real PortSIP sandbox/credential, Docker, CRM/IdP, carrier policy hoặc reviewer độc lập.

## 2. Việc đã làm

1. Kickoff, RACI tạm thời và vacancy log: `DISC-KO-001`.
2. Scan nguồn công khai PortSIP: `DISC-PS-001`; D-002 vẫn Unverified vì thiếu exact customer contract/artifact.
3. Chốt ADR-001/D-023 cho Discovery scaffold.
4. Dựng web/API/worker + contract packages + lockfile + quality/architecture test.
5. Tạo Build Profile và cập nhật WBS/PMP/decision/evidence.

## 3. Thứ tự làm tiếp — không được đảo

1. Đọc `AGENTS.md`, `TASKS.md`, tài liệu 14–16, ADR-001 và Build Profile.
2. Chạy `pnpm install --frozen-lockfile` rồi `pnpm run check`; ghi evidence mới nếu kết quả khác.
3. Bổ nhiệm/ghi account thật cho Security, Telephony, QA/Ops; không tự ký thay các reviewer này.
4. Hoàn tất D-002 bằng exact PortSIP PBX/SBC/SDK/OpenAPI/license/sandbox evidence.
5. Dựng G0-06 synthetic environment; tuyệt đối không real dial/send/trunk write.
6. Thực hiện PoC theo vertical slice: inbound → outbound preview/progressive 1:1 → event/CDR/recording → trunk draft/read-back → auth/config/form/workflow.
7. Mỗi task đổi trạng thái phải cập nhật `TASKS.md`, evidence, decision/RAID và phần trăm theo tài liệu 15.
8. Chỉ sau D-010 `Go/Adjust` mới bắt đầu product features.

## 4. Starter prompt cho phiên Codex tiếp theo

```text
Tiếp tục dự án trong repository hiện tại. Đọc AGENTS.md, TASKS.md, docs/14-CONG-VIEC-HIEN-TAI.md, docs/15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md, docs/16-KICKOFF-VA-BAN-GIAO-PHIEN-TIEP-THEO.md, docs/adr/ADR-001-IMPLEMENTATION-STACK.md và docs/BUILD-PROFILE.md. Chạy quality gate từ Build Profile, đối chiếu live board, chỉ nhận task Ready. Ưu tiên hoàn tất owner assignment, D-002 exact PortSIP contract và G0-06 synthetic environment; không dùng Production credential/data, không real dial/send hoặc mutate trunk. Cập nhật TASKS, decision register và evidence trong cùng change set.
```

## 5. Stop conditions

- Không có named Security/Telephony reviewer nhưng task cần credential, call hoặc trunk write.
- Exact vendor API khác public v22.3 hoặc SDK compatibility không được xác nhận.
- Bất kỳ test nào tạo external side effect ngoài approved sandbox.
- Dependency, schema, tenant boundary, consent/DNC hoặc authorization bị suy đoán thay vì có decision/evidence.
