# Checklist Discovery và PoC

Kickoff `2026-09-08`: Discovery đã bắt đầu. Public PortSIP scan nằm tại [DISC-PS-001](evidence/DISC-PS-001.md); D-023/stack tại [ADR-001](adr/ADR-001-IMPLEMENTATION-STACK.md); scaffold/build evidence tại [G0-002](evidence/G0-002.md). Các checkbox đòi exact customer license, sandbox hoặc real behavior vẫn để mở.

## 1. Thông tin cần chốt với nghiệp vụ

Baseline đang dùng để estimate là **single-tenant, web-first, một CRM connector, voice blended inbound + outbound và P0 extensibility kernel + bounded self-service** theo [blueprint mở rộng](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md). P0 outbound gồm manual, preview và progressive 1:1. ROM tương ứng là `28–32 tuần ±30%`; phương án tăng tốc `26–29 tuần ±30%`. `24–26 tuần` chỉ là phương án Adjust khi self-service form/workflow builders chuyển P1. Native, commercial multi-tenant, digital, advanced dialer hoặc full low-code/plugin runtime đều kích hoạt re-scope/re-estimate.

- [ ] Loại Contact Center: customer service, telesales, collections, helpdesk hay blended.
- [ ] Persona, team, queue và escalation path.
- [ ] Cây tổ chức `tenant → business unit → team`; quan hệ user/resource với queue/campaign; định nghĩa `own/assigned` khi một user hoặc resource thuộc nhiều scope.
- [ ] Call journey hiện tại và pain points có số liệu.
- [ ] Giờ hoạt động, holiday, ngôn ngữ và múi giờ.
- [ ] SLA/ASA/AHT/ACW/FCR/abandonment: công thức, nguồn và measurement plan; target chỉ duyệt sau khi có baseline.
- [ ] Disposition taxonomy, required fields, case lifecycle và follow-up rules.
- [ ] VIP, blacklist, skill, last-called-agent, exclusive-agent và callback policy.
- [ ] Supervisor permissions: monitor, whisper, barge, force state và recording access.
- [ ] Ma trận persona × capability × scope × data classification cho Agent, Supervisor, Campaign Manager, Compliance, Telephony Config và Platform Admin.
- [ ] Bốn lớp quyền: data scope, quyền tính năng/capability, screen/navigation và field/action; chốt field nào hide/mask/read/edit/search/export/download/listen.
- [ ] Separation-of-duties cho role/policy, campaign publish, compliance override và trunk/config apply; break-glass owner, MFA, TTL, alert và hậu kiểm.
- [ ] Entity/custom-field types/form bindings nào cần P0; giới hạn field/index/report và classification/retention mặc định.
- [ ] Business workflow P0: states/transitions, conditional required fields, approved actions, approval quorum, SLA/timer/escalation và in-flight migration policy.
- [ ] Setting catalog: operator-safe, scoped admin, advanced và system-only; allowed scope, precedence, approval, activation/restart và owner từng key.
- [ ] Xác nhận Config Studio chỉ chạy declarative metadata + approved registry; không arbitrary JavaScript/SQL/shell/URL/remote component hoặc operator-uploaded plugin ở P0.
- [ ] Xác nhận voice-only blended go-live; ghi change request nếu bắt buộc SMS/WhatsApp/email.
- [ ] Chốt định nghĩa manual, preview, progressive 1:1 và “power-safe” `≤1,0`; multi-line power/predictive/AMD không thuộc P0.
- [ ] Outbound purpose/market, consent provenance/expiry, regulatory DNC, suppression scope, contact timezone, quiet hours/DST và caller-ID policy.
- [ ] Campaign/list owner, CSV/API schema, dedupe, retry/max-attempt/cooldown, callback ownership, script/disposition và conversion definition.
- [ ] Blended priority: inbound queue depth/longest wait/SLA threshold, hysteresis và người được quyền emergency stop.
- [ ] Current-state volume/cost/pain baseline, benefit hypothesis, ngân sách và TCO ba năm.

## 2. Capacity worksheet

