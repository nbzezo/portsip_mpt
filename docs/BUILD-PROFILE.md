# Build Profile — Portsip CC

Đây là nguồn chuẩn duy nhất cho command scaffold. Profile được kiểm chứng trên Windows/PowerShell ngày `2026-09-08`; clean-machine verification độc lập vẫn còn mở.

## 1. Yêu cầu

- Node.js `>=24.15.0 <25`.
- pnpm `11.19.0` qua Corepack hoặc binary tương đương.
- Git.
- Docker/Podman chỉ cần từ G0-06; host hiện tại chưa có Docker.
- Không cần PortSIP, CRM, IdP hoặc Production credential để chạy quality gate.

Kiểm tra:

```powershell
node --version
pnpm --version
git --version
```

## 2. Cài dependency

```powershell
pnpm install --frozen-lockfile
```

Supply-chain policy chỉ cho `esbuild` chạy install script và từ chối Scarf telemetry. Không chạy `pnpm approve-builds` tùy ý; thay đổi policy phải review manifest + lockfile.

## 3. Quality gate bắt buộc

```powershell
pnpm run check
```

Trong runner/headless shell không có TTY, đặt `CI=true` theo cú pháp của shell trước khi gọi pnpm. Terminal tương tác của developer không cần bước này.

Lệnh này chạy lần lượt:

1. `format:check`;
2. ESLint strict;
3. TypeScript strict cho mọi workspace;
4. Vitest unit tests;
5. architecture dependency test trên source thật cùng allowed/forbidden fixtures;
6. production build cho packages, API, worker và web.

Kết quả hiện tại: PASS — 2 test files/2 tests, architecture source scan + allowed/forbidden fixtures PASS, 9 workspace projects build PASS; API smoke trả liveness `ok` và readiness `degraded` đúng thiết kế khi dependency chưa cấu hình.

## 4. Chạy ứng dụng scaffold

```powershell
pnpm dev
```

- API: `http://127.0.0.1:3000/api/v1/health/live`.
- Readiness cố ý trả `degraded` cho tới khi dependency được cấu hình.
- Web dùng port Vite hiển thị trong terminal.
- Worker chỉ bootstrap, không có dial/send/vendor side effect.

Dừng bằng `Ctrl+C`. Không bật biến `PORTSIP_REAL_SIDE_EFFECTS`; biến này chỉ là hard guard test và không phải cơ chế enable Production.

## 5. E2E và hạ tầng local

Playwright đã pin nhưng browser binary và synthetic environment chưa được cài. Sau G0-06, owner bổ sung exact command để start PostgreSQL 18, Redis 8.2, fake IdP, fake PortSIP và fake CRM; sau đó mới đưa `test:e2e` vào `check`.

Không tự chạy `playwright install`, Docker image, migration hay seed trước khi G0-06 có checksum/image policy và reviewer.

## 6. Troubleshooting

- Node ngoài range: cài Node 24 LTS rồi chạy lại install.
- Lockfile mismatch: không xóa lockfile; kiểm tra manifest change và chạy `pnpm install` có review.
- `ERR_PNPM_IGNORED_BUILDS`: kiểm tra `allowBuilds`; không approve package lạ.
- Architecture test fail: sửa dependency direction, không thêm exception chung.
- Readiness degraded: đúng kỳ vọng của scaffold nếu PostgreSQL/Redis/PortSIP chưa cấu hình.
