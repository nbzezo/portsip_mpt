# Outbound MVP và SIP Trunk Admin UI

## 1. Kết luận đề xuất

Giai đoạn hiện tại chuyển từ inbound-first sang **voice blended inbound + outbound**. P0 outbound gồm:

- manual/click-to-call;
- preview campaign;
- progressive 1:1: chỉ dial sau khi reserve đúng một agent `Ready`;
- “power-safe” nếu dùng tên này chỉ là auto-next tuần tự với effective dial ratio `≤1,0`.

Tại mỗi quyết định dispatch, `effective dial ratio = số attempt mới được dispatch / số reservation agent hợp lệ, độc quyền và ánh xạ 1:1 cho chính các attempt đó`. `0/0 = 0`; nếu attempt `>0` nhưng reservation hợp lệ `=0`, hoặc chỉ một phần attempt có mapping 1:1, đó là invariant breach: dừng dispatch mới, phát alert/kill switch và đưa attempt liên quan vào reconciliation. Không loại attempt lỗi khỏi tử số để làm đẹp chỉ số.

Multi-line power `>1`, predictive dialing và answering-machine detection (AMD) không thuộc P0. Tài liệu PortSIP công khai chứng minh năng lực call control/session, trunk, outbound rule, event và CDR, nhưng chưa đủ để cam kết native campaign/pacing/predictive/AMD. Các năng lực campaign phải do Portsip CC sở hữu và chỉ dùng PortSIP để thực thi cuộc gọi.

**Có thể đưa cấu hình đối nối SIP trunk/DID lên giao diện Portsip CC.** P0 write gồm tenant-owned trunk type/DID-pool assignment mà exact PortSIP role/API cho phép và tenant-scope inbound/outbound rules. System/shared/IP-based trunk object cùng DID-pool assignment mặc định read-only/deep-link cho PortSIP System Admin; tenant rule vẫn có thể tham chiếu trunk đã được System Admin gán nếu exact contract cho phép. Chỉ mở write vào chính privileged trunk sau risk approval với dedicated service principal. Mọi write đi qua backend, có least privilege, semantic validation, preview diff, approval, read-back, test call, audit và rollback snapshot. Không đưa global SIP transport/listening port, SBC, firewall, certificate hoặc raw advanced routing cho tenant admin trong MVP.

Đây vẫn là planning hypothesis. Chỉ ký build sau khi PoC trên exact PBX v22.6.3 chứng minh endpoint, schema, permission, secret behavior và failure semantics; public REST reference hiện ở v22.3.

## 2. Ranh giới P0

| Năng lực | P0 | Không thuộc P0 |
|---|---|---|
| Chế độ gọi | Manual, preview, progressive 1:1 | Multi-line power, predictive, agentless/robocall |
| Máy trả lời | Agent chọn disposition `Voicemail` | AMD tự động |
| Campaign | Lifecycle, list, compliance, retry/callback, script, pacing, dashboard | AI optimization, adaptive/predictive pacing |
| Dữ liệu | Một CRM connector, CSV/API import, E.164/dedupe | Data marketplace hoặc nhiều connector phức tạp |
| Trunk UI | Tenant-owned trunk/DID-pool write; tenant rules được tham chiếu assigned system/shared trunk nếu exact contract cho phép | System/shared/IP-based trunk object/DID-pool write mặc định; global transport, SBC, firewall, certificate, raw advanced routing |
| Routing khác | Read-only/deep-link | Queue/skill/IVR/recording policy write |
| Kênh | Voice inbound + outbound | SMS/WhatsApp/email/webchat |

## 3. Tính năng outbound P0

### 3.1 Campaign lifecycle

- Trạng thái `Draft → Published/Scheduled → Active ↔ Paused → Completed/Stopped`.
- Tên, mục đích gọi, owner, team/skill, start/end window, priority, daily quota và campaign timezone.
- Publish tạo immutable snapshot cho list schema, script, disposition, compliance, caller ID, retry và pacing policy.
- Form preview/disposition, script, option set và retry/pacing parameters lấy từ versioned Metadata/Config Registry; operator chỉ chọn field/action/strategy trong allowlist và luôn preview theo role/scope trước publish.
- Pause/resume/stop có reason; emergency stop chặn dispatch mới trong proposed target `≤5 giây`, không cắt active call.
- Clone/version campaign thay vì sửa policy đã publish tại chỗ.