| Tham số | Giá trị cần điền |
|---|---|
| Tổng agent / peak logged-in agent | TBD / TBD |
| Concurrent calls bình thường / peak | TBD / TBD |
| Queue / DID / trunk | TBD / TBD / TBD |
| Calls per day / peak calls per second | TBD / TBD |
| Outbound contacts/list/day và attempts/day | TBD / TBD |
| Preview/progressive mix, connect rate, right-party rate | TBD / TBD / TBD |
| Provider/trunk CPS và concurrent-call limits | TBD / TBD |
| Peak outbound reservations/dispatches per second | TBD / TBD |
| Average talk + hold + ACW | TBD / TBD / TBD |
| Recording % / format / retention | TBD / TBD / TBD |
| Concurrent supervisor monitoring | TBD |
| Business units / teams / scoped role bindings | TBD / TBD / TBD |
| Queue/campaign resource relationships / peak policy decisions per second | TBD / TBD |
| Custom fields/forms/workflow versions mỗi entity | TBD / TBD / TBD |
| Active workflow instances / durable timers / automation actions per second | TBD / TBD / TBD |
| Report/export jobs, peak rows và file retention | TBD / TBD / TBD |
| SMS/WhatsApp conversations per day (P1 sizing) | TBD |
| Growth 12/24/36 tháng | TBD / TBD / TBD |
| Uptime, RPO, RTO | TBD / TBD / TBD |

## 3. PortSIP inventory

- [ ] PBX/SBC version/build và lifecycle; baseline khảo sát là PBX v22.6.3 + SBC v11.2.8.
- [ ] License edition, max extensions/concurrent calls, contact-center/HA/AI/SDK entitlements.
- [ ] SDK binaries, browser JavaScript/WebRTC package, API docs, sample source và redistribution terms.
- [ ] REST API/OpenAPI đúng exact instance; public reference hiện dừng ở v22.3; base URL, service-account/role model và rate limits.
- [ ] `/api/providers`, `/api/inbound_rules`, `/api/outbound_rules`: create/update/get/delete/export contract, required capabilities, error model và field differences trên exact v22.6.3 build.
- [ ] Xác minh `PhoneSystem.FullAccess` cho inbound/outbound rules và `Trunk.FullAccess` cho provider/trunk; thiết kế service account không cấp token cho browser.
- [ ] Provider secret behavior: response có/không trả password, update-without-secret, rotate credential, registration/status signal và disabled-before-test support.
- [ ] WSI endpoint, topics/keys, auth model và compatibility với exact v22 build.
- [ ] Webhook authentication, duplicate/out-of-order/loss behavior, retry/timeout thực tế và source IP strategy.
- [ ] Queue/routing/monitor/reporting/recording modules đang bật.
- [ ] IM/Data Flow service version và topology.
- [ ] Supported browsers/OS, codec và device/headset list.
- [ ] Vendor support channel, severity/SLA và escalation contacts.

## 4. Hạ tầng và tích hợp

- [ ] Cloud/on-prem, network zones, NAT/SBC, firewall, DNS và trusted certificates.
- [ ] SIP trunk/provider, DID, caller ID, codec, emergency call và failover trunk.
- [ ] Carrier rate limit/CPS/concurrency, caller-ID ownership/verification, anti-spam policy, allowed prefixes và test-number arrangements.
- [ ] Production change policy cho trunk/DID/rules: maker-checker, maintenance window, emergency change, snapshot/rollback và vendor escalation.
- [ ] Dev/UAT/Prod PBX hoặc tenant tách biệt.
- [ ] Một CRM/ticketing master và OIDC IdP cho MVP; có sandbox, owner và test account trước khi đồng hồ PoC chạy.
- [ ] IdP claims/group mapping, service identities, authentication-strength/step-up contract và policy-information freshness.
- [ ] Policy/config/metadata/workflow durable store, cache key/TTL/invalidation, revoke target, backup/restore và fail-closed/degraded behavior.
- [x] D-023: exact runtime/framework/package manager, database access/migration, validation/codegen/test/CI toolchain đã khóa cho Discovery scaffold; Security/DevOps production review là condition trước D-010.
- [ ] Dev/Sandbox/UAT/Prod promotion bằng immutable version/checksum; sandbox chỉ synthetic/anonymized data, connector stub và bị chặn real dial/send/production secrets.
- [ ] Data residency, encryption/KMS, backup, archive và legal hold.
- [ ] Desktop policy, browser version, microphone permission và approved headsets.
- [ ] VDI/VPN/remote-agent scenario và network quality baseline.
- [ ] Monitoring/SIEM/on-call hiện có.

## 5. PoC exit criteria

PoC 10 ngày **không phải build toàn bộ P0 hoặc full Config Studio**. Nó dùng thin vertical slices, test harness và mock/sandbox để chứng minh các contract killer. Platform slice chỉ cần một organization/resource chain, một custom form, một inherited setting và một business workflow/timer chạy xuyên frontend → BFF/PDP → query/command → realtime/export/worker; editor có thể là guided form tối thiểu. `P0` vẫn là toàn bộ hàng `MVP` phải hoàn tất trước go-live; các mục smoke/stretch dưới đây có thể kết thúc bằng evidence + implementation/test plan thay vì production UI hoàn chỉnh. Mọi ngưỡng là proposed target, chưa phải SLA vendor.

