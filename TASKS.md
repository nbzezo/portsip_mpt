# Tasks

## Active

- [ ] **DISC-KO-001 — Kickoff, phân vai và owner assignment** - In Review/90%; actual start 2026-09-08; assignee Codex; accountable Project Owner/user; due 2026-09-09
  - Remaining: Project Owner xác nhận/thay account tạm thời; bổ nhiệm Security, Telephony và independent QA/Ops trước các PoC có side effect.
  - Evidence: `docs/evidence/DISC-KO-001.md`
- [ ] **DISC-PS-001 — Xác minh PortSIP version/API/SDK/license** - Verification/75%; actual start 2026-09-08; assignee Codex; accountable Telephony Owner (vacancy); due Discovery Day 3
  - Public evidence xác nhận PBX 22.6.3, SBC 11.2.8, REST/WSI public 22.3 và SDK native 19.6.2; exact customer artifact/license/sandbox còn thiếu.
  - Next action: named Telephony Owner gửi request đã chuẩn bị; Security + Architecture review response trước khi mở PortSIP PoC.
  - Evidence: `docs/evidence/DISC-PS-001.md`, `docs/evidence/PORTSIP-EXACT-CONTRACT-REQUEST.md`
- [ ] **DISC-ARC-001 — Chốt baseline kiến trúc mở rộng/phân quyền/cấu hình động** - In Review/90%; actual start 2026-09-08; assignee Codex; accountable Project Owner/user; due Discovery Day 5
  - D-016–D-022 đã có Discovery baseline; remaining named Security/Product/Ops review và thin-slice evidence.
  - Evidence: `docs/evidence/DISC-ARC-001.md`, `docs/08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md`
- [ ] **G0-02 — Discovery monorepo scaffold** - Verification/80%; actual start 2026-09-08; assignee Codex; accountable Engineering Lead interim; due 2026-09-09
  - `pnpm run check` PASS; clean-machine execution template đã chuẩn bị; remaining independent review/replay.
  - Evidence: `docs/evidence/G0-002.md`, `docs/evidence/G0-CLEAN-MACHINE-REVIEW.md`
- [ ] **G0-03 — Build Profile** - In Review/90%; actual start 2026-09-08; assignee Codex; accountable Engineering Lead interim; due Discovery Day 5
  - Remaining: người không viết scaffold chạy lại template trên máy sạch và ký evidence.
  - Evidence: `docs/BUILD-PROFILE.md`, `docs/evidence/G0-002.md`, `docs/evidence/G0-CLEAN-MACHINE-REVIEW.md`
- [ ] **G0-05 — Architecture dependency tests** - In Review/90%; actual start 2026-09-08; assignee Codex; accountable Solution Architect interim; required reviewers Engineering Lead + Security; due Gate 0
  - Source scan cùng allowed/forbidden fixtures cho public contract, owned DTO, shared primitive, NestJS/package, PortSIP browser SDK, cross-module internal/repository, shared ORM/persistence và vendor DTO leak đều PASS trong session 002.
  - Remaining: independent rule-coverage/security review và xác nhận path convention trước D-010.
  - Evidence: `docs/evidence/G0-005.md`
- [ ] **DISC-HO-001 — Fresh-reader validation** - Ready/0%; Discovery docs-only; assignee reviewer độc lập đầu tiên; Engineering Lead accountable; Solution Architect + QA Lead review; due T+1 ngày làm việc từ lúc nhận repo
  - Evidence: `docs/evidence/DISC-HO-001.md`
  - Không dùng credential hoặc gọi vendor/production; review scaffold bằng Build Profile.

## Waiting On

- [ ] **G0-04 — CI baseline** - Blocked/0%; waiting on G0-02 since 2026-09-08; owner Engineering Lead/DevOps; target Gate 0
- [ ] **G0-06 — Local/CI synthetic environment** - Blocked/0%; Docker unavailable and DevOps/Security owners vacant since 2026-09-08; target Gate 0
- [ ] **POC-TEL-001 — Inbound + event/CDR/recording PoC** - Blocked/0%; waiting on D-002 exact sandbox/SDK/API and named Telephony/Security reviewers since 2026-09-08; target Day 6
- [ ] **POC-OUT-001 — Preview/progressive 1:1 outbound PoC** - Blocked/0%; waiting on D-002, D-008/D-013 compliance/carrier inputs and synthetic environment since 2026-09-08; target Day 8
- [ ] **POC-TRUNK-001 — SIP trunk/DID/rule Admin PoC** - Blocked/0%; waiting on exact endpoint/role/ownership matrix and approved isolated sandbox since 2026-09-08; target Day 8
- [ ] **POC-CONFIG-001 — Authorization/config/form/workflow thin slice** - Blocked/0%; waiting on G0-06 and named Security/Product/Ops reviewers since 2026-09-08; target Day 9
- [ ] **G0-07 — Contributor quick-start** - Blocked/0%; waiting on G0-03–G0-06 since 2026-09-08; owner Engineering Lead/QA Lead; target before D-010 decision pack
- [ ] **D-010 — Build authorization** - waiting on Discovery/PoC evidence and Sponsor decision since 2026-09-08; target Discovery Day 10
  - Outcome phải là Approved + gate Go/Adjust trước product build.

## Someday

- [ ] **Epics A–H — Product implementation** - 86 work packages trong `docs/13-BACKLOG-KHOI-TAO-VA-PHAN-CONG.md`; mặc định Not Started/0% cho tới khi D-010 và dependency gates cho phép

## Done

- [x] ~~**SESSION-001-CLOSE — Đóng và bàn giao phiên làm việc 001**~~ (2026-09-08)
  - Accepted by Project Owner/user through explicit close-session instruction.
  - Evidence: `docs/sessions/SESSION-001.md`; Git tag `session-001`.
- [x] ~~**DISC-PMP-001 — Bổ sung PMP control checklist và live task tracking**~~ (2026-09-08)
  - Accepted by Project Owner/user through instruction to start and manage work with WBS/PMP/decision/evidence.
  - Evidence: `docs/evidence/DISC-PMP-001.md`
- [x] ~~**G0-01 — Approve D-023 cho Discovery scaffold**~~ (2026-09-08)
  - Accepted by Project Owner/user; product build vẫn chờ D-010 và Security/DevOps review.
  - Evidence: `docs/adr/ADR-001-IMPLEMENTATION-STACK.md`