### 3.2 List ingestion và eligibility

- CSV và authenticated API import; dry-run trước commit, mapping cột, encoding/locale và downloadable error report.
- Chuẩn hóa E.164, validate số, dedupe theo tenant/campaign/purpose và import idempotency key.
- Consent có source/provenance, purpose, captured time, expiry, market và evidence reference.
- Global/campaign suppression và regulatory DNC; PortSIP blacklist chỉ là defense-in-depth, không phải regulatory master.
- Contact timezone dùng IANA zone; xử lý DST. Unknown timezone fail closed hoặc vào review queue theo policy đã duyệt.
- Eligibility được tính khi lên lịch và **kiểm tra lại ngay trước dispatch**.

### 3.3 Agent experience

- Preview card: hồ sơ, mục đích, script version, consent state, lịch sử attempts, local time và warning.
- Agent có `Dial`, `Skip + reason`, `Reschedule/Callback`; không được sửa trực tiếp caller ID hoặc vượt policy.
- Progressive 1:1 chỉ dial khi reservation của agent `Ready` còn hiệu lực; stale state giải phóng reservation và không quay số.
- Call controls, note, case, disposition, right-party contact và conversion nằm trong cùng workspace.
- Disposition bắt buộc trước khi agent trở lại pool nếu policy bật.

### 3.4 Retry, callback và pacing

- Retry matrix riêng cho `busy`, `no_answer`, `technical_failure`, `wrong_number`, `voicemail_agent_selected`, `right_party`, `do_not_call` và unknown result.
- Mỗi outcome có cooldown, max attempts/day, max total attempts và terminal behavior.
- Unknown dispatch result chuyển `reconcile_pending`; không phát lại cho đến khi đã tra session/CDR.
- Callback có requested time, timezone, owner, SLA, priority và conflict rule; phân biệt với PortSIP queue callback.
- Giới hạn provider/trunk/tenant/campaign CPS và concurrency; token-bucket/leaky-bucket implementation phải có deterministic tests.
- Blended protection tự pause outbound khi inbound queue depth, longest wait hoặc SLA breach vượt ngưỡng; resume dùng cooldown/hysteresis.

### 3.5 Caller ID và báo cáo

- Agent/campaign chỉ chọn `caller_id_profile` từ DID pool đã chứng minh quyền sở hữu/được carrier cho phép.
- Outbound rule quyết định trunk, strip/prepend và header/caller ID theo contract; không cho nhập Caller ID tùy ý.
- `Attempted/Dispatch Requested` là lúc command đã gửi tới PortSIP Adapter; `PBX Accepted` chỉ khi PortSIP xác nhận một call session. Hai KPI không được gộp.
- Dashboard phân biệt rõ: `loaded`, `eligible`, `suppressed`, `attempted`, `PBX accepted`, `SIP answered`, `right-party contact`, `conversion`, `busy`, `no-answer`, `callback`, `retry exhausted` và `dialer abandonment`.
- Không dùng `SIP answered` làm proxy cho right-party contact hoặc conversion.

## 4. Kiến trúc outbound

### Phân định ownership

| Portsip CC sở hữu | PortSIP sở hữu |
|---|---|
| Campaign/list/policy/script/disposition | SIP registration/media |
| Consent/DNC/suppression/timezone | Provider/trunk và outbound routing |
| Agent/contact reservation và pacing | Call session/legs và signaling result |
| Retry/callback scheduler | CDR và recording gốc |
| Logical `dial_attempt` và reporting funnel | WSI/webhook/REST telephony events |

### Luồng bền vững

1. Eligibility Worker chọn contact và recheck compliance.
2. Dialer Orchestrator transactionally reserve contact + agent, tạo `dial_attempt` và outbox record.
3. Preview chờ agent xác nhận; progressive xác minh reservation/health/pacing rồi phát command.
4. PoC quyết định SDK agent-originated hay authenticated Call Control API. Browser không giữ campaign scheduler, extension password hoặc PortSIP admin token.
5. Adapter gắn opaque `attempt_id` vào vendor correlation field đã contract-test; không ghi PII.
6. WSI/webhook/CDR cập nhật attempt và interaction. Mọi event xử lý idempotent, out-of-order safe và có reconciliation.
7. Disposition kết thúc ACW; retry/callback engine tính next action theo policy snapshot.

