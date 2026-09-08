# Chuẩn code, review và Definition of Done

## 1. Mục đích và phạm vi áp dụng

Tài liệu này là quy chuẩn triển khai cho application plane của Portsip CC. Mục tiêu là để một lập trình viên mới, kể cả junior, có thể:

1. xác định đúng module và ranh giới thay đổi;
2. triển khai theo một đường đi nhất quán từ request đến domain, database, event và UI;
3. tự kiểm tra trước khi mở pull request;
4. cung cấp đủ bằng chứng để reviewer đánh giá;
5. không vô tình làm yếu tenant isolation, authorization, DNC/consent, call state hoặc carrier guardrail.

Tài liệu áp dụng cho backend, frontend, worker, database migration, event consumer/producer, cấu hình động, workflow, PortSIP adapter và outbound dialer. Nó không thay thế:

- [Kế hoạch triển khai](01-KE-HOACH-TRIEN-KHAI.md);
- [Kiến trúc tích hợp](03-KIEN-TRUC-TICH-HOP.md);
- [Discovery/PoC và các contract cần xác minh](04-DISCOVERY-POC.md);
- [Decision register](06-DECISION-REGISTER.md);
- [Outbound và SIP Trunk Admin](07-OUTBOUND-VA-SIPTRUNK-ADMIN.md);
- [Kiến trúc mở rộng, phân quyền và cấu hình động](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md);
- [Sổ tay hiện thực dành cho Developer](09-SO-TAY-HIEN-THUC-CHO-DEVELOPER.md).

Tài liệu 09 giải thích “làm như thế nào” theo một reference implementation; tài liệu này là normative quality gate để quyết định một thay đổi có được review/merge/bàn giao hay chưa.

Khi có mâu thuẫn, quyết định đã duyệt trong Decision Register và kiến trúc/security boundary được duyệt có ưu tiên cao hơn tài liệu này.

### 1.1 Trạng thái stack — D-023 Approved có điều kiện

Các ví dụ và Discovery scaffold dùng **TypeScript strict** cho application plane theo D-023/ADR-001. Exact framework, package manager, database/migration, validation, test, format/lint và workspace đã được khóa trong manifest/lockfile/Build Profile; Security/DevOps review và D-010 vẫn là điều kiện trước production build.

Các snippet dài trong tài liệu vẫn là **mã minh họa, không bảo đảm chạy độc lập**. Lệnh build/test thật nằm trong `docs/BUILD-PROFILE.md` và root manifest. Migration/deploy chưa có trong profile thì không được tự đặt một lệnh mới rồi coi đó là quy chuẩn.

### 1.2 Enforceability trước và sau D-023

Trước khi D-023/scaffold được duyệt, các outcome bảo mật/kiến trúc trong tài liệu vẫn bắt buộc. Với rule chưa có tool tự động, PR/PoC phải có review evidence thủ công, reviewer đúng owner và tracking ticket gồm owner + due date để tự động hóa; “chưa có linter/test runner” không phải lý do bỏ tenant/auth/idempotency test design.

Sau khi D-023 được duyệt, Architecture/Engineering Lead **MUST** cập nhật revision này bằng link thật tới:

- root scripts và CI jobs cho format/lint/typecheck/test/build/architecture/contract checks;
- `docs/BUILD-PROFILE.md` là nguồn chuẩn cho exact versions và chuỗi bootstrap/test/build end-to-end;
- module public surfaces/dependency rules và owner registry;
- API/event/schema fixtures và compatibility policy;
- policy/capability/config/workflow manifests;
- migration/backfill templates và environment promotion/runbooks.

CI SHOULD ánh xạ mỗi automated gate về rule/checklist tương ứng trong tài liệu này. Đường dẫn hoặc script chưa tồn tại phải được ghi là placeholder trong tài liệu 09/D-023, không được trình bày như lệnh chạy thật.

## 2. Ngôn ngữ quy phạm

| Từ khóa | Ý nghĩa |
|---|---|
| **MUST** | Bắt buộc. Vi phạm làm PR không đạt Definition of Done. |
| **MUST NOT** | Tuyệt đối không làm, trừ exception/ADR được duyệt trước. |
| **SHOULD** | Nên làm. Nếu không làm, PR phải nêu lý do và reviewer chấp thuận. |
| **MAY** | Tùy chọn khi phù hợp, không được phá các MUST/MUST NOT. |

Một reviewer không được hạ một quy tắc MUST thành “nit”. Một deadline gấp không tự động tạo ngoại lệ.

### 2.1 Thuật ngữ tối thiểu cho người mới

| Thuật ngữ | Cách hiểu trong dự án |
|---|---|
| Domain | Nơi chứa quy tắc và trạng thái nghiệp vụ, không phụ thuộc framework/vendor. |
| Application handler | Điều phối một use case: authorization context, transaction, domain và ports. |
| Port / adapter | Port là interface app cần; adapter là implementation nói chuyện với DB/PortSIP/CRM/IdP. |
| Contract / DTO | Cấu trúc dữ liệu qua boundary; contract public phải có version và compatibility rule. |
| Invariant | Điều luôn phải đúng, ví dụ không dial khi DNC hoặc không có agent đã reserve. |
| PEP / PDP / PIP | Điểm chặn quyền / nơi quyết định quyền / nguồn facts phục vụ quyết định. |
| Outbox / inbox | Bảng/ledger giúp phát event sau commit / deduplicate event đã nhận. |
| Idempotent | Chạy lại cùng logical request không tạo thêm logical effect. |
| Reconcile | Đối soát với nguồn authoritative khi kết quả đang không rõ, thay vì đoán hoặc retry mù. |
| Correlation / causation ID | ID nối toàn flow / ID chỉ nguyên nhân trực tiếp của event hoặc action. |
| Lease | Quyền xử lý tạm thời có hạn của một worker; hết lease không tự chứng minh side effect chưa xảy ra. |
| DLQ | Nơi cách ly message không xử lý được để điều tra/replay có kiểm soát. |
| `N/N-1` | Trong rolling deployment, version hiện tại và version liền trước phải cùng vận hành theo window đã duyệt. |
| Pinned version | Record/instance giữ đúng schema/workflow version đã chọn, không âm thầm đổi theo bản mới nhất. |
| WSI / CDR | WebSocket Interface phát event thời gian thực / Call Detail Record của PortSIP. |
| SBC / DID | Session Border Controller / số điện thoại được nhà mạng cấp để nhận hoặc hiển thị cuộc gọi. |
| CPS / concurrency | Số attempt được dispatch mỗi giây / số call hoặc attempt active đồng thời trong scope đã định nghĩa. |
| DNC / PII | Danh sách Do Not Call / thông tin nhận dạng cá nhân. |
| SLO / UAT | Mục tiêu mức dịch vụ / kiểm thử chấp nhận bởi người dùng-nghiệp vụ. |
| IDOR | Lỗi truy cập object ngoài quyền bằng cách đoán/thay resource ID. |
| ADR | Bản ghi quyết định kiến trúc, gồm lựa chọn, lý do, trade-off và owner. |
| Maker-checker | Người tạo change không phải người duyệt/apply khi policy yêu cầu tách nhiệm vụ. |
| Step-up / break-glass | Xác thực mạnh hơn cho action nhạy cảm / quyền khẩn cấp có thời hạn, reason, alert và audit. |
| Calling window | Khung giờ được phép gọi theo timezone/quiet-hours/compliance policy của contact. |
| Effective dial ratio | Tỷ lệ attempt dialer cấp đồng thời trên reservation agent hợp lệ; P0 yêu cầu ánh xạ 1 attempt ↔ 1 agent và tỷ lệ không vượt `1,0`. |

## 3. Đường chạy chuẩn cho lập trình viên mới

Trước khi code, thực hiện lần lượt:

1. Đọc ticket và viết lại outcome bằng một câu: “Ai làm gì, trên resource nào, kết quả quan sát được là gì?”.
2. Xác định module sở hữu dữ liệu và nghiệp vụ. Nếu cần sửa trực tiếp table/package nội bộ của module khác, dừng và hỏi Tech Lead.
3. Liệt kê entry points bị ảnh hưởng: API, page/route, WebSocket, export, worker, timer, webhook hoặc scheduled job.
4. Ghi capability, data scope và field obligations cho từng entry point. Nếu chưa có capability/policy, ticket chưa Ready.
5. Xác định contract vào/ra, error codes, idempotency key, transaction boundary và event phát sinh.
6. Xác định thay đổi schema/config/workflow và chiến lược tương thích `N/N-1` nếu có.
7. Viết hoặc cập nhật test trước/đồng thời với code cho happy path, deny path và failure/retry path.
8. Tự review diff, hoàn thành checklist đúng loại thay đổi, đính kèm evidence và rollback/kill-switch plan vào PR.

Luồng backend thông thường:

```text
HTTP/WebSocket/Webhook/Job input (unknown)
  → transport payload/rate limits
  → authenticate + resolve trusted tenant/subject context
  → parse + validate boundary DTO
  → PEP/PDP capability + scope decision
  → application command/query handler
  → domain rule/state transition
  → repository/adapter ports
  → local transaction + outbox nếu có state change/event
  → response shaping + field obligations
```