### 5.1 Must-prove contract gates cho Day 10

- [ ] SDK register/unregister/reconnect trên Chrome và Edge mục tiêu; có credential threat decision.
- [ ] Một inbound DID → IVR → queue → skill agent → answer → end với event/CDR/recording correlation.
- [ ] Một manual/preview flow: consent/script/history → agent Dial/Skip reason; không phát lệnh trước xác nhận.
- [ ] Một progressive 1:1 flow: reserve đúng một agent Ready rồi dial; stale reservation không tạo call.
- [ ] Unknown call-create result vào `reconcile_pending`; worker restart/retry không tạo duplicate PBX session.
- [ ] WSI reconnect/resubscribe; duplicate/reordered event không làm sai state; REST/CDR reconciliation sửa gap.
- [ ] Organization/scope thin slice có `tenant → business unit → team`, queue/campaign relationships và own/assigned predicate; resource nhiều relationship cho kết quả deterministic, không tự mở rộng scope.
- [ ] Capability Registry + PDP/PIP/PEP proof cho bốn lớp quyền: data, capability, screen/navigation và field/action; missing/unknown policy deny mặc định và feature flag không cấp quyền.
- [ ] Một permission matrix chạy qua list/detail/object lookup/search/count/facet, WebSocket/SSE, report/export và background worker; cùng subject/scope thấy cùng resource universe, direct API/deep link không vượt hidden menu/button.
- [ ] Restricted phone/PII field được omit/mask nhất quán; `view`, `unmask`, `edit`, `search`, `export`, recording `play/download` là capability riêng; browser không nhận field bị cấm.
- [ ] Role/team/resource relationship revoke phát policy-cache invalidation và thu hẹp API/realtime trong proposed window được đo; PDP/PIP lỗi không tạo stale allow vô hạn.
- [ ] Service worker dùng service identity + tenant/delegated campaign scope; PortSIP/config side effect được re-authorize ngay trước execute và không chạy như super-admin.
- [ ] Custom form thin slice: operator thêm một custom field, gắn theo queue/campaign, đặt conditional required/read-only, preview theo role và publish không deploy; backend từ chối payload bypass UI.
- [ ] Effective-setting thin slice: environment/tenant/domain-resource override, hiển thị resolution chain + `Reset to inherited`; ambiguous team/queue/campaign precedence bị chặn, secret/system-only key không xuống browser.
- [ ] Business-workflow thin slice: state/transition + required form + maker-checker + durable SLA timer + approved action; simulate có decision trace, restart không mất timer và không tạo duplicate logical outcome.
- [ ] Published schema/config/workflow version bất biến; instance pin version cũ; một breaking-field/in-flight migration có mapping, dry-run, impact, approval và rollback proof.
- [ ] Registry/contract proof: một mock adapter hoặc approved workflow action mới được đăng ký qua typed contract + conformance tests, không sửa domain/call FSM và có health/timeout/retry/DLQ/kill-switch path.
- [ ] Sandbox proof: arbitrary JavaScript/SQL/shell/URL/remote component bị từ chối; network/secret boundary chặn real dial/send và Prod connector.
- [ ] Sau khi G0-01/D-023 Approved, chạy G0-02/G0-03 scaffold spike: máy sạch làm được clone → install → start dependencies → migrate → seed → protected request → aggregate+outbox → worker → test/build bằng `docs/BUILD-PROFILE.md`; architecture rule chặn một forbidden import mẫu. Spike fail thì mở lại D-023, không vá ngoài Build Profile.
- [ ] Trunk ownership/role matrix; tenant-owned eligible trunk và tenant-scope rules đi qua draft → validate → apply disabled nếu hỗ trợ, nếu không maintenance/fallback → read-back → synthetic test → activate → rollback. Chứng minh rule có/không được tham chiếu assigned system/shared trunk; chính trunk object/DID-pool assignment đó vẫn read-only.
- [ ] Secret write-only/masked; snapshot chỉ giữ retained vault secret-version reference; browser/tenant admin không nhận PortSIP bearer hoặc quyền System/shared/IP-based trunk.
- [ ] DNC/suppression/consent/timezone/caller-ID final check fail closed; blocked attempt có audit và 0 PBX session.
- [ ] Exact PBX/SDK/OpenAPI/license/permission evidence và scope/team revised ROM đủ cho D-010: `28–32 tuần ±30%`, accelerated `26–29`, hoặc Adjust `24–26` khi builders chuyển P1.

### 5.2 Representative smoke/stretch evidence

