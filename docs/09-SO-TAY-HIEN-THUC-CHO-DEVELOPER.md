# Sổ tay hiện thực dành cho Developer

## 1. Mục đích và trạng thái tài liệu

Tài liệu này là hướng dẫn bàn giao để một developer mới, kể cả junior, có thể đi từ yêu cầu đến một vertical slice an toàn trong Portsip CC. Nó chuyển các nguyên tắc ở tài liệu kiến trúc thành cấu trúc thư mục, thứ tự thao tác, quy tắc code review và ví dụ code.

Repository hiện vẫn ở giai đoạn Discovery/Solution Design. Discovery scaffold và Build Profile đã tồn tại theo D-023, nhưng D-010 chưa cho phép product build. Vì vậy:

- cấu trúc và code TypeScript bên dưới là **reference implementation cho Discovery**, chưa phải code production hoặc exact vendor contract;
- manifest, lockfile và `docs/BUILD-PROFILE.md` là nguồn authoritative cho import/package/version/bootstrap của scaffold; snippet còn lại chỉ minh họa trừ khi dẫn tới code thật;
- không tự chọn phiên bản Node.js, package manager, framework, ORM, migration tool, validation library, test runner hoặc policy engine trong một ticket tính năng;
- **D-023 — Application stack và repository conventions** đã `Approved for Discovery scaffold / conditional before D-010` trong [Decision register](06-DECISION-REGISTER.md); không tự nới điều kiện Security/DevOps/independent review;
- exact PortSIP PBX/SBC/SDK/REST/WSI contract vẫn phải đi qua D-002 và Discovery/PoC; không code theo suy đoán từ snippet hoặc tài liệu version khác.

Nếu decision hoặc exact contract liên quan chưa được duyệt, developer chỉ làm work item đã được [Current Work Ledger](14-CONG-VIEC-HIEN-TAI.md) đánh `Ready` trong phạm vi Discovery scaffold/PoC. Work item có thể tạo domain/port/fixture/test bằng fake nếu owner ghi rõ là PoC artifact, nhưng không được nối production credential, đoán vendor endpoint hoặc biến hypothesis thành dependency ngầm.

## 2. Thứ tự đọc và lộ trình onboarding

### 2.1 Đọc theo thứ tự này

| Thứ tự | Tài liệu | Sau khi đọc phải trả lời được |
|---:|---|---|
| 1 | [Mục lục bàn giao](00-MUC-LUC-BAN-GIAO.md) + [README](../README.md) | Dự án đang ở giai đoạn nào, phạm vi P0 là gì và tài liệu nào authoritative? |
| 2 | [Kế hoạch triển khai](01-KE-HOACH-TRIEN-KHAI.md) | Các phase, vai trò, rủi ro, gate và Definition of Success cấp dự án là gì? |
| 3 | [Danh mục tính năng](02-DANH-MUC-TINH-NANG.md) | Tính năng đang làm là MVP/P1/P2, Build hay Reuse, acceptance criteria ở đâu? |
| 4 | [Kiến trúc tích hợp](03-KIEN-TRUC-TICH-HOP.md) | Source of truth, module ownership, luồng inbound/outbound/config và failure mode là gì? |
| 5 | [Discovery/PoC](04-DISCOVERY-POC.md) + [Decision register](06-DECISION-REGISTER.md) | Giả định/decision nào phải chứng minh, ai có quyền chốt và evidence ở đâu? |
| 6 | [Outbound và SIP Trunk Admin](07-OUTBOUND-VA-SIPTRUNK-ADMIN.md) | Outbound invariant, trunk ownership và privileged write boundary nằm ở đâu? |
| 7 | [Extensibility, authorization và cấu hình động](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md) | Bốn lớp quyền, registries, config/form/workflow versioning hoạt động thế nào? |
| 8 | Tài liệu này | Tạo một thay đổi đúng kiến trúc và vertical slice ra sao? |
| 9 | [Chuẩn code và DoD](10-CHUAN-CODE-REVIEW-VA-DEFINITION-OF-DONE.md) | Code/PR phải tuân quy tắc và có evidence nào? |
| 10 | [Hợp đồng API/event/data](11-HOP-DONG-API-EVENT-VA-DU-LIEU.md) | Endpoint, event, table, version và migration được thiết kế thế nào? |
| 11 | [Test/debug/runbook](12-CHIEN-LUOC-TEST-DEBUG-VA-RUNBOOK.md) | Test gì, lấy evidence nào và recovery an toàn ra sao? |
| 12 | [Backlog khởi tạo](13-BACKLOG-KHOI-TAO-VA-PHAN-CONG.md) + [Current Work Ledger](14-CONG-VIEC-HIEN-TAI.md) | Ticket phụ thuộc gì, việc nào hiện Ready, mức nào junior được làm và reviewer nào bắt buộc? |
| 13 | [PMP control checklist](15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md) + [TASKS.md](../TASKS.md) | Cập nhật trạng thái/%/blocker/evidence và khi nào task được tính 100%? |
| 14 | [Nguồn tham khảo](05-NGUON-THAM-KHAO.md) | Contract nào dựa trên nguồn chính thức và mục nào vẫn cần xác minh với vendor? |

Không bắt đầu bằng cách đọc controller rồi sao chép pattern. Hãy xác định source of truth, module owner, capability, data scope, invariant và failure semantics trước.

### 2.2 Kế hoạch năm ngày đầu

**Ngày 1 — hiểu hệ thống:** nhận và hoàn thành starter `DISC-HO-001` trong Current Work Ledger, vẽ lại một inbound flow và một outbound flow bằng lời của mình, rồi xác nhận các decision còn Open với mentor.

**Ngày 2 — chạy nền tảng:** sau khi scaffold tồn tại, chạy đúng bootstrap command trong `docs/BUILD-PROFILE.md`, test suite và một request có trace. Nếu scaffold chưa tồn tại, chỉ tham gia D-023/G0 ticket khi ledger/tracker giao rõ; nếu không, tiếp tục `DISC-HO-001` hoặc task Discovery khác được đánh Ready, không tự tạo app riêng.

**Ngày 3 — đọc một vertical slice:** lần theo route → auth context/PEP → application handler → domain → repository/outbox → consumer/projection → UI. Ghi lại nơi module khác được gọi qua port/event.

**Ngày 4 — thay đổi nhỏ:** thêm một validation hoặc field hiển thị không nhạy cảm kèm unit/integration test. Không chọn ticket trunk credential, permission core, DNC, dial dispatch hoặc migration phá dữ liệu làm ticket đầu tiên.

**Ngày 5 — pair review:** trình bày failure paths, authorization negatives, telemetry và rollback của thay đổi; sửa tài liệu/runbook nếu có bước chỉ tồn tại trong trí nhớ người hướng dẫn.

### 2.3 Thuật ngữ tối thiểu

| Thuật ngữ | Giải thích ngắn |
|---|---|
| Domain | Luật nghiệp vụ thuần, không biết HTTP, database hay PortSIP SDK |
| Application handler | Điều phối một use case: phân quyền, transaction, gọi domain/repository/outbox |
| Port | Interface do phía cần năng lực sở hữu, ví dụ `TelephonyGateway` |
| Adapter | Hiện thực một port cho vendor/database cụ thể |
| PEP | Điểm chặn và thực thi quyết định quyền tại API/query/serializer/worker |
| PDP/PIP | Nơi quyết định quyền và nơi cung cấp thuộc tính/scope cho quyết định |
| Obligation | Ràng buộc kèm quyết định quyền, ví dụ mask số điện thoại hoặc yêu cầu step-up |
| Outbox/Inbox | Bảng bền vững giúp phát/nhận event an toàn khi retry, restart hoặc nhận trùng |
| Idempotency | Chạy lại cùng logical command không tạo side effect lần hai |
| Reconciliation | Đối soát lại với source of truth khi kết quả hoặc event không chắc chắn |
| Aggregate | Cụm domain object bảo vệ invariant trong một transaction |
| Published version | Bản config/schema/workflow bất biến; sửa đổi bằng version mới |
| PBX | Tổng đài quản lý signaling/call session; PortSIP PBX là telephony source of truth |
| SBC | Session Border Controller bảo vệ/định tuyến biên SIP giữa PBX và network/provider |
| SIP trunk | Kết nối thoại SIP giữa PBX và nhà mạng/provider |
| DID/DDI | Đầu số public được route tới tenant/IVR/queue/destination |
| WSI | PortSIP WebSocket Interface/Pub-Sub dùng nhận sự kiện gần thời gian thực |
| CDR | Call Detail Record — bản ghi cuộc gọi hoàn tất dùng đối soát/report |
| CPS | Calls per second — tốc độ tạo cuộc gọi carrier/trunk cho phép |
| Concurrency | Số call/session đồng thời, khác với CPS |
| DNC | Do Not Call — danh sách/chính sách không được gọi; P0 fail closed |
| PII | Dữ liệu định danh cá nhân; phải phân loại, mask, giới hạn export/log |
| IDOR | Truy cập object ngoài quyền bằng cách đoán/thay ID; chặn bằng scoped query/object PEP |
| SLO | Mục tiêu mức dịch vụ đo được; khác SLA cam kết hợp đồng |
| UAT | User Acceptance Testing với kịch bản nghiệp vụ được owner duyệt |
| ADR | Architecture Decision Record ghi lựa chọn, lý do, trade-off và hậu quả |
| Maker-checker | Người tạo thay đổi không được tự phê duyệt/thực thi nếu policy yêu cầu tách nhiệm vụ |
| Break-glass | Quyền khẩn cấp tối thiểu, step-up, có lý do, TTL, alert và hậu kiểm |
| Step-up | Yêu cầu xác thực mạnh hơn ngay trước thao tác nhạy cảm |
| Calling window | Khoảng thời gian được phép gọi theo timezone/quiet-hours/market policy |
| Effective dial ratio | Tỷ lệ attempt đang được phát lệnh/ringing so với reservation agent hợp lệ tại quyết định dispatch |

