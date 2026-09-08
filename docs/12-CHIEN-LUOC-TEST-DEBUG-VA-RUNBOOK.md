# Chiến lược test, debug và runbook cho developer

## 1. Mục tiêu

Tài liệu này hướng dẫn developer, đặc biệt là junior, cách chứng minh một thay đổi đúng và cách điều tra sự cố Portsip CC mà không làm tình hình xấu hơn. Nó áp dụng cho frontend, BFF/API, worker, PostgreSQL/Redis, policy/config/workflow runtime và PortSIP Adapter.

Nguyên tắc quan trọng nhất:

- Không “thử lại xem sao” với dial, trunk apply, CRM write hoặc action không idempotent.
- Không sửa trực tiếp dữ liệu production để thoát lỗi.
- Không tắt authorization/compliance/validation để test nhanh.
- Không dùng credential, contact hoặc số điện thoại production trong local/CI/sandbox.
- Luôn bắt đầu từ `request_id`, `correlation_id`, tenant, aggregate ID và version; không debug chỉ bằng ảnh chụp màn hình.

Đọc trước:

- [Sổ tay hiện thực](09-SO-TAY-HIEN-THUC-CHO-DEVELOPER.md)
- [Chuẩn code và Definition of Done](10-CHUAN-CODE-REVIEW-VA-DEFINITION-OF-DONE.md)
- [Hợp đồng API, event và dữ liệu](11-HOP-DONG-API-EVENT-VA-DU-LIEU.md)
- [Discovery/PoC và golden dataset](04-DISCOVERY-POC.md)
- [Kiến trúc tích hợp](03-KIEN-TRUC-TICH-HOP.md)

## 2. Build Profile phải tồn tại trước khi giao product feature code

Repository đã có Discovery scaffold chạy được theo D-023/ADR-001. Trong G0-02/G0-03, Engineering Lead MUST duy trì `docs/BUILD-PROFILE.md` với đúng command thực tế và hoàn tất independent clean-machine verification:

```text
Runtime + version:
Package manager + version:
Install command:
Start dependencies command:
Apply migration command:
Seed synthetic data command:
Start web/API/worker command:
Unit test command:
Integration test command:
Contract test command:
E2E command:
Lint/typecheck/format command:
Build command:
Stop/clean command:
Required local URLs:
Where test artifacts are written:
Owner and last verified date:
```

Junior MUST copy command từ Build Profile, không đoán package manager/script. PR scaffold chưa được chấp nhận nếu một người mới không thể clone → install → migrate → seed → chạy smoke test chỉ bằng file này. Trước thời điểm đó chỉ làm ticket Discovery/docs/contract/fixture được ledger cho phép; không tự tạo feature app.

## 3. Môi trường và safety boundary

| Môi trường | Dữ liệu | External side effect | Mục đích |
|---|---|---|---|
| Local | Synthetic, seed lại được | Stub/fake mặc định | Unit, component, UI development |
| CI | Synthetic, cô lập mỗi run | Fake/recorded fixtures | Lint, type, unit, integration, contract, selected E2E |
| Sandbox | Synthetic/anonymized | Chỉ test trunk/CRM/account được duyệt | Exact PortSIP/SDK/connector contract |
| UAT | Synthetic + business scenarios được duyệt | Chỉ test numbers/routes | End-to-end, permission, operator workflow |
| Production | Production | Thật | Chỉ smoke/read-only/canary theo runbook và approval |

Sandbox network policy MUST chặn production PBX/CRM endpoints, production secrets và số ngoài allowlist. Một cờ UI như `sandbox=true` không phải boundary; enforcement ở network, credential và adapter.

Mỗi test run có `test_run_id` và tenant riêng. Test cleanup chỉ xóa resource có exact `test_run_id` trong tenant test; không chạy wildcard/recursive cleanup trên environment dùng chung.

## 4. Test layers

### 4.1 Ma trận

