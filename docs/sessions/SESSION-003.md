# Phiên làm việc 003 — Synthetic business and CRM build

## 1. Metadata

| Trường | Giá trị |
|---|---|
| Session ID | `003` |
| Trạng thái | **Planned — handoff ready** |
| Bàn giao từ | `002` |
| Ngày bàn giao | `2026-09-12` |
| Phạm vi | Dựng nghiệp vụ, authorization/configuration contracts và CRM trên synthetic adapters |
| Không thuộc phạm vi | PortSIP exact contract/SDK/license/sandbox và real integration; tiếp tục ở `DISC-PS-001` |

## 2. Mục tiêu phiên

1. Hoàn thiện `PROD-CORE-001`: typed authorization/configuration contracts và lifecycle draft → validate → simulate → approve → publish/rollback.
2. Hoàn thiện `PROD-CRM-001`: synthetic contacts/cases, tenant scope, ownership, audit và deterministic reset.
3. Mở rộng `PROD-SYN-001` Agent Workspace để đọc trạng thái contract/CRM synthetic và giữ các call/trunk action disabled.
4. Duy trì adapter boundary để PortSIP có thể tích hợp sau mà không sửa core domain.

## 3. Trạng thái nhận bàn giao

- HEAD/tag bàn giao: `session-002` (được tạo khi đóng phiên 002).
- `CI=true; pnpm run check`: PASS trên phiên 002.
- Synthetic Compose runtime: PostgreSQL, Redis, fake IdP/PortSIP/CRM healthy; image digests pinned.
- `PROD-SYN-001`: In Review / 90%, chờ `Sentinel` + `Beacon`.
- `PROD-CORE-001`: Ready / 0%.
- `PROD-CRM-001`: Ready / 0%.
- `DISC-PS-001`: Verification / 75%, để lại cho track PortSIP song song.

## 4. Guardrails

- Chỉ synthetic/anonymized data và fake adapters.
- Không real dial/send, trunk/DID mutation, production credential/data/route.
- Không đưa vendor DTO/SDK trực tiếp vào domain/application; dùng typed ports/contracts.
- Không chuyển task sang `Accepted / 100%` nếu chưa có reviewer/approver/date/evidence.

## 5. Definition of Done cho phiên 003

- Authorization/configuration contracts có unit/contract tests cho allow/deny, version pin và rollback.
- CRM synthetic workflow có tenant/ownership isolation, audit field và reset test.
- Agent Workspace hiển thị synthetic records/status và không mở side effect controls.
- `CI=true; pnpm run check` PASS.
- Cập nhật `TASKS.md`, current ledger, evidence và session log trong cùng change set.
- Reviewer độc lập được yêu cầu cho các task cần separation-of-duties.

## 6. Việc không được làm

- Không gửi PortSIP ticket thay `Echo` hoặc dùng public docs làm exact contract.
- Không triển khai real PortSIP/CRM/IdP adapter trước khi `DISC-PS-001` và D-010 final gate đủ evidence.
- Không chờ PortSIP để bắt đầu business/CRM synthetic implementation.
