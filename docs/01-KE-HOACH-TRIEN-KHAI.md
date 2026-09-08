# Kế hoạch triển khai Portsip CC

## 1. Tóm tắt điều hành

Mục tiêu là xây dựng một Contact Center có giao diện và dữ liệu nghiệp vụ riêng, sử dụng PortSIP PBX v22.x và PortSIP VoIP/WebRTC SDK làm lõi truyền thông. Cách tiếp cận ưu tiên tái sử dụng các năng lực PortSIP đã có thay vì xây lại SIP/media, ACD, recording hay CDR.

MVP tập trung vào kênh voice blended inbound + outbound và bốn vai trò chính:

- Agent xử lý cuộc gọi trên trình duyệt, xem hồ sơ khách hàng, ghi chú và disposition trong cùng một màn hình.
- Supervisor theo dõi queue/agent theo thời gian thực, hỗ trợ monitor/whisper/barge theo quyền và xem KPI vận hành.
- Campaign Manager quản lý danh sách, consent/DNC, preview/progressive 1:1, pacing, retry/callback và hiệu quả chiến dịch.
- Administrator quản lý ánh xạ người dùng, quyền, cấu hình nghiệp vụ, tình trạng tích hợp và cấu hình có kiểm soát cho trunk/DID/inbound-outbound rules.

Khuyến nghị hiện tại là **chỉ Go cho Discovery/PoC 10 ngày**, chưa phê duyệt toàn bộ build. Scope mới làm mốc 18 tuần cũ không còn đáng tin cậy. Với extensibility kernel và bounded self-service thuộc P0, ROM là `28–32 tuần ±30%` với 7 core FTE cộng 1,75–2,25 specialist FTE-equivalent ở peak. Có thể rút còn `26–29 tuần ±30%` nếu bổ sung 1 Platform/Backend Engineer, 1 Frontend/Admin UX Engineer và 0,5 QA/Security Automation. Mốc `24–26 tuần ±30%` chỉ là phương án `Adjust`: giữ kernel + role/config templates trong P0 nhưng chuyển visual/self-service form và workflow builders sang P1. Chỉ sau khi chốt quy mô đồng thời, carrier limits, CRM/IdP, thị trường/tuân thủ, mô hình triển khai, exact PortSIP/SDK/license và mức self-service bắt buộc mới được lập delivery baseline.

Quy ước trạng thái trong tài liệu:

- `Hypothesis`: giả định để có thể lập kế hoạch; thay đổi sẽ kéo theo re-estimate.
- `Proposed target`: ngưỡng thiết kế ban đầu, chưa phải SLO/SLA được phê duyệt.
- `Verified`: đã có bằng chứng từ sandbox/test hoặc văn bản vendor.
- `Approved`: đã có owner nghiệp vụ/kỹ thuật phê duyệt và ghi trong [Decision register](06-DECISION-REGISTER.md).

## 2. Mục tiêu và kết quả mong đợi

### Mục tiêu sản phẩm

1. Hợp nhất thao tác thoại và xử lý nghiệp vụ trong một Agent Workspace.
2. Giảm thời gian tra cứu khách hàng, ghi chép sau cuộc gọi và chuyển tiếp xử lý.
3. Cung cấp dữ liệu queue/agent gần thời gian thực cho Supervisor.
4. Tạo interaction timeline đáng tin cậy từ sự kiện cuộc gọi, CDR và dữ liệu CRM.
5. Vận hành outbound campaign có consent/DNC, timezone, retry, caller ID và pacing kiểm soát được mà không ảnh hưởng SLA inbound.
6. Có nền tảng mở theo contract và metadata để bổ sung module, adapter, strategy, field/form, workflow/action và kênh mới mà không thay lõi thoại hoặc tạo phụ thuộc trực tiếp vào PortSIP.
7. Cho phép người vận hành tự cấu hình các setting an toàn, quyền, form và workflow nghiệp vụ qua giao diện có validate, preview/simulate, approval, version và rollback; không biến P0 thành nền tảng low-code tổng quát.

### KPI cần định nghĩa trong Discovery và baseline trong PoC/Pilot

| Nhóm | KPI | Baseline/target |
|---|---|---|
| Khách hàng | Service level, ASA, abandonment rate, queue-callback success | Discovery chốt công thức/measurement plan; đo baseline 2–4 tuần; target được duyệt trước go-live |
| Hiệu suất | AHT, ACW, transfer rate, FCR | Định nghĩa công thức và nguồn dữ liệu trước khi đặt target |
| Trải nghiệm agent | Thời gian screen-pop, số bước xử lý, lỗi lưu disposition | `Proposed target`: screen-pop P95 ≤ 2 giây, đo từ normalized offer event đến UI render |
| Tin cậy | Tỷ lệ reconcile event/CDR, command success, uptime | Target được đo trên golden calls và pilot; không coi số vendor/marketing là SLA |
| Chất lượng | Defect escape, crash-free session, audio quality | Ngưỡng chất lượng thoại được chốt bằng bài test mạng/headset thực tế |
| Outbound | Eligible, dispatch requested, PBX accepted, SIP answered, right-party contact, conversion, callback success, retry exhausted | Chốt mẫu số, outcome taxonomy và nguồn dữ liệu; không đánh đồng dispatch/PBX accept/SIP answer với đúng người cần gặp |
| Tuân thủ outbound | DNC/suppression/time-window violations, dialer abandonment | Mục tiêu P0: 0 vi phạm trong UAT/pilot và 0 answered call thiếu agent ở progressive 1:1 |