Các aggregate tối thiểu: `campaign`, `campaign_version`, `campaign_list`, `campaign_member`, `consent_record`, `suppression_entry`, `dial_policy`, `agent_reservation`, `dial_attempt`, `dial_attempt_event`, `scheduled_callback`, `caller_id_profile`.

## 5. Information architecture cho SIP Trunk Admin UI

Đề xuất menu `Admin → Telephony`:

1. **Trunks** — danh sách, enabled/status, auth/transport, host, DID count, last sync/test và drift.
2. **Numbers (DID)** — inventory hợp nhất từ provider + inbound rules; owner/trunk, routing destination, caller-ID eligibility và conflict.
3. **Inbound Routing** — DID/CID → destination theo office/non-office/holiday.
4. **Outbound Routing** — prefix/length/group → ordered/random trunk routes, number transform và caller ID.
5. **Change Requests** — draft, diff, approval, execution/test, rollback và audit history.
6. **Health** — read-only registration/status nếu API hỗ trợ, synthetic test result, CDR/event lag và drift.

### 5.1 Trunk wizard

| Bước | Trường/kiểm tra chính |
|---|---|
| Identity | Name, brand/provider template, environment, enabled mặc định `false` |
| Authentication/ownership | Tenant-owned `REGISTER_AUTH` và `ACCEPT_REGISTER` chỉ khi exact role/API cho phép. `IP_AUTH` hoặc shared trunk là System-Admin-only/read-only-deep-link mặc định; Teams/WhatsApp loại khỏi SIP voice wizard |
| Network | UDP/TCP/TLS, hostname/IP, port, outbound server/proxy; chỉ show field có trong exact schema |
| Credential | Auth ID, username, password write-only; rotate riêng, không hiển thị lại plaintext |
| Numbers | DID/range import, normalization, duplicate/ownership validation, caller-ID eligibility |
| Routing defaults | Inbound fallback, outbound profile/rule association; emergency/premium prefixes được bảo vệ |
| Review | Semantic diff, affected routes/DIDs/groups, risk, approval và maintenance window |
| Verify | Apply disabled, GET read-back, status/registration signal nếu có, synthetic inbound/outbound call, activate |

Không gọi trạng thái là “Connected” chỉ vì API write trả 2xx. Nếu PortSIP không có endpoint test/status đủ tin cậy, UI phải hiển thị riêng `Configured`, `Read-back matched`, `Registration unknown/registered` và `Synthetic call passed/failed`.

### 5.2 DID inventory và inbound rule

P0 coi DID inventory là read model của Portsip CC tổng hợp từ provider/trunk và inbound rules; không giả định public API có một DID resource độc lập. DID-pool assignment trên system/shared/IP-based trunk là read-only, nhưng tenant-scope inbound rule có thể dùng số trong pool đã được System Admin gán nếu exact role/API cho phép.

Các trường documented cần ánh xạ sau contract test:

- rule name, enabled và usage;
- trunk/provider ID;
- DID/DDI hoặc range, CID number mask;
- office-hours, non-office-hours và holiday forward destination;
- office hours/holiday references;
- recording disclaimer;
- advanced routing: read-only/deep-link ở P0 trừ khi schema và validation an toàn được chứng minh.

Validation bắt buộc: duplicate/overlap DID, invalid range, destination missing/deleted, cross-tenant reference, after-hours loop và recording-notice policy.

### 5.3 Outbound rule

Các trường documented cần ánh xạ sau contract test:

- rule name, enabled, priority;
- number prefix và number length;
- allowed extension mask/user groups;
- office hours/holidays;
- routing strategy `PRIORITIZED` hoặc `RANDOMLY`;
- từng route: provider ID, enabled, strip digits, prepend và outbound caller ID.

Validation bắt buộc: prefix/length overlap và shadowing theo priority, empty route, provider disabled, transform tạo số không hợp lệ, group vượt scope, caller ID ngoài DID allowlist, emergency/premium bypass và loop/fallback.

## 6. REST mapping và giới hạn bằng chứng

