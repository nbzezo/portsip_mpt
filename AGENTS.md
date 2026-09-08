# Portsip CC — repository working agreement

## Trước khi bắt đầu

1. Đọc `README.md`, `docs/00-MUC-LUC-BAN-GIAO.md`, `docs/14-CONG-VIEC-HIEN-TAI.md`, `docs/15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md`, `docs/sessions/README.md`, session handoff mới nhất và `TASKS.md`.
2. Chỉ bắt đầu work item có trạng thái `Ready`, đủ Definition of Ready, assignee và required reviewer rõ. Named role dùng alias trong `docs/ROLE-REGISTRY.md` theo D-024.
3. D-023 đã Approved có điều kiện cho Discovery scaffold theo ADR-001 và Build Profile; D-010 chưa Go product build. Không tự đổi dependency/stack, dùng production credential/data, real dial/send/trunk mutation hoặc tạo external side effect.

## Theo dõi task bắt buộc

- Khi nhận việc, thêm/cập nhật item trong `TASKS.md` với ID, owner, due, evidence và trạng thái.
- Khi trạng thái đổi, cập nhật trong cùng ngày: actual/forecast, remaining work, blocker, next action và evidence.
- Work item vắng khỏi live board/tracker mặc định `Not Started / 0%`.
- Assignee báo code/doc xong tối đa 90%; chỉ chuyển `Accepted / 100%` khi acceptance pass, có approver/date/evidence.
- Khi người dùng xác nhận task hoàn tất, chuyển task sang `## Done` theo dạng `- [x] ~~Task~~ (YYYY-MM-DD)` và giữ evidence link.
- Task blocked giữ % đã earned; ghi blocker owner, `waiting since` và escalation date.
- Alias role không tự tạo independent approval: task yêu cầu separation-of-duties phải được execution/task khác review từ committed snapshot và ghi evidence.

## Đồng bộ tài liệu

- Scope/decision/contract/architecture/test/runbook thay đổi phải cập nhật các tài liệu owner tương ứng theo docs 00 và 15 trong cùng change set.
- Không bịa command. Exact command chỉ authoritative trong `docs/BUILD-PROFILE.md` sau G0-03.
- Không đánh dấu hoàn tất nếu link/evidence không tái tạo được hoặc còn P0/P1 chưa có owner/due.

## Phiên làm việc tuần tự

- Khi người dùng viết `triển khai tiếp phiên làm việc X`, chuẩn hóa X thành ba chữ số và đọc phiên ngay trước trong `docs/sessions/`.
- Tạo `SESSION-X.md` trạng thái `In Progress` trước khi thực hiện task mới; không ghi đè phiên đã Closed.
- Khi đóng phiên: cập nhật live board/decision/evidence, chuyển session thành `Closed`, commit và gắn tag `session-X`.
- Cú pháp tiếp tục hiện tại: `triển khai tiếp phiên làm việc 002`.