| Layer | Chứng minh | Dependency | Khi bắt buộc |
|---|---|---|---|
| Unit | Domain rule/FSM/mapper/validator deterministic | Không network/DB thật | Mọi business logic |
| Component | Repository, transaction, outbox/inbox, policy/query scope | PostgreSQL/Redis cô lập | Mọi persistence/cache change |
| Architecture | Module/import/table ownership | Static analysis/test graph | Mọi module/port change |
| Contract | OpenAPI/event/adapter schema và N/N-1 | Fixtures/provider mock | Mọi boundary change |
| Integration | Nhiều component + dependency sandbox/stub | DB/cache/fake connector | Mọi use case xuyên layer |
| E2E UI | Persona thao tác qua browser | Web/API/worker stack | Critical agent/admin journeys |
| Security | IDOR, scope, field leak, secrets, replay | Full relevant stack | Auth/config/export/recording/PortSIP change |
| Resilience | Retry, restart, failover, gap, duplicate, unknown result | Fault injection | Worker/event/adapter/call/config change |
| Load | Forecast peak + headroom | Representative topology | Realtime, dialer, event, report, policy cache |
| UAT/Pilot | Business outcome và operability | UAT/production-like | P0 go-live |

Một E2E pass không thay unit/contract tests; một unit pass không chứng minh wiring, database constraint hoặc authorization boundary.

### 4.2 Test naming

Dùng mẫu `given_when_then` hoặc câu hành vi rõ:

```ts
describe("PublishCampaign", () => {
  it("denies_when_subject_has_capability_but_campaign_is_outside_scope", async () => {
    // arrange
    // act
    // assert
  });
});
```

Test name phải nêu condition và expected behavior. Không dùng `works`, `test1`, `happy case` hoặc chỉ lặp tên method.

### 4.3 Arrange–Act–Assert

- Arrange chỉ tạo dữ liệu cần thiết; factory đặt tenant/scope rõ.
- Act gọi đúng một public boundary/use case.
- Assert outcome, state, emitted event/audit và **absence of forbidden side effect**.
- Với negative case, luôn assert “0 PortSIP call”, “0 export row”, “0 secret in response” hoặc equivalent; chỉ assert HTTP status là chưa đủ.

## 5. Test bắt buộc theo loại thay đổi

### 5.1 Authorization

Mỗi capability/resource mới cần matrix tối thiểu:

| Persona | Capability | Scope relation | Field obligation | Kết quả |
|---|---|---|---|---|
| Agent A | `interaction.read` | assigned | phone masked | Allow + masked |
| Agent A | `interaction.read` | outside scope | n/a | Deny/no existence leak |
| Supervisor Team A | `interaction.read` | team A | phone masked | Allow |
| Supervisor Team A | `interaction.read` | team B | n/a | Deny |
| Platform Admin | admin capability | tenant | Restricted PII absent by default | Allow admin action, no PII elevation |
| Service worker | declared capability | delegated campaign | least fields | Allow only job scope |

Chạy cùng universe qua list, detail, guessed ID, search, count, facet, dashboard, WebSocket, export, recording/file và worker. Kết quả resource set phải nhất quán. Test revoke role/membership/relationship và đo cache/realtime invalidation.

Ví dụ unit test policy:

```ts
it("defaults_to_deny_for_unknown_capability", async () => {
  const decision = await policy.decide({
    tenantId: TENANT_A,
    subjectId: AGENT_A,
    capability: "unknown.capability",
    resource: { type: "interaction", id: INTERACTION_A },
  });

  expect(decision).toMatchObject({
    allow: false,
    reasonCode: "policy.unknown_capability",
  });
});
```

### 5.2 API/query

- Valid/invalid/missing/unknown field.
- Unauthorized route và out-of-scope object.
- Filter/sort allowlist; cursor malformed/tampered.
- Field omit/mask/read-only/export.
- Subject có command capability nhưng gửi một field/path không nằm trong `allowed_write_fields`: server reject trước domain/DB/outbox; không mass-assign hoặc silently drop.
- Published form không được tạo tình huống field vừa required vừa bị policy cấm ghi; validator chặn hoặc runtime fail closed bằng configuration error.
- Duplicate idempotency key cùng/khác request hash.
- Stale/missing `If-Match`.
- Dependency timeout và safe problem response.
- Count/facet computed **sau** authorized filter.

### 5.3 Database/migration