## 3. Giả định lập kế hoạch

- PortSIP PBX v22.x được triển khai và cấp license phù hợp; bản ứng viên hiện hành tại ngày khảo sát là PBX v22.6.3 + SBC v11.2.8.
- Agent Desktop dự kiến chạy trên Chrome/Edge hiện đại và dùng PortSIP VoIP/WebRTC SDK. Đây là giả định cần PoC: PortSIP công bố hỗ trợ WebRTC/JavaScript nhưng trang tải SDK hiện chưa niêm yết rõ một browser package công khai.
- MVP/go-live phục vụ đúng một đơn vị/tenant; thiết kế dữ liệu tenant-aware chỉ để tránh ngõ cụt, không bao gồm commercial multi-tenancy.
- Go-live chỉ có kênh voice nhưng là blended inbound + outbound. P0 gồm manual/click-to-call, preview campaign và progressive 1:1; multi-line power `>1`, predictive, AMD và SMS/WhatsApp là P1/P2 có gate riêng.
- Progressive 1:1 chỉ phát lệnh sau khi reserve đúng một agent `Ready`; “power-safe” nếu dùng thuật ngữ này chỉ có nghĩa auto-next tuần tự với effective dial ratio `≤1,0`.
- Consent/DNC, timezone/quiet hours, approved caller ID và carrier CPS/concurrency là điều kiện fail-closed cho mọi outbound attempt.
- Có SIP trunk và DID test, domain/certificate hợp lệ, môi trường Dev/UAT riêng.
- MVP yêu cầu một OIDC-compatible IdP và đúng một CRM connector được chọn trước khi kết thúc Discovery; không phát hành local password authentication cho production.
- PortSIP là source of truth cho call/queue/agent telephony state; CRM được chọn ở D-004 là source of truth cho contact/case; ứng dụng lưu mapping/cache và là source of truth cho interaction, note, disposition, follow-up cùng workflow riêng.
- P0 gồm extensibility kernel và bounded self-service: bốn lớp quyền, typed Configuration Registry, Config Studio, custom fields/forms giới hạn và business workflow/rule runtime dùng action đã đăng ký. Không cho operator upload plugin, chạy JavaScript/SQL/shell hoặc sửa safety-critical FSM/invariant.
- D-023/ADR-001 đã khóa Discovery scaffold: TypeScript strict, React/Vite, NestJS/Fastify, PostgreSQL/Redis và PostgreSQL outbox. Exact runtime/framework/package manager/database/migration/test toolchain nằm trong `docs/BUILD-PROFILE.md`; G0-02/G0-03 đã có artifact chạy nhưng vẫn cần independent clean-machine review trước product build.
- Không đọc/ghi trực tiếp PostgreSQL hoặc ClickHouse nội bộ của PortSIP.

## 4. Phân định Build vs. Reuse

| Năng lực | PortSIP | Portsip CC | Ghi chú |
|---|---|---|---|
| SIP registration, media, codec, TLS/SRTP | Chủ sở hữu | Tích hợp SDK | Không tự xây media stack |
| Trunk, DID, IVR, queue/ACD, routing | Chủ sở hữu | UI nghiệp vụ hoặc deep-link có chọn lọc | P0 write tenant-owned trunk/DID + tenant-scope rules; shared/IP-based trunk object/DID-pool assignment read-only, nhưng rule có thể dùng assigned trunk nếu exact contract cho phép; queue/skill/IVR ở Portal |
| PBX admin configuration | Source of truth và nơi thực thi | Draft/validate/approve/apply/read-back/audit cho scope được phép | Không sao chép global transport, SBC, firewall, certificate hay raw advanced routing vào tenant admin UI |
| Call control trên agent | Thực thi | Trải nghiệm UI + policy | Answer, hold, DTMF, transfer, conference |
| Agent/queue real-time state | Phát sinh sự kiện | Chuẩn hóa, phân quyền, hiển thị | Nhận qua WSI/WebSocket và reconcile qua REST |
| CDR/recording | Phát sinh và lưu gốc | Liên kết interaction, retention workflow | Dùng `session_id`/`call_id` để tương quan |
| Contact và case/ticket | Không phải lõi chính | UX + mapping/cache/read model | CRM được chọn ở D-004 là source of truth; sync qua adapter |
| Interaction, note, disposition, follow-up | Không phải lõi chính | Chủ sở hữu | Portsip CC lưu workflow nghiệp vụ và liên kết CRM/PortSIP IDs |
| Wallboard/report thoại | Có sẵn | Tái sử dụng trước; mở rộng báo cáo hợp nhất | Cross-channel/FCR cần dữ liệu ứng dụng |
| Audit nghiệp vụ | Một phần | Chủ sở hữu | Bao gồm mọi thao tác nhạy cảm và supervisor action |
| AI/QA/WFM | Có một phần hoặc tùy chọn | Mở rộng theo roadmap | Không đưa vào critical path của MVP |

## 5. Phạm vi MVP

### Trong phạm vi