Với progressive 1:1 P0, invariant mạnh hơn một KPI trung bình: mỗi dispatch có đúng một reservation agent `Ready` còn hiệu lực, một reservation không cấp cho hai attempts và không có dispatch khi mẫu số bằng 0. Tại mỗi decision window:

```text
effective_dial_ratio = outbound attempts đang dispatch/ringing
                       / valid exclusive agent reservations tương ứng
```

Tỷ lệ phải `≤1,0`; đồng thời acceptance là `0` answered call thiếu agent. Quy ước `0/0 = 0` chỉ dùng khi không có attempt nào; nếu attempt `> 0` nhưng reservation hợp lệ `= 0` thì đó là invariant breach: dừng dispatch mới, alert/kill switch và đưa attempt vào reconciliation thay vì tính một tỷ lệ số học. Nếu batch chỉ ánh xạ được một phần, mọi attempt thiếu quan hệ 1:1 vẫn là breach và không được loại khỏi tử số. Cách chốt sampling window/denominator báo cáo thuộc D-008/Data Owner, không được thay invariant 1:1 bằng một average làm che giấu vi phạm tức thời.

## 3. D-023 — Reference stack cần phê duyệt

### 3.1 Stack hypothesis

Đề xuất dùng TypeScript end-to-end để giảm số mô hình ngôn ngữ mà đội nhỏ phải vận hành và chia sẻ contract/tooling giữa web, API và worker. Đây không phải lý do để chia sẻ domain internals sang frontend.

| Lớp | Reference choice | Ranh giới bắt buộc |
|---|---|---|
| Web | React + TypeScript | Chỉ gọi BFF/API qua generated client; PortSIP media qua một SDK wrapper; menu/field visibility không thay backend authorization |
| API/BFF | NestJS chạy trên Fastify adapter | Controller mỏng; auth context từ OIDC middleware/guard; business logic ở application/domain |
| Worker | TypeScript worker dùng chung application ports/handlers khi phù hợp | Service identity + delegated tenant/scope; inbox/idempotency/lease/retry/DLQ; không chạy như super-admin |
| Database | PostgreSQL | Module-owned schema/migrations; transaction + outbox ban đầu; tenant key bắt buộc trên tenant-owned data |
| Cache/coordination | Redis | Chỉ lưu dữ liệu có thể tái tạo, policy/config cache có version/TTL/invalidation; Redis không là source of truth |
| Messaging P0 | PostgreSQL transactional outbox + worker | Event envelope/versioning từ ngày đầu; chỉ thêm broker khi scale/ownership có evidence |
| Identity | OIDC-compatible IdP | Không local password production; server xác minh issuer/audience/signature/expiry; payload không được khai role/tenant/scope |
| API/schema | OpenAPI + JSON Schema | Contract có version, generated client, server validation và compatibility test |
| Observability | OpenTelemetry | Trace/metric/log correlation xuyên API → worker → adapter; không ghi secret/raw PII |

D-023 phải khóa tối thiểu: Node.js LTS, package manager/workspace, exact framework versions, module format, HTTP/schema validation approach, database access/migration tool, test runner, lint/format, OpenAPI codegen, secrets interface, local container approach và supported OS. Ghi version trong manifest/lockfile, không ghi “latest”.

### 3.2 G0-01 — điều kiện phê duyệt D-023 trước scaffold

D-023 chỉ chuyển sang `Approved` khi Engineering Lead, Architecture, Security và DevOps cùng chốt:

- exact runtime/framework/package manager/workspace và supported OS;
- database access/migration, validation/codegen, test/lint/build/CI conventions;
- version pinning, support horizon, license và dependency/security ownership;
- module layout, dependency direction, secrets interface và local-environment boundary;
- ADR nêu lý do chọn, phương án bị loại, rủi ro và điều kiện phải mở lại quyết định.

Đây là quyền tạo scaffold, không phải quyền bắt đầu product build. Không cài package hoặc tạo framework skeleton trước G0-01 chỉ để ép quyết định theo code đã viết.

### 3.3 G0-02/G0-03 — kiểm chứng scaffold sau D-023

Sau D-023 Approved, scaffold và Build Profile phải chứng minh:

- Một lệnh bootstrap được tài liệu hóa và chạy được trên máy sạch được hỗ trợ.
- `lint`, `typecheck`, unit, integration, architecture và build có command chính thức ở root.
- API và worker shutdown sạch; migration có lock; health/readiness phân biệt database, Redis và PortSIP dependency.
- OpenAPI sinh client cho web mà không import server internals.
- Một request và một background job giữ cùng `trace_id`/`correlation_id`.
- Một transaction ghi aggregate và outbox; retry publisher không phát logical side effect hai lần.
- OIDC fake/test realm hoạt động local mà không cần production secret.
- Dependency/license/security scan có owner và policy xử lý kết quả.

Nếu spike không đạt, mở lại D-023 và cập nhật ADR; không giữ status Approved rồi thêm workaround ngoài Build Profile. Chỉ sau G0-02/G0-03 pass và D-010 Go mới giao product feature code.

## 4. Cấu trúc monorepo mục tiêu

Cấu trúc dưới đây là baseline để D-023 phê duyệt hoặc sửa. Không tạo thêm `shared`, `common` hay `utils` nếu chưa chỉ ra owner và lý do không thuộc một module.

```text
Portsip CC/
├─ apps/
│  ├─ web/
│  │  └─ src/
│  │     ├─ app/                    # bootstrap, router, providers, error boundary
│  │     ├─ features/
│  │     │  ├─ agent-workspace/
│  │     │  ├─ interactions/
│  │     │  ├─ campaigns/
│  │     │  ├─ admin-access/
│  │     │  └─ config-studio/
│  │     ├─ telephony/              # duy nhất nơi gọi PortSIP browser SDK
│  │     ├─ api/                    # generated API client + transport/session
│  │     ├─ design-system/          # approved components/tokens/a11y
│  │     └─ test/
│  ├─ api/
│  │  └─ src/
│  │     ├─ bootstrap/              # Nest/Fastify, OIDC, request context, errors
│  │     ├─ platform/               # policy/config/event/telemetry contracts
│  │     └─ modules/
│  │        ├─ interactions/
│  │        ├─ contacts/
│  │        ├─ campaigns/
│  │        ├─ outbound/
│  │        ├─ telephony-config/
│  │        ├─ authorization/
│  │        ├─ configuration/
│  │        ├─ metadata-forms/
│  │        └─ workflows/
│  └─ worker/
│     └─ src/
│        ├─ bootstrap/
│        ├─ consumers/              # event handlers, mỗi handler có owner/version
│        ├─ jobs/                   # timer, outbox, reconcile, projection
│        └─ schedulers/             # chỉ tạo durable work, không giữ state trong RAM
├─ packages/
│  ├─ api-contracts/                # OpenAPI artifacts/generated public DTOs
│  ├─ event-contracts/              # event envelope + published schemas/fixtures
│  ├─ authorization-contracts/      # capability/decision/typed-scope contracts
│  ├─ configuration-contracts/      # config definition/schema contracts
│  ├─ observability/                # logging/tracing interfaces và bootstrap
│  ├─ test-kit/                     # fakes/builders, không chứa production rule
│  ├─ eslint-config/
│  └─ tsconfig/
├─ database/
│  ├─ migrations/                   # tách theo owner module và thứ tự bất biến
│  ├─ seeds/                        # chỉ synthetic/non-production
│  └─ README.md                     # command thật sau D-023
├─ infra/
│  ├─ local/                        # local dependencies sau khi được chọn
│  ├─ deploy/                       # manifest/IaC theo môi trường
│  └─ observability/
├─ docs/
├─ scripts/                         # script nhỏ, có test/owner; không giấu domain rule
├─ package.json                     # chỉ xuất hiện khi scaffold được tạo
├─ <workspace-config>               # tên file do D-023 quyết định
└─ <lockfile>                       # đúng một lockfile do D-023 quyết định
```

`apps/api` và `apps/worker` có thể dùng cùng package application/domain đã xuất bản nội bộ hoặc cùng source module theo workspace convention được D-023 chọn. Không copy domain rule sang hai app. Ngược lại, không để domain import NestJS, Fastify, Redis, SQL client, OpenTelemetry hoặc PortSIP DTO.

### 4.1 Anatomy của một backend module