Luồng frontend thông thường:

```text
route + server-provided capability/screen manifest
  → page/feature container
  → query/mutation client
  → explicit loading/empty/error/denied/degraded state
  → accessible component/form
  → invalidate/refetch hoặc reconcile realtime update
```

Nếu không thể chỉ ra thay đổi nằm ở đâu trong hai luồng trên, không bắt đầu bằng cách thêm logic vào controller hoặc component lớn. Hỏi người sở hữu module để làm rõ thiết kế.

## 4. Ranh giới module và tổ chức mã

### 4.1 Cấu trúc tham chiếu

Cấu trúc chính xác được khóa ở D-023, nhưng mọi module SHOULD ánh xạ được về các lớp sau:

```text
modules/<module>/
  domain/          # entity, value object, invariant, domain error/event
  application/     # command/query, handler, ports, transaction orchestration
  adapters/        # database, PortSIP, CRM, IdP, event bus, clock
  api/             # HTTP/WebSocket/job controllers và boundary schemas
  contracts/       # public API/event DTO đã version hóa
  tests/           # unit, integration, contract fixtures của module
```

Đây là mô hình khái niệm; không tự tạo folder chỉ để khớp tài liệu nếu scaffold được duyệt dùng convention tương đương.

### 4.2 Quy tắc import và ownership

- Mỗi module **MUST** sở hữu business rules, tables, repositories và migrations của nó.
- Module khác **MUST NOT** import domain entity, ORM model, repository hoặc adapter nội bộ.
- Giao tiếp đồng bộ **MUST** qua public typed application port/contract; giao tiếp bất đồng bộ **MUST** qua versioned event.
- Domain **MUST NOT** import HTTP framework, ORM, browser API, PortSIP SDK/DTO, CRM SDK hoặc environment variables.
- `shared/common` **MUST** chỉ chứa primitive ổn định như branded IDs, clock contract, E.164 value object, event envelope và authorization context.
- `shared/common` **MUST NOT** trở thành nơi đặt business service, repository hoặc “utils” không có owner.
- Cross-module report/search **MUST** đọc projection/read model; **MUST NOT** join trực tiếp các table nội bộ xuyên module.
- Dependency direction **MUST** được kiểm chứng. Sau D-023 phải có architecture test tự động; trước khi tool tồn tại, PR phải có import/dependency review evidence cùng tracking ticket, owner và due date để tự động hóa.

Ví dụ không đạt:

```ts
// campaign/application/start-campaign.ts
import { UserOrmEntity } from '../../people/adapters/database/user-orm-entity';
import { TrunkClient } from '../../telephony/adapters/portsip/trunk-client';

// Campaign đang phụ thuộc implementation detail của hai module khác.
```

Ví dụ đạt về mặt ranh giới:

```ts
import type { AgentAvailabilityPort } from '../ports/agent-availability-port';
import type { TelephonyGateway } from '../ports/telephony-gateway';

export class StartCampaignHandler {
  constructor(
    private readonly agents: AgentAvailabilityPort,
    private readonly telephony: TelephonyGateway,
  ) {}
}
```

Adapters của People/Telephony implement các port ở composition root; Campaign không biết ORM hay PortSIP DTO.

### 4.3 Khi thêm một module hoặc extension

Module/extension mới **MUST** khai báo trong manifest được quy định tại tài liệu 08:

- stable key, owner và runbook;
- public contracts và compatibility range;
- capabilities và config definitions;
- produced/consumed event versions;
- migrations, health checks, metrics và feature flag/kill switch;
- dependency list và degradation behavior.

P0 **MUST NOT** tải code, JavaScript, SQL, HTML hoặc remote component do tenant/operator upload. Extension code là trusted compiled code, review và deploy qua CI.

## 5. TypeScript strict và convention kiểu dữ liệu

### 5.1 Compiler baseline

Khi TypeScript được duyệt ở D-023, production code **MUST** bật `strict`. Baseline SHOULD bật thêm các kiểm tra tương đương:

- `noImplicitReturns`;
- `noFallthroughCasesInSwitch`;
- `noImplicitOverride`;
- `noUncheckedIndexedAccess`;
- `exactOptionalPropertyTypes`;
- `useUnknownInCatchVariables`;
- kiểm tra unused locals/parameters theo convention của repository.

Không tắt một rule ở cấp project để sửa một file. Suppression cục bộ phải có comment giải thích, phạm vi tối thiểu và reviewer chấp thuận.

### 5.2 MUST/MUST NOT cho type

- Dữ liệu deserialized từ HTTP, WebSocket, webhook, event bus, storage document/JSON, SDK và config **MUST** bắt đầu là `unknown` và được parse/validate ở boundary.
- Production code **MUST NOT** dùng `any`. Exception cho vendor typing lỗi phải nằm trong adapter, được thu hẹp ngay và có contract test.
- **MUST NOT** dùng `as SomeType` để thay validation dữ liệu runtime.
- **MUST NOT** dùng non-null assertion (`value!`) nếu không có invariant đã được kiểm tra ngay trước đó.
- Public function và module contract **MUST** khai báo input/output rõ; không để type inference trở thành accidental API.
- Optional field và field có giá trị `null` **MUST** có semantics khác nhau được ghi trong contract.
- ID của các aggregate quan trọng SHOULD dùng branded/opaque type để tránh truyền nhầm `campaignId` vào `contactId`.
- Time trong persistence/event **MUST** là UTC instant có timezone rõ; timezone nghiệp vụ là input riêng. Không dùng local server time.
- Phone number **MUST** đi qua value object/normalizer E.164; không tự nối chuỗi prefix trong UI/controller.
- Exhaustive switch SHOULD dùng `never` để compiler phát hiện state/event mới chưa xử lý.

Ví dụ branded IDs và exhaustive state:

```ts
type Brand<T, Name extends string> = T & { readonly __brand: Name };
type CampaignId = Brand<string, 'CampaignId'>;

type AttemptState =
  | 'eligible'
  | 'reserved'
  | 'dispatch_pending'
  | 'pbx_accepted'
  | 'ringing'
  | 'answered'
  | 'failed'
  | 'wrap_up'
  | 'finalized'
  | 'reconcile_pending'
  | 'suppressed'
  | 'cancelled';

function assertNever(value: never): never {
  throw new Error(`Unexpected state: ${String(value)}`);
}

function isTerminal(state: AttemptState): boolean {
  switch (state) {
    case 'finalized':
    case 'suppressed':
    case 'cancelled':
      return true;
    case 'eligible':
    case 'reserved':
    case 'dispatch_pending':
    case 'pbx_accepted':
    case 'ringing':
    case 'answered':
    case 'failed':
    case 'wrap_up':
    case 'reconcile_pending':
      return false;
    default:
      return assertNever(state);
  }
}
```

### 5.3 Naming

| Thành phần | Convention | Ví dụ |
|---|---|---|
| File/folder | `kebab-case` | `start-campaign-handler.ts` |
| Type/class/component | `PascalCase` | `StartCampaignHandler` |
| Function/variable | `camelCase`, động từ cho hành động | `reserveNextContact` |
| Boolean | câu hỏi `is/has/can/should` | `isWithinCallingWindow` |
| Constant thực sự | `UPPER_SNAKE_CASE` | `MAX_PREVIEW_SECONDS` |
| Command | động từ + object | `PublishCampaign` |
| Query | `Get/List/Search` + object | `ListAssignedInteractions` |
| Event | sự kiện đã xảy ra, past tense; version ở envelope/schema, không gắn vào event type | `CampaignPublished` → `campaign.published` |
| Capability | `<resource>.<action>` stable key | `campaign.publish` |
| Config key | namespace ổn định | `outbound.progressive.max_cps` |
| Error code | domain + nguyên nhân, ổn định | `CAMPAIGN_NOT_DRAFT` |

Tên **MUST** thể hiện nghiệp vụ. Tránh `data`, `info`, `item`, `manager`, `helper`, `process`, `handleThing` khi có thể đặt tên cụ thể. Không tái sử dụng capability/config/event/field/workflow key đã deprecate.

### 5.4 Export, import và function convention

- SHOULD dùng named export để refactor/search rõ; default export chỉ khi framework/tooling được duyệt bắt buộc.
- Type-only dependency SHOULD dùng `import type` để không tạo runtime dependency ngoài ý muốn.
- Module **MUST** có public surface rõ; **MUST NOT** dùng barrel file để vô tình export private domain/adapter hoặc che circular import.
- Circular dependency **MUST** được loại bỏ bằng cách sửa ownership/port, không dùng lazy import như một bản vá mặc định.
- Input command/query/DTO SHOULD là `readonly`; domain mutation chỉ qua method thể hiện invariant.
- Public async function **MUST** có return type `Promise<...>` rõ trong contract.
- **MUST NOT** `throw` string/object tùy ý hoặc catch rồi bỏ qua. `catch` nhận `unknown`, thu hẹp/map error và preserve cause an toàn.
- Hàm domain SHOULD thuần và ngắn; side effect phải nhìn thấy qua injected port. Không đọc clock/random/environment trực tiếp.
- Magic string/number có ý nghĩa nghiệp vụ phải thành typed value/config definition; không biến mọi literal hiển nhiên thành constant.
- Comment SHOULD giải thích “vì sao/invariant/constraint”, không lặp lại câu code đang làm gì. Workaround vendor phải link evidence/issue và điều kiện gỡ bỏ.

