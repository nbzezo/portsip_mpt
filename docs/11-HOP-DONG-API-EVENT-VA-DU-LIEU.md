# Hợp đồng API, event và dữ liệu

## 1. Mục đích và phạm vi

Tài liệu này là quy ước triển khai bắt buộc cho HTTP API, command/query giữa module, integration event, database schema, metadata động và adapter PortSIP của Portsip CC. Mục tiêu là để một developer mới có thể trả lời ba câu hỏi trước khi viết code:

1. Input/output chính xác của thay đổi là gì?
2. Quyền, tenant, version và idempotency được kiểm tra ở đâu?
3. Làm sao thay đổi mà consumer, dữ liệu cũ và workflow đang chạy không bị hỏng?

Các từ khóa `MUST`, `MUST NOT`, `SHOULD`, `MAY` là mức bắt buộc. Ví dụ dùng TypeScript/SQL/YAML theo reference stack ở D-023; chúng là mẫu thiết kế cho tới khi scaffold và Build Profile được phê duyệt. Nếu đổi ngôn ngữ/framework, semantics trong tài liệu này vẫn giữ nguyên.

Đọc cùng:

- [Kiến trúc tích hợp](03-KIEN-TRUC-TICH-HOP.md)
- [Blueprint mở rộng và phân quyền](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md)
- [Sổ tay hiện thực cho developer](09-SO-TAY-HIEN-THUC-CHO-DEVELOPER.md)
- [Chuẩn code và Definition of Done](10-CHUAN-CODE-REVIEW-VA-DEFINITION-OF-DONE.md)
- [Decision register](06-DECISION-REGISTER.md)

## 2. Contract-first workflow

Không bắt đầu bằng controller hoặc table. Mỗi thay đổi đi theo thứ tự:

1. Viết user story, acceptance và failure cases.
2. Xác định owner module, resource, capability, data scope và field classification.
3. Chọn command hoặc query; không dùng một DTO chung cho cả create/update/read.
4. Soạn API/event/schema diff và ít nhất một fixture thành công + một fixture lỗi.
5. Xác định idempotency, concurrency, transaction, timeout, retry và unknown-result behavior.
6. Review contract với consumer, Security/Data/Telephony khi có liên quan.
7. Viết contract test trước hoặc đồng thời implementation.
8. Implement theo dependency direction: contract → application → domain → adapter.
9. Chạy compatibility, authorization và negative tests.
10. Publish documentation/generated client cùng PR; không để contract đi sau code.

Một PR thay API/event/table nhưng không có contract diff, migration/compatibility plan hoặc test fixture là chưa đủ Definition of Done.

## 3. Quy ước chung

### 3.1 Kiểu dữ liệu và định dạng

| Dữ liệu | Quy ước |
|---|---|
| App resource ID | Opaque UUID; client không suy nghĩa hoặc thứ tự từ ID |
| Vendor ID | String opaque, chỉ adapter hiểu; luôn đi cùng source/environment/tenant mapping |
| Timestamp | RFC 3339 UTC, ví dụ `2026-09-08T02:15:30.123Z` |
| Business date/time | Lưu local value + IANA timezone khi nghiệp vụ phụ thuộc timezone/DST |
| Phone | Canonical E.164; raw input có thể lưu riêng theo retention/classification |
| Duration | Integer milliseconds trong code/event; UI format ra đơn vị dễ đọc |
| Enum/state | Stable lowercase snake case; không tái sử dụng key đã deprecate |
| Boolean | `true/false`; không dùng `0/1`, `Y/N` ở public contract |
| Optional | Vắng field khác với `null`; schema phải nêu semantics của cả hai |
| Secret | Write-only input hoặc vault reference; MUST NOT xuất hiện trong read response/event/log |

Không dùng floating point cho tiền, tỷ lệ cần đối soát hoặc duration. Không đặt PII vào URL, query string, event type, metric label, idempotency key hoặc correlation ID.

### 3.2 Request context tin cậy

`app_tenant_id`, role, data scope và capability MUST NOT lấy từ body/query/header tùy ý của client. BFF xác thực session/token rồi tạo context nội bộ:

```ts
export interface RequestContext {
  requestId: string;
  traceId: string;
  tenantId: string;
  subjectId: string;
  subjectType: "user" | "service";
  authenticationStrength: "standard" | "step_up";
  delegatedBy?: string;
}
```

Context chỉ mang identity đã xác thực. Capability/scope hiệu lực được PDP/PIP resolve theo `policy_version`; không nhét một danh sách quyền lâu hạn vào browser rồi tin lại.