- Đăng nhập SSO/OIDC và ánh xạ user ↔ PortSIP extension. Tài khoản nội bộ chỉ được dùng trong Dev/PoC, không thuộc go-live.
- Agent Desktop trên web: thiết bị audio, register, inbound/outbound manual, answer/reject, mute, hold/resume, DTMF, blind/attended transfer và wrap-up.
- Agent state: Logged Out, Not Ready kèm reason, Ready, Queue Call/Other Call, Wrap Up.
- Inbound flow: DID, business hours, IVR, queue, skill-based routing, overflow và queue callback do PortSIP điều phối.
- Outbound campaign: draft/publish/schedule/pause/resume/stop; CSV/API import có dry-run, chuẩn hóa E.164, dedupe; consent/DNC/suppression; timezone/quiet hours; script/disposition; retry/callback; caller-ID allowlist; pacing/CPS/concurrency và emergency stop.
- Preview dial và progressive 1:1; progressive chỉ quay sau khi reserve một agent Ready, tự dừng cấp cuộc gọi mới khi inbound vượt ngưỡng đã cấu hình.
- Admin UI cho tenant-owned trunk/provider type được phép, DID inventory và tenant-scope inbound/outbound rules với preview diff, least privilege, secret write-only, audit, read-back, test call và rollback/snapshot. Shared/IP-based trunk object và DID-pool assignment mặc định read-only/deep-link; tenant rule có thể tham chiếu assigned trunk nếu exact role/API cho phép.
- Screen-pop theo số điện thoại; contact, interaction history, note, case/ticket và disposition bắt buộc.
- Interaction timeline có call legs, timestamps, outcome, CDR và recording reference.
- Supervisor wallboard, trạng thái agent/queue, cảnh báo SLA và monitor/whisper/barge theo quyền.
- Báo cáo cơ bản: volume, handled/abandoned, SLA, ASA, AHT, ACW, transfer, agent activity và queue callback.
- Bốn lớp quyền: data scope, quyền tính năng/capability, screen/navigation và field/action; backend enforce nhất quán ở API, object lookup, realtime, search/report/export và background jobs.
- Extensibility kernel trong modular monolith: module-owned schema/migration, typed ports/adapters, versioned command/query/event contracts, registries cho connector/strategy/action/projection và architecture tests.
- Config Studio: typed settings có effective-value/resolution chain, draft/version/approval/audit, feature flags tách khỏi permission, preview/simulate/test và rollback.
- Custom fields/forms giới hạn cho contact read-model, case, interaction, campaign member và disposition form; business workflow/rule/timer chỉ gọi approved actions và giữ version theo từng instance.
- Audit log, secrets management, operator health dashboard, log/metric/trace và runbook vận hành.

### Ngoài phạm vi MVP

- Multi-line power dialer `>1`, predictive dialer, answering-machine detection, workforce management đầy đủ và native mobile app.
- Email/social channel hoặc một omnichannel engine tổng quát.
- AI agent, real-time agent assist và tự động chấm QA.
- White-label multi-tenant thương mại hoàn chỉnh.
- Arbitrary code/plugin upload, BPMN/DMN đầy đủ, generic drag-drop page builder, remote UI component và dynamic override của call/dial/compliance/security invariants.
- Thay thế PortSIP PBX portal hoặc tự xây SIP/media/recording engine.

## 6. Lộ trình 28–32 tuần

| Giai đoạn | Tuần | Deliverable chính | Exit criteria |
|---|---:|---|---|
| 0. Discovery & Feasibility PoC | 1–2 | Inbound slice; preview/progressive 1:1 slice; trunk/rule draft → apply disabled nếu hỗ trợ, nếu không dùng maintenance/fallback → read-back → test; compliance/license/TCO | Day-10 D-010 Go/Adjust/Stop quyết định có cấp quyền bắt đầu build hay không |
| 1. Integration Hardening | 3–6 | SDK wrapper, REST adapter, WSI/webhook contracts, idempotent call creation, failure/reconnect/reconciliation | Hai chiều gọi và config slice lặp lại ổn định; captured contracts và golden smoke tests tự động |
| 2. Platform & Extensibility Foundation | 4–10 | CI/CD, module boundaries, ports/adapters, versioned contracts, four-layer authorization, config/feature-flag registry, inbox/outbox và durable jobs | Deploy Dev/UAT; architecture/contract/permission tests xanh; effective settings và versioned jobs hoạt động |
| 3. Agent & Inbound MVP | 7–14 | Agent Workspace, call controls, screen-pop, CRM, contact/case/disposition, queue callback và metadata-driven forms | Agent hoàn thành inbound/manual/preview; không mất interaction khi refresh/reconnect; field policy được enforce server-side |
| 4. Outbound & Trunk Admin | 10–19 | Campaign lifecycle, progressive 1:1, reservation/pacing/retry/callback, DID/trunk/rule UI | Không DNC/time-window violation; không answered call thiếu agent; config read-back/test/audit đạt |
| 5. Config Studio & Bounded Self-Service | 12–22 | Role/scope administration, effective settings, custom field/form editor, guided workflow/rule/timer editor, approved action/strategy registries | Operator publish/rollback không deploy code; old instances/data giữ đúng pinned version; không arbitrary code |
| 6. Supervisor & Reporting | 16–22 | Blended wallboard, inbound protection, outbound funnel/KPI, monitoring và báo cáo | Số liệu đối soát với PortSIP/CRM; data/screen/field/export scope được kiểm thử |
| 7. Hardening & Pilot | 23–29 | Load/failover/security test, N-1 migration, authorization/config/workflow resilience, UAT, training và runbook | Pilot 10–20 agent/10 ngày/đủ inbound và outbound sample; operator usability và measurable exit criteria đạt |
| 8. Rollout & Hypercare | 30–32 | Rollout theo wave, rollback plan, on-call, KPI baseline | Go-live checklist đạt; support ownership, configuration governance và SLO được bàn giao |