## 6. Boundary validation, Result và domain errors

### 6.1 Validate ở mọi trust boundary

Boundary schema **MUST** kiểm tra tối thiểu:

- required/optional/null semantics;
- length, numeric range và collection size;
- enum/format/timezone/E.164;
- unknown field policy;
- tenant/resource IDs theo định dạng, nhưng không coi định dạng hợp lệ là có quyền;
- payload/schema version;
- cross-field rule thuộc boundary; domain invariant vẫn kiểm tra ở domain.

Trong hai snippet sau, `RequestLike.body` được coi là `unknown` tại trust boundary.

Ví dụ không đạt:

```ts
async function createCampaign(request: RequestLike) {
  const body = request.body as CreateCampaignInput;
  return repository.insert(body);
}
```

Ví dụ đạt về ý tưởng:

```ts
async function createCampaign(
  request: RequestLike,
): Promise<CreateCampaignResponse> {
  const context = requireAuthenticatedContext(request);
  const input = createCampaignInputSchema.parse(request.body);
  return createCampaignHandler.execute({ context, input });
}
```

`createCampaignInputSchema` là abstraction minh họa; thư viện thực tế chờ D-023. Parse error được map thành stable API error, không trả stack trace.

### 6.2 Controller và handler

- Controller **MUST** mỏng: enforce transport limits, authenticate, parse, authorize/forward trusted context, call handler và map response/error.
- Domain rule **MUST NOT** nằm trong controller, UI component, repository hoặc PortSIP adapter.
- Handler **MUST** nhận dependencies qua ports; không đọc global singleton hoặc environment variables.
- Domain mutation **MUST** thông qua method/state transition thể hiện invariant; không set field trạng thái tùy ý.

### 6.3 Result và error taxonomy

Expected business failure SHOULD dùng typed `Result<T, E>` hoặc cơ chế tương đương; exception chỉ dành cho lỗi không mong đợi/infrastructure và được translate ở boundary.

```ts
type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

type PublishCampaignError =
  | { readonly code: 'CAMPAIGN_NOT_FOUND' }
  | { readonly code: 'CAMPAIGN_NOT_DRAFT'; readonly state: string }
  | { readonly code: 'CAMPAIGN_HAS_NO_ELIGIBLE_CONTACTS' }
  | { readonly code: 'CONCURRENT_MODIFICATION' };
```

Error code **MUST** ổn định và machine-readable. Message hiển thị có thể localize, nhưng log/telemetry dựa trên code. Domain error **MUST NOT** chứa access token, raw vendor body hoặc PII không cần thiết.

Không đạt:

```ts
try {
  await publishCampaign(id);
  return true;
} catch {
  return false; // mất nguyên nhân, không biết retry hay không
}
```

Đạt:

```ts
const result: Result<PublishedCampaign, PublishCampaignError> =
  await handler.execute(command);
if (!result.ok) {
  return mapPublishCampaignError(result.error);
}
return presentCampaign(result.value);
```

API error SHOULD có `code`, safe `message`, `correlationId` và field errors nếu có. Status mapping được tập trung; không map cùng domain error thành nhiều HTTP status khác nhau ở các controller.

## 7. Authorization và security enforcement

### 7.1 PEP bắt buộc

Mọi entry point **MUST** là Policy Enforcement Point (PEP):

- HTTP/GraphQL/RPC endpoint;
- WebSocket subscribe và từng sensitive command;
- search, count, facet, report và export;
- file/recording playback hoặc download;
- webhook-triggered command;
- background job, timer, event handler và service-to-service call;
- admin config/workflow publish/apply/approve.

UI hide/disable chỉ cải thiện UX, **MUST NOT** được coi là enforcement. Feature flag không cấp quyền.

### 7.2 Thứ tự xử lý an toàn

1. Xác thực session/service identity.
2. Lấy tenant/subject từ trusted token mapping; **MUST NOT** tin `tenantId`, role hoặc scope do client tự gửi.
3. Parse resource identifier và action context.
4. Transport/BFF có thể pre-check coarse capability; application handler **MUST** là PEP authoritative để use case vẫn an toàn khi được gọi từ API, worker hoặc timer.
5. Xin PDP scoped decision rồi áp authorized filter ngay trong query; không load object ngoài scope.
6. Sau khi load đúng object, re-check resource-state/relationship facts và obligations nếu policy cần ABAC context đầy đủ.
7. Chạy business operation.
8. Áp field obligations trước serialization/export/realtime delivery.
9. Ghi audit cho sensitive allow/deny theo policy.

Không đạt — query rộng rồi lọc trong memory:

```ts
const contacts = await contactRepository.listAll(tenantId);
return contacts.filter((contact) => allowedTeams.includes(contact.teamId));
```

Đạt — scope là input của repository:

```ts
const decision = await policy.decide({
  subject: context.subject,
  capability: 'contact.list',
  resource: { type: 'contact_collection', tenantId: context.tenantId },
  actionContext: { filters: input.filters },
});

if (!decision.allowed) return err({ code: 'ACCESS_DENIED' });

const page = await contactRepository.list({
  tenantId: context.tenantId,
  authorizedScope: decision.scope,
  filters: input.filters,
  cursor: input.cursor,
});

return ok(maskContactPage(page, decision.obligations));
```

### 7.3 Write-side field authorization

Capability cho mutation không tự động cấp quyền sửa mọi field. Trước domain transition hoặc DB write, handler **MUST**:

1. parse payload thành canonical field keys; không bind cả request object vào entity/ORM;
2. xin PDP decision có write obligations như `allowedWriteFields`, `readOnlyFields`, conditional field predicates và step-up/approval nếu có;
3. so sánh **các field client thực sự gửi** với obligations;
4. từ chối field không được phép bằng stable code như `FIELD_WRITE_FORBIDDEN`; **MUST NOT** silently drop vì client có thể tưởng thay đổi đã được lưu;
5. chỉ tạo authorized patch từ allowlist rồi mới chạy domain validation/transition và transaction;
6. áp response mask/omit obligations riêng trước khi trả dữ liệu.

Field comparison **MUST** dùng canonical **leaf path** hoặc custom-field stable key từ published schema. Quyền trên parent object không ngầm cấp quyền cho mọi descendant. Không dùng `Object.keys` cấp cao nhất, raw JSON Pointer chưa normalize hoặc object spread để authorize nested/custom fields; parser phải chặn duplicate path, parent-child path conflict và prototype-pollution keys.

```ts
const suppliedFieldPaths = collectSuppliedCanonicalLeafPaths(
  input.patch,
  publishedContactSchema,
);

const decision = await policy.decide({
  subject: context.subject,
  capability: 'contact.update',
  resource: contact.authorizationFacts(),
  actionContext: { suppliedFields: suppliedFieldPaths },
});

if (!decision.allowed) return err({ code: 'ACCESS_DENIED' });

const forbiddenFields = suppliedFieldPaths.filter(
  (field) => !isFieldWriteAllowed(field, decision.obligations),
);
if (forbiddenFields.length > 0) {
  return err({ code: 'FIELD_WRITE_FORBIDDEN', fields: forbiddenFields });
}

const authorizedPatch = buildAuthorizedPatch({
  source: input.patch,
  schema: publishedContactSchema,
  allowedLeafPaths: decision.obligations.allowedWriteFields,
});
contact.update(authorizedPatch);
```

Đây là mẫu ý tưởng; representation của field obligations chờ D-016/D-023. Danh sách field trong error chỉ được trả nếu không làm lộ schema/field bị hạn chế; nếu có rủi ro, trả code chung và correlation ID.

Nếu workflow/form yêu cầu một field mà actor không được ghi, resolver **MUST** chọn một trong các kết quả đã khai báo: field do server sinh/default hợp lệ, transition không khả dụng, hoặc policy/config conflict fail closed và alert owner. **MUST NOT** tự mở quyền, bỏ required rule hoặc ghi `null`. Bulk mutation phải authorize từng resource và field hoặc dùng một PDP decision tập hợp được chứng minh tương đương.

Integration tests **MUST** gồm trường hợp user có capability mutation nhưng gửi thêm field bị cấm/read-only, nested/custom field không được phép và field bắt buộc xung đột policy. Không case nào được tạo partial write/outbox ngoài contract đã khai báo.

### 7.4 Quy tắc bổ sung

- Policy thiếu/lỗi/capability lạ **MUST** fail closed, trừ degraded active-call policy đã threat-model và duyệt riêng.
- Repository query **MUST** có tenant predicate và authorized scope; code review phải nhìn thấy cả hai.
- Object ngoài scope **MUST NOT** rò sự tồn tại, trạng thái, count hoặc field nhạy cảm qua error khác biệt.
- Permission **MUST** được re-evaluate tại request, execution và download với job/export dài.
- Field mask/omit/read-only **MUST** áp đồng nhất ở list, detail, search, export, print và realtime.
- Worker/service identity **MUST** có capability/scope tối thiểu; không dùng “system admin” mặc định.
- Cache policy **MUST** chứa policy version và có bounded TTL/invalidation; không cache allow vô hạn.
- Maker-checker, step-up và break-glass **MUST** theo D-016/D-020/D-021.
- Test **MUST** có allow và deny; một happy-path test không chứng minh authorization.