### 3.3 Correlation và causation

- `request_id`: một HTTP request hoặc một lần worker thực thi.
- `trace_id`: chuỗi quan sát xuyên service/adapter.
- `correlation_id`: cùng một business flow, ví dụ interaction hoặc config change.
- `causation_id`: command/event trực tiếp tạo event hiện tại.
- `client_command_id`: chống double-click/retry từ client.
- `idempotency_key`: chống xử lý side effect lặp ở boundary.

Các ID có vai trò khác nhau; không dùng một giá trị cho tất cả chỉ để “dễ log”.

## 4. HTTP API contract

### 4.1 Route và version

- Base path: `/api/v1`.
- Resource dùng danh từ số nhiều: `/campaigns`, `/interactions`, `/config-changes`.
- Action nghiệp vụ không ánh xạ tự nhiên sang CRUD dùng subresource/action rõ: `POST /campaigns/{id}:publish` hoặc `POST /config-changes/{id}:approve`.
- Path/version mới cho breaking public contract; patch/additive change giữ v1.
- Không expose URL, method hoặc DTO gốc của PortSIP qua BFF.

### 4.2 Header chuẩn

| Header | Khi dùng | Quy tắc |
|---|---|---|
| `Authorization`/session cookie | Mọi protected route | BFF xác thực; browser không gửi PortSIP bearer |
| `X-Request-Id` | Mọi request | Server sinh nếu thiếu; không tin giá trị quá dài/sai format |
| `Idempotency-Key` | Create/command có side effect và có thể retry | Bắt buộc cho dial, publish, apply, import và bulk action |
| `If-Match` | Update/publish trên object có version | Chứa ETag hiện tại; mismatch trả `412` |
| `traceparent` | Distributed tracing | Propagate theo thư viện; không dùng chứa business/PII data |

### 4.3 Success response

Single resource:

```json
{
  "data": {
    "id": "4ee0d3ce-6fd9-4a84-b230-e650924d1242",
    "name": "Renewal Q4",
    "state": "draft",
    "version": 3
  },
  "meta": {
    "request_id": "req_01"
  }
}
```

List dùng cursor opaque; không dùng offset cho bảng thay đổi nhanh:

```json
{
  "data": [],
  "page": {
    "limit": 50,
    "next_cursor": null,
    "has_more": false
  },
  "meta": {
    "request_id": "req_02"
  }
}
```

- Default `limit=50`, proposed hard max `200`; exact limit được config definition quản lý.
- Filter/sort là allowlist; field lạ trả validation error, không ghép raw SQL.
- Cursor chứa sort keys đã ký/mã hóa hoặc opaque lookup token; client không sửa cursor.
- `data` đã được query-scoped và field-shaped theo PDP obligations trước khi tới serializer HTTP.

### 4.4 Error response

Dùng `application/problem+json` với stable machine code:

```json
{
  "type": "https://portsip-cc.example/problems/validation-failed",
  "title": "Dữ liệu chưa hợp lệ",
  "status": 422,
  "code": "validation.failed",
  "detail": "Có 2 trường cần kiểm tra.",
  "instance": "/api/v1/campaigns/4ee0d3ce:publish",
  "request_id": "req_03",
  "errors": [
    {
      "path": "schedule.timezone",
      "code": "timezone.unknown",
      "message": "Chọn múi giờ IANA hợp lệ."
    }
  ]
}
```

Quy tắc:

- `code` ổn định cho frontend/test; `message/detail` có thể dịch.
- Không trả stack trace, SQL, hostname nội bộ, secret, raw vendor response hoặc dữ liệu object ngoài scope.
- Object lookup ngoài data scope SHOULD trả `404 resource.not_found` để tránh xác nhận object tồn tại; audit nội bộ vẫn ghi `authorization.denied`.
- Capability thiếu trên một chức năng người dùng đã biết có thể trả `403 authorization.denied` với remediation không tiết lộ dữ liệu.
- Mapping status: `400` parse/protocol, `401` chưa xác thực, `403` capability, `404` not found/out-of-scope object, `409` state/idempotency conflict, `412` ETag mismatch, `422` domain validation, `429` limit, `503` dependency/degraded.
- PortSIP `4xx/5xx` không được forward nguyên. Adapter map sang canonical error + retryability + vendor correlation đã redact.

### 4.5 Idempotency

Mọi command có external side effect MUST có idempotency contract:

```text
scope = tenant + subject/service + operation + Idempotency-Key
stored = request_hash + status + canonical_response + created_at + expires_at
```

Algorithm:

1. Validate key và canonical request hash.
2. Insert/reserve idempotency record trong transaction.
3. Nếu cùng key + cùng hash đã hoàn tất, trả lại response cũ.
4. Cùng key + khác hash trả `409 idempotency.key_reused`.
5. Đang xử lý trả trạng thái/poll link; không chạy side effect lần hai.
6. Unknown external result chuyển `reconcile_pending`; không xóa key rồi retry mù.

Key không chứa phone/contact/secret. TTL phụ thuộc business risk và phải dài hơn retry/reconciliation window.

### 4.6 Optimistic concurrency và ETag

- Mutable aggregate có monotonic `version` hoặc `row_version`.
- GET trả `ETag: "campaign-4ee0d3ce-v3"`.
- Update/publish yêu cầu `If-Match`; mismatch trả `412 concurrency.stale_version` cùng current version/refresh action được phép.
- Không dùng last-write-wins cho policy, workflow, form, config, campaign, trunk change hoặc consent.
- Published version bất biến; “sửa” là tạo draft/version mới.

### 4.7 Async job

Import, export, bulk migration, publish/apply dài và report generation trả `202`:

```json
{
  "data": {
    "job_id": "e9603d65-a2c9-4a07-a902-0361d44e0a3f",
    "state": "queued",
    "status_url": "/api/v1/jobs/e9603d65-a2c9-4a07-a902-0361d44e0a3f"
  },
  "meta": { "request_id": "req_04" }
}
```

Job status tối thiểu: `queued`, `running`, `succeeded`, `failed`, `cancelled`, `reconcile_pending`. Response có progress dạng count, error summary và artifact link được phân quyền; không trả raw internal payload.

Policy phải được kiểm tra khi request, khi worker execute và khi user tải artifact. Revoke trước download phải chặn được file dù job đã `succeeded`.

### 4.8 Ví dụ controller và application handler

DTO client không có `tenantId`, `role` hoặc `scope`:

```ts
export interface PublishCampaignBody {
  clientCommandId: string;
  reason: string;
}

export class CampaignController {
  constructor(private readonly publishCampaign: PublishCampaignHandler) {}

  async publish(
    ctx: RequestContext,
    campaignId: string,
    body: PublishCampaignBody,
    ifMatch: string,
    idempotencyKey: string,
  ): Promise<ApiResponse<AcceptedJob>> {
    return this.publishCampaign.execute({
      ctx,
      campaignId,
      expectedVersion: parseEtag(ifMatch),
      idempotencyKey,
      clientCommandId: body.clientCommandId,
      reason: body.reason,
    });
  }
}
```

Application handler re-authorize và query đúng scope trước side effect:

```ts
export class PublishCampaignHandler {
  async execute(command: PublishCampaignCommand): Promise<ApiResponse<AcceptedJob>> {
    const decision = await this.policy.decide({
      subjectId: command.ctx.subjectId,
      tenantId: command.ctx.tenantId,
      capability: "campaign.publish",
      resource: { type: "campaign", id: command.campaignId },
      context: { authenticationStrength: command.ctx.authenticationStrength },
    });

    if (!decision.allow) throw authorizationError(decision.reasonCode);

    return this.unitOfWork.run(async (tx) => {
      const campaign = await tx.campaigns.getAuthorizedForUpdate({
        tenantId: command.ctx.tenantId,
        campaignId: command.campaignId,
        scopeFilter: decision.scopeFilter,
      });

      campaign.assertVersion(command.expectedVersion);
      campaign.requestPublish(command.reason);

      const job = await tx.jobs.enqueueOnce(command.idempotencyKey, {
        type: "campaign.publish",
        tenantId: command.ctx.tenantId,
        campaignId: campaign.id,
        actorId: command.ctx.subjectId,
        policyVersion: decision.policyVersion,
      });

      await tx.outbox.append(campaign.releaseEvents());
      return accepted(job);
    });
  }
}
```

Ví dụ trên không phải lý do để mọi handler tự gọi PDP theo cách khác nhau. Scaffold MUST cung cấp một authorization port/helper chuẩn và architecture test kiểm tra handler nhạy cảm đã khai capability/PEP.

### 4.9 Write-side field authorization và chống mass assignment

Capability cho cả command chưa đủ để cho phép ghi mọi field. Mutation path bắt buộc:

1. Runtime-validate DTO và xác định chính xác canonical **leaf path** client đã gửi theo published schema; custom field dùng stable key, không dùng label.
2. PDP quyết định capability/resource/state và trả write obligations, ví dụ `allowed_write_fields`, `read_only_fields`, `require_step_up`.
3. Reject unknown field theo HTTP contract; reject field đã biết nhưng không được ghi bằng stable `authorization.field_write_denied` **trước** domain transition/database write.
4. Dựng authorized patch từ allowlist tới leaf path rồi map thủ công DTO sang command; không spread body vào entity/ORM update.
5. Domain kiểm tra invariant/cross-field validation rồi transaction mới ghi.

```ts
export interface WriteFieldObligations {
  allowedWriteFields: ReadonlySet<string>;
  readOnlyFields: ReadonlySet<string>;
}

function assertWritableFields(
  suppliedFields: readonly string[],
  obligations: WriteFieldObligations,
): void {
  const forbidden = suppliedFields.filter(
    (field) => !obligations.allowedWriteFields.has(field),
  );
  if (forbidden.length > 0) {
    throw fieldWriteDenied(forbidden); // mapper không tiết lộ value hiện tại
  }
}

const suppliedLeafPaths = collectSuppliedCanonicalLeafPaths(
  input.patch,
  publishedSchema,
);
assertWritableFields(suppliedLeafPaths, decision.obligations);
const authorizedPatch = buildAuthorizedPatch({
  source: input.patch,
  schema: publishedSchema,
  allowedLeafPaths: decision.obligations.allowedWriteFields,
});
```

Quyền trên object cha không tự cấp quyền cho mọi field con. Collector/builder phải normalize path, duyệt tới leaf, và reject duplicate path, parent-child conflict cùng các key prototype-pollution; chỉ `Object.keys` ở cấp đầu là không đủ. Không silently drop field bị cấm vì client có thể tưởng update đã thành công. Nếu workflow/form đánh dấu một field `required` nhưng policy khiến subject không được ghi/nhìn field đó, publication validator phải chặn configuration mâu thuẫn. Nếu cấu hình lỗi vẫn lọt runtime, transition fail closed bằng canonical configuration error và correlation ID; không nâng quyền tạm thời hoặc nhận hidden value từ browser.

Test tối thiểu: subject có capability update tổng thể nhưng không được sửa một Restricted field; request bị reject, aggregate/row/outbox/audit-change không bị ghi ngoài deny audit.

## 5. Command, query và module contract

### 5.1 Quy tắc

- Command đổi state và trả ID/version/result tối thiểu; không trả cả aggregate.
- Query không có side effect và luôn nhận `AuthorizedQueryContext`/scope filter.
- Module A không inject repository/ORM entity của module B.
- Public module port nằm trong `modules/<name>/public`; nội bộ không được import từ bên ngoài module.
- Cross-module report dùng projection; không join table nội bộ xuyên module.
- Transaction không đi xuyên module. Orchestration dùng event/saga + compensating action.

```ts
export interface ContactQueryPort {
  findSummary(input: {
    tenantId: string;
    contactId: string;
    authorizedScope: AuthorizedScope;
    fieldObligations: FieldObligations;
  }): Promise<ContactSummary | null>;
}
```

Không thiết kế port kiểu `query(sql: string)` hoặc `call(method: string, payload: unknown)`; chúng phá type safety, authorization và vendor boundary.

### 5.2 Result và domain error

Expected business outcome dùng typed result/domain error, không throw string:

```ts
export type PublishError =
  | { kind: "campaign_not_draft"; currentState: string }
  | { kind: "missing_approval"; requestId: string }
  | { kind: "compliance_configuration_invalid"; violations: string[] };

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

Unexpected infrastructure failure được throw/capture ở boundary, gắn request/trace ID và map sang safe problem response. Không catch rồi trả `null` hoặc `false` làm mất nguyên nhân.

## 6. Integration event contract

### 6.1 Envelope chuẩn

```ts
export interface IntegrationEvent<TData> {
  event_id: string;
  event_type: string;          // ví dụ campaign.published
  event_version: number;       // bắt đầu từ 1
  occurred_at: string;         // RFC 3339 UTC
  producer: string;            // module key
  app_tenant_id: string;
  aggregate_type: string;
  aggregate_id: string;
  aggregate_version: number;
  initiating_subject_id?: string; // actor khởi tạo ý định, nếu có
  executing_service_id?: string;  // service đang phát/xử lý, nếu có
  correlation_id: string;
  causation_id: string;
  trace_id: string;
  data: TData;
}
```

Ví dụ:

```json
{
  "event_id": "8bcb74ef-1c52-471c-9b27-47501a1b1190",
  "event_type": "campaign.published",
  "event_version": 1,
  "occurred_at": "2026-09-08T02:15:30.123Z",
  "producer": "campaign",
  "app_tenant_id": "b6ce5086-8d95-48fb-8eeb-f9989758f8f4",
  "aggregate_type": "campaign",
  "aggregate_id": "4ee0d3ce-6fd9-4a84-b230-e650924d1242",
  "aggregate_version": 4,
  "initiating_subject_id": "90fb6836-bff6-442e-afd8-029a57c9ce43",
  "executing_service_id": "campaign-api",
  "correlation_id": "corr_01",
  "causation_id": "req_03",
  "trace_id": "trace_01",
  "data": {
    "published_version": 4,
    "effective_from": "2026-09-09T01:00:00.000Z"
  }
}
```

### 6.2 Naming và versioning

- Event là fact quá khứ: `interaction.started`, `dial_attempt.suppressed`, `config_change.applied`.
- Không đặt command như `start_campaign` vào event bus rồi giả vờ là fact.
- Add optional field và consumer ignore unknown field là additive change trong cùng version.
- Với event version đã hỗ trợ, envelope/required known fields được validate chặt nhưng unknown additive fields trong `data` MUST được ignore hoặc preserve an toàn. Không áp HTTP command policy `additionalProperties=false` một cách máy móc lên event payload và phá forward compatibility.
- Rename/remove/change meaning/type/cardinality là breaking; tạo `event_version + 1`.
- Producer SHOULD phát N và N-1 trong transition nếu migration plan yêu cầu; consumer khai supported versions.
- Unknown version vào quarantine/DLQ với alert; không deserialize đoán hoặc bỏ im lặng.
- Event key/type đã deprecate không được tái sử dụng với nghĩa khác.

### 6.3 Outbox/inbox

Producer trong cùng database transaction:

1. Update aggregate.
2. Insert outbox rows với unique `event_id`.
3. Commit.
4. Relay claim/lease rows trong transaction ngắn rồi commit claim.
5. Relay publish ngoài database transaction; không giữ row lock xuyên network call.
6. Relay mark/advance trong transaction ngắn khác với lease owner/version check.

Consumer:

1. Validate envelope/schema/version/tenant.
2. Insert inbox `(consumer_key, event_id)` với unique constraint.
3. Nếu duplicate, ack mà không chạy side effect.
4. Apply state transition/projection trong transaction.
5. Ghi outbox của event tiếp theo nếu có.
6. Ack sau durable commit.

Outbox relay là **at-least-once**, không phải exactly-once. Claim/lease giảm tranh chấp nhưng không chứng minh lần publish trước chưa tới broker; crash sau publish và trước `mark published` vẫn có thể phát trùng. Mọi retry MUST giữ nguyên `event_id`. Consumer inbox có unique `(consumer_key, event_id)` và handler side effect phải idempotent/reconcile được.

Các crash window bắt buộc test:

| Điểm crash | Kỳ vọng |
|---|---|
| Trước database commit | Không aggregate change, không outbox event |
| Sau commit, trước relay publish | Row còn pending và được relay khác/restart xử lý |
| Sau publish, trước mark | Event có thể tới hai lần nhưng cùng `event_id`; mỗi consumer tạo một logical effect |
| Hai relay claim cùng lúc | Lease/locking ngăn concurrent ownership hoặc duplicate vẫn an toàn |
| Consumer sau side effect, trước inbox commit | Handler dùng downstream idempotency/reconciliation; không giả định inbox một mình giải quyết external effect |

Không dựa vào broker “exactly once” để bỏ idempotency.

### 6.4 Ordering, replay và DLQ

- Chỉ kỳ vọng ordering theo aggregate khi transport hỗ trợ; dùng `aggregate_version` để phát hiện gap/out-of-order.
- Event cũ không được ghi đè terminal/newer state; lưu raw reference và schedule reconciliation.
- Replay có `replay_run_id`, target projection và `side_effects=false` mặc định.
- Không replay notification, dial, trunk apply hoặc CRM write nếu handler chưa chứng minh idempotent.
- DLQ record có event reference, consumer, error code, attempt, first/last failure, next action và owner; raw payload tuân retention/masking.
- Poison message không được chặn partition/tenant khác vô thời hạn.

### 6.5 Actor và service identity khi chạy event/job

Không dùng một execution rule cho mọi background work:

| Loại | Authorization model |
|---|---|
| User-intent command/job như export, publish, bulk update | Lưu initiating actor + approval; re-authorize actor/resource khi execute và khi tải artifact |
| Internal fact consumer/projection | Service identity chỉ được capability cho tenant + event type/projection; không phụ thuộc việc actor gốc còn quyền để cập nhật factual read model |
| Timer/workflow action thay business state | Service identity + pinned workflow/policy context; re-check current resource state, hard invariant và required approval |
| External side effect như dial/CRM write/notify/trunk apply | Capability riêng, current compliance/security/limit check, idempotency/unknown-result contract và initiating actor + executing service trong audit |

Không chạy worker dưới một `system/admin` chung. Job/event record phải đủ tenant, handler/event version, resource, initiating actor nếu có, executing service, policy/workflow/config version, approval reference, idempotency và correlation để quyết định/replay/audit.

## 7. Database contract

### 7.1 Ownership và tenant constraint

- Mỗi module sở hữu PostgreSQL schema/tables/migrations/repositories của mình.
- Table tenant-owned MUST có `app_tenant_id NOT NULL` và key/unique constraint có tenant.
- Foreign key nội module SHOULD gồm `app_tenant_id` để không tạo cross-tenant edge.
- Không foreign key hoặc join trực tiếp table nội bộ module khác; lưu opaque ID và xác minh qua port/event/read model.
- PostgreSQL RLS MAY bảo vệ tenant boundary như defense-in-depth; data scope BU/team/queue/campaign/own vẫn do authorized query policy áp trước khi đọc.
- Không nhận `app_tenant_id` từ DTO rồi dùng thẳng trong repository.

Ví dụ minh họa:

```sql
CREATE SCHEMA IF NOT EXISTS campaign;