```text
modules/interactions/
├─ module.manifest.ts               # key, owner, capabilities, config, events, health
├─ api/
│  ├─ http/
│  │  ├─ interaction-notes.controller.ts
│  │  ├─ interaction.responses.ts
│  │  └─ interaction.openapi.ts
│  └─ realtime/                     # authorized topic/projection mapping
├─ application/
│  ├─ commands/add-interaction-note/
│  │  ├─ add-interaction-note.command.ts
│  │  ├─ add-interaction-note.handler.ts
│  │  └─ add-interaction-note.handler.spec.ts
│  ├─ queries/
│  └─ ports/
│     ├─ interaction.repository.ts
│     ├─ interaction.unit-of-work.ts
│     └─ policy.port.ts
├─ domain/
│  ├─ interaction.aggregate.ts
│  ├─ interaction.events.ts
│  ├─ interaction.errors.ts
│  └─ value-objects/
├─ infrastructure/
│  ├─ persistence/postgres-interaction.repository.ts
│  ├─ persistence/interaction.mapper.ts
│  └─ projections/
├─ contracts/
│  ├─ events/interaction-note-added.v1.schema.json
│  └─ public.ts                     # bề mặt duy nhất module khác được import
├─ migrations/
├─ fixtures/
├─ module.ts                        # composition/DI, không chứa business rule
└─ README.md                        # owner, contracts, state, runbook, dashboards
```

### 4.2 Luật phụ thuộc

```text
HTTP / realtime / job trigger
              ↓
        application use case
         ↙               ↘
      domain          application ports
                          ↑
                infrastructure adapters
```

Các luật phải được architecture test tự động hóa:

1. `domain` chỉ phụ thuộc standard library và primitive nội bộ ổn định.
2. `application` phụ thuộc domain và interface port, không phụ thuộc controller, ORM model hay vendor SDK.
3. `infrastructure` hiện thực port; mapping vendor/database model sang domain tại boundary.
4. `api` chỉ validate/shape transport, lấy auth context và gọi application handler.
5. Module A chỉ import `contracts/public` hoặc gọi port của module B; không import `domain`, `infrastructure` hay repository nội bộ của B.
6. Module A không query table của B, kể cả để “chỉ đọc báo cáo”. Dùng query port hoặc versioned projection/event.
7. Web chỉ dùng API contract/generated client và UI primitives; không import backend domain package.
8. `test-kit` cung cấp fake/builder, không trở thành nơi né boundary trong production.
9. Transaction không đi xuyên module. Dùng local transaction + outbox + saga/compensation.
10. Shared kernel chỉ chứa ID, clock, E.164, money/time primitives, event/auth contracts; không chứa workflow, outbound hoặc authorization rule.

## 5. Quy ước code và contract

### 5.1 Tên ổn định

- Module key: danh từ số nhiều, lowercase/kebab khi ở path, ví dụ `telephony-config`.
- Capability key: `<resource>.<subresource?>.<action>`, ví dụ `interaction.note.edit`, `recording.download`, `trunk.change.apply`.
- Config key: `<module>.<area>.<setting>`, ví dụ `interaction.wrap_up.default_seconds`.
- Event type: sự kiện đã xảy ra, ví dụ `interaction.note.added`; version nằm ở `event_version`, không giấu trong tên.
- Public API: `/api/v1/...`; breaking contract dùng version mới theo policy đã duyệt.
- ID nội bộ là opaque UUID/ULID theo D-023; không dùng phone number, extension hoặc vendor ID làm primary ID.
- Stable key đã deprecate không được tái sử dụng cho nghĩa mới.

### 5.2 Tenant, time và PII

- Mọi tenant-owned row có `app_tenant_id NOT NULL`; unique/index/FK quan trọng phải bao gồm tenant khi phù hợp.
- `app_tenant_id`, subject, session, authentication strength và delegated identity đến từ verified server context, không từ request body/query/header tùy ý.
- Lưu timestamp theo UTC; giữ business timezone/IANA zone riêng cho quiet hours, campaign và calendar. Không lưu “local time” không có zone.
- Phone number chuẩn hóa E.164 khi có thể, nhưng giữ raw input có classification/retention rõ nếu nghiệp vụ cần.
- Không log token, password, trunk secret, recording URL dài hạn hoặc raw PII. Dùng ID/correlation và masked value.
- API unauthorized object nên trả semantics chống enumeration theo policy (`404` hoặc response thống nhất), không tiết lộ object tồn tại ngoài scope.

### 5.3 Error và telemetry

Mỗi lỗi public có stable `code`, thông điệp an toàn, `request_id`/`trace_id` và optional field violations. Stack trace, SQL, vendor token và raw response chỉ ở secured telemetry theo redaction policy.

Mỗi inbound request tạo hoặc tiếp nhận `trace_id` và `correlation_id`. Khi handler phát event, event giữ correlation và thêm `causation_id`. Worker tạo span mới nhưng nối trace/context. Metric label không dùng tenant/user/resource ID có cardinality cao.

## 6. Công thức thêm một vertical slice

Một ticket tốt đi theo lát cắt dọc nhỏ, không tạo toàn bộ “layer” rồi để trống nghiệp vụ. Trình tự khuyến nghị:

1. Xác nhận feature/decision/status và acceptance criteria trong docs 01–08.
2. Chọn module owner; ghi source of truth và dữ liệu nào module sở hữu.
3. Định nghĩa capability, resource/scope, field obligations và negative cases.
4. Định nghĩa command/query contract, lỗi và idempotency semantics.
5. Viết domain invariant + unit test trước adapter.
6. Viết application handler + fake ports; test allow, deny, missing object, retry và conflict.
7. Thêm migration theo expand/migrate/contract nếu cần.
8. Hiện thực repository/adapter; thêm integration/contract tests.
9. Nếu phát event, ghi outbox cùng transaction; thêm inbox/idempotent consumer.
10. Expose endpoint/OpenAPI, rồi sinh client và làm UI states.
11. Thêm telemetry, audit, health/runbook và feature flag rollout nếu cần.
12. Chạy Definition of Done và xin review đúng owner.

Không gộp một endpoint, schema phá dữ liệu, PortSIP adapter mới, policy model mới và UI lớn trong cùng PR. Chia theo compatible slices có thể deploy độc lập.

## 7. Ví dụ TypeScript: controller → PEP/handler → domain → repository/outbox

> **Trạng thái ví dụ:** illustrative cho reference stack ở D-023. Tên decorator/import/DI token/database client phải được thay bằng convention thật sau scaffold. Mục tiêu của ví dụ là giữ đúng ranh giới và luồng dữ liệu, không phải để copy nguyên khối trước khi dependencies được khóa.

### 7.1 Auth context và transport DTO

```ts
// platform/auth/request-principal.ts
export interface RequestPrincipal {
  readonly subjectId: string;
  readonly tenantId: string;
  readonly sessionId: string;
  readonly authenticationStrength: "standard" | "step_up";
}

export interface RequestContext {
  readonly principal: RequestPrincipal;
  readonly executingServiceId: string;
  readonly requestId: string;
  readonly correlationId: string;
  readonly traceId: string;
}

// modules/interactions/api/http/add-note.body.ts
export class AddNoteBody {
  text!: string;
}
```

Không thêm `tenantId`, `role`, `teamIds`, `scope` hoặc `canEdit` vào `AddNoteBody`. Nếu client gửi các field đó, schema nên reject unknown properties; server vẫn không tin chúng.

TypeScript type/class không tự validate dữ liệu runtime. Bootstrap phải dùng OpenAPI/JSON Schema validation theo D-023, giới hạn độ dài/kích thước trước controller và từ chối payload sai kiểu hoặc field lạ ở command nhạy cảm.

### 7.2 Controller mỏng

```ts
import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import { RequestContext } from "../../../../platform/auth/request-principal";
import { AuthContext } from "../../../../bootstrap/auth-context.decorator";
import { AddInteractionNoteHandler } from "../../application/commands/add-note/add-note.handler";
import { AddNoteBody } from "./add-note.body";

// Bootstrap đặt global prefix `api/v1` theo contract; controller chỉ khai resource path.
@Controller("interactions")
export class InteractionNotesController {
  constructor(private readonly addNote: AddInteractionNoteHandler) {}

  @Post(":interactionId/notes")
  @HttpCode(201)
  async execute(
    @AuthContext() context: RequestContext,
    @Param("interactionId", ParseUUIDPipe) interactionId: string,
    @Body() body: AddNoteBody,
  ): Promise<{
    data: { note_id: string };
    meta: { request_id: string };
  }> {
    const result = await this.addNote.execute({
      context,
      interactionId,
      text: body.text,
    });
    return {
      data: { note_id: result.noteId },
      meta: { request_id: context.requestId },
    };
  }
}
```

OIDC guard tạo `RequestPrincipal` sau khi xác minh token; request middleware bổ sung các correlation fields để thành `RequestContext`. Ví dụ giả định authentication guard fail-closed được gắn global; nếu D-023 chọn guard theo route thì controller phải khai guard rõ và architecture test phải chặn route chưa phân loại. Controller không đọc raw bearer để tự parse, không nhận tenant từ URL/body và không chứa business rule.

### 7.3 Typed authorization scope, repository và unit of work ports

```ts
export interface InteractionReadScope {
  readonly tenantId: string;
  readonly allowedBusinessUnitIds: readonly string[];
  readonly allowedTeamIds: readonly string[];
  readonly allowedQueueIds: readonly string[];
  readonly ownOnly: boolean;
  readonly subjectId: string;
}

export interface PolicyPort {
  requireInteractionScope(input: {
    principal: RequestPrincipal;
    capability: "interaction.note.edit";
  }): Promise<InteractionReadScope>;

  requireInteractionState(input: {
    principal: RequestPrincipal;
    capability: "interaction.note.edit";
    resource: { id: string; state: string; ownerId?: string };
  }): Promise<void>;
}

export interface InteractionRepository {
  findForUpdate(input: {
    id: string;
    scope: InteractionReadScope;
  }): Promise<Interaction | null>;
  save(interaction: Interaction): Promise<void>;
}

export interface OutboxPort {
  append(input: {
    tenantId: string;
    initiatingSubjectId?: string;
    executingServiceId: string;
    correlationId: string;
    causationId: string;
    traceId: string;
    events: readonly DomainEvent[];
  }): Promise<void>;
}

export interface InteractionUnitOfWork {
  transaction<T>(
    work: (ports: {
      interactions: InteractionRepository;
      outbox: OutboxPort;
    }) => Promise<T>,
  ): Promise<T>;
}
```