### 7.5 Actor và service identity trong xử lý bất đồng bộ

Không dùng một rule “luôn chạy bằng actor gốc” hoặc “luôn chạy bằng system”. Chọn execution model theo loại công việc:

| Loại xử lý | Identity và authorization bắt buộc |
|---|---|
| User-intent command chạy trễ, export, scheduled apply | Lưu initiating actor + tenant/scope + requested capability; re-authorize actor/delegation theo policy hiện tại tại execution và trước download/apply |
| Internal fact consumer/projection | Dùng service identity least-privilege scoped theo tenant + event type/projection; không re-authorize actor để phủ nhận fact đã commit |
| Internal maintenance/reconciliation | Dùng service capability riêng, resource scope rõ và runbook; không mượn quyền `system admin` tổng quát |
| External side effect từ workflow/event | Authorize executing service/action capability, re-check invariant/compliance/resource state hiện tại và giữ initiating actor để audit |

Event/job envelope **MUST** giữ cả `initiating_subject_id` khi có, `executing_service_id`, tenant, capability/action key, policy/config/workflow version và correlation/causation IDs. Nếu initiating actor bị revoke trước một user-intent action, job phải chuyển `denied/cancelled` hoặc manual review theo contract, không âm thầm chạy bằng service rộng hơn. Projection thuần không được gọi external side effect chỉ vì đã nhận một fact; side effect phải là action/command có PEP riêng.

## 8. Transaction, outbox và idempotency

### 8.1 Transaction boundary

- Một command thay đổi state **MUST** có local transaction rõ.
- Transaction **MUST NOT** đi xuyên module hoặc giữ mở trong lúc gọi PortSIP/CRM/network.
- Nếu cần phát event từ state đã commit, state và outbox row **MUST** được ghi trong cùng local transaction.
- Side effect xuyên hệ thống dùng saga/compensation hoặc reconciliation; không giả định distributed transaction.
- Handler **MUST** xác định concurrency policy: optimistic version, unique constraint, reservation/lease hoặc serialized processing.

Không đạt:

```ts
await campaignRepository.markRunning(campaignId);
await eventBus.publish({ type: 'CampaignStartedV1', campaignId });
// Crash giữa hai dòng làm mất event.
```

Đạt về ý tưởng:

```ts
await transaction.run(async (tx) => {
  const campaign = await tx.campaigns.getForUpdate(command.campaignId);
  const event = campaign.start(command.actorId, clock.now());

  await tx.campaigns.save(campaign);
  await tx.outbox.append(toEventEnvelope(event, command.correlationId));
});
```

Outbox relay là **at-least-once**, không phải exactly-once:

- relay claim/lease row trong một DB transaction ngắn và commit claim trước khi gọi broker; publish diễn ra **ngoài** DB transaction; relay mark/advance trạng thái trong transaction ngắn khác với lease owner/version check;
- transaction-scoped row lock **MUST NOT** được giữ mở xuyên network publish; lease expiry chỉ cho phép worker khác thử lại, không chứng minh lần publish trước chưa tới broker;
- `event_id` **MUST** được tạo một lần khi append outbox và giữ nguyên qua mọi lần retry;
- crash trước publish để row còn pending và được retry;
- crash sau broker nhận nhưng trước khi relay mark có thể publish duplicate; lease/mark không loại bỏ crash window này;
- nhiều dispatcher tranh cùng row không được làm mất event, nhưng consumer vẫn **MUST** chịu duplicate;
- mỗi consumer dùng inbox unique key `(event_id, consumer_key)` và transaction gắn inbox outcome với local state change khi phù hợp;
- external side effect cần idempotency ledger/key hoặc reconciliation, không dựa vào inbox đơn thuần để tuyên bố exactly-once.

Test relay/consumer **MUST** mô phỏng ít nhất crash trước publish, crash sau publish/trước mark và hai dispatcher tranh một row. Kết quả chấp nhận là có thể nhận nhiều delivery nhưng chỉ một logical state/effect.

### 8.2 Idempotency contract

Operation có thể bị retry **MUST** định nghĩa:

- nguồn và phạm vi của `idempotency_key`;
- input hash/canonical payload;
- thời gian lưu và cleanup;
- response/outcome được replay;
- cách xử lý cùng key nhưng input khác — **MUST** conflict, không chạy lại;
- unknown external outcome và reconciliation path.

Webhook/event consumer **MUST** có inbox/dedup theo `event_id + consumer_key`. “Đã nhận” không đồng nghĩa “đã xử lý thành công”; trạng thái processing/retry/DLQ phải phân biệt.

PortSIP/outbound command có timeout **MUST NOT** dial/retry mù khi không biết cuộc gọi đã được tạo. Chuyển attempt sang `reconcile_pending`, tra cứu bằng opaque correlation/idempotency reference rồi mới quyết định.

## 9. Database và migration

### 9.1 Quy tắc chung

- Chỉ migration của module sở hữu mới sửa table của module đó.
- Application **MUST NOT** đọc/ghi trực tiếp PostgreSQL hoặc ClickHouse nội bộ của PortSIP.
- Table tenant-owned **MUST** có `app_tenant_id` và constraint/index phù hợp với access path.
- Constraint database SHOULD bảo vệ invariant đơn giản: unique, foreign key, check và optimistic version.
- Query **MUST** phân trang có thứ tự ổn định; không trả collection không giới hạn.
- Dynamic field dùng versioned schema + JSONB/document column và typed projection/index được duyệt; **MUST NOT** dùng EAV tổng quát cho toàn domain.
- PII/secret classification, encryption, retention và erase behavior **MUST** được xác định trước khi thêm column.

### 9.2 Expand → migrate → contract

Mọi thay đổi schema dùng được trong rolling deploy **MUST** theo ba bước:

1. **Expand:** thêm cấu trúc tương thích ngược; code cũ và mới cùng chạy được.
2. **Migrate/backfill:** ghi kép hoặc chuyển dữ liệu theo batch có checkpoint, idempotency, progress và dry-run khi cần.
3. **Contract:** chỉ bỏ column/index/contract cũ sau khi không còn reader/writer, telemetry xác nhận và deprecation window hết.

Ví dụ thêm cột bắt buộc:

- Không đạt: thêm ngay `NOT NULL` không default có ý nghĩa vào table lớn, rồi deploy code phụ thuộc cột đó.
- Đạt: thêm nullable; deploy writer mới; backfill theo batch; verify không còn null; thêm constraint theo cơ chế an toàn của DB; sau cùng loại compatibility path.

Migration **MUST** có:

- owner và change ticket;
- estimated rows/size/lock/IO/time window;
- forward/rollback strategy; rollback thường là forward fix, không giả định down migration an toàn;
- precondition/postcondition queries hoặc verification step được review;
- N/N-1 application compatibility;
- resumable/idempotent backfill và cách dừng;
- observability, alert và operator runbook;
- test trên representative dataset, không chỉ empty database.

Destructive rename/drop/type change **MUST NOT** nằm trong cùng release với code chuyển sang schema mới. Production migration và backfill nhạy cảm cần Data/DB reviewer được chỉ định ở phần 18.

## 10. Event và background processing

Event envelope **MUST** theo tài liệu 08, tối thiểu có event ID/type/version, time, producer, tenant, resource, correlation, causation, trace và data.

Unknown-field policy phụ thuộc loại boundary: command/mutation HTTP SHOULD reject field lạ để chặn typo/mass assignment, trừ khi contract ghi rõ extensible field bag. Với **event version đang được hỗ trợ**, consumer phải validate chặt envelope và các field bắt buộc đã biết nhưng **MUST NOT** reject chỉ vì `data` có additive field mới; parser phải ignore/strip/preserve an toàn theo contract. Event version không hỗ trợ hoặc thay đổi làm đổi semantics/type của field đã biết mới đi quarantine/DLQ. Quy tắc này phải được thể hiện trong schema fixtures/compatibility tests, không chỉ trong parser option.

- Event name dùng past tense; event mô tả fact đã xảy ra, không là command trá hình.
- Producer **MUST** publish qua outbox khi event gắn với transaction state.
- Consumer **MUST** chịu duplicate và SHOULD phòng thủ out-of-order/loss bằng version, inbox và reconciliation.
- Consumer **MUST** ignore additive field chưa biết; breaking change tạo version mới và deprecation plan.
- Unknown/breaking version **MUST** vào quarantine/DLQ, không parse đoán.
- Retry **MUST** có bounded attempts/backoff; poison message không được chặn toàn partition vô hạn.
- Side effect của consumer **MUST** idempotent hoặc có ledger/reconciliation.
- Replay/backfill **MUST** có run namespace/ID để không phát cùng external side effect hai lần.
- Timer/job **MUST** durable, có lease, versioned handler/payload, timezone/DST policy, retry/DLQ và idempotency key.
- Mỗi handler **MUST** truyền correlation/causation/trace context và ghi outcome có reason code.

Consumer test tối thiểu: duplicate, out-of-order representative case, unknown additive field, unsupported version, transient retry, poison message, worker crash sau side effect/trước ack và replay.

