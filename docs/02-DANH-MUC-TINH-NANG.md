# Danh mục tính năng đề xuất

## 1. Quy ước ưu tiên

- `MVP` = `P0`: bắt buộc để vận hành voice an toàn, đo được và mở rộng có kiểm soát; gồm extensibility kernel + bounded self-service và mọi hàng MVP phải có acceptance test trước go-live.
- `P1`: triển khai sau pilot, mở rộng năng suất và omnichannel.
- `P2`: tối ưu hóa/AI/WFM sau khi dữ liệu và quy trình đã ổn định.
- `Reuse`: PortSIP cung cấp lõi; Portsip CC tích hợp hoặc trình bày lại.
- `Build`: chức năng nghiệp vụ do Portsip CC sở hữu.

## 2. Feature map theo persona

### 2.1 Agent Workspace

| Ưu tiên | Tính năng | Ownership | Acceptance cấp cao |
|---|---|---|---|
| MVP | Đăng nhập, ánh xạ extension và kiểm tra trạng thái đăng ký | Build + PortSIP | Agent chỉ truy cập đúng tenant/extension; lỗi đăng ký có hướng dẫn rõ |
| MVP | Chọn/test microphone, speaker, ringtone và headset | Build + SDK | Thiết bị được nhớ theo trình duyệt; mất thiết bị không làm treo cuộc gọi |
| MVP | Inbound toast và screen-pop | Build | Hiện caller/contact/queue trước hoặc ngay khi answer; anonymous caller vẫn xử lý được |
| MVP | Answer, reject, hangup, mute, hold/resume, DTMF | SDK wrapper | UI state khớp call state; chống double command và thao tác khi state không hợp lệ |
| MVP | Blind transfer, attended transfer/consult | SDK + PortSIP | Hai luồng transfer được ghi đúng call legs và outcome |
| MVP | Outbound manual/click-to-call | SDK + PortSIP | Chỉ bật cho use case/market đã duyệt; recheck consent/DNC/timezone, chuẩn hóa E.164 và chỉ dùng caller ID allowlisted |
| MVP | Preview campaign | Build + SDK/PortSIP | Agent xem contact/script/consent/lịch sử rồi chọn Dial hoặc Skip kèm reason; không dial trước xác nhận |
| MVP | Progressive 1:1 / power-safe auto-next | Build + SDK/PortSIP | Chỉ dial sau khi reserve đúng một agent Ready; effective dial ratio ≤1,0 và không có answered call thiếu agent |
| MVP | Ready/Not Ready/reason/Wrap Up | REST/PortSIP + Build | State hiển thị nhất quán; reason bắt buộc theo policy; hết ACW chuyển state đúng |
| MVP | Hồ sơ khách hàng và interaction timeline | Build | Tra cứu theo số; thấy lịch sử được phân quyền; không tạo trùng contact vô kiểm soát |
| MVP | Note, case/ticket, disposition và follow-up | Build | Autosave; form có custom field/conditional required theo pinned schema version; disposition bắt buộc trước Ready nếu policy bật |
| MVP | Banner chất lượng/kết nối | Build + SDK | Phân biệt lỗi PBX, microphone, network và CRM; có hành động khôi phục |
| MVP | Script outbound theo campaign và lịch sử attempt | Build | Agent thấy đúng immutable version; disposition/callback/retry được lưu cùng logical attempt |
| P1 | Script động/knowledge panel theo queue/intent | Build | Supervisor quản lý phiên bản; agent thấy đúng script theo context |
| P1 | SMS/WhatsApp unified inbox | PortSIP + Build | Assignment, transfer, history và SLA conversation hoạt động end-to-end |
| P1 | Advanced shared follow-up/callback worklist | Build | Bổ sung load balancing, SLA, bulk reassignment và cross-campaign view; P0 vẫn có callback owner/nhắc giờ và phân biệt với PortSIP queue callback |
| P2 | Real-time agent assist, suggested reply và auto-summary | Build/AI | Có confidence/source, human confirmation và audit; không tự gửi ngoài policy |
| P2 | Native mobile/desktop client | SDK | Chỉ làm khi browser không đáp ứng use case/quality mục tiêu |

### 2.2 Inbound Routing và Customer Experience