- Apply từ clean database.
- Upgrade từ N-1 representative schema/data.
- Old app/new schema và new app/expanded schema compatibility trong rolling window.
- Constraint chống cross-tenant edge/duplicate idempotency.
- Backfill dry-run, batch resume, verification query và progress metric.
- Large-table lock/query plan ở representative scale.
- Contract/drop chỉ sau evidence không còn reader/writer cũ.

Không dùng rollback test chỉ bằng `down` migration để kết luận production an toàn.

### 5.4 Event/outbox/inbox

- Commit aggregate + outbox atomically; rollback không để orphan event.
- Relay crash sau publish/trước mark có thể phát lại **cùng `event_id`**; inbox unique `(consumer_key,event_id)` và handler chỉ tạo một logical effect.
- Hai relay tranh cùng row và lease owner chết giữa batch không làm mất event; duplicate vẫn được coi là expected at-least-once behavior.
- Duplicate delivery chỉ tạo một logical effect.
- Out-of-order/old aggregate version không ghi đè state mới.
- Missing version/gap tạo reconciliation/alert.
- Unknown additive field được ignore; unknown breaking version vào quarantine/DLQ.
- Replay mặc định không dial/send/apply/notify external.
- Worker crash trước/sau external response và trước/sau durable commit.
- Phân biệt user-intent job re-authorize actor, factual projection dùng tenant/event-scoped service identity và external side effect re-check current invariant/capability; audit giữ initiating actor + executing service.

### 5.5 Dynamic config/form/workflow

- Effective value đúng theo từng allowed scope và resolver.
- Ambiguous match, invalid range/dependency, stale ETag và missing approval bị chặn.
- System-only/secret key không xuống browser; write-only secret không hiện lại.
- Custom field publish không deploy; backend chặn bypass conditional required/read-only.
- Deprecate field không xóa dữ liệu; record cũ render theo pinned schema.
- Workflow v1 instance tiếp tục sau publish v2; migration thiếu mapping bị chặn.
- Timer sống qua restart/failover/DST; chỉ một logical outcome.
- Automatic loop, unreachable state, unregistered action và resource-limit breach fail safe.

### 5.6 PortSIP và outbound

- Recorded fixtures từ exact version cho success, reject, timeout, malformed/extra/missing field.
- WSI reconnect/resubscribe, duplicate/reordered/missing event và CDR reconciliation.
- Progressive không dial nếu chưa reserve đúng một Ready agent.
- DNC/consent/timezone/caller-ID/CPS/concurrency recheck ngay trước dispatch.
- Unknown call-create result vào `reconcile_pending`, không retry tạo session thứ hai.
- Pause/stop chặn command mới trong proposed target; active call không bị cắt.
- Trunk/rule apply: ownership, secret masking, diff, approval, apply-disabled/maintenance, read-back, synthetic call, drift và compensating rollback.

## 6. E2E frontend

Reference stack dùng Playwright sau D-023. Test bằng role/name/label thay vì CSS selector dễ vỡ:

```ts
test("operator_cannot_self_approve_config_change", async ({ page }) => {
  await loginAs(page, "telephony_config_editor");
  await page.goto("/admin/change-requests/change-01");

  await expect(page.getByRole("button", { name: "Phê duyệt" })).toBeDisabled();
  await expect(page.getByText("Người tạo không được tự phê duyệt")).toBeVisible();

  const response = await callApproveApiAsCurrentUser(page, "change-01");
  expect(response.status()).toBe(403); // UI disabled không phải security proof duy nhất
});
```

Mỗi critical page có test cho loading, empty, partial/degraded, permission denied, validation error, concurrent edit, retry-safe và keyboard/focus flow. Không snapshot toàn trang thay cho assert hành vi quan trọng.

## 7. Golden datasets

Giữ fixture versioned trong repo sau scaffold:

```text
test/fixtures/
├── auth/
│   ├── organization-resource-graph.v1.json
│   └── persona-policy-matrix.v1.json
├── portsip/
│   └── <exact-version>/
│       ├── wsi/
│       ├── webhook/
│       ├── cdr/
│       └── rest/
├── config/
├── forms/
├── workflows/
└── calls/
```

Fixture header ghi source (`synthetic` hoặc sandbox capture đã anonymize), PortSIP/build/schema version, captured date, redaction method, expected canonical result và owner. Không commit token, credential, real phone, contact note hoặc recording.

