# Tasks

## Active

- [ ] **DISC-PS-001 — Xác minh PortSIP version/API/SDK/license** - Verification/75%; actual start 2026-09-08; assignee/accountable `Echo`; required reviewers `Sentinel` + `Atlas`; due Discovery Day 3
  - Public evidence xác nhận PBX 22.6.3, SBC 11.2.8, REST/WSI public 22.3 và SDK native 19.6.2; exact customer artifact/license/sandbox còn thiếu.
  - Next action: `Echo` gửi request đã chuẩn bị bằng approved external account; `Sentinel` + `Atlas` review response trước khi mở PortSIP PoC.
  - Evidence: `docs/evidence/DISC-PS-001.md`, `docs/evidence/PORTSIP-EXACT-CONTRACT-REQUEST.md`
- [ ] **DISC-ARC-001 — Chốt baseline kiến trúc mở rộng/phân quyền/cấu hình động** - In Review/90%; actual start 2026-09-08; assignee `Atlas`; accountable `Owner`; required reviewers `Sentinel` + `Compass` + `Beacon`; due Discovery Day 5
  - D-016–D-022 đã có Discovery baseline; remaining named Security/Product/Ops review và thin-slice evidence.
  - Evidence: `docs/evidence/DISC-ARC-001.md`, `docs/08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md`
- [ ] **G0-02 — Discovery monorepo scaffold** - Verification/80%; actual start 2026-09-08; assignee/accountable `Atlas`; required independent replay/review `Scout` + `Beacon` + `Sentinel`; due 2026-09-09
  - Same-host clean checkout tại `bf760f6` với `core.autocrlf=true`, frozen install và full gate PASS; line-ending portability defect đã sửa bằng `.gitattributes`.
  - Remaining: independent clean-machine replay/review; next action owner Engineering Lead, due 2026-09-10.
  - Evidence: `docs/evidence/G0-002.md`, `docs/evidence/G0-CLEAN-MACHINE-REVIEW.md`, `docs/evidence/GATE-0-REVIEW-PACK.md`
- [ ] **G0-03 — Build Profile** - In Review/90%; actual start 2026-09-08; assignee/accountable `Atlas`; required independent execution/review `Scout` + `Forge`; due Discovery Day 5
  - Remaining: người không viết scaffold chạy lại template trên máy sạch và ký evidence.
  - Same-host clean-checkout replay PASS tại `bf760f6`; không tính là independent signature.
  - Evidence: `docs/BUILD-PROFILE.md`, `docs/evidence/G0-002.md`, `docs/evidence/G0-CLEAN-MACHINE-REVIEW.md`, `docs/evidence/GATE-0-REVIEW-PACK.md`
- [ ] **G0-05 — Architecture dependency tests** - In Review/90%; actual start 2026-09-08; assignee/accountable `Atlas`; required separate reviewers `Sentinel` + `Beacon`; due Gate 0
  - Source scan cùng allowed/forbidden fixtures cho public contract, owned DTO, shared primitive, NestJS/package, PortSIP browser SDK, cross-module internal/repository, shared ORM/persistence và vendor DTO leak đều PASS trong session 002.
  - Remaining: independent rule-coverage/security review và xác nhận path convention trước D-010.
  - Evidence: `docs/evidence/G0-005.md`, `docs/evidence/GATE-0-REVIEW-PACK.md`
- [ ] **DISC-HO-001 — Fresh-reader validation** - Ready/0%; Discovery docs-only; assignee `Scout` in separate execution; accountable/reviewer `Atlas` + `Beacon`; due T+1 ngày làm việc từ lúc nhận repo
  - Evidence: `docs/evidence/DISC-HO-001.md`
  - Không dùng credential hoặc gọi vendor/production; review scaffold bằng Build Profile.

## Waiting On

