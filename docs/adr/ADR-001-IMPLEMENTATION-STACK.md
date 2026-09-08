# ADR-001 — Implementation stack và repository toolchain

- Decision ID: `D-023`
- Status: **Approved for Discovery scaffold / conditional before product build**
- Date: `2026-09-08`
- Approver: Project owner/user qua chỉ thị “Bắt đầu ngay”; Codex là implementation agent chịu trách nhiệm lập và kiểm chứng scaffold
- Còn phải review trước `D-010`: Security, DevOps/Ops và Engineering Lead account thật khi đội dự án được bổ nhiệm

## Bối cảnh

Dự án cần một nền tảng dễ mở rộng cho inbound, outbound, authorization, cấu hình, form và workflow động. Đội tiếp nhận có thể gồm junior, nên một ngôn ngữ end-to-end, contract rõ và command root thống nhất được ưu tiên. Quyết định này chỉ cho phép Gate 0/PoC; không cho phép gọi số, dùng credential Production hoặc triển khai product feature.

## Quyết định

| Thành phần | Phiên bản/baseline khóa | Ghi chú |
|---|---|---|
| Runtime | Node.js `>=24.15.0 <25`, actual `24.15.0` | Node 24 LTS; ESM (`type: module`) |
| Workspace | pnpm `11.19.0` | Một workspace, một `pnpm-lock.yaml`; supply-chain policy bật |
| Language | TypeScript `6.0.3`, strict | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |
| Web | React `19.2.8`, Vite `8.2.2` | PortSIP SDK chỉ qua `apps/web/src/telephony` |
| API/BFF | NestJS `12.0.1`, Fastify adapter | `/api/v1`; controller mỏng; domain không import framework |
| Worker | TypeScript process riêng | Service identity/delegated scope sẽ được thêm ở slice tương ứng |
| Database | PostgreSQL `18.x`, `pg 8.23.0`, node-pg-migrate `9.0.0` | SQL migration bất biến; transaction + outbox P0 |
| Cache | Redis `8.2` Extended | Không là source of truth; chưa dựng local vì host chưa có Docker |
| Validation/API | Zod `4.5.4`, OpenAPI qua `@nestjs/swagger 12.0.1` | JSON Schema/OpenAPI artifact phải version hóa |
| Unit/contract | Vitest `5.0.0` | Test synthetic, deterministic |
| E2E | Playwright `1.63.0` | Browser binary chưa tải; chờ G0-06 synthetic environment |
| Quality | ESLint `10.10.0`, Prettier `3.9.6` | Root `pnpm run check` là quality gate |
| Observability | OpenTelemetry-compatible contract | SDK package chỉ thêm khi có vertical slice và owner |

Chỉ `esbuild` được phép chạy install script. `@scarf/scarf` bị chặn vì telemetry không cần cho build/runtime.

## Kiến trúc được khóa

- Modular monolith cho app plane, tách deployable `web`, `api`, `worker`.
- Contract package độc lập cho API, event, authorization, configuration và observability.
- PostgreSQL transactional outbox trước; chỉ thêm broker khi có số liệu scale/ownership.
- Deny-by-default và authorization server-side; ẩn menu/field ở frontend không phải kiểm soát bảo mật.
- Form/workflow/settings chỉ dùng versioned declarative metadata và allowlisted action/logic registry; không arbitrary code.
- Vendor adapter chống nhiễm DTO PortSIP vào domain; thao tác thật bị disabled cho tới khi D-002/D-010 và sandbox gate đạt.

## Phương án không chọn

- Microservices từ đầu: tăng chi phí vận hành và consistency khi domain/volume chưa được chứng minh.
- Broker từ đầu: chưa có bằng chứng cần Kafka/RabbitMQ; outbox giữ đường nâng cấp.
- Low-code/BPMN/arbitrary script P0: mở rộng attack surface và khó version/rollback.
- Browser gọi PortSIP REST bằng admin token: vi phạm tenant/security boundary.

## Điều kiện mở lại ADR

- PortSIP browser SDK không tương thích Node/web build hoặc yêu cầu native client.
- Capacity chứng minh outbox worker không đáp ứng throughput/SLO.
- OIDC/hosting/regulated-market policy không tương thích stack.
- Clean-machine, architecture, dependency/license hoặc security review fail.

## Bằng chứng

- Manifest và lockfile tại repository root.
- Build commands: [BUILD-PROFILE.md](../BUILD-PROFILE.md).
- Kết quả xác minh: [G0-002 evidence](../evidence/G0-002.md).