- [ ] CSV/API list dry-run, E.164/dedupe, timezone/DST và deterministic retry/callback bằng thin UI hoặc test harness.
- [ ] Provider/trunk/tenant/campaign CPS/concurrency guard, pause/stop ≤5 giây và emergency kill switch.
- [ ] Mixed-load smoke: inbound threshold tự pause outbound và resume có hysteresis, không cắt active calls.
- [ ] Mute, hold/resume, DTMF, blind transfer và attended transfer.
- [ ] Agent Ready/Not Ready/Wrap Up đồng bộ đúng giữa UI và PortSIP.
- [ ] Screen-pop đúng contact/queue trong P95 ≤2 giây ở tải PoC được ghi lại.
- [ ] Anonymous caller, no-answer, busy, rejected, caller-hangup và queue-abandon.
- [ ] Silent monitor/whisper/barge chỉ chạy với supervisor được cấp quyền và có audit.
- [ ] Agent own, Team Supervisor, BU Supervisor, Campaign Manager, Platform Admin và cross-scope attacker chạy cùng golden dataset; Platform Admin không mặc định thấy unmasked PII/recording.
- [ ] Một queue/campaign được liên kết nhiều team, một user đổi team giữa phiên và một direct resource-ID probe đều không gây IDOR, count/facet leak hoặc stale realtime event.
- [ ] Maker không tự approve/publish role/config/workflow/campaign/trunk change; break-glass yêu cầu step-up, reason/ticket, tự hết hạn, alert và hậu kiểm.
- [ ] Export job re-authorize tại execute và download, áp row/field policy, row cap/TTL/watermark và audit; revoke trước download chặn file.
- [ ] Form/schema lifecycle gồm add, deprecate/hide, type-change rejected, typed-index/backfill dry-run và render record ở schema version cũ.
- [ ] Workflow negative cases: unauthorized transition, missing required field, unregistered action, automatic loop, timeout/unknown non-idempotent action và migration mapping thiếu đều fail closed/có safe recovery.
- [ ] Setting negative cases: user override compliance/security key, ambiguous precedence, stale ETag, invalid range/dependency, publish không approval và rollback incompatible đều bị chặn.
- [ ] CRM outage không làm gián đoạn cuộc gọi; note draft được phục hồi/sync.
- [ ] Browser refresh/network flap/device unplug có behavior đã thống nhất.
- [ ] Logs/traces tìm được call/attempt/config change bằng correlation IDs.
- [ ] Một burst test và một soak test đại diện; full capacity qualification thực hiện ở hardening/pilot.

## 6. Golden call/attempt/config/access/workflow dataset

Tạo một bộ mặc định 30–50 cuộc gọi được thực thi, cộng các blocked-attempt và config-negative cases không phát sinh cuộc gọi. QA có thể đổi denominator trước khi chạy nếu vẫn bao phủ đủ nhánh sau:

- handled trong/ngoài SLA;
- short/long abandoned;
- IVR exit và invalid DTMF;
- callback thành công/thất bại;
- overflow/no-agent/after-hours;
- hold và nhiều call legs;
- blind/attended transfer;
- monitor/whisper/barge;
- failed trunk/4xx/5xx SIP cases;
- preview skip, progressive success và progressive reservation expiry;
- DNC/suppressed/expired-consent/outside-window/unknown-timezone/DST cases;
- busy/no-answer/voicemail-agent-disposition/retry-exhausted/scheduled callback;
- worker crash, unknown dispatch result, pause/stop và inbound-protection transition;
- trunk/rule read-back mismatch, failed test, rollback và drift;
- Agent own, Team/BU Supervisor, Campaign Manager, Platform Admin và cross-scope attacker trên cùng resource set; direct-ID/search/count/realtime/export/file parity;
- Restricted field hide/mask/unmask/edit/export, role/relationship revoke và self-approval/break-glass cases;
- custom field/form add/deprecate, conditional required, record pinned schema cũ và typed-index/backfill;
- inherited setting/effective-source, ambiguous precedence, stale ETag, secret/system-only browser exclusion và rollback;
- workflow v1/v2 pinning, timer qua restart/DST, invalid loop/action, unknown non-idempotent outcome và approved migration;
- extension/action timeout, retry/DLQ, health failure và kill switch;
- duplicate/reordered/missing event simulation.

Đối soát từng executed call bằng event timeline, UI state, CDR, recording nếu đủ điều kiện, disposition và KPI projection; blocked attempt phải có policy decision/audit mà không có PBX session. Access case phải chứng minh cùng authorized universe và field obligation trên mọi channel; config/schema/workflow case phải có version, decision trace, diff/simulation, publish/migration/rollback evidence. Bộ này trở thành regression pack cho mọi nâng cấp PortSIP/SDK và platform contract.