Các giai đoạn 1–6 có thể chồng lấn. `28–32 tuần` là ROM `±30%` cho 7 core FTE + specialist part-time nêu ở mục 8, single-tenant, voice-only blended, một connector, bounded self-service và dependencies sẵn từ ngày 1. Phương án tăng tốc `26–29 tuần` cần thêm 1 Platform/Backend, 1 Frontend/Admin UX và 0,5 QA/Security Automation. Phương án `Adjust` `24–26 tuần` chỉ giữ extensibility kernel + role/config templates trong P0 và chuyển visual/self-service form/workflow builders sang P1; mốc 18 tuần không còn phù hợp với scope hiện tại.

## 7. Workstream và deliverable

### A. Telephony & PortSIP Integration

- Khóa version matrix: PBX, SDK, browser/OS, codec, trunk và firmware headset.
- PortSIP REST client có timeout, retry có kiểm soát, token refresh, rate-limit handling và contract tests.
- WSI/webhook gateway có reconnect, resubscribe, idempotency, ordering policy, dead-letter queue và reconciliation job.
- SDK wrapper duy nhất trong frontend để cô lập API vendor và quản lý call state machine.
- Bộ kịch bản IVR/queue/transfer/queue-callback/recording và test numbers.

### B. Agent Experience & CRM

- Unified Agent Workspace; screen-pop không che call controls.
- Search/deduplicate contacts theo số E.164; xử lý unknown/anonymous caller.
- Interaction/case/note/disposition autosave; ACW timer; scheduled follow-up.
- Adapter contract cho CRM; retry và conflict policy khi CRM gián đoạn.

### C. Outbound Campaign & Dialer

- Campaign/list/compliance do Portsip CC sở hữu; PortSIP chỉ thực thi SIP/trunk/session và phát CDR/event.
- Preview và progressive 1:1 với transactional contact/agent reservation, idempotency key, pacing/CPS/concurrency guards và emergency stop.
- Import CSV/API có dry-run, E.164, dedupe; consent/DNC/suppression được kiểm tra khi lập lịch và ngay trước dispatch.
- Retry/callback theo outcome, timezone IANA/DST, immutable policy/script version và caller ID chỉ từ DID/profile đã duyệt.
- Blended protection tạm dừng dispatch mới khi queue depth/longest wait/SLA inbound vượt ngưỡng; active calls được hoàn tất.

### D. SIP Trunk Admin UI

- Wizard quản lý provider/trunk, DID inventory, inbound rule và outbound rule qua backend PortSIP Adapter.
- Luồng `draft → validate → preview diff → approve → apply disabled nếu endpoint hỗ trợ, nếu không theo maintenance/fallback plan → read-back → test → activate`; lưu before/after snapshot và audit.
- Password/secret là write-only, mã hóa trong secret manager; browser không nhận PortSIP admin token hoặc secret đã lưu.
- Global transport, SBC, firewall, certificate và raw advanced routing chỉ thuộc System Admin/vendor portal, không thuộc tenant-admin MVP.

### E. Business Case & Commercial

- Baseline current state: volume, staffing, SLA, handle time, incident/pain point và chi phí công cụ hiện tại.
- Quote/license schedule bằng văn bản cho PBX/SBC/SDK/module/support; không dùng giới hạn Free Edition để tính production.
- TCO ba năm: license, carrier, compute/storage/egress, recording/transcription, support và delivery/operations staffing.
- Benefit hypothesis và measurement plan; sponsor phê duyệt Go/Adjust/Stop trước build.

### F. Supervisor, QA & Analytics

- Queue/agent wallboard và SLA alerts dựa trên event chuẩn hóa.
- Monitor/whisper/barge có scope, audit và policy thông báo.
- Định nghĩa data dictionary cho từng KPI; đối soát với PortSIP reports/CDR.
- Export/report scheduling và dữ liệu pilot baseline.

### G. Platform, Security & Operations

- OIDC, RBAC, tenant scoping, secrets vault, encryption, audit.
- Dev/UAT/Prod tách biệt; Infrastructure as Code và CI/CD có approval gates.
- Metrics/logs/traces; synthetic call; webhook/WSI lag; trunk/registration health.
- Outbound dispatch lag, reserved-agent age, suppression reasons, pacing/CPS/concurrency, orphan/duplicate attempt và inbound-protection status.
- Backup/restore drill, incident runbook, SLO và escalation matrix.

### H. Extensibility, Authorization & Operator Configuration