| Ưu tiên | Tính năng | Ownership | Acceptance cấp cao |
|---|---|---|---|
| MVP | DID, office hours/holiday, IVR, MOH, announcement | Reuse PortSIP | Mỗi nhánh có destination/fallback; có test number và versioned call-flow spec |
| MVP | Queue/ACD và configurable SLA threshold | Reuse PortSIP | Ring strategy, timeout, overflow và no-agent behavior được kiểm thử |
| MVP | Skills-based routing | Reuse PortSIP | Skill level và fallback group tạo đúng thứ tự phân phối |
| MVP | Queue callback/exit | Reuse PortSIP | Giữ vị trí theo cấu hình; báo cáo thành công/thất bại callback |
| MVP | VIP, exclusive agent và last-called-agent khi phù hợp | Reuse PortSIP | Có fallback rõ; không dùng với ring strategy không được PortSIP hỗ trợ |
| MVP | Spam/blacklist policy | Reuse PortSIP | Có audit, review và quy trình unblock |
| P1 | Post-call CSAT qua IVR/SMS | PortSIP + Build | Liên kết đúng interaction; opt-out và rate limit |
| P1 | Context-aware routing từ CRM | Build + PortSIP | Routing decision có timeout/fallback, audit và không làm rớt cuộc gọi |
| P2 | Voicebot/virtual agent với human handoff | Build/AI + PortSIP | Chuyển toàn bộ context; fallback khi confidence thấp hoặc backend lỗi |

### 2.3 Campaign Manager

| Ưu tiên | Tính năng | Ownership | Acceptance cấp cao |
|---|---|---|---|
| MVP | Campaign lifecycle | Build | Draft/publish/schedule/pause/resume/stop; status transition hợp lệ, policy version bất biến và mọi thay đổi có audit |
| MVP | Lead list import CSV/API | Build | Dry-run/schema mapping, E.164, validation, dedupe và idempotent import; lỗi có downloadable report |
| MVP | Eligibility, consent, DNC và suppression | Build | Có provenance/expiry/scope; kiểm tra lúc scheduling và ngay trước dispatch; fail closed nếu dữ liệu thiếu |
| MVP | Timezone, quiet hours và DST | Build | Dùng IANA timezone; unknown timezone bị chặn hoặc route vào review queue theo policy |
| MVP | Segmentation, team/skill, priority và quota | Build | Contact chỉ được cấp cho phạm vi cho phép; reservation chống cấp trùng giữa workers |
| MVP | Retry matrix và scheduled callback | Build | Busy/no-answer/technical failure có cooldown/max attempts xác định; trạng thái không rõ không retry mù |
| MVP | Caller-ID profile và trunk/rule selection | Build + PortSIP | Caller ID chỉ từ DID pool/profile đã duyệt; routing đọc từ PortSIP và được audit theo attempt |
| MVP | Pacing/CPS/concurrency và emergency stop | Build | Không vượt limit provider/trunk/tenant/campaign; stop chặn dispatch mới trong proposed target ≤5 giây |
| MVP | Blended inbound protection | Build | Outbound auto-pause khi inbound threshold bị vi phạm và resume có hysteresis; active calls không bị cắt |
| MVP | Campaign realtime/historical dashboard | Build + PortSIP CDR | Phân biệt loaded/eligible/suppressed/attempted/PBX accepted/SIP answered/right-party/conversion/callback/retry exhausted |
| P2 | Multi-line power, predictive và AMD | Build/vendor dependent | Chỉ sau pilot, legal/carrier gate, capacity model và giới hạn abandonment được phê duyệt |

### 2.4 Supervisor và Operations

| Ưu tiên | Tính năng | Ownership | Acceptance cấp cao |
|---|---|---|---|
| MVP | Live wallboard queue/agent | Reuse + Build | Queue depth, longest wait, SLA, state và active calls cập nhật gần real-time |
| MVP | Filter theo team/queue và threshold alert | Build | Chỉ thấy phạm vi được cấp quyền; alert có cooldown/escalation |
| MVP | Silent monitor, whisper, barge và barge-break | Reuse PortSIP | Chỉ supervisor thuộc monitor group sử dụng được; mọi action được audit |
| P1 | Force state/logout có kiểm soát | REST/PortSIP | Chỉ làm sau khi exact API/policy được PoC; yêu cầu lý do/quyền/audit và không làm mất active call |
| MVP | Intraday reports và export | Reuse + Build | Công thức KPI đã định nghĩa và đối soát với CDR |
| P1 | Recording review, bookmarks, QA scorecard, coaching | Build | Versioned scorecard, calibration và dispute workflow |
| P1 | Custom dashboard/report schedule | Build/PortSIP Data Flow | Phân quyền dữ liệu và timezone nhất quán |
| P2 | Forecast, staffing, schedule và adherence | Build/WFM | Forecast accuracy và adherence rule được định nghĩa trước triển khai |
| P2 | Automated QA/sentiment/topic analytics | Build/AI hoặc PortSIP AI | Sample audit, bias/error monitoring và human override |