| UI capability | PortSIP REST surface công khai | P0 action | Gate/cảnh báo |
|---|---|---|---|
| Trunks | `/api/providers`, `/api/providers/{id}` | Tenant-owned eligible type: list/get/create/update; delete sau dependency check. System/shared/IP-based: read-only/deep-link mặc định | Public schema cho thấy auth mode, UDP/TCP/TLS, host/port, credential, outbound server và DID fields; xác minh role/ownership trên v22.6.3 |
| Inbound rules | `/api/inbound_rules`, `/{id}`, `/{id}/destroy`, `/export` | Tenant-scope list/get/create/update; có thể reference assigned trunk; guarded delete/export | Cần có provider trước; v22.3 permission `PhoneSystem.FullAccess`; PoC chứng minh tenant/resource scope |
| Outbound rules | `/api/outbound_rules`, `/{id}`, `/{id}/destroy`, `/export`, applied-groups | Tenant-scope list/get/create/update/group mapping; có thể reference assigned trunk; guarded delete/export | v22.3 permission `PhoneSystem.FullAccess`; PoC chứng minh scope và app validate precedence/conflict |
| Call execution | Call Control API hoặc SDK | Manual/preview/progressive theo topology PoC | Xác minh authentication, correlation field, lookup và unknown-result recovery |
| Status/test | Provider/session/event/CDR surfaces tùy exact contract | Read-back + status signal + synthetic test call | Không cam kết có một native “test trunk” endpoint trước PoC |

PortSIP vẫn là source of truth cho effective telephony configuration. Portsip CC lưu desired-state draft, immutable secret-version reference, before/after snapshot không chứa plaintext và change evidence; drift detector so read-back với approved snapshot.

Telephony Admin dùng chung Policy Service và Configuration Registry của nền tảng. UI có thể render field/config từ adapter capability + typed schema, nhưng trunk/routing vẫn dùng wizard chuyên biệt, domain validation và approved action registry; không hiển thị raw vendor JSON. Màn hình luôn cho biết effective value, nguồn kế thừa, policy scope và object nào bị ảnh hưởng trước khi publish/apply.

## 7. Security, authorization và audit

### Vai trò đề xuất

Role chỉ là template capability; quyền thực tế còn phụ thuộc tenant, business-unit/team, trunk/DID/campaign relationship, field obligation và thời hạn grant. Quyền màn hình chỉ giúp điều hướng, không thay cho kiểm tra backend. Capability tối thiểu tách `view`, `draft`, `approve`, `apply`, `rotate_secret`, `enable_disable`, `delete`, `export`, `play_recording` và `download_recording`.

| Vai trò | Quyền |
|---|---|
| Telephony Viewer | Xem masked config, DID/rules, health và change history |
| Config Editor | Tạo/sửa/validate draft; không apply production hoặc đọc secret |
| Config Approver | Approve/reject production change; không approve draft do chính mình tạo khi maker-checker bật |
| Config Executor | Backend-controlled apply/test/rollback; không phải browser-held PortSIP credential |
| PortSIP System Trunk Operator | Ngoài tenant-admin P0; quản lý system/shared/IP-based trunk qua Portal hoặc privileged workflow đã risk-approve |
| Campaign Manager | Quản lý campaign/list/policy trong relationship scope được grant; không sửa trunk/rule production |
| Compliance Admin | DNC/consent/suppression/market policy và audited override |

### Kiểm soát bắt buộc

- Browser chỉ gọi BFF bằng user session; PortSIP bearer/service credential ở secret manager và chỉ PortSIP Adapter đọc được.
- Capability PortSIP rộng được thu hẹp bằng app RBAC, tenant/resource/trunk-ownership allowlist và server-side policy; không forward endpoint/JSON tùy ý. Privileged System Admin service principal phải tách khỏi tenant adapter nếu sau này được duyệt.
- PEP kiểm tra lại tại API/command handler, object query, realtime subscription/fan-out, report/search/count, export request/job/download, recording gateway, worker và ngay trước privileged PortSIP command. Không query rộng rồi lọc ở browser hoặc memory.
- DID/contact phone có policy `hide/mask/unmask/edit/export`; recording tách `play` khỏi `download`. Cùng authorized universe phải áp dụng cho list/detail/search/count/dashboard/realtime/export để không rò dữ liệu gián tiếp.
- Password là write-only; API response/log/audit/snapshot không chứa plaintext. Vault lưu secret theo immutable version với access audit và retention tối thiểu bằng approved rollback window; config snapshot chỉ giữ secret-version reference. Rotation có step-up auth và không dùng masked placeholder làm password mới.
- Production change có reason, ticket/reference, actor, approver, timestamp, before/after semantic diff, PortSIP resource IDs, response hash và test evidence.
- Export, secret rotate, enable/disable, delete và rollback đều có scope riêng; rate limit và alert bất thường.
- CSRF, SSRF/hostname allowlist, command injection, cross-tenant object reference và webhook spoof/replay nằm trong security tests.