- Giữ một modular monolith nhưng cưỡng chế module ownership: mỗi module sở hữu schema/table/migration; module khác chỉ dùng typed command/query port hoặc versioned event, không import nội bộ hay đọc bảng chéo.
- Shared kernel chỉ chứa primitive ổn định, event envelope và authorization context; PortSIP/CRM/IdP DTO không đi qua adapter boundary.
- Capability Registry và Policy Decision Service thực thi bốn lớp quyền: data scope, quyền tính năng/capability, screen/navigation và field/action. UI manifest chỉ hỗ trợ UX; API, realtime, export và worker vẫn deny-by-default ở backend.
- Configuration Registry quản lý typed definition, scope/precedence, effective value, risk/approval, activation mode, audit và secret reference; feature flag tách khỏi permission và business setting.
- Config Studio dùng mental model thống nhất `draft → validate → preview/simulate → approve → publish/schedule → monitor → supersede/rollback`, có Basic/Advanced mode, dependency impact và hướng xử lý lỗi/drift rõ ràng.
- Metadata/Form Runtime hỗ trợ custom fields và layout giới hạn; Workflow/Rule Runtime hỗ trợ guards, required fields, timers/waits và approved action handlers. Telephony FSM, tenant isolation, compliance hard-stop và security invariant vẫn code-owned.
- Durable scheduler/job có lease, idempotency, retry/DLQ và reconciliation; workflow instance pin definition version, sống qua deploy/restart và chỉ migrate bằng dry-run + approval.
- Contract/schema compatibility, expand-migrate-contract database migration, adapter conformance, architecture tests và operator usability tests nằm trong Definition of Done.

## 8. Nhân sự cơ sở

Baseline là **7 core FTE** cộng 1,75–2,25 specialist FTE-equivalent ở peak và ROM `28–32 tuần ±30%`. Phương án tăng tốc `26–29 tuần ±30%` cần thêm 1 Platform/Backend Engineer, 1 Frontend/Admin UX Engineer và 0,5 QA/Security Automation; peak staffing khoảng 11,25–11,75 FTE-equivalent. Phương án `Adjust` `24–26 tuần ±30%` không bao gồm visual/self-service form và workflow builders trong P0.

| Vai trò | Mức tham gia |
|---|---:|
| Product Owner / BA Contact Center | 1,0 |
| Tech Lead / Solution Architect | 1,0 |
| Backend/Integration Engineer | 2,0 |
| Frontend Engineer | 2,0 |
| QA/SDET | 1,0 |
| DevOps/SRE | 0,5 |
| UX/Product Designer | 0,5 |
| PortSIP/Telephony specialist | 0,5–1,0 trong Discovery, PoC và go-live |
| Legal/Compliance | 0,25 tại outbound/config gates |
| Phương án tăng tốc: Platform/Backend + Frontend/Admin UX + QA/Security Automation | +1,0 / +1,0 / +0,5 |

Đội vận hành Contact Center, Security/Compliance và CRM owner phải tham gia theo gate, không chỉ ở UAT.

| Giai đoạn | Core team | Specialist/đầu mối bắt buộc |
|---|---:|---|
| Discovery/PoC | 4–5 FTE | Telephony 1,0; DevOps/Security/CRM/Legal part-time; sponsor có lịch Day 10 |
| Build MVP | 7 core FTE baseline hoặc 9 core FTE tăng tốc | DevOps 0,5; UX 0,5; Telephony 0,5–1,0; QA/Security Automation tăng tốc 0,5; CRM/Data/Legal theo sprint/gate |
| Pilot/Go-live | 6–7 core FTE | Telephony 1,0; Ops/Trainer/Security/Business owner theo ca pilot |

## 9. Yêu cầu phi chức năng ban đầu

### Availability và phục hồi

- `Proposed target`: application plane 99,9% theo tháng; telephony availability phải tách theo PBX, SBC và trunk, rồi khóa bằng topology/contract thực tế.
- Active interaction, event inbox, note và disposition: thiết kế synchronous durable write/HA với RPO mục tiêu xấp xỉ 0; CDR thiếu phải được REST reconciliation sửa chữa.
- Cấu hình, cache và report projection có thể rebuild: RPO đề xuất ≤ 15 phút. Recording giữ tại PortSIP trong MVP có RPO/RTO riêng theo topology/backup vendor.
- `Proposed target`: RTO application plane ≤ 60 phút; các số này phải được BIA phê duyệt trước khi thành SLO.
- Agent vẫn nhìn thấy call controls thiết yếu khi CRM chậm; note được lưu local-draft và retry an toàn.
- Có degraded mode khi WSI mất kết nối và reconciliation sau khi phục hồi.
- Outbound scheduler fail closed khi agent state/trunk health/WSI stale; lệnh không rõ kết quả chuyển `reconcile_pending`, không retry mù.

### Hiệu năng

- `Proposed target`: normalized PortSIP event → UI render P95 ≤ 2 giây trong forecast peak + 30% signaling headroom.
- `Proposed target`: screen-pop P95 ≤ 2 giây từ normalized offer event; CRM latency được đo riêng và degraded response phải rõ.
- `Proposed target`: API read nội bộ P95 ≤ 300 ms; thao tác ghi P95 ≤ 700 ms. PoC/pilot phải tạo baseline trước khi phê duyệt.
- Capacity test theo ba biến: registered agents, simultaneous calls và events/second; không suy từ cấu hình tối thiểu của vendor.
- Outbound test thêm attempts/second, carrier CPS, trunk concurrency, connect rate, agent reservation và list throughput; mọi giới hạn đều có headroom và kill switch.

### Bảo mật và riêng tư