`InteractionReadScope` là typed filter, không phải raw SQL do PDP trả về. PostgreSQL adapter biên dịch nó thành parameterized predicates và bắt buộc `app_tenant_id`. Không được query rộng rồi lọc trong JavaScript.

`OutboxPort` ghép metadata tin cậy của execution context với metadata aggregate trong `DomainEvent`, rồi map camelCase nội bộ sang canonical envelope snake_case ở mục 8.4. Mapper phải fail nếu thiếu producer/type/version/aggregate/correlation/causation/trace; không tự điền tenant, actor hoặc service từ payload nghiệp vụ.

### 7.4 Domain aggregate bảo vệ invariant

```ts
import { randomUUID } from "node:crypto";

export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly occurredAt: string;
  readonly producer: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly aggregateVersion: number;
  readonly data: Readonly<Record<string, unknown>>;
}

interface InteractionNote {
  readonly id: string;
  readonly text: string;
  readonly actorId: string;
  readonly createdAt: string;
}

export class Interaction {
  private readonly pendingEvents: DomainEvent[] = [];

  constructor(
    readonly id: string,
    readonly tenantId: string,
    private state: "active" | "wrap_up" | "closed",
    private aggregateVersion: number,
    private readonly ownerId?: string,
    private readonly notes: InteractionNote[] = [],
  ) {}

  authorizationFacts(): { id: string; state: string; ownerId?: string } {
    return { id: this.id, state: this.state, ownerId: this.ownerId };
  }

  addNote(input: { text: string; actorId: string; now: Date }): string {
    const text = input.text.trim();
    if (this.state === "closed") throw new Error("INTERACTION_CLOSED");
    if (text.length === 0 || text.length > 4_000) {
      throw new Error("NOTE_TEXT_INVALID");
    }

    const noteId = randomUUID();
    this.notes.push({
      id: noteId,
      text,
      actorId: input.actorId,
      createdAt: input.now.toISOString(),
    });
    this.aggregateVersion += 1;
    this.pendingEvents.push({
      eventId: randomUUID(),
      eventType: "interaction.note.added",
      eventVersion: 1,
      occurredAt: input.now.toISOString(),
      producer: "interactions",
      aggregateType: "interaction",
      aggregateId: this.id,
      aggregateVersion: this.aggregateVersion,
      data: { noteId, actorId: input.actorId },
    });
    return noteId;
  }

  pullEvents(): readonly DomainEvent[] {
    return this.pendingEvents.splice(0);
  }
}
```

Production implementation nên dùng typed domain errors và value object thay `Error` string; lựa chọn đó thuộc scaffold convention. Domain không biết `Request`, JWT, NestJS, SQL hay PortSIP.

### 7.5 Application handler là PEP chính của use case

```ts
export class AddInteractionNoteHandler {
  constructor(
    private readonly policy: PolicyPort,
    private readonly uow: InteractionUnitOfWork,
    private readonly clock: { now(): Date },
  ) {}

  async execute(command: {
    context: RequestContext;
    interactionId: string;
    text: string;
  }): Promise<{ noteId: string }> {
    const scope = await this.policy.requireInteractionScope({
      principal: command.context.principal,
      capability: "interaction.note.edit",
    });

    return this.uow.transaction(async ({ interactions, outbox }) => {
      const interaction = await interactions.findForUpdate({
        id: command.interactionId,
        scope,
      });
      if (!interaction) throw new Error("INTERACTION_NOT_FOUND");

      await this.policy.requireInteractionState({
        principal: command.context.principal,
        capability: "interaction.note.edit",
        resource: interaction.authorizationFacts(),
      });

      const noteId = interaction.addNote({
        text: command.text,
        actorId: command.context.principal.subjectId,
        now: this.clock.now(),
      });
      await interactions.save(interaction);
      await outbox.append({
        tenantId: command.context.principal.tenantId,
        initiatingSubjectId: command.context.principal.subjectId,
        executingServiceId: command.context.executingServiceId,
        correlationId: command.context.correlationId,
        causationId: command.context.requestId,
        traceId: command.context.traceId,
        events: interaction.pullEvents(),
      });
      return { noteId };
    });
  }
}
```

Hai lần kiểm tra có mục đích khác nhau: scope filter chặn IDOR và data leakage khi load; resource-state check áp ABAC/obligation sau khi đã load đúng object. Repository update và outbox append nằm trong cùng database transaction.

### 7.6 Repository adapter phải áp scope tại query

Pseudocode SQL tương đương, luôn parameterized:

```sql
SELECT i.*
FROM interactions.interaction AS i
WHERE i.app_tenant_id = :app_tenant_id
  AND i.id = :interaction_id
  AND (
    i.business_unit_id = ANY(:allowed_business_unit_ids)
    OR i.team_id = ANY(:allowed_team_ids)
    OR i.queue_id = ANY(:allowed_queue_ids)
    OR (:own_only AND i.owner_id = :subject_id)
  )
FOR UPDATE;
```

Typed scope compiler phải xử lý danh sách rỗng thành deny, không thành “bỏ filter”. Test bắt buộc: đúng tenant/scope tìm thấy; khác tenant, khác team và guessed ID đều không tìm thấy; count/search/export dùng cùng semantics.

### 7.7 Test tối thiểu cho ví dụ

- allow: capability + scope đúng, note hợp lệ → save một lần, outbox một event;
- deny capability: repository không được gọi;
- outside scope/guessed ID: trả semantics không tiết lộ object, không save/outbox;
- closed interaction: transaction rollback, không outbox;
- invalid note: không save/outbox;
- retry cùng command nếu endpoint hỗ trợ idempotency: cùng key không tạo note/event thứ hai;
- tenant trong body/header tùy ý: schema reject hoặc bị ignore, không đổi effective tenant;
- event chứa correlation/causation/trace ở envelope do outbox publisher bổ sung; payload không chứa secret.

## 8. Cách thêm từng loại thay đổi

### 8.1 Thêm module mới

1. Viết một đoạn module charter: problem, owner, source of truth, aggregate, public use cases, data classification và non-goals.
2. Kiểm tra module có thực sự mới hay thuộc module hiện hữu. Không tách theo mỗi table hoặc mỗi màn hình.
3. Khai `module.manifest`: stable key/version, owner/team, public ports, event schemas, capabilities, config definitions, migrations, health và runbook URL/path.
4. Tạo anatomy như mục 4.1; export duy nhất qua `contracts/public`.
5. Xác định call đồng bộ nào cần port, thay đổi bất đồng bộ nào cần event. Không tạo circular dependency; nếu có, xem lại ownership.
6. Đăng ký composition ở app bootstrap; không dùng global service locator.
7. Thêm architecture tests: forbidden import, forbidden cross-schema query, manifest completeness.
8. Thêm smoke test và telemetry; cập nhật feature catalog/architecture/decision nếu phạm vi thay đổi.

Exit: module bị xóa adapter vẫn unit-test được với fake ports; module khác không import internal path; owner/runbook rõ.

### 8.2 Thêm use case/command

1. Đặt tên theo ý định nghiệp vụ, ví dụ `PublishCampaign`, không đặt `UpdateCampaignRow`.
2. Viết preconditions, invariant, allowed state transitions, idempotency key và kết quả `accepted/rejected/unknown` nếu có external side effect.
3. Chọn capability và resource type. Ghi data scope, field/action obligation, step-up/approval và service/delegated identity nếu worker gọi.
4. Handler resolve scope trước object query; re-authorize state ngay trước side effect nhạy cảm.
5. Domain quyết định state/event; handler điều phối transaction/repository/outbox.
6. External call không nằm giữa transaction dài. Dùng durable command/outbox, worker và reconcile/compensation.
7. Test happy path, mọi deny, invalid state, duplicate, timeout, unknown result và retry.

### 8.3 Thêm endpoint

1. Mô tả OpenAPI trước: method/path, request/response schema, error codes, auth requirement và idempotency header nếu có.
2. Không nhận trusted identity/scope/permission trong payload. Lấy principal từ verified request context.
3. Reject unknown fields cho command nhạy cảm; chuẩn hóa/validate transport trước handler, nhưng lặp lại business validation trong domain.
4. PDP/application PEP lấy write-field obligations; nếu payload có field đã biết nhưng không được ghi thì reject trước domain/DB/outbox. Không `spread` body vào entity hoặc silently drop field bị cấm.
5. Controller gọi đúng một application use case hoặc query. Không gọi repository/PortSIP trực tiếp.
6. Serializer áp read-field obligations ở server. Generated client không nhận field bị cấm rồi mới hide.
7. Thêm contract test và negative auth test cho direct URL, guessed ID, forbidden write field, list/count/search/export.
8. Không trả vendor DTO/raw error. Map thành canonical response và stable error code.

### 8.4 Thêm event và consumer

