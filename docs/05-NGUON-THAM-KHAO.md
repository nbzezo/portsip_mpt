# Nguồn tham khảo PortSIP và kiến trúc nền tảng

Tài liệu được kiểm tra ngày `2026-09-07`. Khi bắt đầu implementation, phải khóa exact PBX/SDK version và chạy contract tests; tài liệu web không thay thế xác nhận kỹ thuật/license từ PortSIP.

## Nền tảng và SDK/API

- [PortSIP PBX/SBC download — current published versions](https://www.portsip.com/download-portsip-pbx/)
- [PortSIP PBX v22.6.3 release notes](https://www.portsip.com/2026/08/12/portsip-pbx-v22-6-3/)
- [PortSIP PBX version policy / change summary](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/summary-of-changes)
- [PortSIP PBX Administration Guide](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide)
- [PortSIP PBX v22 installation and requirements](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/1-installation-of-the-portsip-pbx/installation-of-portsip-pbx-v22.x/install-portsip-pbx)
- [PortSIP VoIP SDK overview](https://www.portsip.com/portsip-voip-sdk/)
- [PortSIP SDK downloads](https://www.portsip.com/download-portsip-voip-sdk/)
- [PortSIP SDK license agreement](https://support.portsip.com/portsip-communications-solution/faq/portsip-sdk-license-agreement)
- [PortSIP Calling APIs / supported SDK platforms](https://support.portsip.com/development-portsip/calling-apis)
- [PortSIP REST API v22.3](https://support.portsip.com/development-portsip/rest-apis/version-22.3)
- [PortSIP REST API change summary](https://support.portsip.com/development-portsip/rest-apis/summary-of-changes)
- [PortSIP Call Control API](https://support.portsip.com/development-portsip/call-control-api)
- [PortSIP WSI Pub/Sub](https://support.portsip.com/development-portsip/going-real-time-with-portsip-pbx-pub-sub)
- [PortSIP WSI v22.3](https://support.portsip.com/development-portsip/going-real-time-with-portsip-pbx-pub-sub/version-22.3)
- [PortSIP Webhook Events](https://support.portsip.com/development-portsip/webhook-notifications)
- [Webhook delivery behavior](https://support.portsip.com/development-portsip/webhook-notifications/receiving-events-via-a-webhook)
- [Webhook event reference](https://support.portsip.com/development-portsip/webhook-notifications/event-reference)

## SIP trunk, DID và call routing

- [REST v22.3 — Trunks](https://support.portsip.com/development-portsip/rest-apis/version-22.3/trunks)
- [REST v22.3 — Inbound Rules](https://support.portsip.com/development-portsip/rest-apis/version-22.3/inbound-rules)
- [REST v22.3 — Outbound Rules](https://support.portsip.com/development-portsip/rest-apis/version-22.3/outbound-rules)
- [Configuring SIP Trunks — provider guides](https://support.portsip.com/portsip-communications-solution/configuring-sip-trunks)
- [Configuring SIP Trunk — PBX administration](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/7-trunk-management/configuring-sip-trunk)
- [Configuring Outbound Rule](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/8-call-route-management/configuring-outbound-rule)
- [Handle Outbound Calls Through SIP Trunk](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/7-trunk-management/handle-outbound-calls-through-sip-trunk)

Public REST v22.3 liệt kê riêng `Trunks`, `Inbound Rules` và `Outbound rules`, nên về mặt API có thể xây Admin UI cho phạm vi này. Changelog v22.3 cũng cho biết inbound/outbound rules yêu cầu `PhoneSystem.FullAccess` và provider export yêu cầu `Trunk.FullAccess`; đây là lý do token chỉ nằm ở backend và quyền ứng dụng phải hẹp hơn quyền PortSIP gốc. Administration Guide phân biệt trunk ownership: IP-based/shared trunk cần System Admin, trong khi tenant chỉ được thao tác loại trunk thuộc tenant theo quyền; P0 UI phải giữ đúng ranh giới này.

## Contact Center

- [Call Queue overview](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/16-call-queue)
- [Configuring Call Queue](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/16-call-queue/configuring-call-queue)
- [Queue Callback and Queue Exit](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/16-call-queue/configuring-queue-callback-and-queue-exit)
- [Agent States and Work Modes](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/16-call-queue/agent-states-and-work-modes)
- [Skills-Based Routing](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/16-call-queue/skills-based-routing)
- [Live Wallboards](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/16-call-queue/live-wallboards)
- [Silent Monitoring, Whisper and Barge](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/16-call-queue/silent-monitoring)
- [Roles and Permissions](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/17-roles-and-permissions)

## Dữ liệu, báo cáo, recording và digital

- [CDR](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/20-cdr-and-call-recordings/cdr)
- [Push CDR to Webhook / WebSocket](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/20-cdr-and-call-recordings/push-cdr)
- [Call Recordings](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/20-cdr-and-call-recordings/call-recordings)
- [Call Reports and Data Flow](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/21-call-reports)
- [Digital Engagement Channels](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/28-digital-engagement-channels)
- [SMS Channel](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/28-digital-engagement-channels/sms-channel)
- [WhatsApp Channel](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/28-digital-engagement-channels/whatsapp-channel)
- [Manage SMS/WhatsApp Conversations](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/28-digital-engagement-channels/manage-sms-whatsapp-message-conversations)
- [AWS AI Transcription](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/34-ai-transcription/configuring-aws-ai)

## Bảo mật

- [PortSIP Security Features](https://support.portsip.com/portsip-communications-solution/portsip-pbx-administration-guide/portsip-security-feature)

## Kiến trúc mở rộng, phân quyền và cấu hình động

- [NIST SP 800-162 — Guide to Attribute Based Access Control](https://csrc.nist.gov/pubs/sp/800/162/upd2/final)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Business Logic Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html)
- [JSON Schema specification — Draft 2020-12](https://json-schema.org/specification)
- [CloudEvents specification](https://cloudevents.io/)
- [OpenFeature — Flag Evaluation](https://openfeature.dev/specification/sections/flag-evaluation/)
- [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)

Các nguồn trên là guardrail thiết kế, không khóa sớm implementation. Baseline dùng RBAC cho capability bundle, kết hợp thuộc tính và quan hệ resource để quyết định scope; deny-by-default và kiểm tra ở server cho mọi request. JSON Schema phù hợp làm hợp đồng typed giữa metadata/form frontend và validation backend. CloudEvents, OpenFeature và OpenTelemetry cung cấp mẫu trung lập cho event envelope, feature-flag adapter và observability; việc chọn thư viện cụ thể chỉ diễn ra sau benchmark/PoC.

## Reference implementation và developer workflow

- [NestJS — Modules](https://docs.nestjs.com/modules)
- [TypeScript — `strict` compiler option](https://www.typescriptlang.org/tsconfig/strict)
- [React documentation](https://react.dev/learn)
- [pnpm workspaces](https://pnpm.io/workspaces)
- [OpenAPI Specification](https://spec.openapis.org/oas/)
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [PostgreSQL — Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Playwright — Test fixtures](https://playwright.dev/docs/test-fixtures)

Các nguồn này đã được dùng để chốt D-023/ADR-001 cho Discovery scaffold. Exact versions và command nằm trong `docs/BUILD-PROFILE.md` và lockfile; G0-02/G0-03 vẫn cần independent clean-machine review. Nếu spike/review thất bại, D-023 phải được mở lại thay vì vá ngầm. NestJS module encapsulation phù hợp hướng modular monolith; TypeScript `strict`, OpenAPI, JSON Schema, PostgreSQL RLS defense-in-depth và isolated Playwright fixtures hỗ trợ các quality gates đã nêu, nhưng architecture tests và backend policy enforcement vẫn là trách nhiệm của Portsip CC.

## Những điểm cần xác minh trực tiếp với vendor

- Exact v22 patch tương thích với exact SDK/browser package nào.
- Vì PBX hiện hành v22.6.3 mới hơn public REST/WSI reference v22.3, cần OpenAPI/changelog/compatibility statement đúng build.
- API/WSI schema, rate limits, reconnect/replay semantics và support lifecycle.
- Webhook retry window được tài liệu hóa chưa nhất quán; đo và xác nhận trên sandbox/vendor thay vì hard-code giả định.
- Quyền phân phối ứng dụng sử dụng SDK và chi phí/license theo số concurrent calls/extensions/tenant.
- Call control nào có trong WebRTC SDK so với REST/FAC, đặc biệt attended transfer và supervisor monitoring.
- Progressive nên dùng SDK agent-originated hay authenticated Call Control API; xác minh idempotency, `user_data`/correlation field và lookup khi POST timeout.
- Full provider/trunk schema trên exact build: auth mode, transport, host/port, outbound proxy, DID pool, credential update/rotation và IP allowlist.
- API status/registration/test support, create-disabled semantics, dependency behavior khi disable/delete và read-after-write consistency.
- Permission model cho `/api/providers`, `/api/inbound_rules`, `/api/outbound_rules`; cách cô lập tenant khi capability `PhoneSystem.FullAccess` rộng.
- Carrier CPS/concurrency, caller-ID ownership/verification, emergency/premium-number safeguards và anti-spam rules.
- Cơ chế truy cập recording/transcript an toàn và thời điểm asset sẵn sàng sau CDR.
- HA/cluster, backup/restore và capacity sizing cho tải thực tế.