## 11. Secret, PII, logging và telemetry

### 11.1 Data handling

| Loại | Ví dụ | Quy tắc tối thiểu |
|---|---|---|
| Secret | PortSIP bearer, SIP credential, OAuth token, private key | Vault/reference; không browser/local storage/log/event/PR; rotate và audit riêng |
| Restricted PII | Số điện thoại đầy đủ, recording reference, consent evidence | Capability + scope + mask/omit; encryption/retention/export audit |
| Internal | Campaign configuration, routing reason, operational metrics | Tenant scope; không public; retention theo owner |
| Public/non-sensitive | UI label/help text đã duyệt | Có thể cache; vẫn cần integrity/version |

- Secret **MUST NOT** xuất hiện trong source, fixture, screenshot, telemetry, event payload hoặc browser response.
- Frontend chỉ nhận trạng thái/version/last-rotated metadata của secret, không nhận lại secret đã lưu.
- Test data **MUST** synthetic/anonymized; không copy production PII vào local/CI.
- Error trả client **MUST** an toàn; raw SQL/vendor/stack trace chỉ ở restricted diagnostic channel nếu policy cho phép.
- Export/file URL **MUST** ngắn hạn, scoped, re-authorized và audit; revoke phải chặn download tiếp theo.

### 11.2 Structured logging

Log SHOULD là structured record có:

- timestamp UTC, level, service/module/build version;
- stable `event`/`error_code`;
- correlation/causation/trace IDs;
- actor/service identity dạng pseudonymous khi cần;
- tenant/resource references đã mask/hash theo policy;
- policy/config/workflow/schema/event version liên quan;
- outcome, duration và retry/attempt number.

Không log full request/response theo mặc định. Phone SHOULD mask (ví dụ chỉ giữ 4 số cuối nếu policy cho phép). Không dùng tenant/user/resource ID làm metric label cardinality cao. Log message không được là nơi duy nhất chứa dữ liệu cần alert; metric/trace/audit phải có signal có cấu trúc.

Audit log khác application log: sensitive action **MUST** ghi actor, capability, resource, before/after hoặc diff an toàn, decision/version, reason, approval và correlation ID; audit là append-only theo retention policy.

## 12. Frontend patterns và UX quality

### 12.1 Ranh giới và state

- UI SHOULD tổ chức theo feature/module, không theo một thư mục component dùng chung vô hạn.
- API client/contract mapping nằm ở boundary; component **MUST NOT** phụ thuộc raw PortSIP/vendor DTO.
- Server state, local presentation state, form draft state và realtime state **MUST** được phân biệt.
- Không copy server result vào nhiều local stores nếu không có ownership/sync rule.
- Mutation **MUST** hiển thị pending, thành công/lỗi, xử lý double-submit và reconcile/invalidate cache.
- Realtime event **MUST** kiểm tra version/order và refetch khi không thể reconcile an toàn.
- Permission manifest quyết định menu/action visibility cho UX; API vẫn là authority.
- URL/deep link SHOULD giữ filter/sort/pagination phù hợp để vận hành và hỗ trợ.

Không đạt:

```tsx
{user.role === 'admin' && (
  <button onClick={() => applyTrunkChange()}>Apply</button>
)}
```

Đạt về ý tưởng. Đây là pseudo-TSX minh họa component API; framework UI thực tế chờ D-023:

```tsx
<AuthorizedAction
  capability="trunk.change.apply"
  resource={trunkResource}
  fallback={<PermissionHint capability="trunk.change.apply" />}
>
  <AsyncButton
    pending={applyChange.isPending}
    onPress={openImpactAndApprovalDialog}
  >
    Áp dụng thay đổi
  </AsyncButton>
</AuthorizedAction>
```

`AuthorizedAction` chỉ điều khiển UX. Backend vẫn re-authorize khi submit và apply.

### 12.2 Mọi màn hình phải có state đầy đủ

Mỗi page/widget/data region **MUST** thiết kế:

- initial/loading và refresh;
- empty/no result (khác nhau nếu có filter);
- validation error và server business error;
- permission denied;
- degraded/stale/drift/partial failure nếu có integration;
- offline/reconnecting cho realtime;
- success/confirmation khi action có ảnh hưởng;
- conflict/concurrent edit;
- safe retry hoặc correlation ID + hướng xử lý nếu không retry được.

Không xóa input khi submit lỗi. Published config/workflow không dùng optimistic success nếu backend chưa xác nhận version effective.

### 12.3 Form và accessibility

- Form động **MUST** render theo schema/form version từ server và gửi version khi submit.
- Client validation hỗ trợ UX; server **MUST** validate lại required/read-only/conditional rule.
- Label liên kết control; error liên kết field và có summary/focus; keyboard dùng được; focus trở lại vị trí hợp lý sau dialog.
- Không chỉ dùng màu để truyền state; text/icon phải có accessible name.
- Touch target, contrast và responsive behavior đáp ứng baseline WCAG 2.1 AA của tài liệu 08.
- Loading không làm layout nhảy bất thường; destructive/publish/apply action có impact confirmation phù hợp.
- Copy dùng ngôn ngữ vận hành dễ hiểu; raw vendor error/code chỉ ở phần chi tiết có kiểm soát.

Frontend test tối thiểu cho màn hình nhạy cảm: permitted/denied capability, masked field, loading/empty/error, keyboard/focus, double-submit, conflict, realtime reconnect và API deny dù action từng hiển thị.

## 13. Config, custom field và workflow code

### 13.1 Config definition

Mỗi setting đưa lên frontend **MUST** có typed definition: stable key/version, owner, type/schema, allowed scopes, default, precedence, view/change/approve/apply capabilities, classification/risk, lifecycle, dependencies, validation, UI metadata, activation behavior và audit policy.

- **MUST NOT** đọc config trực tiếp từ tùy ý nhiều nguồn trong business code; dùng effective config resolver.
- Caller SHOULD nhận `value + source scope/version + resolved_at`; telemetry ghi effective version, không log secret value.
- Missing high-risk config **MUST** fail theo documented safe default; không dùng truthy/falsy ngầm.
- Feature flag và authorization **MUST** tách biệt.
- Published version immutable; rollback là publish version tương thích mới/đã biết.

### 13.2 Custom field/form

- Stable field key không tái sử dụng; breaking type change tạo version/migration.
- Backend **MUST** validate payload theo pinned schema version.
- Search/report field phải có approved typed projection/index và data classification.
- Permission manifest và field obligations được áp trước response/export.
- UI component chỉ từ approved registry; **MUST NOT** render arbitrary HTML/CSS/remote script.
- Legacy record/render và N/N-1 schema compatibility **MUST** có test.

### 13.3 Workflow/action

- Telephony FSM, authorization, tenant isolation, DNC/consent và carrier hard limits **MUST NOT** được chuyển thành operator-editable workflow.
- Guard chỉ dùng allowlisted facts/functions, deterministic và bounded resource.
- Action chỉ từ registry, có typed input/output, capability, timeout, retry/idempotency/compensation và owner.
- Workflow instance pin immutable version; migration in-flight cần mapping, dry-run, impact, approval và rollback.
- Timer/job phải durable; non-idempotent unknown result chuyển `reconcile_pending`/manual task.
- Test **MUST** chứng minh workflow/config không bypass hard invariant dù metadata bị sửa ác ý.

## 14. PortSIP integration standards

Mọi PortSIP code nằm sau adapter/wrapper. Domain **MUST NOT** phụ thuộc REST/WSI/SDK DTO hoặc version string.

### 14.1 REST/WSI/webhook

- Contract **MUST** lấy từ exact sandbox/instance và evidence của Discovery; không code theo ký ức hoặc giả định public v22.3 giống PBX v22.6.3.
- Adapter **MUST** map raw vendor payload sang canonical type; raw payload chỉ lưu restricted khi có retention/purpose.
- Network call có connect/request timeout, cancellation, rate limit, circuit breaker và correlation.
- Chỉ retry operation được chứng minh safe/idempotent. Unknown call-creation outcome phải reconcile.
- WSI consumer phải xử lý reconnect/resubscribe, duplicate, out-of-order và gap/loss bằng reconciliation.
- Webhook phải xác minh source/signature hoặc cơ chế được PortSIP hỗ trợ, chống replay và giới hạn payload.
- Error vendor được map về stable adapter/domain error; không đẩy raw message ra UI.
- **MUST NOT** đọc/ghi DB nội bộ PortSIP để “đi đường tắt”.

### 14.2 Browser SDK

- SDK được bọc sau một client telephony interface có state machine rõ.
- Token/credential cấp theo cơ chế đã threat-model; không hard-code hoặc persist secret dài hạn trong browser.
- Registration/call events được normalize, dedup và gắn correlation với app interaction/dial attempt.
- UI không tự suy diễn authoritative call state chỉ từ một callback; phải reconcile theo contract được PoC chứng minh.
- Upgrade SDK cần compatibility matrix, adapter tests, browser/device matrix và controlled rollout.

### 14.3 SIP trunk Admin

