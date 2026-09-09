# Portsip CC

Kho lưu trữ kế hoạch cho dự án Contact Center sử dụng PortSIP PBX làm lõi thoại và tích hợp PortSIP SDK/API vào ứng dụng nghiệp vụ riêng.

## Trạng thái

- Giai đoạn: Discovery / Solution Design
- Phiên bản kế hoạch/bàn giao: `0.7`
- Phiên làm việc hiện tại: `002 — In Progress`; base `session-001`
- Ngày khởi tạo: `2026-09-07`
- Baseline để ước lượng: web-first, một tenant, một CRM connector, kênh voice blended inbound + outbound; outbound gồm manual/click-to-call, preview campaign và progressive 1:1
- Phiên bản ứng viên tại ngày khảo sát: PBX `v22.6.3` + SBC `v11.2.8`; exact PBX/SBC/SDK contract phải được khóa sau PoC vì tài liệu REST công khai mới nhất đang ở `v22.3`

Discovery đã được Project Owner khởi động ngày `2026-09-08`; scaffold Gate 0 đã được tạo và quality gate pass. Ngày `2026-09-09`, Project Owner chọn hướng `Adjust`: giữ kernel/authorization/voice P0 và role/config templates, chuyển visual/self-service form/workflow builders sang P1; ROM định hướng `24–26 tuần ±30%`. Đây chưa phải quyền product build; estimate và D-010 final gate vẫn chờ evidence.

Bộ tài liệu hiện được tổ chức như một handover package cho Product, Architecture, Developer, QA/Security và Operations. D-023/ADR-001 đã khóa TypeScript strict/React/NestJS/PostgreSQL cho Discovery scaffold; `docs/BUILD-PROFILE.md` là nguồn command chuẩn. Scaffold đã pass quality gate trên máy tạo; G0-02/G0-03 vẫn chờ independent clean-machine review. Chỉ khi các gate còn lại đạt và D-010 cho Go thì scaffold mới được coi là implementation baseline để bắt đầu product build.

## Định hướng chính

PortSIP chịu trách nhiệm cho SIP/media, trunk, DID, IVR, queue/ACD, recording và CDR. Sản phẩm `Portsip CC` tập trung vào trải nghiệm Agent/Supervisor, outbound campaign orchestration, dữ liệu khách hàng và ticket, tích hợp CRM, báo cáo hợp nhất, vận hành và một Admin UI có kiểm soát. Kiến trúc theo hướng modular, policy-driven, metadata-driven và configuration-first: tính năng mới đi qua contract/registry có phiên bản; quyền dữ liệu, tính năng, màn hình và trường/action được backend thực thi thống nhất; operator có thể cấu hình an toàn qua giao diện mà không chạy mã tùy ý. P0 có thể write tenant-owned trunk/DID và tenant-scope inbound/outbound rules; system/shared/IP-based trunk object cùng DID-pool assignment mặc định read-only/deep-link, nhưng tenant rule vẫn có thể tham chiếu trunk đã được System Admin gán nếu exact role/API cho phép.

Không để trình duyệt gọi PortSIP REST API bằng tài khoản quản trị. Backend tích hợp PortSIP qua REST, webhook và WSI/WebSocket; Agent Desktop sử dụng PortSIP VoIP/WebRTC SDK cho media và call control.

## Tài liệu

- [Mục lục và checklist bàn giao](docs/00-MUC-LUC-BAN-GIAO.md)
- [Kế hoạch triển khai](docs/01-KE-HOACH-TRIEN-KHAI.md)
- [Danh mục tính năng và backlog](docs/02-DANH-MUC-TINH-NANG.md)
- [Kiến trúc tích hợp](docs/03-KIEN-TRUC-TICH-HOP.md)
- [Checklist Discovery và PoC](docs/04-DISCOVERY-POC.md)
- [Nguồn tham khảo PortSIP và kiến trúc nền tảng](docs/05-NGUON-THAM-KHAO.md)
- [Decision register](docs/06-DECISION-REGISTER.md)
- [Outbound MVP và SIP Trunk Admin UI](docs/07-OUTBOUND-VA-SIPTRUNK-ADMIN.md)
- [Nền tảng mở rộng, phân quyền và cấu hình động](docs/08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md)
- [Sổ tay hiện thực cho developer](docs/09-SO-TAY-HIEN-THUC-CHO-DEVELOPER.md)
- [Chuẩn code, review và Definition of Done](docs/10-CHUAN-CODE-REVIEW-VA-DEFINITION-OF-DONE.md)
- [Hợp đồng API, event và dữ liệu](docs/11-HOP-DONG-API-EVENT-VA-DU-LIEU.md)
- [Chiến lược test, debug và runbook](docs/12-CHIEN-LUOC-TEST-DEBUG-VA-RUNBOOK.md)
- [Backlog khởi tạo và hướng dẫn phân công](docs/13-BACKLOG-KHOI-TAO-VA-PHAN-CONG.md)
- [Current Work Ledger — việc được phép bắt đầu](docs/14-CONG-VIEC-HIEN-TAI.md)
- [PMP-aligned checklist và kiểm soát dự án](docs/15-PMP-CHECKLIST-VA-KIEM-SOAT-DU-AN.md)
- [Role Registry — đội ngũ delivery bằng Codex](docs/ROLE-REGISTRY.md)
- [Kickoff và bàn giao phiên Codex tiếp theo](docs/16-KICKOFF-VA-BAN-GIAO-PHIEN-TIEP-THEO.md)
- [Build Profile](docs/BUILD-PROFILE.md)
- [ADR-001 — implementation stack](docs/adr/ADR-001-IMPLEMENTATION-STACK.md)
- [Sổ đăng ký phiên làm việc](docs/sessions/README.md)
- [Hồ sơ đóng phiên 001](docs/sessions/SESSION-001.md)
- [Hồ sơ phiên 002](docs/sessions/SESSION-002.md)

Theo dõi hằng ngày tại [TASKS.md](TASKS.md); xem dạng bảng qua [dashboard.html](dashboard.html). Mọi item trong backlog chưa xuất hiện ở live board mặc định là `Not Started / 0%`; chỉ tính `100%` khi acceptance và evidence đã được approver xác nhận.

## Mốc tiếp theo

Hoàn thành Discovery và vertical-slice PoC cho bốn lát cắt: inbound DID → IVR → Queue → Agent; preview/progressive 1:1 → Agent → PSTN; tạo trunk/rule ở trạng thái tắt nếu endpoint hỗ trợ → đọc lại → test → kích hoạt có audit/rollback; và policy/config/form/workflow → preview/simulate → publish → rollback. Cả hai chiều gọi phải tương quan đúng interaction, event, CDR và recording reference; direct API/realtime/export phải giữ đúng data scope và field policy.