CREATE TABLE campaign.dial_attempt (
  app_tenant_id uuid NOT NULL,
  attempt_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  campaign_member_id uuid NOT NULL,
  state text NOT NULL,
  policy_version integer NOT NULL,
  client_command_id text NOT NULL,
  idempotency_key_hash text NOT NULL,
  portsip_session_id text,
  row_version bigint NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  PRIMARY KEY (app_tenant_id, attempt_id),
  UNIQUE (app_tenant_id, client_command_id),
  CHECK (state IN (
    'eligible', 'reserved', 'dispatch_pending', 'pbx_accepted',
    'ringing', 'answered', 'failed', 'wrap_up', 'finalized',
    'reconcile_pending', 'suppressed', 'cancelled'
  ))
);
```

Đây là minimum minh họa, không phải migration production hoàn chỉnh. Index, partition, retention, RLS và transition integrity phải có design review theo capacity.

### 7.2 Column convention

- ID: `<entity>_id`; tenant: `app_tenant_id`.
- Timestamps: `created_at`, `updated_at`, optional `effective_from/to`; tất cả `timestamptz`.
- Concurrency: `row_version bigint`.
- External mapping: `source_system`, `external_id`, `environment`; unique theo tenant/source/environment.
- State dùng check/reference catalog có migration; không dùng magic integer.
- Secret chỉ là `secret_version_ref`; không lưu ciphertext tự chế hoặc masked placeholder.
- Soft delete không mặc định. Dùng lifecycle/deprecation/retention rõ; audit append-only.
- Core query/report field là typed column. Custom field dùng JSONB + schema version và approved typed projection/index, không EAV toàn hệ thống.

### 7.3 Migration

Tên đề xuất: `<timestamp>_<module>_<intent>`, ví dụ `202609080215_campaign_add_attempt_policy_version`.

Mọi breaking DB change đi qua:

1. **Expand**: thêm nullable column/table/index concurrently hoặc compatible view; code cũ vẫn chạy.
2. **Migrate/backfill**: job theo batch, có progress, retry, run ID, dry-run và verification query.
3. **Switch**: code đọc/ghi contract mới, theo dõi mismatch.
4. **Contract**: chỉ xóa/NOT NULL/rename sau khi N-1 không còn và evidence đạt.

MUST NOT rename/drop column, đổi type phá dữ liệu hoặc backfill toàn bảng trong một blocking transaction ở release bình thường. Down migration không phải rollback mặc định; rollback dùng compatible app version/feature flag/forward fix.

### 7.4 Query authorization

Repository nhận authorized filter, không nhận boolean `isAdmin`:

```ts
export interface AuthorizedScope {
  tenantId: string;
  businessUnitIds: readonly string[];
  teamIds: readonly string[];
  queueIds: readonly string[];
  campaignIds: readonly string[];
  ownershipPredicate?: { subjectId: string; relations: readonly string[] };
}
```

Query phải áp scope trước `COUNT`, facet, aggregate, pagination và object lookup. Không query rộng rồi filter trong JavaScript. Empty scope là deny/empty set, không biến thành “all”.

## 8. Audit contract

High-risk allow và mọi deny/config/permission/recording/export/monitor action phải audit:

```ts
export interface AuditRecord {
  audit_id: string;
  occurred_at: string;
  app_tenant_id: string;
  actor_id: string;
  actor_type: "user" | "service";
  delegated_actor_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  result: "allowed" | "denied" | "failed";
  reason_code: string;
  matched_scope?: string;
  policy_version: number;
  obligations?: readonly string[];
  request_id: string;
  correlation_id: string;
  before_hash?: string;
  after_hash?: string;
}
```

Audit không chứa raw token/password/recording URL/phone/email/note. Before/after ưu tiên semantic diff đã redact hoặc hash + secure evidence reference. Audit append-only, có retention và export policy riêng.

## 9. Config, custom field/form và workflow contracts

### 9.1 Config definition

```json
{
  "key": "outbound.progressive.max_concurrency",
  "version": 1,
  "owner_module": "outbound",
  "value_type": "integer",
  "default": 1,
  "constraints": { "minimum": 1, "maximum": 1 },
  "allowed_scopes": ["tenant", "campaign"],
  "resolver": "campaign_over_tenant",
  "read_capability": "campaign.settings.read",
  "write_capability": "campaign.settings.edit",
  "approve_capability": "campaign.settings.approve",
  "risk_level": "high",
  "activation_mode": "new_attempt_only",
  "frontend_editable": true,
  "ui": {
    "control": "number",
    "label": "Số cuộc gọi progressive đồng thời",
    "help": "P0 chỉ cho phép 1 cuộc gọi trên mỗi agent đã reserve."
  }
}
```

Backend đăng ký key; operator chỉ tạo value/version cho key có sẵn. Hard maximum ở code/domain invariant vẫn thắng metadata. Secret config dùng write-only command + vault reference và `frontend_editable` chỉ mô tả wizard rotate, không có nghĩa browser đọc secret.

### 9.2 Custom field và form

```json
{
  "field_key": "contact.customer_segment",
  "schema_version": 2,
  "entity_type": "contact",
  "data_type": "single_select",
  "classification": "internal",
  "required": false,
  "options": ["standard", "vip"],
  "capabilities": {
    "view": "contact.segment.read",
    "edit": "contact.segment.edit",
    "export": "contact.segment.export"
  },
  "search_projection": true,
  "state": "published"
}
```

- Stable key không đổi nghĩa/type tại chỗ.
- Record pin `schema_version`; field deprecate không xóa value lịch sử.
- Cùng JSON Schema 2020-12/validation artifact dùng ở frontend và backend; backend authoritative.
- Form chỉ dùng component registry allowlist; không HTML/CSS/JS hoặc remote component.
- Conditional visibility/required/read-only dùng safe expression DSL và được server đánh giá lại khi submit.

### 9.3 Workflow và timer

```json
{
  "workflow_key": "case.standard",
  "version": 3,
  "initial_state": "open",
  "transitions": [
    {
      "key": "resolve",
      "from": ["open", "pending"],
      "to": "resolved",
      "required_capability": "case.resolve",
      "guards": [{ "op": "exists", "path": "disposition_code" }],
      "actions": [{ "handler_key": "crm.sync_case_outcome", "version": 1 }]
    }
  ]
}
```

Published version bất biến; instance mới pin v3, instance cũ giữ version của nó. Action handler phải registered, typed, timeout-bounded và khai idempotency/retry semantics. Validator chặn cycle tự động, state không tới được, action lạ và dependency schema/capability thiếu.

Durable timer tối thiểu lưu:

```text
app_tenant_id, timer_id, workflow_instance_id, handler_key, handler_version,
run_at, business_calendar_id, timezone, payload_schema_version, status,
lease_until, attempt_count, max_attempts, idempotency_key,
initiating_subject_id (nullable), executing_service_id, capability_key, action_key,
policy_version, workflow_version, config_version, approval_ref (nullable),
correlation_id, causation_id
```

## 10. PortSIP adapter contract

### 10.1 Boundary

Domain chỉ dùng canonical port như `TelephonyGateway`; không import PortSIP SDK/DTO/error code. Adapter chịu:

- bearer/service credential và refresh;
- exact-version request/response mapping;
- timeout/retry/rate limit/circuit breaker;
- tenant/extension/provider/resource mapping;
- raw event durable inbox, signature/authentication và dedupe;
- canonical error/event mapping;
- read-back/reconciliation và health evidence;
- secret/PII redaction.

```ts
export type CanonicalTelephonyRejectReason =
  | "destination_rejected"
  | "agent_endpoint_unavailable"
  | "capacity_limited"
  | "configuration_invalid"
  | "authentication_failed"
  | "unsupported_operation";