- Tenant-owned/shared/system ownership boundary theo tài liệu 07.
- Secret write-only, version reference, rotation và reveal **MUST** tách capability.
- Draft → validate/test → approve → apply → verify/drift → rollback/drain là lifecycle bắt buộc cho thay đổi có tác động.
- Apply operation có optimistic concurrency, idempotency và post-apply readback/reconciliation.
- System/shared/IP-based trunk write không được mở chỉ vì API cho phép; phải qua D-011/security gate.

## 15. Outbound và dialer standards

P0 chỉ manual/click-to-call, preview và progressive 1:1 với effective dial ratio `≤ 1,0` theo D-008.

Ở mỗi scheduling batch, đo `effective dial ratio = số attempt mới được dispatch / số agent reservation hợp lệ, độc quyền và đã gắn cho chính các attempt đó`. Nếu cả hai bằng 0 thì báo 0. Nếu attempt `> 0` nhưng reservation hợp lệ `= 0`, đây là **invariant breach**, không phải một tỷ lệ số học: dừng cấp attempt mới, kích hoạt alert/kill switch theo runbook và đưa các attempt liên quan vào reconciliation. Nếu batch chỉ có một phần mapping hợp lệ, mọi attempt không có ánh xạ 1:1 cũng là breach; không được loại chúng khỏi numerator để làm chỉ số đẹp hơn.

Invariant mạnh hơn dashboard là: mỗi dialer-generated attempt chưa terminal phải có đúng một agent mapping hợp lệ theo state model và một agent không bảo trợ đồng thời hai attempt progressive. CPS được đo riêng bằng số dispatch trong rolling one-second window; concurrency là số call/attempt active theo provider/trunk/tenant/campaign scope. Nguồn đo là reservation + `dial_attempt` ledger, không phải số button click ở browser. D-007/D-008 phải khóa window/state/formula KPI cuối cùng trước go-live.

- Trước dial **MUST** re-check DNC, consent/purpose, timezone/calling window, retry limits, caller-ID/DID allowlist, campaign/trunk/provider CPS và concurrency.
- Compliance hard-stop fail closed và **MUST NOT** bị workflow/config override.
- Progressive **MUST** reserve một agent `Ready` và một eligible contact atomically trước dispatch.
- Reservation có lease/expiry; worker crash không tự tạo attempt thứ hai.
- Mỗi attempt có opaque ID/idempotency key/correlation xuyên app → adapter → PortSIP → event/CDR.
- State transition chỉ qua dial-attempt FSM; callback lạ/out-of-order không được set state tùy ý.
- Timeout sau dispatch → reconcile, không retry mù.
- Outcome/disposition và retry policy version phải audit được.
- Emergency stop/kill switch **MUST** có owner, capability, propagation SLO, test định kỳ và không phụ thuộc một worker đang lỗi.
- Blended pool phải auto-pause/hysteresis theo D-015 khi được duyệt; không tự đặt threshold trong code.

Golden tests tối thiểu:

1. Không có agent Ready → zero external dial.
2. Contact bị DNC/ngoài giờ/thiếu consent → zero external dial và reason code đúng.
3. Hai worker tranh cùng contact/agent → chỉ một reservation/attempt thắng.
4. Timeout/worker crash sau dispatch → không duplicate call; attempt vào reconcile.
5. Duplicate/out-of-order WSI → một logical outcome.
6. CPS/concurrency đạt ngưỡng → backpressure, không vượt limit.
7. Emergency stop → dừng tạo attempt mới trong SLO được duyệt.
8. Revoked capability/service identity → worker không tiếp tục command mới.

## 16. Test strategy và bằng chứng

### 16.1 Quy tắc test

- Test tên theo behavior và outcome, không theo implementation detail.
- Arrange/Act/Assert SHOULD nhìn thấy rõ; một test chỉ nên có một nguyên nhân thất bại chính.
- Clock, UUID, random và external ports **MUST** inject/seed để test deterministic.
- **MUST NOT** dùng sleep để chờ async nếu có thể await event/clock/condition kiểm soát được.
- Mock ở port boundary; **MUST NOT** mock chính domain object đang cần kiểm tra.
- Bug fix **MUST** có regression test thất bại trước sửa và xanh sau sửa, trừ khi bất khả thi được nêu trong PR.
- Snapshot chỉ dùng khi reviewer có thể hiểu diff; không cập nhật snapshot mù.
- Flaky test không được retry vô hạn để “xanh”; quarantine cần owner, ticket và hạn xử lý.

### 16.2 Test theo lớp

| Lớp | Chứng minh điều gì | Ví dụ bắt buộc khi liên quan |
|---|---|---|
| Architecture | Dependency direction/forbidden import | Domain không import adapter; module không dùng ORM entity của nhau |
| Domain unit | Invariant/state/rule thuần | call/dial FSM, eligibility, E.164, config precedence |
| Application unit | Orchestration và port behavior | auth decision, transaction, error/result mapping |
| Adapter contract | Mapping/vendor/infra contract | exact PortSIP fixtures, CRM adapter conformance |
| API integration | Boundary + persistence + policy | malformed input, allow/deny/out-of-scope, concurrency |
| Database migration | Schema/data compatibility | empty + representative DB, N/N-1, resumable backfill |
| Event/worker | Delivery failure semantics | duplicate, retry, DLQ, crash-before-ack, replay |
| Frontend component | User-visible states/a11y | loading/empty/error/denied, keyboard, masked field |
| End-to-end | Critical business outcome | inbound, preview/progressive, trunk change lifecycle |
| Security | Abuse/negative cases | IDOR, tenant escape, privilege escalation, secret/PII leak |
| Reliability/load | SLO/backpressure/recovery | reconnect storm, event lag, CPS/concurrency, timer failover |

Coverage percentage không thay thế risk coverage. Code nhạy cảm có thể cần mutation/property/state-model testing nếu Lead yêu cầu.

### 16.3 Evidence trong PR

PR **MUST** chứa hoặc link tới bằng chứng phù hợp:

- test cases và kết quả từ script chuẩn của repository/CI;
- screenshot/video cho UI state hoặc accessibility interaction;
- API/event fixtures và contract diff;
- migration dry-run/row count/lock estimate/backfill progress;
- authorization matrix gồm allow và deny;
- log/metric/trace/audit sample đã redaction;
- failure injection/reconciliation result cho PortSIP/outbound/worker;
- rollout, feature flag/kill switch và rollback plan.

Không paste secret/PII vào evidence. “Tested locally” không đủ nếu không nói scenario/outcome.

## 17. Quy trình code review và pull request

### 17.1 Trước khi mở PR

Tác giả **MUST**:

1. bảo đảm ticket đạt Definition of Ready hoặc ghi rõ spike;
2. tự đọc toàn bộ diff, bỏ debug/dead code/unrelated formatting;
3. chạy các script chuẩn được repository/CI khai báo cho phạm vi thay đổi;
4. hoàn thành checklist chung và checklist chuyên biệt;
5. cập nhật contract/migration/runbook/tài liệu khi hành vi thay đổi;
6. nêu rõ rủi ro, non-goals, rollout và rollback;
7. gắn reviewer đúng ownership/risk matrix.

### 17.2 Kích thước và cấu trúc PR

- PR SHOULD có một mục tiêu, một outcome và diff có thể review độc lập.
- PR SHOULD dưới khoảng 400 dòng logic thay đổi không tính generated code, lockfile và fixtures lớn. Đây là guideline, không phải cách chia một transaction/migration nguy hiểm thành các PR không chạy được.
- PR lớn hơn phải giải thích vì sao không tách được và cung cấp review map theo commit/file/flow.
- Refactor và behavior change SHOULD tách riêng nếu có thể.
- Generated code **MUST** chỉ sinh từ source/schema được review và chỉ bằng generator đã pin trong repository.
- Không gộp migration contract/drop với rollout code đầu tiên.

### 17.3 Nội dung PR tối thiểu

```text
Outcome:
In scope / Out of scope:
Module owner và entry points:
Capability/data scope/field obligations:
Contract, schema, event hoặc migration change:
Failure modes và idempotency/reconciliation:
Evidence đã chạy/xem:
Observability/audit:
Rollout/feature flag/kill switch:
Rollback hoặc forward-fix plan:
Open risks/decisions/ADR:
```

Không ghi lệnh giả định. Trường Evidence tham chiếu script thực tế trong repository/CI sau khi D-023/scaffold được duyệt.

### 17.4 Reviewer behavior

- Reviewer đánh giá correctness, boundary, security, failure mode, operability và maintainability; không chỉ style.
- Comment phải nêu severity, vấn đề, tác động và hướng sửa/tiêu chí chấp nhận.
- Tác giả không chỉ “resolve” comment mà không sửa hoặc giải thích.
- Approval cũ không còn hiệu lực nếu diff thay đổi material sau review.
- Tác giả **MUST NOT** tự approve change của mình khi maker-checker/segregation áp dụng.
- Merge chỉ khi required reviewers, CI và Definition of Done đều đạt.

## 18. Review severity, ownership và escalation

### 18.1 Severity