1. Event diễn tả sự kiện đã xảy ra, có owner và mục đích consumer rõ.
2. Tạo JSON Schema fixture và tách envelope khỏi payload. Envelope/known required fields validate chặt; với event version đã hỗ trợ, payload phải chấp nhận/ignore additive unknown fields. Không sao chép policy HTTP command `additionalProperties=false` rồi phá forward compatibility.
3. Chọn `event_type` ổn định và `event_version = 1`. Thay đổi additive giữ version nếu compatibility test cho phép; breaking change tăng version và có deprecation/upcaster plan.
4. Ghi outbox trong cùng transaction với state change. Relay claim/lease và commit trong transaction ngắn, publish ngoài database transaction, rồi mark bằng transaction ngắn khác có lease owner/version check. Publisher là at-least-once, giữ nguyên `event_id`; crash sau publish/trước mark có thể phát trùng và phải được test. Không giữ row lock/transaction mở xuyên network call.
5. Consumer ghi inbox unique `(consumer_key,event_id)` trong cùng transaction với state/projection update. Duplicate event phải trả success mà không lặp logical effect; external effect còn cần downstream idempotency/reconciliation.
6. Unknown/breaking version vào quarantine/DLQ, không parse đoán.
7. Propagate tenant, initiating subject nếu có, executing service, correlation, causation và trace. User-intent job re-authorize actor lúc execute; factual projection dùng tenant/event-scoped service identity; external side effect có capability riêng và re-check current invariant.
8. Test duplicate, out-of-order, delayed, missing dependency, poison message, restart và replay.

Envelope tối thiểu:

```ts
export interface EventEnvelope<T extends object> {
  event_id: string;
  event_type: string;
  event_version: number;
  occurred_at: string;
  producer: string;
  app_tenant_id: string;
  initiating_subject_id?: string;
  executing_service_id?: string;
  aggregate_type: string;
  aggregate_id: string;
  aggregate_version: number;
  correlation_id: string;
  causation_id: string;
  trace_id: string;
  data: T;
}
```

### 8.5 Thêm migration

1. Chỉ module owner tạo migration cho schema/table của module đó.
2. Dùng `expand → migrate/backfill → contract`: thêm nullable/new structure tương thích; deploy code đọc cũ/mới; backfill có checkpoint; sau N-1 window mới siết/xóa.
3. Mọi tenant-owned table có `app_tenant_id`, primary/unique/index và FK phù hợp. Không thêm global uniqueness vô tình chặn hai tenant.
4. Migration lớn có estimate lock/time/space, batch size, pause/resume, progress metric và abort criteria.
5. Backfill có immutable `run_id`, dry-run/report, idempotency và không phát business side effect trùng.
6. Không giả định down migration an toàn. Rollback thường là forward fix hoặc quay app/config version khi schema vẫn tương thích.
7. Test empty DB, current snapshot, representative volume, N-1 rolling deploy và failed/restarted backfill.
8. Không sửa migration đã chạy ở shared environment; tạo migration mới.

### 8.6 Thêm config definition và setting UI

Operator chỉ thay **value** của key đã được module đăng ký. Operator không tự tạo raw key hoặc evaluator.

```ts
export const wrapUpDefaultSeconds = {
  key: "interaction.wrap_up.default_seconds",
  definitionVersion: 1,
  ownerModule: "interactions",
  schema: { type: "integer", minimum: 0, maximum: 900 },
  allowedScopes: ["tenant", "queue"],
  precedence: ["platform", "environment", "tenant", "queue"],
  readCapability: "interaction.settings.view",
  writeCapability: "interaction.settings.edit",
  approvalRisk: "low",
  activation: "new_instance_only",
  ui: {
    control: "duration_seconds",
    labelKey: "settings.wrapUp.defaultSeconds",
    helpKey: "settings.wrapUp.defaultSeconds.help",
  },
} as const;
```

Trình tự:

1. Đăng ký typed schema, owner, scopes, evaluator/precedence, capabilities, classification, risk/approval, activation, UI metadata, impacts và default.
2. Viết resolver tests cho từng layer và ambiguous relationship; không dùng “last row wins”.
3. Tạo lifecycle draft → validate → preview effective diff → simulate/test → approve nếu cần → publish → invalidate → monitor.
4. UI luôn hiện effective value, nguồn kế thừa, override/version/actor/time và `Reset to inherited`.
5. Secret value chỉ đi vào write-only endpoint rồi thành vault reference; read API chỉ trả trạng thái/metadata.
6. Publish version bất biến và audit. Rollback là publish lại compatible value/version, không sửa lịch sử.
7. Feature flag chỉ mở code path; handler vẫn kiểm tra capability/policy.

Không đưa setting lên UI nếu chưa typed, validate, authorize, preview/test và version/rollback được. Hiển thị read-only health + deep-link/runbook cho system-only setting.

### 8.7 Thêm capability, data scope, screen hoặc field rule

1. Tạo capability stable key với description, owner, risk, applicable resource/action và deprecation policy.
2. Gắn vào role template chỉ như default bundle; grant thực tế phải có scope/validity/conditions.
3. Xác định typed scope predicate cho repository, object lookup, realtime, report và export.
4. Xác định field obligations: omit, mask, read-only, unmask, export/download/print riêng.
5. Đăng ký screen/navigation entry yêu cầu capability để UX dễ hiểu; vẫn giữ API PEP.
6. Thêm authorization matrix với allow và deny cho tenant, BU, team, queue, campaign, own/assigned, multi-membership và expired/revoked grant.
7. Test cache invalidation/revoke; stale allow không vượt bounded window đã phê duyệt.
8. Audit allow/deny nhạy cảm bằng reason/policy version, không log PII.

Không dùng role name trực tiếp trong controller kiểu `if (user.role === "ADMIN")`. Không hardcode visibility ở web mà thiếu server policy. Không tạo capability có nghĩa mơ hồ như `manage_all`.

### 8.8 Thêm web screen hoặc UI action

1. Đặt code trong `features/<feature>`; route loader lấy screen/form/action manifest đã lọc từ server.
2. Dùng generated API client và canonical view model; không gọi PortSIP admin REST từ browser.
3. Ẩn/disable theo manifest để UX rõ, nhưng xử lý `403/404/policy_changed` vì server có thể từ chối sau khi màn hình tải.
4. Có đủ loading, empty, no-data, validation, permission denied, degraded, drift, conflict/ETag, partial failure và retry-safe states.
5. Form dùng server-published schema/version; submit kèm schema/config/workflow version cần thiết, backend revalidate.
6. Sensitive value mặc định mask; reveal/download là action/capability riêng và có audit.
7. Basic mode trước Advanced; plain-language help/example/impact; keyboard/focus/error summary và WCAG 2.1 AA.
8. Test component, route/action manifest, unauthorized deep link, responsive viewport và representative operator task.

### 8.9 Thêm adapter/logic/action extension

1. Chọn đúng registry: CRM adapter, eligibility validator, assignment strategy, workflow action, notification adapter, import mapper hoặc report projection.
2. Port do domain/application side sở hữu; adapter mapping không rò vendor DTO.
3. Manifest khai key/version, input/output schema, timeout, idempotency, retry, health, required capability/config và compatible runtime range.
4. Conformance suite dùng chung phải xanh với fake/vendor sandbox.
5. Có kill switch, metric/error budget và safe fallback. Fallback không được bỏ authorization/compliance.
6. Extension code chỉ được build/deploy qua CI. P0 không cho operator upload JS/SQL/plugin/remote component.

## 9. Dynamic field, form và workflow

### 9.1 Custom field

Custom field P0 chỉ thuộc `contact read-model`, `case`, `interaction`, `campaign_member` và `disposition form`. Không thêm field động trực tiếp vào PortSIP CDR/trunk/session hoặc core IDs/state/compliance columns.

Khi thêm loại field/widget mới bằng code:

1. Định nghĩa canonical value type và JSON Schema.
2. Thêm server validator/normalizer, storage serializer và migration/version compatibility.
3. Khai classification, encrypt/retention, view/edit/unmask/search/filter/sort/index/export capabilities.
4. Thêm approved frontend widget với keyboard/a11y/error states.
5. Thêm renderer cho record schema cũ và test breaking-type rejection.
6. Nếu được search/report, tạo typed projection/index; không query JSON tùy ý trên hot path.

Record pin `schema_version`; delete là deprecate/hide rồi purge theo retention riêng. Backend authoritative cho required/read-only/conditional rule.

### 9.2 Form/layout

Form definition tách khỏi data schema và chỉ dùng approved page/tab/section/group/widget slots. Luồng publish:

1. draft từ published version;
2. validate field/reference/capability dependencies;
3. preview bằng synthetic data theo persona/queue/campaign/workflow state;
4. accessibility và responsive checks;
5. simulate conditional visible/required/read-only;
6. approve/publish immutable version;
7. record mới pin version; record cũ vẫn render hoặc có migration rõ;
8. monitor submission errors, rollback bằng version mới nếu cần.

Không cho arbitrary HTML/CSS/component URL. Web không tự quyết required field mà backend không biết.

### 9.3 Workflow/rule/timer

Workflow động chỉ điều phối quy trình nghiệp vụ như case, follow-up, approval, assignment và SLA. Nó không thay thế registration/call/session/dial-attempt FSM, tenant isolation, authorization, DNC/consent, secret handling hoặc carrier hard limit.

Mỗi workflow version cần:

- initial/terminal states và transition map;
- capability + typed guard cho từng transition;
- form binding/required fields;
- approved action key/version;
- timer, business calendar, timezone/DST và outage catch-up policy;
- retry/timeout/idempotency/compensation;
- migration compatibility và owner.