- TLS/WSS cho signaling/API và SRTP/DTLS-SRTP cho media khi topology hỗ trợ.
- Không đưa PBX admin credential/token vào browser; credential SIP/SDK được cấp và lưu theo thiết kế đã threat-model.
- Bốn lớp quyền dùng chung một policy decision: data scope, quyền tính năng/capability, screen/navigation và field/action. API, object lookup, realtime subscription, search/report/export, recording và background job đều enforce server-side; menu ẩn không phải security boundary.
- Role chỉ là capability template; scoped grant gắn rõ tenant/business unit/team/queue/campaign/own/assigned, có hiệu lực thời gian và deny-by-default. Maker-checker, break-glass và service identity có policy/audit riêng.
- Encryption at rest; retention và legal hold cho recording/transcript; redaction hoặc pause/resume recording cho dữ liệu nhạy cảm.
- Chốt quy định về thông báo/đồng ý ghi âm, outbound consent, DNC, data residency và xóa dữ liệu với Legal/Compliance tại thị trường triển khai.
- Trunk/DID/rule change dùng quyền riêng, step-up auth/approval theo môi trường, secret write-only và immutable audit; không cấp `PhoneSystem.FullAccess` cho browser hoặc Campaign Manager.

### Khả năng mở rộng, cấu hình và thay đổi an toàn

- Module boundary được kiểm tra trong CI; module sở hữu schema/migration và không dùng chung ORM entity. Chỉ tách microservice khi có evidence về tải, fault isolation, security boundary hoặc ownership.
- API/event/metadata/config/workflow dùng explicit version. Thay đổi additive là mặc định; breaking change cần version mới, deprecation window, upcaster/backfill và consumer contract test. Rolling deploy phải hỗ trợ N và N-1 theo policy được duyệt.
- Database migration dùng `expand → migrate/backfill → contract`; không xem down migration là rollback mặc định. Dynamic field giữ schema version và chỉ field được khai báo search/report mới có typed index/projection.
- Settings có typed schema, allowed scope, validation, owner, risk/approval, activation mode và immutable revision. UI hiển thị effective value, resolution chain, override source và `Reset to inherited`; ambiguous precedence bị chặn.
- Feature flag có owner, expiry, scope, dependency, server-side evaluation và kill switch; flag không cấp quyền và không thay thế business configuration lâu dài.
- Workflow/rule chỉ dùng expression/action allowlist, có giới hạn tài nguyên, deterministic simulation và immutable published version. Instance đang chạy tiếp tục version đã pin; timer/job có durable lease, idempotency, retry/DLQ và reconciliation.
- Operator UI dùng plain-language labels, safe defaults, Basic/Advanced mode, inline validation, impact/dependency preview, autosave draft, accessibility WCAG 2.1 AA và trạng thái lỗi/drift/partial failure có safe next action.
- Proposed target cho policy/config cache invalidation, setting propagation và scheduled activation phải được đo ở PoC; thao tác nhạy cảm fail closed khi policy/config source stale.

## 10. Rủi ro chính và biện pháp

| Rủi ro | Tác động | Giảm thiểu/Gate |
|---|---|---|
| SDK/browser package hoặc license không khớp PBX | Chặn Agent Desktop | Yêu cầu vendor cung cấp browser package/sample/license; PoC trên đúng binary/version trong tuần 1–2 |
| PBX v22.6.3 mới hơn REST/WSI reference v22.3 | Sai adapter, wallboard hoặc interaction | Lấy OpenAPI/schema từ instance/vendor, capture payload thực tế, versioned contract test và REST reconciliation |
| Webhook/WSI có thể trùng, mất hoặc sai thứ tự | Sai call state/CDR | Đây là defensive consumer assumption vì tài liệu retry chưa nhất quán: durable inbox, dedupe, state guard, DLQ và REST reconciliation |
| NAT/firewall/headset gây lỗi một chiều hoặc chất lượng kém | Ảnh hưởng trực tiếp agent | Network readiness, WSS/TLS/SRTP test, synthetic call, approved-device matrix |
| Trộn PortSIP state với app state | Race condition, khó support | Xác định source of truth và correlation keys; không ghi trực tiếp DB vendor |
| Công thức KPI không thống nhất | Mất niềm tin báo cáo | Data dictionary, golden calls, đối soát hằng ngày trong pilot |
| CRM/IdP phụ thuộc ngoài | Chậm tiến độ | Adapter + mock server, sandbox sớm, timeout/circuit breaker/degraded mode |
| Recording chứa dữ liệu nhạy cảm | Rủi ro pháp lý/bảo mật | Policy, encryption, scoped access, audit, retention và pause/resume được test |
| Duplicate/orphan outbound khi worker timeout/crash | Gọi lặp, khiếu nại, tăng chi phí | Transactional reservation/outbox, idempotency, `reconcile_pending`, correlation bằng opaque attempt ID |
| DNC/consent/timezone/caller ID sai | Rủi ro pháp lý và khóa trunk | Fail closed, recheck trước dispatch, provenance/expiry, DID allowlist và Legal/carrier gate |
| Outbound làm giảm SLA inbound | Mất chất lượng dịch vụ | Blended protection tự pause bằng threshold + hysteresis; active calls finish; diễn tập peak mix |
| Cấu hình trunk/rule sai hoặc quyền REST quá rộng | Mất cả hai chiều gọi | Least privilege, preview diff, apply disabled nếu hỗ trợ hoặc maintenance/fallback, read-back/test, dual control, snapshot/rollback |
| Quyền data/feature/screen/field được triển khai rời rạc | Rò dữ liệu hoặc privilege escalation qua API, deep link, realtime, export hay worker | Một Policy Decision contract + PEP tại mọi entry point; deny-by-default, scoped grants, field masking và permission/tenant-isolation matrix test |
| Metadata/config quá tự do biến thành low-code không kiểm soát | Khó debug, hiệu năng kém và operator có thể phá invariant | Typed registry, approved fields/actions/components, safe expression DSL, hard guardrails; cấm arbitrary code/SQL/URL và giữ telephony/compliance/security invariant trong code |
| Workflow/config thay version làm hỏng record hoặc instance đang chạy | Sai required field, mất timer hoặc chạy side effect lặp | Immutable version, pinned schema/workflow, explicit migration dry-run, durable lease/idempotency, reconciliation và rollback bằng publish version tương thích |
| Custom field JSON làm chậm search/report | Query nóng thiếu index, metric sai hoặc migration khó | Core field giữ typed column; chỉ field được khai báo mới có typed index/projection; quota và performance test theo tenant/entity |
| Config Studio khó hiểu hoặc lỗi thao tác hàng loạt | Tăng incident và phụ thuộc kỹ thuật | Basic/Advanced mode, effective-value chain, impact/simulation, maker-checker, usability test với operator và runbook/correlation ID |
| Bounded self-service làm tăng scope nền tảng | Trượt tiến độ nếu coi là vài màn hình CRUD | Baseline 28–32 tuần; D-019 khóa entity/workflow/action P0. Chọn Adjust 24–26 tuần nếu chuyển visual/self-service builders sang P1 |
| Scope trượt sang omnichannel/AI/predictive quá sớm | Trễ MVP và tăng compliance risk | Giữ multi-line power/predictive/AMD cùng digital/AI ở P1/P2 sau pilot gate |