## 8. Apply, test và rollback policy

1. **Draft** từ snapshot mới nhất; báo drift trước khi sửa.
2. **Validate** client-side để hỗ trợ UX và bắt buộc server-side để quyết định.
3. **Preview diff/impact** theo semantic field, không chỉ JSON text.
4. **Preflight/Approve**: kiểm tra trunk ownership, active calls, campaign/rule dependencies, alternate route và capacity. Production mặc định maker-checker và step-up auth.
5. **Drain/Apply disabled**: pause campaign liên quan, chặn dispatch mới và chờ active calls drain hoặc dùng approved maintenance override; sau đó apply theo dependency order trunk → inbound/outbound rules → group association. Nếu endpoint không cho disabled create, phải có maintenance/fallback plan đã phê duyệt.
6. **Read-back** từng resource và so desired/effective state.
7. **Test** registration/status khi có, sau đó synthetic inbound và outbound call qua test numbers.
8. **Activate** theo order đã PoC; quan sát signaling/CDR trong verification window.
9. **Rollback** bằng re-apply snapshot đã xác minh. Credential rollback chỉ tự động khi snapshot trỏ tới một vault secret version còn retention, quyền truy cập hợp lệ và carrier vẫn chấp nhận credential cũ; nếu không, chuyển manual/vendor-assisted recovery với credential mới. Vì REST không cung cấp transaction xuyên nhiều resource, rollback là compensating workflow, không được quảng bá là atomic.

Luồng trên là một specialization của lifecycle cấu hình chung `draft → validate → simulate/test → approve → publish/apply → monitor → supersede/rollback`. Call/session/dial-attempt integrity, DNC/consent fail-closed, tenant isolation và secret boundary không được workflow/config động ghi đè.

Hard delete không phải rollback mặc định. Resource đang có active call hoặc được rule/DID/campaign sử dụng phải bị chặn xóa; chỉ tiếp tục sau drain và explicit dependency migration/alternate-route plan.

## 9. Acceptance criteria P0

### Outbound

- 0 attempt tới DNC/suppressed, consent không hợp lệ hoặc ngoài allowed window trong UAT/pilot.
- 100% attempt recheck compliance ngay trước dispatch; dependency unavailable thì fail closed.
- Progressive không dial khi chưa reserve đúng một agent Ready; 0 answered call thiếu agent trong mode 1:1.
- Worker crash/retry không tạo hai PBX sessions được chấp nhận cho cùng logical attempt.
- Pause/stop chặn request mới trong proposed target `≤5 giây`; active call hoàn tất bình thường.
- Không vượt provider/trunk/tenant/campaign CPS/concurrency đã cấu hình.
- Caller ID luôn thuộc allowlist/DID pool và khớp CDR.
- 100% golden attempts được PBX accept liên kết được campaign/contact/agent/attempt/session/CDR; blocked attempts có policy reason + audit và 0 PBX session.
- Inbound protection auto-pause/resume có hysteresis; mixed-load đạt inbound target đã duyệt.
- Báo cáo phân biệt SIP answered, right-party contact và conversion.

### SIP trunk/DID/rules

- Trunk/rule tạo ở disabled state khi contract hỗ trợ; read-back bằng desired snapshot trước activation.
- Duplicate/overlap DID, prefix shadowing, invalid transform, disabled provider và caller ID ngoài allowlist đều bị chặn hoặc cảnh báo bắt buộc phê duyệt theo policy.
- Secret plaintext không xuất hiện trong browser response, logs, traces, audit export hoặc snapshot; snapshot chỉ có immutable vault secret-version reference và rollback-window metadata.
- Không tenant admin nào gọi được raw PortSIP endpoint hay global transport/SBC/firewall/certificate operation.
- Mọi production change truy vết đủ actor/approver/reason/before-after/resource/test result.
- Synthetic inbound/outbound test pass trước activation; failed test giữ resource disabled và đưa workflow về `failed`.
- Rollback drill khôi phục routing của golden numbers; credential rollback kiểm thử cả nhánh retained-secret và manual recovery; drift không tự ghi đè ngoài approval.
- Disable/update/delete bị chặn khi còn active call hoặc campaign dependency nếu chưa drain/chuyển alternate route theo approved plan.
- Direct API/deep link vẫn bị deny khi menu bị ẩn; revoke scoped grant phải chặn cả request mới và realtime subscription trong SLO đã duyệt.
- Effective-access/config preview cho thấy đúng role, resource scope, field masking, source kế thừa và pending change trước publish/apply.