Action handler nhận typed input và execution context (`tenant`, workflow instance/version, service/delegated subject, correlation/idempotency). Không nhận raw script, SQL hoặc URL. Timer phải lưu durable job trước khi trả success; restart không được mất timer. External action trả `unknown` phải vào reconcile/manual task thay vì retry mù.

Workflow publish validator phải tìm unreachable state, cycle nguy hiểm, action loop, missing capability/schema, timer không owner/escalation và non-idempotent action có retry policy sai. Instance đang chạy pin version cũ; migration cần mapping, dry-run, impact report và approval.

## 10. PortSIP integration guide

### 10.1 Browser SDK wrapper

Chỉ `apps/web/src/telephony` được import PortSIP browser SDK. Expose một internal `TelephonyClient` với canonical state/action; UI feature không gọi vendor method trực tiếp.

Wrapper chịu trách nhiệm:

- SDK lifecycle, registration, device permission/selection và reconnect;
- canonical call FSM và command guard;
- map vendor event sang app event/view state;
- correlation IDs theo contract đã PoC;
- telemetry không chứa credential/SDP/raw PII ngoài policy;
- capability/version detection và graceful unsupported state.

Không lưu extension password/admin bearer trong browser storage. Exact browser SDK availability vẫn là D-002 gate.

### 10.2 Backend port và adapter

```ts
export type CanonicalTelephonyRejectReason =
  | "destination_rejected"
  | "agent_endpoint_unavailable"
  | "capacity_limited"
  | "configuration_invalid"
  | "authentication_failed"
  | "unsupported_operation";

export type CreateOutboundCallResult =
  | {
      kind: "accepted";
      sessionId: string;
      callId?: string;
      vendorCorrelationId?: string;
    }
  | { kind: "rejected"; reason: CanonicalTelephonyRejectReason; retryable: boolean }
  | { kind: "unknown"; reconciliationToken: string };

export interface TelephonyGateway {
  createOutboundCall(command: {
    tenantId: string;
    attemptId: string;
    agentExtensionId: string;
    destinationE164: string;
    callerIdProfileId: string;
    idempotencyKey: string;
    correlationId: string;
  }): Promise<CreateOutboundCallResult>;
}
```

Danh sách reason cuối cùng và mapping mã PortSIP phải được D-002 khóa bằng fixture exact-version; không thêm raw vendor code vào union này ngay trong adapter PR mà chưa cập nhật contract/compatibility test.

Adapter hiện thực REST/Call Control sau khi PoC chốt topology. Nó phải:

1. lấy credential từ secret manager bằng server identity; không nhận bearer từ controller;
2. map canonical command sang exact-version vendor DTO;
3. timeout/circuit-break/rate-limit; chỉ retry operation chứng minh idempotent;
4. phân biệt rejected và unknown/timeout-after-send;
5. lưu raw vendor reference/payload có redaction ở integration boundary khi cần điều tra;
6. map response/event về canonical types, không phát vendor DTO vào domain;
7. read-back/reconcile với REST/CDR/event khi stream gap hoặc kết quả unknown;
8. chạy contract fixture tests trên exact PBX build trước upgrade.

WSI/webhook receiver durable-write inbox trước khi xử lý, deduplicate, trả acknowledgment phù hợp rồi publish canonical event. Reconnect phải re-authenticate, resubscribe và REST reconcile. Không coi event stream là authoritative final CDR.

### 10.3 SIP trunk/DID/rule

Mọi write đi qua Telephony Config Service: draft → semantic validate → diff/impact → approval → apply disabled/maintenance nếu contract hỗ trợ → read-back → synthetic test → activate → monitor/rollback. PortSIP vẫn là effective source of truth.

- Tenant-owned object/rule chỉ được ghi nếu exact ownership/role/API cho phép.
- System/shared/IP-based trunk mặc định read-only/deep-link.
- Secret là write-only và lưu vault reference; snapshot/audit không chứa plaintext.
- HTTP 2xx chỉ nghĩa request được chấp nhận, không đồng nghĩa registered/connected/test passed.
- Privileged capability `draft`, `approve`, `apply`, `rotate_secret`, `enable_disable` tách nhau; adapter re-authorize ngay trước command.

Xem đầy đủ tại [Outbound và SIP Trunk Admin](07-OUTBOUND-VA-SIPTRUNK-ADMIN.md).

## 11. Outbound invariants — không được “đơn giản hóa”

Các rule sau là code-owned. Config/workflow/feature flag không được bypass:

1. Manual/click-to-call, preview và progressive đều final-check consent, DNC/suppression, timezone/quiet hours, approved caller ID và carrier/provider/tenant/campaign limits ngay trước dispatch.
2. Progressive 1:1 chỉ dial sau khi transactionally reserve **đúng một** agent `Ready`; effective dial ratio không vượt `1.0`; không có answered call thiếu agent.
3. Reservation, logical `dial_attempt` và outbox command được ghi atomically. Browser không giữ scheduler/pacing state.
4. Mỗi attempt có immutable campaign/policy/config versions, idempotency key và correlation tới PortSIP `session_id`/`call_id` khi có.
5. `Dispatch requested`, `PBX accepted`, `SIP answered`, `right-party contact` và `conversion` là trạng thái/KPI khác nhau.
6. Timeout sau khi gửi là `unknown/reconcile_pending`, không tự tạo attempt mới. Chỉ retry theo exact idempotency/reconcile evidence.
7. Inbound protection có threshold, hysteresis/cooldown và manual emergency stop; scheduler dừng cấp call mới khi policy yêu cầu.
8. Agent disconnect/not-ready sau reservation phải theo explicit state machine; không dial nếu reservation hết hạn hoặc state không còn hợp lệ.
9. Retry/callback giữ max attempts, cooldown, timezone, owner/SLA và immutable outcome mapping. Queue callback PortSIP khác campaign callback.
10. DNC/consent violation, missing agent, caller-ID ngoài allowlist hoặc hard limit breach phải fail closed và audit.

Suggested transaction boundary:

```text
BEGIN
  lock/select one eligible campaign member
  lock/select one Ready agent capacity slot
  re-check durable policy snapshot inputs
  create reservation + dial_attempt(dispatch_pending)
  append outbound.call.requested to outbox
COMMIT

worker → final compliance/limit check → PortSIP adapter
       → accepted | rejected | unknown/reconcile_pending
```

Unit test policy không đủ. Phải có concurrency test hai worker tranh cùng contact/agent, worker crash trước/sau vendor send, duplicate event, WSI gap, PBX restart và mixed inbound load.

## 12. Local development và bootstrap

### 12.1 Trạng thái hiện tại

Repository đã có Discovery scaffold và package manifest theo ADR-001. `docs/BUILD-PROFILE.md` là nguồn command duy nhất; không tự đoán command ngoài file đó. Docker Compose, migration execution và E2E environment chưa được phê duyệt/kiểm chứng vì G0-06 còn blocked.

Sau khi D-023 được phê duyệt và scaffold merge, maintainer phải thay toàn bộ placeholder dưới đây bằng command thật và CI phải chạy cùng scripts. `docs/BUILD-PROFILE.md` là nguồn chuẩn duy nhất cho exact versions và chuỗi command end-to-end; README/manifest cấp root, app hoặc database chỉ giải thích chi tiết và phải được liên kết từ Build Profile, không được định nghĩa một chuỗi bootstrap khác.

| Việc | Placeholder không chạy nguyên văn | Nơi phải ghi command thật |
|---|---|---|
| Cài runtime/package manager | `<install pinned runtime and PM from D-023>` | `docs/BUILD-PROFILE.md` → tool version file |
| Cài dependencies | `<PM> install` | `docs/BUILD-PROFILE.md` → root package manifest |
| Khởi động PostgreSQL/Redis/test IdP | `<LOCAL_RUNTIME> up` | `docs/BUILD-PROFILE.md` → `infra/local/README.md` |
| Tạo local config | `<copy approved env example>` | `docs/BUILD-PROFILE.md` → `.env.example` + secrets guide |
| Chạy migration | `<PM> run db:migrate` | `docs/BUILD-PROFILE.md` → `database/README.md` |
| Chạy API/web/worker | `<PM> run dev` hoặc app-specific scripts | `docs/BUILD-PROFILE.md` → root/app README |
| Kiểm tra chất lượng | `<PM> run lint/typecheck/test/build` | `docs/BUILD-PROFILE.md` → root package scripts |
| Contract test PortSIP | `<PM> run test:contract:portsip` | `docs/BUILD-PROFILE.md` → adapter README; sandbox-only |

`<PM>` và `<LOCAL_RUNTIME>` là token mô tả, không phải shell command. PR scaffold phải xóa sự mơ hồ bằng tên/phiên bản thực.

### 12.2 Local environment tối thiểu sau scaffold

- PostgreSQL và Redis local/isolated; seed chỉ synthetic.
- Test OIDC issuer/realm với user đại diện Agent, Supervisor, Campaign Manager, Tenant Admin và deny-only user.
- Fake PortSIP/CRM adapters là default cho unit/local smoke. Vendor sandbox chỉ bật bằng explicit profile và credential riêng.
- Không copy production database, token, recording hoặc phone list xuống máy developer.
- Outbound sandbox chặn real dial/send bằng network policy và fake destination allowlist, không chỉ bằng UI flag.
- Config/schema/workflow sandbox promotion tạo package/version mới và revalidate; không ghi thẳng production.