Golden call/attempt/config/access/workflow cases chi tiết nằm trong [Discovery/PoC](04-DISCOVERY-POC.md). Khi fix production incident, thêm minimal anonymized regression fixture trước khi đóng incident.

## 8. Debug workflow chuẩn

### 8.1 Sáu bước

1. **Xác nhận impact và safety:** tenant/environment, đang có active call/dial/config change không; cần pause/kill switch hay chỉ quan sát.
2. **Lấy identifiers:** UTC time range, request/trace/correlation ID, interaction/attempt/job/config/workflow ID, app tenant; không yêu cầu người dùng gửi secret.
3. **Xác định owner plane:** browser/SDK, BFF/policy, domain/database, event/worker, PortSIP PBX/trunk hoặc CRM/IdP.
4. **Dựng timeline:** command → audit/policy decision → domain state → outbox → adapter request → vendor event/CDR → projection/UI.
5. **So source of truth:** PortSIP cho call/session/CDR/trunk effective state; app cho campaign/attempt/config draft/workflow; CRM theo D-004 cho contact/case.
6. **Chọn recovery an toàn:** reconcile/replay projection/requeue idempotent job/publish compatible version/compensating workflow. Ghi evidence và regression test.

Không bắt đầu bằng restart toàn bộ service. Restart có thể xóa evidence, làm lease chuyển node hoặc kích hoạt retry.

### 8.2 Evidence bundle

```text
Environment:
UTC start/end:
Tenant ID:
Subject/service ID:
Request/trace/correlation IDs:
Resource IDs and versions:
Expected / actual:
Last known good:
Policy decision + version + obligations:
Domain state / row_version:
Outbox/inbox/job state:
Adapter request outcome (redacted):
PortSIP session/CDR/reference:
Config/schema/workflow versions:
User-visible error + correlation ID:
Actions already taken:
Safety action / kill switch:
Owner and next update:
```

## 9. Runbooks theo triệu chứng

### 9.1 Không screen-pop hoặc realtime stale

1. Xác nhận SDK có call event và browser connection còn sống.
2. Tra raw adapter inbox bằng PortSIP session/call ID.
3. Kiểm tra event normalization, outbox publish và Realtime Gateway lag.
4. Kiểm tra PDP decision, matched scope, field obligations và subscription version.
5. So interaction projection với PortSIP REST/CDR snapshot.
6. Nếu event gap: chạy scoped reconciliation theo exact interaction/tenant; không replay toàn tenant trước approval.
7. Thêm fixture cho payload/gap vừa gặp.

### 9.2 Outbound attempt kẹt `dispatch_pending` hoặc `reconcile_pending`

1. Pause cấp attempt mới cho campaign nếu duplicate-call risk chưa rõ.
2. Tìm theo `attempt_id`, idempotency key hash và time window trong adapter evidence.
3. Tra WSI/webhook/session/CDR PortSIP trước khi phát command khác.
4. Nếu tìm thấy session, link canonical mapping và tiếp tục FSM idempotently.
5. Nếu chứng minh không có session sau approved reconciliation window, chuyển state bằng recovery command có approval/audit; không sửa row trực tiếp.
6. Nếu chưa chứng minh được, tạo manual task; không dial lại.

### 9.3 Event có nhưng thiếu/sai CDR

1. Chờ readiness window đã đo, không dùng hard-coded giả định.
2. So correlation keys nguyên bản: `session_id`, `call_id`, `cdr_id`, extension, timestamps.
3. Chạy REST/CDR reconciliation scoped.
4. Không sửa raw event; tạo correction event/versioned projection update.
5. Nếu vendor schema khác fixture, quarantine payload, cập nhật adapter mapping/contract test qua review.

### 9.4 User bị deny ngoài dự kiến

1. Không cấp role rộng để chữa cháy.
2. Lấy `reason_code`, policy version, subject membership, resource relationships, auth strength và field obligations.
3. Kiểm tra feature/entitlement availability tách khỏi permission.
4. Kiểm tra cache key/invalidation và effective time của grant.
5. Dùng policy simulator với cùng input; so expected matrix.
6. Nếu cần break-glass, theo step-up/reason/TTL/alert/hậu kiểm; không dùng shared admin.