## 11. Tiêu chí Go-live

- `P0` đồng nghĩa toàn bộ hàng gắn `MVP` trong feature catalog. 100% kịch bản P0 đạt trên UAT với trunk/browser/headset mục tiêu.
- 0 outbound attempt tới DNC/suppressed hoặc ngoài allowed window trong UAT/pilot; consent và timezone được recheck ngay trước dispatch.
- Progressive 1:1 chỉ dial khi reserve đúng một agent Ready; 0 dialer-abandoned call do thiếu agent; pause/stop chặn request mới trong proposed target ≤5 giây.
- 100% golden attempts được PortSIP/PBX accept liên kết được campaign/contact/agent/attempt/session/CDR; blocked attempts có policy reason + audit và 0 PBX session. Caller ID của executed calls thuộc allowlist và khớp CDR.
- Carrier/provider/tenant/campaign CPS và concurrency không vượt giới hạn; inbound protection được test với hysteresis ở mixed-load peak.
- Mọi thay đổi trunk/DID/rule P0 có actor, before/after, approval, PortSIP ID, read-back và test result; rollback drill thành công.
- 100% của 30–50 golden calls có interaction/CDR đúng trong 15 phút sau call end; 100% recording-eligible calls có recording reference đúng trong readiness window đo được ở PoC.
- Pilot mặc định: 10–20 agent, 10 ngày làm việc liên tiếp gồm peak shift và tối thiểu 500 recording-eligible calls, trong đó đề xuất ≥200 outbound attempts và ≥100 progressive attempts; nếu volume/mix thấp hơn, Product/QA/Compliance phê duyệt denominator thay thế trước pilot.
- Trong pilot: ≥99,9% eligible calls tự reconcile interaction/CDR trong 15 phút và 100% eventual reconciliation trong 24 giờ; mọi ngoại lệ có incident/root cause.
- Load test đạt forecast peak + 30% signaling/event headroom; media concurrency/headroom được PortSIP sizing và test riêng.
- Authorization matrix chứng minh data/capability/screen/field policy ở API, object lookup, realtime, search/report/export, recording và worker; đoán resource ID hoặc gọi deep link trực tiếp không rò record, count hay field.
- Operator thêm một custom field P0, gắn conditional required vào form theo queue/campaign, preview theo role, publish và rollback mà không deploy; record cũ/mới vẫn render/validate đúng pinned schema version.
- Workflow instance đang chạy giữ version cũ khi publish version mới; durable timer sống qua worker restart và non-idempotent unknown result đi `reconcile_pending`/manual thay vì chạy lặp.
- Config Studio hiển thị đúng effective value/resolution chain, chặn ambiguous precedence, hỗ trợ version/approval/rollback và không cho nhập arbitrary JavaScript/SQL/shell/URL hoặc raw secret.
- Adapter/extension conformance, architecture dependency, API/event compatibility và expand-migrate-contract từ N-1 đều đạt trong CI/UAT; rollback/replay không tạo duplicate side effect.
- Representative operator hoàn thành role grant, field/form publish, workflow publish và setting rollback trong usability test mà không cần DB/CLI; error/drift/partial failure có safe next action và correlation ID.
- Không có Sev-1/Sev-2 mới trong 5 ngày làm việc cuối; Sev-3 có owner/deadline. Sev-1 = mất thoại/breach/mất dữ liệu diện rộng; Sev-2 = core workflow diện rộng hỏng không có workaround; Sev-3 = phạm vi hạn chế hoặc có workaround.
- Security review, dependency scan, penetration test các bề mặt internet và four-layer authorization test hoàn tất.
- Backup/restore, PBX/app failover và rollback được diễn tập.
- Dashboard/alert/on-call/runbook/escalation vendor sẵn sàng.
- Agent/Supervisor/Campaign Manager/Telephony Admin/Platform Operator được đào tạo; pilot sign-off và business owner chấp thuận KPI.