### 2.5 Administrator

| Ưu tiên | Tính năng | Ownership | Acceptance cấp cao |
|---|---|---|---|
| MVP | People & Access: capability catalog, role template và scoped grants | Build + PortSIP | Quyền tách data scope, quyền tính năng/capability, screen/navigation và field/action; deny-by-default, có hiệu lực thời gian, drift detection và không shared admin |
| MVP | Field classification, masking và sensitive actions | Build | View/mask/edit/search/export/print/download/listen được enforce nhất quán ở detail/list/search/export/realtime; `play` và `download` recording là quyền khác nhau |
| MVP | Access review, maker-checker và break-glass | Build | Maker không tự approve khi policy bật; break-glass cần step-up, reason/ticket, hết hạn tự động, alert và hậu kiểm |
| MVP | Read-only queue/skill mapping; app-owned disposition/reason mapping | Build + PortSIP | Sync và phát hiện drift; thay đổi queue/skill/IVR tiếp tục thực hiện trong PortSIP Portal ở MVP |
| MVP | Tenant-owned SIP trunk/provider wizard | Build + PortSIP REST | Chỉ trunk type/ownership exact contract cho Tenant Admin; apply-disabled nếu endpoint hỗ trợ, nếu không có maintenance/fallback; shared/IP-based trunk object read-only/deep-link |
| MVP | DID inventory và inbound routing | Build + PortSIP REST | DID/range không trùng; tenant rule có thể dùng pool/trunk được System Admin gán nếu exact contract cho phép; office/non-office/holiday, notice và fallback được test |
| MVP | Outbound rule management | Build + PortSIP REST | Tenant rule có thể route qua assigned trunk; prefix/length/group/priority/routes/strip/prepend/caller ID có conflict detection, read-back và test call |
| MVP | Production config approval/audit | Build | Actor/approver/reason/before-after/PortSIP IDs/test result bất biến; quyền apply tách khỏi quyền soạn draft |
| P1 | System/shared/IP-based trunk và global PBX automation | Build + PortSIP | Chỉ System Admin/service principal sau risk approval và exact-version PoC; transport/SBC/firewall/certificate không thuộc tenant-admin P0 |
| MVP | Config Studio và effective settings | Build | Typed setting hiển thị effective value/resolution chain, override source, owner/help/impact; draft/validate/preview/approve/publish/schedule/rollback và `Reset to inherited` |
| MVP | Custom fields và form/layout editor giới hạn | Build | Operator thêm field cho entity P0, gắn visibility/required/permission, preview theo role và publish không deploy; record cũ giữ pinned schema version |
| MVP | Guided business workflow/rule/timer editor | Build | Chỉ dùng guard/action đã đăng ký; simulate/version/approve/publish; instance cũ giữ version, timer sống qua restart và không arbitrary code/SQL/URL |
| MVP | Feature rollout và kill switch | Build | Flag tách permission/business setting, enforce server-side, có owner/expiry/scope/dependency/default/fail behavior và audit |
| MVP | Operator Overview và Integration Health | Build | Thấy REST auth, WSI/webhook/CDR lag, trunk/registration, config drift, failed/stuck workflow/job, DLQ và safe next action/correlation ID |
| MVP | Audit log và export có kiểm soát | Build | Search theo actor/action/resource/time; log bất biến theo policy |
| P1 | Self-service connector configuration nâng cao | Build | Secret không hiện lại; test connection, capability/schema preview và rotation không downtime |
| P1 | Bulk import/export | Build | Validate/dry-run/error report; thao tác idempotent |
| P1 | Visual workflow canvas, reusable subflow và advanced condition builder | Build | Không phá P0 contract/version; có lint, simulation, permission và migration gate |
| P1 | Formula/file/rich-text field và dashboard/layout builder | Build | Chỉ sau security/performance/accessibility gate; không remote component tùy ý |
| P2 | Multi-tenant/dealer/white-label console | Build + PortSIP | Tenant isolation được kiểm thử tự động và qua security review |

### 2.6 Platform Extensibility và Operator Experience