Tên biến môi trường cuối cùng thuộc D-023. Các nhóm bắt buộc là database URL, Redis URL, OIDC issuer/audience/client, secret-provider reference, PortSIP sandbox endpoint/credential reference, telemetry endpoint và safe-mode flags. `.env.example` chỉ chứa placeholder; không commit secret.

### 12.3 Bootstrap verification bắt buộc

Một developer mới phải chứng minh:

1. checkout sạch + documented install thành công;
2. migration tạo database từ rỗng và chạy lại an toàn;
3. API readiness xanh khi dependency sẵn sàng và đỏ/degraded đúng khi dependency mất;
4. login test OIDC tạo server-derived tenant/subject;
5. request demo có trace, policy decision và redacted log;
6. transaction demo tạo outbox; worker xử lý một lần dù restart/retry;
7. fake PortSIP adapter chạy golden inbound/outbound fixtures;
8. toàn bộ root quality commands giống CI.

## 13. Test strategy cho từng PR

### 13.1 Pyramid thực dụng

| Loại test | Kiểm tra | Không thay thế |
|---|---|---|
| Domain unit | Invariant, transition, value object, deterministic rule | Authorization/query và database transaction |
| Handler unit | Orchestration, deny/allow, error/unknown, fake port calls | SQL scope và real transaction |
| Repository integration | Tenant/scope filter, locks, unique/FK, transaction/outbox | Vendor contract |
| Contract | OpenAPI/event N/N-1, PortSIP/CRM exact fixture, adapter conformance | End-to-end browser/media |
| Component/UI | States, form/schema, accessibility, manifest behavior | Backend enforcement |
| End-to-end | Representative persona/use case trên deployed stack | Load/failover |
| Resilience/load | Concurrency, restart, gap/replay, capacity/inbound protection | Business UAT/compliance approval |

### 13.2 Authorization negative suite

Mỗi feature đọc/ghi dữ liệu phải có cases:

- no grant, expired/revoked grant và wrong capability;
- same tenant nhưng wrong BU/team/queue/campaign;
- cross-tenant guessed ID;
- own/assigned/participant đúng và sai;
- list/detail/count/search/facet/realtime/export/file nhất quán;
- field omit/mask/edit/unmask/export rules;
- direct API/deep link vẫn deny khi menu ẩn;
- policy change invalidates active realtime/export download;
- worker/service identity không vượt delegated scope.

### 13.3 Không dùng snapshot thay business assertions

Snapshot hữu ích cho UI manifest/schema hoặc canonical vendor fixtures. Với state machine, authorization và outbound, test phải assert invariant cụ thể. Một snapshot lớn đổi theo payload không chứng minh rằng không DNC violation hoặc không cross-tenant leak.

## 14. Definition of Ready

Một story chỉ Ready để developer nhận khi:

- có persona/problem/outcome và link feature priority;
- owner/source of truth/module boundary rõ;
- acceptance criteria có cả success, deny và failure/unknown paths;
- decision liên quan Approved hoặc ticket ghi rõ đang làm PoC/fake và điểm dừng;
- API/event/schema/capability/config keys dự kiến đã review nếu public/stable;
- data classification, retention, masking/export và tenant/scope được xác định;
- PortSIP/CRM/IdP dependency có exact sandbox contract/fixture hoặc mock boundary;
- migration/backfill/compatibility được nêu nếu đổi dữ liệu;
- rollout/feature flag, telemetry, audit và rollback/compensation có owner;
- test data synthetic và môi trường cần thiết sẵn sàng;
- ticket đủ nhỏ để review; nếu vượt một vertical slice, đã chia.

Thiếu security/compliance/PortSIP contract không phải lý do để junior tự quyết. Chuyển story về refinement hoặc giới hạn thành port/fake/PoC rõ ràng.

## 15. Definition of Done

Một thay đổi chỉ Done khi tất cả mục phù hợp đều đạt:

### Code và kiến trúc

- domain/application/infrastructure/API boundaries đúng; architecture tests xanh;
- không cross-module internal import/table access; không vendor DTO leak;
- controller/consumer mỏng; business invariant có unit test;
- formatter, lint, typecheck, unit, integration, contract và build xanh bằng root commands;
- dependency/secret/security scan không có finding chưa triage.

### Data và compatibility

- migration theo expand/migrate/contract, chạy từ empty/current/N-1 state;
- tenant/index/constraint đúng; backfill restartable/idempotent;
- API/event/config/schema/workflow version và compatibility tests cập nhật;
- no destructive migration hoặc data purge thiếu approval/backup/retention evidence.

### Authorization và bảo mật

- server-derived auth context; deny-by-default PEP ở mọi entry point;
- negative matrix gồm cross-tenant, wrong scope, direct API và field/export/realtime;
- secret/PII redaction và audit đúng; không credential trong browser/repository;
- step-up, maker-checker hoặc break-glass đúng nếu feature yêu cầu.

### Tin cậy và vận hành

- timeout, retry, idempotency, unknown result, reconciliation và DLQ có test;
- logs/metrics/traces/alerts dùng correlation ID và không cardinality/PII sai;
- health/readiness/runbook/dashboard/safe next action cập nhật;
- rollout flag/canary và rollback/forward-fix được thử ở môi trường phù hợp.

### UX và bàn giao

- loading/empty/error/permission/degraded/conflict/partial states hoàn chỉnh;
- accessibility/keyboard/responsive và operator wording được review;
- OpenAPI/generated client/docs/changelog cập nhật;
- reviewer đúng chuyên môn phê duyệt: module owner, Security cho auth/PII, Telephony cho PortSIP, Compliance cho outbound, Data cho KPI/migration;
- acceptance evidence gắn vào ticket/decision, không chỉ ghi “tested locally”.

## 16. Anti-patterns bị cấm

| Anti-pattern | Vì sao nguy hiểm | Thay bằng |
|---|---|---|
| Browser gọi PortSIP admin API | Lộ credential và vượt tenant policy | BFF → PEP → application → PortSIP Adapter |
| Tin `tenantId`, role hoặc scope từ payload | Cross-tenant/privilege escalation | Verified OIDC context + PDP/PIP |
| Ẩn button/menu và coi là authorization | Direct API/deep link vẫn gọi được | Server PEP + UI manifest |
| Query tất cả rồi filter trong memory/browser | Rò count/data, tải lớn | Typed authorized repository predicate |
| `if role === ADMIN` rải rác | Role explosion, không scope/condition | Stable capability + scoped policy |
| Module đọc table/internal class của module khác | Coupling, không tách/đổi schema được | Public port/query hoặc versioned projection/event |
| `common/utils/rules` chứa nghiệp vụ | Mất ownership, dependency vòng | Đặt trong module owner, expose typed port |
| Domain import Nest/ORM/PortSIP DTO | Khó test và khóa vendor/framework | Port/adapter + mapper |
| HTTP call trong DB transaction dài | Lock kéo dài, retry mơ hồ | Outbox/durable command + worker/reconcile |
| Retry mọi timeout | Có thể tạo cuộc gọi/config side effect trùng | `unknown/reconcile_pending` + idempotency evidence |
| Event không version/idempotency | Consumer vỡ hoặc side effect trùng | Versioned schema + outbox/inbox |
| Redis là source of truth | Mất state khi eviction/restart | PostgreSQL durable state; Redis cache only |
| Chỉnh migration đã chạy | Environment diverge | Migration mới + compatibility plan |
| Dynamic `eval`, JS, SQL, URL | RCE/data exfiltration/bypass invariant | Typed DSL + allowlisted action registry |
| Raw JSON settings editor | Không validate/impact/rollback được | Typed Configuration Registry + guided UI |
| Workflow sửa call/DNC/security FSM | Bypass safety-critical rule | Code-owned invariant + bounded business workflow |
| Log raw phone/token/recording URL | PII/secret exposure | Structured redacted telemetry |
| Gọi PortSIP 2xx là “Connected” | Trạng thái sai, khó vận hành | Configured/read-back/registered/tested tách biệt |
| Down migration mặc định là rollback | Có thể mất dữ liệu | Forward fix hoặc compatible version rollback |

## 17. Troubleshooting map