## 7. Go/Adjust/Stop gate sau PoC

### Go

- Exact PortSIP version/license hỗ trợ toàn bộ **PortSIP-dependent** capability trong `MVP/P0`; app-owned P0 được đánh giá bằng feasibility/estimate riêng.
- Event/CDR correlation ổn định và repair được.
- Browser/media quality đạt target trên network/headset thực tế.
- Estimate và vận hành nằm trong ngân sách/rủi ro chấp nhận được.

### Adjust

- Giữ PortSIP PBX nhưng đổi Agent Desktop sang native SDK.
- Reuse PortSIP ONE/portal cho một số chức năng thay vì custom UI.
- Thu nhỏ MVP theo wave nếu PoC/capacity/permission không đạt. Có thể dời từng phần và re-estimate; nếu buộc giữ mốc 18 tuần thì cả progressive lẫn config write phải sang wave sau, trunk UI chỉ read-only/deep-link.

### Stop/đánh giá lại nền tảng

- License/redistribution hoặc API/SDK contract không đáp ứng mô hình thương mại.
- Không đạt chất lượng/HA/capacity mục tiêu trên topology bắt buộc.
- Không thể đảm bảo event/CDR integrity, tenant isolation hoặc compliance controls.

## 8. Câu trả lời cần từ Product và Technical Owners

1. Bao nhiêu agent đăng nhập và bao nhiêu cuộc gọi đồng thời ở peak?
2. Xác nhận web-only MVP; nếu cần Windows/mobile native, lý do và deadline là gì?
3. Xác nhận một công ty/tenant ở MVP; nếu cần multi-tenant, business model và isolation requirement là gì?
4. CRM/ticketing và IdP nào phải tích hợp đầu tiên?
5. Xác nhận voice-only blended go-live; thị trường/purpose nào được chạy manual, preview và progressive 1:1?
6. PortSIP PBX/license/SDK hiện đã có chưa; exact version là gì?
7. Cloud hay on-prem; yêu cầu HA/DR và data residency ra sao?
8. Recording/transcript lưu bao lâu, ai được nghe/tải và có legal hold không?
9. Consent/DNC/timezone/caller-ID và retry/max-attempt policy nào áp dụng; ai có quyền emergency stop?
10. Deadline, ngân sách và đội ngũ thực tế là gì?
11. Có chấp nhận Admin UI chỉ quản lý trunk/DID/inbound-outbound rules, còn transport/SBC/firewall/certificate tiếp tục ở PortSIP Portal không?
12. Có yêu cầu maker-checker cho production trunk/rule change và maintenance/rollback window nào?
13. Outbound dùng chung blended agent pool với inbound hay một pool riêng; nếu dùng chung thì inbound protection ưu tiên tới mức nào?
14. Write-enabled Trunk Admin UI có bắt buộc cho go-live hay read-only/deep-link là phương án `Adjust` chấp nhận được?
15. Danh sách trunk nào tenant-owned Register/Accept Register và trunk nào system/shared/IP-based do PortSIP System Admin quản lý?
16. Hệ thống nào là nguồn chuẩn cho lead/consent, outcome sync một hay hai chiều với CRM, và KPI kinh doanh mục tiêu là gì?
17. Business unit/team nào là scope chuẩn; queue/campaign có thể gắn nhiều team ra sao; `own/assigned/participant` được định nghĩa thế nào?
18. Ai được xem/sửa/unmask/export từng nhóm PII, nghe/tải recording và phê duyệt quyền; role nào bắt buộc tách maker/approver/executor?
19. Những entity, field type, form binding và số lượng custom field nào bắt buộc ở go-live; field nào cần search/index/report/export?
20. Business workflow nào phải tự thiết kế ở P0; action/timer/SLA/approval nào cần sẵn, và đâu là invariant tuyệt đối không cho operator sửa?
21. Setting nào operator được tự đổi, setting nào cần approval/step-up, setting nào chỉ System Admin/IaC; precedence khi team/queue/campaign cùng khớp là gì?
22. Có bắt buộc visual/self-service form và workflow builders khi go-live không, hay template-guided configuration là phương án `Adjust` chấp nhận được?
23. Chọn delivery baseline `28–32 tuần`, accelerated `26–29 tuần` có tăng người, hay `Adjust` `24–26 tuần` bằng cách chuyển builders sang P1?
24. Engineering Lead có phê duyệt D-023 reference stack hay chọn stack khác; exact versions, support horizon, package manager, migration/test tool và Build Profile owner là ai?