## 10. Delivery impact

ROM cũ 18 tuần không còn phù hợp với scope mới.

| Phương án | ROM | Điều kiện |
|---|---:|---|
| Baseline đầy đủ P0 | 28–32 tuần, `±30%` | 7 core FTE + specialist part-time; gồm extensibility kernel và bounded self-service cho access/config/form/workflow |
| Tăng tốc | 26–29 tuần, `±30%` | Trên baseline, thêm +1 Platform/Backend, +1 Frontend/Admin UX và +0,5 QA/Security Automation; outbound specialist capacity vẫn phải giữ |
| Adjust để giữ 24–26 tuần | 24–26 tuần, `±30%` | P0 giữ kernel + role/config templates; chuyển self-service form/workflow editors sang P1 |
| Giữ 18 tuần | Không khuyến nghị cho full scope | Chỉ khả thi khi Release 1 là inbound + manual/preview, trunk UI chỉ read-only/deep-link; cả progressive lẫn config write sang wave sau |

Multi-line power, predictive và AMD không nằm trong các ROM trên.

Lộ trình tham chiếu:

- Tuần 1–2: expanded Discovery/PoC và Go/Adjust/Stop.
- Tuần 3–6: integration hardening và exact-version contracts.
- Tuần 4–10: platform/extensibility, authorization, config/schema/workflow kernel và campaign/list/compliance foundation.
- Tuần 7–14: Agent + inbound/manual/preview.
- Tuần 10–19: progressive 1:1 + trunk/DID/rule Admin UI.
- Tuần 12–22: scoped access, Config Studio, custom field/form và bounded workflow editor.
- Tuần 16–22: blended supervisor/reporting.
- Tuần 23–29: security/load/resilience/usability/UAT/pilot.
- Tuần 30–32: rollout/hypercare; phương án tăng tốc kết thúc tuần 26–29 sau re-baseline.

## 11. Day-10 Go/Adjust/Stop evidence

Để `Go`, evidence pack phải có:

- exact PortSIP PBX/SBC/SDK/OpenAPI/license/version matrix;
- một inbound golden call và một manual/preview/progressive 1:1 golden attempt;
- proof reservation/idempotency/correlation và unknown-result reconciliation;
- DNC/timezone/DST/caller-ID/CPS/concurrency negative tests;
- trunk + inbound/outbound rule draft/apply-disabled nếu endpoint hỗ trợ, nếu không maintenance/fallback/read-back/test/activate/rollback demo;
- permission matrix, secret masking và audit proof;
- một scoped authorization/config/form/workflow thin slice: direct API/realtime/export bị chặn, custom field/form publish không deploy, effective setting resolve đúng, timer sống qua restart và rollback/version giữ được dữ liệu cũ;
- carrier/Legal approval hoặc explicit conditions;
- revised capacity, staffing, TCO và ROM.

Chọn `Adjust` nếu chỉ manual/preview hoặc read-only/deep-link trunk UI đạt; có thể chuyển một phần scope sang wave sau và re-estimate. Riêng phương án giữ 18 tuần phải chuyển **cả** progressive lẫn config write. Chọn `Stop/đánh giá lại` nếu không bảo đảm idempotency, tenant isolation, secret safety, regulatory controls hoặc exact-version API/license contract.

## 12. Liên kết tài liệu

- [Kế hoạch tổng thể](01-KE-HOACH-TRIEN-KHAI.md)
- [Feature catalog](02-DANH-MUC-TINH-NANG.md)
- [Kiến trúc tích hợp](03-KIEN-TRUC-TICH-HOP.md)
- [Discovery/PoC checklist](04-DISCOVERY-POC.md)
- [Nguồn PortSIP](05-NGUON-THAM-KHAO.md)
- [Decision register](06-DECISION-REGISTER.md)
- [Nền tảng mở rộng, phân quyền và cấu hình động](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md)