### 9.5 Nghi ngờ scope/field leak

1. Đây là security incident; ngừng export/realtime path hoặc bật kill switch scoped nếu có.
2. Giữ audit/log evidence, không paste raw PII vào ticket/chat.
3. Kiểm tra cùng subject trên list/detail/ID/search/count/facet/realtime/export/download.
4. Revoke grant/subscription và đo propagation.
5. Security Owner quyết định notification/containment; developer không tự kết luận impact pháp lý.
6. Fix phải có matrix regression và negative side-channel tests.

### 9.6 Config/trunk apply fail hoặc drift

1. Ngừng apply tiếp; kiểm tra active calls/campaign dependencies và alternate route.
2. So approved semantic diff, PortSIP read-back và config/version/secret reference; không yêu cầu plaintext secret.
3. Nếu partial apply, theo compensating workflow dependency order; rollback không được gọi là atomic.
4. Credential rollback chỉ dùng retained vault version còn hợp lệ; nếu carrier không chấp nhận, chuyển manual/vendor-assisted recovery.
5. Giữ failed resource disabled nếu có thể, chạy synthetic test trước activate.
6. Audit actor/approver/executor, responses đã redact và result từng step.

### 9.7 Workflow/timer kẹt

1. Xác nhận workflow instance/version, current state, pending transition và timer/job lease.
2. Kiểm tra handler/action version, policy decision, idempotency record, retry/DLQ và last heartbeat.
3. Lease expiry không tự chứng minh action chưa chạy; với unknown non-idempotent result vào reconcile/manual.
4. Không chuyển instance sang workflow version mới trực tiếp; migration cần mapping/dry-run/approval.
5. Recovery dùng registered admin command tạo transition log/audit, không `UPDATE` row bằng tay.

### 9.8 Custom field/form lỗi sau publish

1. Pin record, form và schema versions liên quan.
2. So frontend manifest với backend validation artifact/checksum.
3. Kiểm tra field capability/classification và conditional rule trace.
4. Không đổi published schema; tạo compatible version/rollback publication.
5. Type migration/backfill cần dry-run và render test cho record cũ.

## 10. Logging và observability

Structured log tối thiểu:

```json
{
  "timestamp": "2026-09-08T02:15:30.123Z",
  "level": "info",
  "service": "worker",
  "executing_service_id": "dialer-worker",
  "module": "campaign",
  "message": "dial attempt moved to reconcile_pending",
  "app_tenant_id": "tenant-id",
  "request_id": "req-id",
  "trace_id": "trace-id",
  "correlation_id": "corr-id",
  "aggregate_type": "dial_attempt",
  "aggregate_id": "attempt-id",
  "aggregate_version": 4,
  "reason_code": "portsip.create_call.unknown_result"
}
```

MUST NOT log token, password, secret reference resolution, raw phone/email/note, recording URL hoặc full vendor payload. Metric label không dùng tenant/user/resource ID cardinality cao; chi tiết để trong masked log/trace.

Dashboard/alert tối thiểu theo [kiến trúc tích hợp](03-KIEN-TRUC-TICH-HOP.md): REST/WSI/webhook, event lag/DLQ, reconciliation, policy deny/cache invalidation, realtime revoke, config drift, workflow/timer/job, adapter health, dialer/CPS/concurrency và screen-pop.

## 11. Failure injection an toàn

Trong CI/local/sandbox, test có kiểm soát:

- REST timeout trước/sau fake provider accept.
- Duplicate/reordered/missing WSI event.
- Worker kill trước/giữa/sau commit.
- Redis unavailable/stale cache.
- PostgreSQL transaction rollback/deadlock retry.
- PDP/PIP unavailable và delayed invalidation.
- CRM/IdP latency/outage.
- Timer lease transfer, clock/timezone/DST boundary.
- Trunk test failure/read-back mismatch trên stub hoặc approved test resource.

Không fault-inject production nếu chưa có change record, blast-radius limit, abort condition, owner và rollback.

## 12. Incident và escalation