| Ưu tiên | Năng lực nền tảng | Ownership | Acceptance cấp cao |
|---|---|---|---|
| MVP | Enforced modular-monolith boundaries | Build | Mỗi module sở hữu schema/table/migration; không cross-module table read hay internal import; architecture tests chặn dependency sai |
| MVP | Typed ports/adapters và extension registries | Build | PortSIP/CRM/IdP DTO không rò vào domain; thêm approved adapter/action/strategy qua contract + conformance tests, không sửa call FSM |
| MVP | Versioned API, command/query/event và metadata contracts | Build | Additive change giữ compatibility; breaking change cần version/deprecation/upcaster; consumer N và N-1 chạy trong rolling deploy |
| MVP | Central Policy Decision và enforcement points | Build | 100% API/query/object/realtime/export/file/worker entry points enforce cùng policy; menu/screen manifest chỉ phục vụ UX, deep link không bypass |
| MVP | Configuration Registry | Build | Module đăng ký typed key, scope/precedence, validator, risk/approval, activation mode và UI metadata; operator không tự tạo raw key |
| MVP | Metadata/Form Runtime | Build | Server validate published schema; Restricted field bị omit/mask trước browser; core identifiers, consent/DNC và call state không chuyển thành dynamic JSON |
| MVP | Workflow/Rule Runtime và Approved Action Registry | Build | Deterministic guard, action timeout/retry/idempotency/compensation; telephony/compliance/security invariant vẫn code-owned |
| MVP | Durable Job/Scheduler | Build | Timer/job có lease, idempotency, retry/backoff, DLQ, correlation và reconciliation; restart/replay không tạo duplicate side effect |
| MVP | Compatible data migration và projection rebuild | Build | Database dùng expand–migrate/backfill–contract; dynamic field/index/report projection có quota, dry-run và migration evidence từ N-1 |
| MVP | Config/policy/workflow observability | Build | Theo dõi policy deny, propagation lag, config revision/drift, workflow version/stuck instance, timer/job lag và extension/contract health mà không log secret/PII |
| MVP | Consistent operator interaction model | Build + UX | Các màn hình cấu hình dùng `draft → validate → preview/simulate → approve → publish → monitor/rollback`, Basic trước Advanced, autosave và WCAG 2.1 AA |
| P2 | Third-party runtime plugin hoặc full BPMN/DMN | Build/platform dependent | Chỉ sau business case, sandbox/isolation, signing, resource quota, security và operability gate; không nằm trong ROM P0 |

## 3. Outbound roadmap

### MVP/P0 — blended, bounded automation

- Manual/click-to-call, preview campaign và progressive 1:1.
- Campaign/list/compliance/retry/callback/reporting do Portsip CC sở hữu; PortSIP thực thi trunk/session/CDR/recording.
- Progressive chỉ phát lệnh khi đã reserve đúng một agent Ready. “Power-safe” chỉ là auto-next tuần tự với effective dial ratio `≤1,0`; không quay nhiều số song song.
- Import CSV/API có dry-run, E.164/dedupe; global/campaign suppression, DNC, consent provenance/expiry, timezone/quiet hours/DST được recheck ngay trước dispatch.
- Caller ID lấy từ DID/profile allowlist; pacing bị chặn bởi provider/trunk/tenant/campaign CPS/concurrency và inbound protection.
- Lệnh tạo call timeout hoặc kết quả không rõ chuyển `reconcile_pending`, không tự retry.

### P1 — tối ưu sau pilot

- Advanced segmentation/attribution, campaign template library và nhiều nguồn list/CRM connector.
- Rule optimization từ dữ liệu pilot, nhưng vẫn giữ dial ratio `≤1,0` nếu chưa qua advanced-dialer gate.

### P2 — advanced dialer chỉ sau legal/carrier/capacity gate

- Multi-line power với dial ratio `>1,0`.
- Predictive dialing nếu exact PortSIP/API, carrier và quy định thị trường cho phép.
- Answering machine detection; MVP chỉ có disposition `Voicemail` do agent chọn.
- Dynamic/adaptive pacing với abandonment guardrails.
- Campaign A/B testing và attribution.

## 4. Digital/Omnichannel roadmap

PortSIP v22 có kênh SMS và WhatsApp, bao gồm routing message tới ring group/queue và chuyển conversation giữa agent. MVP vẫn là voice-only; P1 mới đưa SMS/WhatsApp vào cùng contact timeline.

Các năng lực cần xây thêm để thực sự “omnichannel”:

- Conversation ownership, collision prevention và transfer.
- Unified customer identity và merge/deduplicate.
- SLA per channel, queue priority và workload/concurrency policy.
- Template/consent/opt-out, attachment scanning và message delivery state.
- Cross-channel history, case continuity và reporting.
- Webhook/provider retry, rate limits và dead-letter handling.

## 5. Reporting data dictionary tối thiểu

Mỗi KPI phải có công thức, timezone, grain, filters, source of truth và quy tắc loại trừ.