| Mức | Ý nghĩa | Xử lý |
|---|---|---|
| **Blocker / P0** | Có thể gây cross-tenant access, bypass auth/compliance, secret leak, duplicate call, data loss hoặc outage nghiêm trọng | Dừng merge/release; Security/Architecture/Telephony/Data owner tham gia tùy phạm vi |
| **Major / P1** | Sai nghiệp vụ, race/retry lỗi, contract break, migration/rollback không an toàn, thiếu critical test/observability | Phải sửa trước merge hoặc có exception/ADR được đúng owner duyệt |
| **Minor / P2** | Maintainability/UX/test gap có rủi ro hữu hình nhưng không chặn correctness hiện tại | SHOULD sửa trong PR; nếu defer phải có ticket/owner/due date |
| **Nit / P3** | Style/câu chữ không ảnh hưởng hành vi và thường được formatter/linter xử lý | Tùy chọn; không dùng nit để ép preference cá nhân |

### 18.2 Required reviewers theo thay đổi

| Thay đổi | Reviewer bắt buộc tối thiểu |
|---|---|
| Capability, scope, mask, PEP/PDP/cache | Module owner + Security/Authorization owner |
| PortSIP SDK/REST/WSI/webhook/trunk | Module owner + Telephony Lead; Security nếu credential/network boundary đổi |
| Dialer, DNC/consent, CPS/concurrency, caller ID | Outbound owner + Telephony + Compliance/Security phù hợp |
| Destructive/large migration, retention/PII | Module owner + Data/DB owner + Security/Data owner |
| Public API/event breaking/version | Producer + ít nhất một consumer owner + Architecture |
| Config/workflow action, expression, runtime | Module owner + Platform/Architecture; Security cho action nhạy cảm |
| Accessibility-critical/shared frontend pattern | Frontend owner + UX/A11y reviewer được chỉ định |
| SLO/deployment/failover/secret handling | Platform/SRE + Security/owner hệ thống |

### 18.3 Khi junior phải dừng và hỏi

Không tự suy đoán. Dừng triển khai và báo người phụ trách nếu:

- ticket không nói resource owner, capability, data scope hoặc expected deny behavior;
- cần query table/import private package của module khác;
- PortSIP contract/version/field/error semantics chưa có evidence;
- không biết external command có idempotent không;
- timeout nhưng không biết side effect đã xảy ra;
- thay đổi DNC/consent/calling window/caller ID/CPS/concurrency;
- migration có drop/rename/type change, table lớn hoặc lock không biết trước;
- muốn log/store/export secret, recording hoặc PII mới;
- workflow/config có thể vượt code-owned invariant;
- cần arbitrary URL/script/SQL/plugin hoặc quyền “admin toàn hệ thống”;
- yêu cầu business buộc bỏ test, audit, rollback hay approval bắt buộc.

Escalation là hành vi đúng, không phải thất bại của junior.

## 19. Checklist chung cho mọi PR

- [ ] Ticket đạt Definition of Ready hoặc được đánh dấu spike/time-boxed.
- [ ] Outcome và non-goals rõ, diff không chứa thay đổi ngoài phạm vi.
- [ ] Module/data owner đúng; không phá import/table boundary.
- [ ] Input ngoài trust boundary được parse từ `unknown` và validate.
- [ ] TypeScript strict; không `any`, cast/non-null assertion để che lỗi.
- [ ] Capability, scope, screen và field/action permission đã xét ở mọi entry point.
- [ ] Mutation đối chiếu supplied fields với write obligations trước domain/DB; không mass-assign hoặc silently drop field cấm.
- [ ] Tenant context đến từ trusted identity, không từ client payload.
- [ ] Error/result code ổn định, không rò stack/vendor detail/PII.
- [ ] Transaction, concurrency, retry, idempotency và unknown outcome được xử lý.
- [ ] Event/API/schema/config/workflow compatibility và version được xét.
- [ ] Secret/PII classification, redaction, retention/export behavior đúng.
- [ ] Happy, deny, invalid, conflict và failure/retry tests phù hợp đã có.
- [ ] Log/metric/trace/audit đủ điều tra nhưng không lộ dữ liệu.
- [ ] UI có loading/empty/error/denied/degraded/conflict và accessibility phù hợp.
- [ ] Rollout, feature flag/kill switch và rollback/forward-fix rõ.
- [ ] Docs/runbook/decision/evidence được cập nhật hoặc ghi “không áp dụng” có lý do.

## 20. Checklist chuyên biệt

### 20.1 Backend/API

- [ ] Controller mỏng; domain rule không nằm trong controller/repository/adapter.
- [ ] Boundary schema quy định unknown fields, limits, format và null semantics.
- [ ] API contract/error codes/version được cập nhật và có fixtures.
- [ ] PEP gọi đúng capability/resource/action context trước data access nhạy cảm.
- [ ] Query có tenant + authorized scope; pagination/order ổn định.
- [ ] Supplied fields được so với write obligations; forbidden/read-only/custom field có stable deny và zero partial write.
- [ ] Field obligations áp trước serialization.
- [ ] Mutation có transaction/concurrency policy và outbox khi phát event.
- [ ] Timeout/retry/circuit breaker/cancellation áp đúng cho external call.
- [ ] Service identity dùng least privilege.

### 20.2 Frontend

- [ ] Page/action lấy capability/screen manifest, không hard-code role name.
- [ ] UI permission không được coi là backend enforcement.
- [ ] Server/local/form/realtime state có ownership rõ, không copy dư thừa.
- [ ] Loading, no-data, no-result, error, denied, degraded và conflict có UX rõ.
- [ ] Double-submit, stale response và reconnect/reorder event được xử lý.
- [ ] Field mask/read-only/conditional form hiển thị đúng manifest/version.
- [ ] Keyboard, focus, label/error association, contrast/non-color cue đạt baseline.
- [ ] Secret/raw vendor detail không xuất hiện trong DOM, storage hoặc screenshot.
- [ ] Component tests gồm denied/masked/error/a11y representative cases.

### 20.3 Database migration/backfill

- [ ] Module owner và table/column/data classification được xác định.
- [ ] Có expand → migrate → contract; code N/N-1 tương thích.
- [ ] Lock/IO/row count/duration và deployment ordering được đánh giá.
- [ ] Backfill batched, resumable, idempotent, có checkpoint/progress/stop.
- [ ] Pre/postcondition và representative-data test có evidence.
- [ ] Index/constraint tạo theo cơ chế production-safe được DB owner duyệt.
- [ ] Không drop/rename/type-break trong release expand đầu tiên.
- [ ] Rollback/forward-fix và cleanup/deprecation window rõ.
- [ ] Tenant predicate/index, retention và erasure không bị phá.

### 20.4 Event/consumer/job

- [ ] Event là past-tense fact, envelope và schema version đầy đủ.
- [ ] State + outbox atomic; inbox/dedup key của consumer rõ.
- [ ] Event ID giữ nguyên qua retry; relay được coi là at-least-once và ba crash/concurrency windows đã test.
- [ ] Additive/breaking compatibility và N/N-1 fixtures được test.
- [ ] Duplicate, out-of-order, unsupported version và poison message được xử lý.
- [ ] Retry bounded; side effect idempotent hoặc reconcile được.
- [ ] Crash sau side effect/trước ack không tạo logical effect thứ hai.
- [ ] Replay/backfill có run ID và không gọi external side effect ngoài ý muốn.
- [ ] Timer durable, lease/timezone/DST/handler version/kill switch đầy đủ.
- [ ] Initiating actor và executing service model/capabilities được chọn đúng loại command/fact/side effect.
- [ ] Correlation/causation/trace và DLQ/reconcile alert có owner.

### 20.5 Config/custom field/workflow

- [ ] Stable key/version/owner/type/scope/default/precedence/capabilities khai báo đủ.
- [ ] Classification/risk/approval/step-up/audit đúng setting/action.
- [ ] Validate, preview/simulate, impact/dependency và effective source có evidence.
- [ ] Published definition immutable; rollback/version/migration rõ.
- [ ] Schema/workflow instance pin version; legacy/in-flight behavior được test.
- [ ] Expression/action chỉ từ allowlist, bounded và deterministic.
- [ ] Không JavaScript/SQL/shell/arbitrary URL/remote UI code.
- [ ] Không bypass auth, tenant, DNC/consent, telephony FSM hoặc carrier limits.
- [ ] Sandbox không dùng credential/dial/send/write Production.

### 20.6 PortSIP/telephony

- [ ] Exact PBX/SBC/SDK/API version và captured contract evidence được link.
- [ ] Vendor DTO chỉ ở adapter; canonical mapping và contract fixture có test.
- [ ] REST timeout/retry/rate limit/circuit breaker/correlation được định nghĩa.
- [ ] WSI reconnect/resubscribe/dedup/order/gap/reconciliation được test.
- [ ] Webhook auth/replay/payload limit và event idempotency được xử lý.
- [ ] Unknown call command outcome không retry mù.
- [ ] Browser SDK credential/state/correlation/reconnect behavior an toàn.
- [ ] Không truy cập DB PortSIP trực tiếp; không log token/SIP secret/raw PII.
- [ ] Trunk change có validate/test/approve/apply/readback/drift/rollback hoặc drain.

### 20.7 Outbound/dialer