- [ ] **G0-04 — CI baseline** - Blocked/30%; pushed `main` to GitHub and workflow submitted 2026-09-09; waiting on first hosted run, G0-02 independent acceptance and branch protection; assignee/accountable `Forge` + `Atlas`; reviewer `Beacon`; escalation 2026-09-10; target Gate 0
  - Evidence: `docs/evidence/G0-004-G0-006-PREFLIGHT.md`
- [ ] **G0-06 — Local/CI synthetic environment** - Blocked/45%; Compose runtime and candidate reviewer acceptance PASS 2026-09-11; waiting on named `Sentinel` + `Beacon` sign-off; assignee/accountable `Forge`; reviewers `Sentinel` + `Beacon`; escalation 2026-09-10; target Gate 0
  - Evidence: `docs/evidence/G0-004-G0-006-PREFLIGHT.md`
- [ ] **POC-TEL-001 — Inbound + event/CDR/recording PoC** - Blocked/0%; waiting on D-002 exact sandbox/SDK/API and approved external account since 2026-09-08; assignee/accountable `Echo`; reviewers `Sentinel` + `Beacon` + `Atlas`; target Day 6
- [ ] **POC-OUT-001 — Preview/progressive 1:1 outbound PoC** - Blocked/0%; waiting on D-002, D-008/D-013 compliance/carrier inputs and synthetic environment since 2026-09-08; target Day 8
- [ ] **POC-TRUNK-001 — SIP trunk/DID/rule Admin PoC** - Blocked/0%; waiting on exact endpoint/role/ownership matrix and approved isolated sandbox since 2026-09-08; target Day 8
- [ ] **POC-CONFIG-001 — Authorization/config/form/workflow thin slice** - Blocked/0%; waiting on G0-06 since 2026-09-08; assignee/accountable `Atlas`; reviewers `Sentinel` + `Compass` + `Beacon`; target Day 9
- [ ] **G0-07 — Contributor quick-start** - Blocked/0%; waiting on G0-03–G0-06 since 2026-09-08; assignee `Scout`; accountable `Atlas`; reviewer `Beacon`; target before D-010 decision pack
- [ ] **D-010 — Build authorization** - `Adjust` direction selected by `Owner` on 2026-09-09; final authorization still waiting on Discovery/PoC evidence
  - Adjust baseline: giữ kernel/authorization/voice P0/role-config templates; chuyển visual form/workflow builders sang P1; build vẫn chưa được phép.
  - Evidence: `docs/evidence/D-010-ADJUST.md`; final outcome phải có signed gate và evidence pack.

## Someday

- [ ] **Epics A–H — Product implementation** - 86 work packages trong `docs/13-BACKLOG-KHOI-TAO-VA-PHAN-CONG.md`; mặc định Not Started/0% cho tới khi D-010 và dependency gates cho phép

## Done

- [x] ~~**DISC-KO-001 — Kickoff, phân vai và owner assignment**~~ (2026-09-09)
  - Accepted by Project Owner/user through explicit approval of memorable Codex role aliases; D-024 preserves separate-execution review and external authority boundaries.
  - Evidence: `docs/ROLE-REGISTRY.md`, `docs/evidence/DISC-KO-001.md`, `docs/06-DECISION-REGISTER.md#gate-discoverypoc`
- [x] ~~**SESSION-001-CLOSE — Đóng và bàn giao phiên làm việc 001**~~ (2026-09-08)
  - Accepted by Project Owner/user through explicit close-session instruction.
  - Evidence: `docs/sessions/SESSION-001.md`; Git tag `session-001`.
- [x] ~~**DISC-PMP-001 — Bổ sung PMP control checklist và live task tracking**~~ (2026-09-08)
  - Accepted by Project Owner/user through instruction to start and manage work with WBS/PMP/decision/evidence.
  - Evidence: `docs/evidence/DISC-PMP-001.md`
- [x] ~~**G0-01 — Approve D-023 cho Discovery scaffold**~~ (2026-09-08)
  - Accepted by Project Owner/user; product build vẫn chờ D-010 và Security/DevOps review.
  - Evidence: `docs/adr/ADR-001-IMPLEMENTATION-STACK.md`