| Triệu chứng | Kiểm tra theo thứ tự | Safe action; không làm |
|---|---|---|
| API trả 401 | Token presence → issuer/audience/signature/expiry → clock skew → IdP health | Re-login/fix IdP config; không tắt verify signature |
| API trả 403 | capability → grant validity → scope relationship → auth strength → resource state → policy version | Dùng decision reason/correlation; không gán Admin để “test nhanh” |
| Object trả 404 dù tồn tại | tenant context → authorized scope predicate → relationship projection lag | Reconcile scope/projection; không query bỏ tenant để dò |
| List/count lệch detail | Query PEP của list/count/search/facet có cùng typed scope không | Sửa shared authorized query contract; không filter sau query |
| Field bị lộ/mask sai | PDP obligations → serializer → export/realtime projection → cache version | Fail closed/omit restricted field; invalidate cache |
| Menu hiện nhưng action bị deny | Screen manifest version/flag khác policy hoặc permission vừa revoke | Refresh manifest, giải thích deny; API denial là authoritative |
| Realtime vẫn thấy dữ liệu sau revoke | subscription bind → invalidation event → reconnect re-auth → revoke lag metric | Đóng/rebind subscription; không tăng TTL vô hạn |
| Outbox backlog tăng | publisher lease → DB lock → poison event/version → downstream health → retry age | Pause offending type/canary, DLQ có audit; không xóa row |
| Consumer tạo trùng | inbox unique key → transaction boundary → idempotency key → external effect reconciliation | Stop consumer nếu cần; reconcile rồi forward-fix |
| PortSIP event mất/thứ tự sai | WSI connection/gap → inbox → sequence/timestamps → REST/CDR reconcile | Reconcile source of truth; không sửa interaction bằng phỏng đoán |
| Call command timeout | request sent? → adapter log/correlation → PortSIP session/CDR → attempt state | Chuyển `reconcile_pending`; không dial lại ngay |
| Progressive có nguy cơ thiếu agent | reservation lease/state → agent Ready source → concurrency lock → dial ratio → inbound protection | Emergency stop/pause campaign; không bỏ reservation để tăng tốc |
| Trunk write 2xx nhưng không gọi được | read-back diff → ownership → registration status → route/DID → synthetic test | Giữ disabled/rollback compensated; không hiển thị Connected |
| Config effective value sai | definition version → scope layers → relationship ambiguity → ETag → cache invalidation | Block publish khi ambiguous; hiện resolution chain |
| Form cũ không render | record schema version → published definition availability → deprecated widget compatibility | Giữ old renderer/version; không đổi type tại chỗ |
| Workflow timer không chạy | durable job status → `run_at` UTC/timezone → lease expiry → worker health → DLQ | Requeue bằng idempotency/runbook; không sửa DB tay |
| Workflow action kết quả không rõ | action idempotency → connector correlation → external read-back | Reconcile/manual task; không blind retry |
| Redis down | app fallback policy → DB/source availability → cache TTL/version | Sensitive operation fail closed hoặc approved degraded path; Redis không được mất durable work |
| Không tìm được trace | ingress propagation → outbox envelope → worker extraction → adapter header/log | Sửa propagation và dùng correlation ID; không log thêm raw payload/PII |
| Migration bị kẹt | lock holder → batch/checkpoint → disk/replica lag → abort criteria | Pause/forward-fix theo runbook; không kill/xóa tùy tiện |

Khi xử lý incident, ghi timeline, environment, version, correlation IDs và hành động đã thử. Không paste secret/raw PII vào chat/ticket. Thay đổi dữ liệu production thủ công cần runbook, approval và audit riêng.

## 18. Quy trình pull request và review

PR description tối thiểu:

```text
Problem / user outcome:
Feature + decision links:
Module owner / source of truth:
Capability + data/field scope:
Contract and compatibility impact:
Migration/backfill impact:
Failure / retry / unknown / reconciliation behavior:
Security / PII / secret impact:
Telemetry / audit / runbook:
Rollout / flag / rollback:
Test evidence, including negative cases:
Open assumptions or follow-up:
```

Giữ PR nhỏ và deployable. Reviewer kiểm tra invariant và boundary trước style. Comment “sau này làm auth/test” không chấp nhận nếu endpoint đã đọc/ghi resource. TODO chỉ được merge khi có owner/ticket/due và không tạo security/compliance gap.

Review bắt buộc theo risk:

- Security: OIDC/session, capability/policy, PII/recording/export, secret, privileged config.
- Telephony: SDK wrapper, REST/WSI/webhook, call FSM, trunk/DID/rule, PortSIP upgrade.
- Compliance/Product: DNC/consent/timezone/caller ID, campaign outcome/retry.
- Data: KPI semantics, schema/migration/backfill, reporting projection.
- Operations/SRE: HA, durable jobs, alerts/runbook, production config/rollback.

## 19. Điểm dừng và cách escalation cho junior

Dừng implementation và hỏi owner khi gặp một trong các tình huống:

- decision còn Open/Hypothesis nhưng ticket yêu cầu biến nó thành production behavior;
- exact PortSIP endpoint/schema/permission/retry behavior khác fixture hoặc chưa có bằng chứng;
- cần nhận tenant/role/scope từ client để “làm cho chạy”;
- quyền chỉ có thể enforce bằng frontend hoặc query sau khi đã đọc rộng;
- workflow/config yêu cầu bỏ qua call, DNC, tenant, security hoặc carrier invariant;
- external timeout nhưng không biết side effect đã xảy ra;
- migration có thể khóa bảng/mất dữ liệu hoặc không có N-1 plan;
- cần plaintext secret/production data trên máy local;
- acceptance criteria mâu thuẫn giữa docs, ticket và code;
- thay đổi tăng scope/timeline thuộc danh sách Change control ở D-010.

Khi escalation, gửi: quyết định/tài liệu liên quan, evidence/correlation/fixture, điều đã thử, hai hoặc ba phương án cùng trade-off, và đề xuất an toàn nhất. Trong lúc chờ, có thể tiếp tục bằng interface/fake/test hoặc task độc lập; không tự nới guardrail.

## 20. Checklist ngày đầu cho developer mới

- [ ] Tôi biết dự án mới chỉ Go cho Discovery/PoC và không coi hypothesis là cam kết.
- [ ] Tôi đã đọc mục lục bàn giao, README và docs 01, 03, 06–12 theo thứ tự onboarding.
- [ ] Tôi xác định được feature/module/owner/source of truth của ticket đầu tiên.
- [ ] Tôi biết D-002 khóa exact PortSIP contract và D-023 phải khóa application stack/scaffold.
- [ ] Tôi giải thích được vì sao browser không giữ PortSIP admin credential.
- [ ] Tôi giải thích được bốn lớp quyền và vì sao ẩn menu không đủ.
- [ ] Tôi biết tenant/scope/role không được lấy từ payload.
- [ ] Tôi biết module không đọc table/internal code của module khác.
- [ ] Tôi biết state change và outbox phải atomic; consumer phải idempotent.
- [ ] Tôi phân biệt event realtime với finalized CDR và biết khi nào reconcile.
- [ ] Tôi phân biệt dispatch requested, PBX accepted, SIP answered và right-party contact.
- [ ] Tôi thuộc các outbound hard-stop: DNC/consent/timezone/caller ID/hard limits/agent reservation.
- [ ] Tôi biết config/form/workflow published version là bất biến và không chạy arbitrary code.
- [ ] Tôi biết command local chính thức chỉ tồn tại sau D-023/scaffold và không chạy placeholder nguyên văn.
- [ ] Tôi có test user/data synthetic; không dùng production secret/PII.
- [ ] Tôi đã chạy quality commands chính thức và xem một trace/outbox flow sau khi scaffold tồn tại.
- [ ] Tôi biết các điểm dừng cần escalation và người review theo risk.

## 21. Tiêu chí bàn giao theo giai đoạn

Ở giai đoạn Discovery, bộ tài liệu được coi là **Discovery handover-ready** khi `DISC-HO-001` pass: người mới tìm đúng scope/gate/source of truth, biết việc đầu tiên được phép làm và không biến hypothesis thành code hoặc external side effect.

Tài liệu chỉ được coi là **implementation handover-ready** sau khi scaffold được tạo và đội thực hiện một onboarding rehearsal:

1. Một junior không tham gia thiết kế làm vertical slice nhỏ chỉ bằng docs + mentor review, không cần hỏi command/path nền tảng bị thiếu.
2. Mọi placeholder stack/bootstrap trong mục 3 và 12 được thay bằng exact version/command đã kiểm tra trên máy sạch.
3. Một test cố tình gửi tenant/scope giả bị chặn; một cross-tenant query và realtime subscription bị deny.
4. Một event duplicate và worker restart không tạo side effect trùng.
5. Một fake PortSIP unknown result đi vào reconciliation, không blind retry.
6. Một custom field/form/config/workflow version được draft, validate, publish, render/executed và rollback/migrate đúng.
7. Người mới tìm được owner, dashboard, runbook, decision và correlation ID trong dưới 15 phút cho một failure mẫu.

Feedback onboarding phải được sửa trực tiếp vào handbook/module README/runbook. Không giữ “mẹo triển khai” chỉ trong chat hoặc trí nhớ cá nhân.

## 22. Liên kết nhanh

- [Mục lục bàn giao](00-MUC-LUC-BAN-GIAO.md)
- [Kế hoạch tổng thể](01-KE-HOACH-TRIEN-KHAI.md)
- [Feature catalog](02-DANH-MUC-TINH-NANG.md)
- [Kiến trúc tích hợp PortSIP](03-KIEN-TRUC-TICH-HOP.md)
- [Discovery và PoC](04-DISCOVERY-POC.md)
- [Nguồn tham khảo](05-NGUON-THAM-KHAO.md)
- [Decision register](06-DECISION-REGISTER.md)
- [Outbound và SIP Trunk Admin UI](07-OUTBOUND-VA-SIPTRUNK-ADMIN.md)
- [Kiến trúc mở rộng, phân quyền và cấu hình động](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md)
- [Chuẩn code, review và Definition of Done](10-CHUAN-CODE-REVIEW-VA-DEFINITION-OF-DONE.md)
- [Hợp đồng API, event và dữ liệu](11-HOP-DONG-API-EVENT-VA-DU-LIEU.md)
- [Chiến lược test, debug và runbook](12-CHIEN-LUOC-TEST-DEBUG-VA-RUNBOOK.md)
- [Backlog khởi tạo và hướng dẫn phân công](13-BACKLOG-KHOI-TAO-VA-PHAN-CONG.md)
- [Current Work Ledger](14-CONG-VIEC-HIEN-TAI.md)
- [PMP control checklist](15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md)
- [TASKS.md](../TASKS.md)