- [ ] Mode vẫn trong D-008 và effective dial ratio không vượt `1,0`.
- [ ] DNC/consent/timezone/retry/caller-ID/CPS/concurrency re-check ngay trước dial.
- [ ] Contact + Ready agent được reserve atomically; race test có evidence.
- [ ] Attempt ID/idempotency/correlation đi xuyên PortSIP event/CDR.
- [ ] FSM chặn transition lạ/duplicate/out-of-order.
- [ ] Timeout/worker crash đi reconcile; không duplicate external call.
- [ ] Zero-ready-agent và ineligible-contact chứng minh zero external dial.
- [ ] Emergency stop propagation/owner/test/alert/kill switch đạt SLO được duyệt.
- [ ] Outcome/disposition/retry policy version và audit đầy đủ.

## 21. Công thức triển khai thay đổi thường gặp

### 21.1 Thêm backend command/API

1. Xác nhận module owner và capability/resource.
2. Định nghĩa boundary schema và stable error codes.
3. Định nghĩa command/result và port cần dùng.
4. Định nghĩa scoped policy decision và write obligations; normalize supplied nested/custom fields thành canonical leaf paths.
5. Viết domain transition/invariant test.
6. Implement handler: trusted context → scoped decision/query → reject forbidden supplied fields → build authorized patch → transaction → domain → repository/outbox.
7. Thêm thin controller và response shaping/read obligations.
8. Thêm API integration allow/deny/out-of-scope/forbidden-field/invalid/conflict tests; forbidden write phải có zero partial state/outbox.
9. Thêm telemetry/audit, contract fixture và PR evidence.

### 21.2 Thêm màn hình hoặc action frontend

1. Xác định screen manifest/capability và route owner.
2. Định nghĩa query/mutation contract; không dùng vendor DTO.
3. Thiết kế loading/empty/error/denied/degraded/conflict trước happy path.
4. Implement accessible form/action, double-submit và focus/error behavior.
5. Áp field manifest/mask/read-only; server vẫn authoritative.
6. Test keyboard, denied/masked, network failure, stale/realtime behavior.
7. Đính screenshot/video và accessibility evidence không chứa PII.

### 21.3 Thêm config setting

1. Xác định owner, type, scopes, precedence, default và risk class.
2. Đăng ký view/change/approve/apply capabilities và server-side schema.
3. Implement effective resolver; không đọc rải rác từ environment/database/UI.
4. Thêm Basic/Advanced UI với source chain, impact, validate/test và reset inherited.
5. Test override precedence, missing/invalid value, concurrent publish, rollback và secret redaction.
6. Với high-risk setting, thêm maker-checker, canary/activation behavior và runbook.

### 21.4 Thêm workflow action/logic pack

1. Chứng minh action là business extension, không là code-owned invariant.
2. Định nghĩa stable key/version, typed input/output và required capability.
3. Khai báo timeout, idempotency, retry/compensation, owner và kill switch.
4. Implement adapter/handler qua port; không arbitrary URL/code.
5. Thêm validator/simulator explanation và dependency manifest.
6. Test deterministic result, duplicate, timeout, unknown outcome, old-version instance và hard-invariant bypass attempt.

### 21.5 Thêm PortSIP operation

1. Thu exact endpoint/SDK/event contract từ sandbox/evidence D-002.
2. Thêm raw boundary schema + captured sanitized fixtures trong adapter tests.
3. Map sang canonical port/result/error; không đưa DTO vendor vào domain.
4. Xác định safe retry hay reconcile cho từng outcome.
5. Implement timeout/rate-limit/circuit-breaker/correlation và secret redaction.
6. Test success, vendor errors, malformed/additive payload, timeout, duplicate/out-of-order và version mismatch.
7. Cập nhật compatibility matrix, metrics/alerts và runbook.

## 22. Definition of Ready

Một delivery ticket chỉ **Ready để code** khi:

- [ ] User/persona, problem, outcome và acceptance criteria quan sát được rõ.
- [ ] In scope/non-goals và P0/P1/P2 được xác định.
- [ ] Module/data owner và affected entry points rõ.
- [ ] API/event/SDK/config/schema dependency có contract hoặc ticket là time-boxed spike.
- [ ] Capability, data scope, screen và field/action permission có expected allow/deny.
- [ ] PII/secret/retention/compliance/DNC impact được phân loại.
- [ ] State transition, transaction, idempotency và failure/reconcile expectation rõ khi liên quan.
- [ ] Migration/compatibility/rollout/feature flag/kill switch expectation rõ.
- [ ] Test evidence và observability/audit expectation rõ.
- [ ] Owner quyết định và required reviewers được xác định.
- [ ] Open decision có ID/due date; không ẩn assumption trong code.

Nếu contract PortSIP hoặc business rule chưa biết, ticket SHOULD đổi thành spike/PoC với câu hỏi, time box và evidence exit; không giả lập contract rồi đưa production.

## 23. Definition of Done

Một thay đổi chỉ **Done** khi tất cả mục áp dụng đều đạt:

### Correctness và architecture

- [ ] Acceptance criteria, edge/failure paths và non-goals được đáp ứng.
- [ ] Module ownership/import direction/public contracts đúng.
- [ ] Domain invariant/state transition nằm đúng lớp, type strict và boundary validation đầy đủ.
- [ ] Error taxonomy, concurrency, transaction, idempotency và reconciliation được xử lý.

### Security, authorization và data

- [ ] Tất cả entry points có PEP; deny-by-default và negative tests xanh.
- [ ] Tenant/scope/read obligations áp ở query và serialization/export/realtime.
- [ ] Mutation normalize supplied fields thành canonical leaf paths, áp write obligations trước domain/DB và từ chối field cấm mà không partial write/outbox.
- [ ] Secret/PII không lộ; classification/encryption/retention/audit đúng.
- [ ] Security/Compliance/Data approval đã có nếu thuộc ownership matrix.

### Contracts, migration và compatibility

- [ ] API/event/config/schema/workflow keys/version/fixtures được cập nhật.
- [ ] Consumer/rolling deploy N/N-1 và deprecation plan được chứng minh khi liên quan.
- [ ] Migration theo expand/migrate/contract; backfill/forward-fix/verification sẵn sàng.
- [ ] PortSIP exact-version contract và adapter conformance có evidence khi liên quan.

### Quality và operations

- [ ] Required unit/integration/contract/frontend/E2E/security/reliability tests xanh trong CI chuẩn.
- [ ] Không có flaky/quarantined test mới không owner/due date.
- [ ] Structured logs, metrics, traces, audit, dashboards/alerts đủ phát hiện và điều tra.
- [ ] Loading/error/degraded/operator recovery UX và accessibility đạt chuẩn.
- [ ] Runbook, architecture/decision/user-facing docs được cập nhật.
- [ ] Rollout, flag/kill switch, canary, rollback/forward-fix và post-deploy verification rõ.
- [ ] Required reviewers approve trên diff hiện tại; mọi Blocker/Major đã đóng.
- [ ] Product/Operations/UAT acceptance có evidence nếu thay đổi hành vi vận hành.

“Code đã merge” hoặc “CI xanh” riêng lẻ không đồng nghĩa Done.

## 24. Exception và ADR

Không bypass quy chuẩn bằng comment như `TODO`, `temporary`, disable test/linter hoặc feature flag không owner. Nếu một MUST/MUST NOT không thể tuân thủ, tác giả **MUST** tạo decision/ADR trước merge với:

```text
Decision/ADR ID:
Rule cần exception:
Phạm vi và lý do:
Alternatives đã đánh giá:
Risk và affected tenants/data/flows:
Compensating controls:
Owner và approvers:
Effective date và expiry date:
Removal/migration plan + tracking ticket:
Evidence/monitoring:
```

Exception phải hẹp, có thời hạn và có owner. Exception liên quan tenant isolation, authorization, secret, DNC/consent, duplicate dial hoặc destructive data loss không được duyệt chỉ bởi feature team; phải báo đúng cấp phụ trách theo bảng reviewer ở phần 18.

D-023 phải khóa tối thiểu: runtime/framework, workspace/package manager, TypeScript compiler baseline, formatter/linter, validation library, test layers/runners, database access/migration tool, API/event schema tooling, architecture-test mechanism và các repository/CI scripts chính thức. Sau khi D-023 được duyệt, tài liệu này cần một revision để thay các abstraction bằng reference implementation và đường dẫn/lệnh thực tế, nhưng không được làm yếu các invariant đã nêu.

## 25. Cách dùng tài liệu khi onboarding

Trong tuần đầu, junior SHOULD đi theo thứ tự:

1. đọc phần 1–8 để hiểu rule nền;
2. đọc checklist đúng module ở phần 19–20;
3. pair với senior trên một vertical slice nhỏ có API + permission + test;
4. dùng công thức phần 21 cho ticket đầu tiên;
5. tự chấm Definition of Ready/Done trước refinement và PR;
6. nhờ module owner review thiết kế trước code cho PortSIP, outbound, migration, authorization hoặc workflow action đầu tiên.

Người hướng dẫn SHOULD chọn ticket đầu có failure mode thực nhưng blast radius thấp, cung cấp một PR mẫu đã được duyệt và review cách đọc logs/traces/audit. Junior không nên bắt đầu bằng migration destructive, call dispatch, auth policy engine, secret rotation hoặc compliance rule nếu chưa pair với owner.