export interface TelephonyGateway {
  createOutboundCall(command: {
    tenantId: string;
    attemptId: string;
    agentExtensionId: string;
    destinationE164: string;
    callerIdProfileId: string;
    idempotencyKey: string;
    correlationId: string;
  }): Promise<
    | {
        kind: "accepted";
        sessionId: string;
        callId?: string;
        vendorCorrelationId?: string;
      }
    | { kind: "rejected"; reason: CanonicalTelephonyRejectReason; retryable: boolean }
    | { kind: "unknown"; reconciliationToken: string }
  >;
}
```

`unknown` không được map thành `rejected` hoặc tự retry. Dialer chuyển attempt sang `reconcile_pending` và tra event/session/CDR trước lệnh tiếp theo. D-002 phải khóa mapping exact-version từ vendor response/error sang reason ổn định; thêm reason là thay đổi contract có fixture, owner và compatibility review.

### 10.2 Mapping table bắt buộc

Mỗi adapter version có file mapping được review:

| Vendor surface | Canonical contract | Cần ghi |
|---|---|---|
| WSI/Webhook event | `interaction.*`, `call_leg.*`, `agent_state.*` | Exact sample, optional/missing field, ordering/gap behavior |
| REST error | Canonical error/retryability | HTTP/vendor code, safe message, retry/unknown rule |
| Provider/trunk/rule | Desired/effective config model | Ownership, secret-return behavior, disabled/read-back/test support |
| CDR | Final interaction/call-leg fields | Correlation keys, timezone, late arrival/correction |

Raw vendor payload chỉ ở adapter evidence/inbox theo retention và masking; public/internal domain event không rò vendor DTO.

## 11. Compatibility và contract tests

### 11.1 Fixtures bắt buộc

Mỗi endpoint/event/adapter contract có fixture tối thiểu:

- happy path;
- missing/invalid field;
- unknown additive field;
- unauthorized/out-of-scope;
- field masked/omitted;
- duplicate/idempotent retry;
- stale ETag/version;
- dependency timeout/retryable failure;
- unknown external result nếu có side effect;
- N-1 payload/consumer.

Fixture không chứa production secret/PII. Phone dùng dải test được duyệt.

### 11.2 CI gates

- OpenAPI/schema lint và breaking-change detection.
- Generated client/type không có diff chưa commit.
- Consumer/provider contract tests.
- Event N/N-1 deserialize + unknown additive field.
- Adapter conformance trên recorded synthetic/sandbox fixtures.
- Migration từ N-1, rollback/forward-fix path và backfill dry-run.
- Permission matrix cho API/query/realtime/export/worker.
- Secret/field leakage scan trên response, log, trace, event và artifacts.

## 12. Checklist thêm contract mới

### API

- [ ] Owner module, resource và capability đã đăng ký.
- [ ] Data scope/field obligations và object-not-found policy đã xác định.
- [ ] OpenAPI request/response/problem schemas và examples có version.
- [ ] Idempotency, ETag, async job và status codes đã quyết định.
- [ ] Không có tenant/role/scope/vendor token từ client làm trusted input.
- [ ] Negative authorization/validation/concurrency/dependency tests có fixture.

### Event

- [ ] Tên là fact quá khứ; owner và consumer liệt kê rõ.
- [ ] Envelope, event/data version và classification hoàn chỉnh.
- [ ] Additive/breaking decision và N/N-1 plan có evidence.
- [ ] Outbox/inbox/dedupe/order/gap/replay/DLQ semantics được test.
- [ ] Side effect idempotent; replay mặc định không dial/send/apply.

### Table/migration

- [ ] Module owner và `app_tenant_id` constraint đúng.
- [ ] Không cross-module table access/FK.
- [ ] Index/capacity/retention/PII classification được review.
- [ ] Expand–migrate/backfill–contract và N-1 deploy path được test.
- [ ] Authorized query áp scope trước lookup/count/facet/export.

### Dynamic config/schema/workflow

- [ ] Stable key, owner, version, capability, risk và lifecycle có đủ.
- [ ] Frontend/backend cùng validation version; backend authoritative.
- [ ] Preview/simulate/approval/publish/rollback và audit có test.
- [ ] In-flight instance/data cũ giữ pinned version hoặc có explicit migration.
- [ ] Không arbitrary code/SQL/URL/remote component và không override core invariant.

Nếu một ô chưa thể đánh dấu, PR phải ghi blocker/decision ID và không merge đường production tương ứng.