## 12. Kế hoạch 10 ngày làm việc đầu tiên

Đồng hồ 10 ngày chỉ bắt đầu khi có: vendor contact, quyền tải exact SDK/sample/license text, PBX sandbox admin, SIP trunk + DID test, DNS/certificate, CRM/IdP sandbox hoặc mock được phê duyệt, hai persona/operator đại diện cùng sample data-scope/field policy và lịch sponsor cho Day 10. Dependency thiếu được ghi `Blocked`; không âm thầm ăn vào thời gian PoC. Extensibility PoC là thin slice/test harness để khóa contract và ROM, không phải xây xong toàn bộ Config Studio trong 10 ngày.

| Ngày | Owner chính | Công việc | Output/Gate |
|---:|---|---|---|
| 1 | PO/BA + Ops | Inbound/outbound journeys, campaign modes, disposition/case, KPI formulas, business baseline; inventory field/form/workflow/setting và operator pain points | Approved journeys + measurement plan + bounded self-service inventory |
| 2 | Architect + Security/Legal + Engineering Lead | Capacity/CPS/concurrency, recording, consent/DNC/timezone/caller ID, HA/DR; chọn IdP/CRM; khóa scope hierarchy, capability catalog, configurable-vs-code-owned boundary, setting exposure classes và implementation stack/toolchain | D-001, D-003, D-004, D-006, D-008, D-016–D-019 và D-023 có kết luận hoặc explicit blocker; các quyết định Day 5 có evidence owner |
| 3 | Telephony Lead + Vendor | Exact PBX/SBC/SDK/license/OpenAPI/WSI; provider/trunk/rule permissions; dựng sandbox/trunk/cert | Version/license/permission matrix và callable test numbers |
| 4–5 | FE + Telephony Lead | SDK spike: register, devices, inbound/manual/preview và P0 call controls | Browser feasibility + credential threat decision |
| 4–6 | BE + QA | REST auth/refresh, WSI subscribe/reconnect, webhook durable inbox | Captured/versioned contracts và automated smoke tests |
| 4–7 | Platform + FE + Security/QA | Thin slice four-layer policy + Config Registry: hai persona thấy khác menu/data/field; direct API/realtime/export deny; effective setting; custom field/form conditional-required; workflow timer/version-pin qua restart | Permission/config/schema/workflow evidence, architecture test và revised bounded-self-service estimate |
| 5–8 | BE + Telephony + Security | Trunk/rule draft/apply-disabled nếu hỗ trợ hoặc maintenance/fallback/read-back/test/activate; snapshot/rollback | Guarded config slice, least-privilege proof và immutable audit |
| 6–8 | Full squad | Inbound slice + preview/progressive 1:1; DNC/timezone; failure/reconnect/duplicate/reorder; CDR/recording | Hai vertical slices + golden event/attempt traces |
| 9 | QA + Data/BA | Reconciliation, mixed-load/CPS smoke, inbound protection, permission matrix, N-1 schema/event/config compatibility, operator walkthrough, KPI sample và risk/TCO update | Evidence pack + revised ROM/self-service estimate |
| 10 | Sponsor + PO + Architect | Demo và quyết định Go/Adjust/Stop, gồm chọn full bounded self-service hay Adjust chuyển builders sang P1 | D-010 và D-019 signed; scope/team/timeline re-baselined |

## 13. Quyết định còn mở

Baseline hiện tại là single-tenant, web-first, OIDC, một CRM connector, voice-only blended inbound + outbound và P0 bounded self-service theo [Kiến trúc mở rộng, phân quyền và cấu hình động](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md). P0 outbound chỉ gồm manual, preview và progressive 1:1; multi-line power/predictive/AMD, multi-tenant, digital channel, native client, arbitrary plugin/code hoặc full low-code/BPMN đều phải re-scope/re-estimate. G0-01/D-023 phải khóa stack/toolchain trước scaffold; G0-02/G0-03 phải tạo và kiểm chứng Build Profile trước product build. Quyết định Day 10 phải chọn rõ baseline `28–32 tuần`, accelerated `26–29 tuần` hoặc phương án `Adjust` `24–26 tuần` chuyển visual/self-service builders sang P1. Chi tiết outbound nằm trong [Outbound MVP và SIP Trunk Admin UI](07-OUTBOUND-VA-SIPTRUNK-ADMIN.md); quyết định và bằng chứng nằm trong [Decision register](06-DECISION-REGISTER.md) và [Checklist Discovery/PoC](04-DISCOVERY-POC.md). Hướng dẫn thực thi và kiểm soát dự án nằm trong [Mục lục bàn giao](00-MUC-LUC-BAN-GIAO.md) và docs 09–15.