| Mức | Ví dụ | Hành động junior |
|---|---|---|
| Sev-1 | Mất thoại diện rộng, cross-tenant/PII leak, uncontrolled outbound, mất dữ liệu | Dừng thao tác; báo on-call/Security/Telephony ngay; thu identifiers; thực hiện kill switch chỉ theo runbook |
| Sev-2 | Core workflow diện rộng lỗi, config/trunk partial failure, nhiều attempts kẹt | Báo owner; pause affected scope; không retry side effect; dựng evidence bundle |
| Sev-3 | Một tenant/team/feature lỗi có workaround | Ghi ticket + correlation; tạo reproduction/fixture; xử lý theo sprint/on-call policy |

Junior MUST escalate trước khi:

- chạy production migration/backfill/replay;
- rotate secret hoặc apply/rollback trunk/routing;
- dùng break-glass;
- thay policy, DNC/consent/caller-ID/carrier limit;
- resolve unknown external side effect;
- purge data/audit/recording;
- mở outbound network hoặc production connector từ sandbox;
- thấy dấu hiệu cross-tenant, secret hoặc PII leak.

Escalate không có nghĩa ngừng điều tra: tiếp tục thu read-only evidence, timeline và test reproduction trong phạm vi an toàn.

## 13. Release verification

### Trước merge

- [ ] Acceptance và threat/failure cases được chuyển thành test.
- [ ] Unit/component/contract/architecture tests phù hợp chạy xanh.
- [ ] Permission/field/export/realtime negative cases chạy xanh nếu liên quan.
- [ ] Migration N-1/backfill plan và feature/kill switch được kiểm tra.
- [ ] Không secret/PII trong code, fixture, log snapshot hoặc artifact.
- [ ] Runbook/dashboard/alert cập nhật nếu behavior vận hành đổi.

### Trước deploy

- [ ] Artifact immutable, config/version/checksum và migration order được ghi.
- [ ] Dependency/PortSIP exact-version compatibility có evidence.
- [ ] Canary/maintenance/drain/rollback owner và abort threshold rõ.
- [ ] Pending job/workflow/active call behavior qua deploy đã test.
- [ ] On-call biết correlation/dashboard/runbook liên quan.

### Sau deploy

- [ ] Health/readiness và synthetic read-only/test-number checks đạt.
- [ ] Error/latency/event lag/policy deny/config drift/timer lag không bất thường.
- [ ] Golden transaction có end-to-end correlation và audit.
- [ ] Không mở rộng rollout trước observation window.
- [ ] Nếu rollback, xác nhận schema/event/app compatibility; không chỉ rollback binary.

## 14. Mẫu test evidence

```text
Story/PR:
Risk class:
Environment/build/config versions:
Test run ID:
Dataset/fixture versions:
Cases executed:
Expected vs actual:
Authorization matrix result:
External side effects count:
Migration/compatibility result:
Performance/resilience result:
Logs/traces/screenshots location (redacted):
Known gaps/waivers + ADR/owner/expiry:
Reviewer/sign-off:
```

## 15. Bài tập onboarding bắt buộc cho junior

Sau khi scaffold tồn tại, junior hoàn thành trong local/CI, không đụng sandbox thật nếu chưa được cấp quyền:

1. Chạy toàn bộ Build Profile và giải thích web/API/worker/database/outbox vai trò gì.
2. Thêm một read-only field vào response bằng additive contract + test.
3. Viết một negative test chứng minh guessed object ID ngoài scope không lộ tồn tại.
4. Gửi cùng event hai lần và chứng minh projection chỉ cập nhật một lần.
5. Tạo config override ở tenant/campaign và giải thích effective resolution chain.
6. Publish custom field/form bản mới, render record cũ và rollback publication.
7. Cho timer worker restart giữa chừng và chứng minh một logical outcome.
8. Dùng fake PortSIP adapter tạo `unknown` result và đưa attempt vào `reconcile_pending` mà không gọi lại.
9. Dựng evidence bundle từ một test failure và chỉ ra owner module.
10. Mở một PR nhỏ đạt checklist/Definition of Done và được reviewer sign-off.

Tech Lead xác nhận onboarding bằng evidence, không chỉ bằng việc junior đã “đọc tài liệu”.
