# Evidence — DISC-PS-001 PortSIP public contract scan

- Date: `2026-09-08`
- Assignee: `Codex implementation agent`
- Status: `Verification / 75%`
- Scope: nguồn công khai chính thức; không truy cập tenant/vendor portal, binary hoặc credential

## Đã xác minh

| Hạng mục | Kết quả công khai | Nguồn |
|---|---|---|
| PBX | `22.6.3`, `2026-08-12`; free edition 2 simultaneous calls/3 extensions | https://www.portsip.com/download-portsip-pbx/ |
| SBC | `11.2.8`, `2026-08-12`; free edition 3 simultaneous calls | https://www.portsip.com/download-portsip-pbx/ |
| Version policy | v22.x current/recommended; v16 EOL cuối 2026 | https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/summary-of-changes |
| REST | Public latest `v22.3.0`, changelog `2025-12-19`; có OpenAPI download và resource trunk/inbound/outbound rules | https://support.portsip.com/development-portsip/rest-apis/version-22.3 |
| SDK platforms | WebRTC/browser, iOS, Android, macOS, Windows; SDK được nêu là bundled với PBX license | https://support.portsip.com/development-portsip/calling-apis |
| Kensaku SDK download | Android/iOS/Windows/.NET MAUI `19.6.2`, macOS `19.6.1`; trang public không hiện browser package/version | https://www.portsip.com/download-portsip-voip-sdk/ |
| SDK license | Buyer có quyền phát triển/phân phối app; license không chuyển nhượng; signed order/click agreement phải được đối chiếu | https://support.portsip.com/portsip-communications-solution/faq/portsip-sdk-license-agreement |

## Chưa được xác minh — chặn D-002

- Exact PBX/SBC build và license/order form khách hàng thực có.
- Exact JavaScript/WebRTC SDK artifact, version, checksum, sample và compatibility với PBX 22.6.3.
- OpenAPI/WSI/webhook schema đúng exact build 22.6.3; rate/replay/retry semantics.
- License entitlement cho contact center, HA, SDK, extensions/concurrent calls và mô hình phân phối cụ thể.
- Sandbox endpoint/role matrix, recording access, call-control idempotency và trunk mutation behavior.

## Next action

Telephony owner dùng [exact contract/license/sandbox request](PORTSIP-EXACT-CONTRACT-REQUEST.md) để mở vendor ticket, đính kèm checklist D-002 trong `docs/04-DISCOVERY-POC.md`, rồi lưu trả lời/binary hash/order-form reference vào evidence store. Request hiện ở trạng thái `Prepared — not sent`; Codex không thay named Telephony Owner tạo external side effect. Không commit secret hoặc proprietary SDK binary vào repository.
