# Sổ đăng ký phiên làm việc

## Quy ước phiên bản

- Mã phiên dùng ba chữ số: `001`, `002`, `003`...
- Mỗi phiên có một file `SESSION-nnn.md` và một Git tag `session-nnn` khi đóng.
- `Closed` nghĩa là trạng thái, bằng chứng, blocker và next action đã được ghi và commit; không đồng nghĩa toàn bộ dự án hoàn tất.
- Không sửa lịch sử phiên đã đóng để làm đẹp trạng thái. Nếu cần đính chính, ghi trong phiên kế tiếp và liên kết phiên cũ.

## Cách tiếp tục bằng Codex

Người dùng chỉ cần gửi:

```text
triển khai tiếp phiên làm việc 002
```

Codex phải:

1. đọc `AGENTS.md`, `TASKS.md`, registry này và `SESSION-001.md`;
2. kiểm tra Git tag/working tree và chạy quality gate trong Build Profile;
3. tạo `SESSION-002.md` với trạng thái `In Progress` trước khi sửa artifact;
4. nhận work item Ready theo đúng dependency/gate;
5. cập nhật task/decision/evidence trong cùng change set;
6. khi người dùng yêu cầu đóng, chuyển phiên `002` thành `Closed`, commit và gắn tag `session-002`.

Có thể viết số không có zero-padding, ví dụ “phiên làm việc 2”; Codex chuẩn hóa thành `002`.

## Danh sách phiên

| Phiên | Trạng thái | Ngày | Phạm vi chính | Git reference | Bàn giao sang |
|---|---|---|---|---|---|
| [001](SESSION-001.md) | **Closed** | 2026-09-08 | Kickoff, PortSIP public scan, architecture baseline, stack/scaffold, PMP/WBS/handoff | `session-001` | `002` |