| KPI | Định nghĩa cần chốt |
|---|---|
| Offered | Cuộc gọi vào queue, xử lý re-entry/transfer như thế nào |
| Handled | Agent answer; quy tắc short call/test call |
| Abandoned | Caller rời trước answer; ngưỡng short abandon |
| Service Level | `% handled trong T giây`; mẫu số và short-abandon policy |
| ASA | Thời gian chờ trung bình của handled calls |
| AHT | Talk + Hold + ACW; xác định ACW timer nguồn nào |
| Occupancy | Handle time / staffed available time; state được tính/loại trừ |
| FCR | Không có repeat contact cùng issue trong cửa sổ N ngày; cần case/CRM data |
| Transfer Rate | Transfer leg/session nào được tính; consult vs blind |
| Queue Callback Success | PortSIP queue-callback request → connected trong SLA và đúng caller |
| Eligible | Contact vượt qua consent/DNC/suppression/timezone/retry policy ở thời điểm đánh giá |
| Attempted / Dispatch Requested | Logical `dial_attempt` đã qua final policy check và command được gửi tới PortSIP Adapter; có thể bị PBX reject hoặc rơi vào `reconcile_pending` |
| PBX Accepted | PortSIP xác nhận tạo/nhận một call session cho logical attempt; retry không được đếm trùng session |
| SIP Answered | Remote endpoint answer theo CDR; không đồng nghĩa đúng người cần gặp |
| Right-party Contact | Agent xác nhận gặp đúng đối tượng bằng disposition được kiểm soát |
| Conversion | Outcome nghiệp vụ do campaign định nghĩa, liên kết case/order/CRM khi có |
| Dialer Abandonment | Outbound được answer nhưng không có agent sẵn sàng; P0 progressive 1:1 đặt mục tiêu bằng 0 |
| Contact/Conversion Rate | Right-party hoặc conversion chia cho mẫu số được Campaign/Data Owner phê duyệt |

### Reporting authority và correction policy

| Metric/data | Source chính | Policy |
|---|---|---|
| Live call/queue/agent state | PortSIP WSI → app realtime projection | UI là projection; reconnect xong phải REST reconcile |
| Offered/handled/abandoned/SLA/ASA/talk/hold | PortSIP finalized CDR/Data Flow | App có thể trình bày lại nhưng phải đối soát với PortSIP golden dataset |
| PBX accepted/SIP answered/busy/no-answer/failed | PortSIP call session + finalized CDR | `dial_attempt` tương quan bằng opaque attempt ID và session/call IDs; reconciliation sửa event thiếu |
| Eligible/suppressed/retry/callback/right-party/conversion | Portsip CC + CRM outcome | Policy/version và denominator phải truy vết được; không suy right-party chỉ từ SIP answer |
| ACW/disposition/follow-up | Portsip CC | Event timestamp lưu UTC; hiển thị theo tenant timezone |
| FCR/case resolution | CRM/case master | Không suy FCR chỉ từ số điện thoại/CDR |
| Cross-channel journey | App warehouse/projection | Bắt đầu từ P1; không thay đổi metric voice gốc |

Tenant timezone định nghĩa ngày báo cáo và cutoff. Window 72 giờ gần nhất được phép recompute khi CDR đến muộn; correction sau đó phải versioned/audited. Exact cutoff/window là `Proposed policy`, Data/Business Owner phê duyệt trong Discovery.

## 6. Thứ tự phát hành khuyến nghị

1. `Release 0`: inbound/outbound/trunk cùng policy/config/form/workflow thin-slice PoC và golden evidence pack.
2. `Release 1`: integration hardening + Platform Kernel — IdP/organization, module contracts, four-layer authorization, Configuration/Metadata/Workflow registries, durable jobs và observability.
3. `Release 2`: Agent Desktop + inbound queue + manual/preview + CRM connector đầu tiên + contact/case/disposition trên metadata-driven forms.
4. `Release 3`: progressive 1:1 + campaign/list/compliance/retry/callback + guarded trunk/DID/rule Admin UI + bounded Config Studio/form/workflow editors.
5. `Release 4`: blended Supervisor realtime, reporting, inbound protection, security/resilience/usability hardening, pilot và P0 go-live.
6. `Release 5` (`P1`): CRM two-way/connector thứ hai, QA, visual builder nâng cao và outbound optimization vẫn giữ dial ratio ≤1,0.
7. `Release 6` (`P1`): SMS/WhatsApp và cross-channel reporting.
8. `Release 7` (`P2`): multi-line power/predictive/AMD, AI/WFM và runtime plugin/BPMN chỉ sau dữ liệu pilot cùng gate riêng.
