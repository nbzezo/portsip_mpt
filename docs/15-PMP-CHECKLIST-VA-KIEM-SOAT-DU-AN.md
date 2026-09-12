# PMP-aligned checklist và cơ chế kiểm soát dự án

## 1. Mục đích và cách dùng

Tài liệu này là control plan để Sponsor, Project Manager, Product Owner và các Lead theo dõi Portsip CC từ Discovery đến đóng dự án. Nó được tailor cho dự án phần mềm + viễn thông, không phải bản sao hay tuyên bố chứng nhận PMP/PMI.

Baseline tham chiếu là **PMBOK® Guide – Eighth Edition** (PMI, phát hành tháng 11/2025). PMI mô tả bản này bằng sáu nguyên tắc cốt lõi, bảy performance domains và process guidance theo các focus area Initiating, Planning, Executing, Monitoring and Controlling, Closing. Dự án dùng cả hai góc nhìn: domain để không bỏ sót năng lực quản trị, focus area để vận hành checklist theo thời điểm.

Nguồn chính thức:

- [PMI — PMBOK Guide, Eighth Edition](https://www.pmi.org/standards/pmbok)
- [PMI — PMBOK Guide Eighth Edition table of contents](https://www.pmi.org/-/media/pmi/documents/public/pdf/publications/pmbok-guide-eighth-edition_table-of-contents.pdf)

Nếu PMO nội bộ hoặc hợp đồng khách hàng có quy trình nghiêm hơn, quy trình đó thắng. Mọi ngưỡng RAG, cadence và baseline trong tài liệu này là proposed cho tới khi Sponsor/PM phê duyệt.

## 2. Nguồn chuẩn và nguyên tắc không nhập liệu trùng

| Cần biết | Nguồn chuẩn hiện tại | Quy tắc |
|---|---|---|
| Scope/P0/P1/P2/ROM | [01](01-KE-HOACH-TRIEN-KHAI.md), [02](02-DANH-MUC-TINH-NANG.md) | Scope đổi phải có change request + D-010/Decision Register update |
| Architecture/security/telephony boundary | [03](03-KIEN-TRUC-TICH-HOP.md), [07](07-OUTBOUND-VA-SIPTRUNK-ADMIN.md), [08](08-KIEN-TRUC-MO-RONG-PHAN-QUYEN-CAU-HINH-DONG.md) | Không dùng project report để sửa technical invariant |
| Quyết định và gate | [06](06-DECISION-REGISTER.md) | Chỉ outcome có approver/evidence/date mới là Approved |
| WBS/backlog kỹ thuật | [13](13-BACKLOG-KHOI-TAO-VA-PHAN-CONG.md) | Item vắng khỏi live board mặc định `Not Started / 0%` |
| Việc được phép làm hiện tại | [14](14-CONG-VIEC-HIEN-TAI.md) | Chỉ item `Ready` và assignee/reviewer rõ mới bắt đầu |
| Theo dõi hằng ngày | [TASKS.md](../TASKS.md) | Active/Waiting/Done; cập nhật trong ngày khi trạng thái đổi |
| Acceptance/quality evidence | [10](10-CHUAN-CODE-REVIEW-VA-DEFINITION-OF-DONE.md), [12](12-CHIEN-LUOC-TEST-DEBUG-VA-RUNBOOK.md), `docs/evidence/` | Không tính 100% nếu thiếu acceptance/evidence |
| Exact build commands | `docs/BUILD-PROFILE.md` | Đã tồn tại và pass trên máy tạo; clean-machine verification còn mở |
| Named role/authority | [Role Registry](ROLE-REGISTRY.md) | D-024 alias dùng cho code-delivery; independent review phải là execution tách biệt |

Khi issue tracker chính thức được chọn, tracker là source of truth cho từng work item; `TASKS.md` chỉ là dashboard đồng bộ cho Active/Waiting/Done. PM phải ghi tracker URL, project key và đồng bộ owner trong tài liệu này. Không duy trì hai trạng thái khác nhau ở hai nơi.

## 3. Vòng đời và phase-gate checklist

### 3.1 Initiating — khởi tạo/ủy quyền

- [x] Sponsor, Project Manager, Product Owner và technical/reviewer roles có named alias/authority theo D-024; external authority vẫn phải gắn account thật khi cần.
- [ ] Project charter nêu business need, mục tiêu giá trị, high-level scope/non-goal, ROM, deadline constraint và success measures.
- [ ] Stakeholder register có ảnh hưởng, mức quan tâm, nhu cầu thông tin, decision authority và escalation path.
- [ ] Assumption/constraint log có owner, ngày cần xác minh và impact nếu sai.
- [x] D-010 ghi rõ hướng `Adjust`; hiện chỉ Discovery/PoC được Go, funding/authority không bị hiểu thành toàn bộ build.
- [ ] Privacy, legal/compliance, carrier, recording và outbound consent/DNC stakeholders tham gia từ đầu.
- [ ] Success không chỉ là “go-live”: có adoption, service outcome, operational readiness và benefits owner.

**Exit:** charter/Discovery authorization được Sponsor ký; roles và evidence repository tồn tại; không còn việc chạy mà không có accountable owner.

### 3.2 Planning — lập kế hoạch tích hợp

- [ ] Scope baseline và requirements traceability map từ outcome → feature → work package → acceptance test.
- [ ] WBS dùng ID ổn định trong docs 13; dependency, milestone, critical path và external lead time được xác định.
- [ ] Schedule baseline có planned start/finish, resource calendar, holiday/timezone và contingency.
- [ ] Cost baseline tách labor, PortSIP/license, carrier/trunk, cloud/on-prem, security/compliance, devices/headsets, training, support và management reserve.
- [ ] Quality plan dẫn đến DoR/DoD, test pyramid, UAT, security, performance, failover và evidence retention.
- [ ] Resource plan có RACI, capacity, specialist windows, onboarding, backup person và knowledge-transfer tasks.
- [ ] Communication plan có audience, nội dung, cadence, channel, owner và sensitivity/classification.
- [ ] Risk plan có scoring, trigger, response, contingency/fallback, risk owner và residual risk approver.
- [ ] Procurement plan có make/buy, SOW/SLA/support, license/redistribution, acceptance, lead time, exit/renewal và vendor escalation.
- [ ] Stakeholder engagement plan có current/desired engagement, objections, adoption/training và feedback route.
- [ ] Change-control process và configuration/document control được duyệt.
- [ ] D-001–D-024 có owner/due/evidence; G0-01 → G0-02 → G0-03 → D-010 dependency không bị đảo.

**Exit:** baselines được duyệt hoặc ghi rõ chưa baseline; work item đầu tiên đạt Ready; mọi open gate có owner/due.

### 3.3 Executing — thực hiện công việc

- [ ] Chỉ lấy task từ live board/tracker; task có assignee, reviewer, dependency và evidence location.
- [ ] Kickoff từng phase/increment xác nhận objective, non-goal, Definition of Done và stop condition.
- [ ] Team thực hiện technical quality gates ở docs 09–12, không đánh đổi security/compliance để “giữ tiến độ”.
- [ ] Vendor/carrier/CRM/IdP work dùng approved sandbox, named contact, response SLA và decision log.
- [ ] QA/BA/Ops tham gia acceptance từ refinement, không chờ cuối release.
- [ ] Knowledge được cập nhật vào repo/runbook/ADR; không để quyết định chỉ trong chat/họp.
- [ ] Training, UAT, change adoption và operational transition chạy song song với build.

**Exit từng work package:** acceptance pass, evidence gắn, reviewer/owner chấp nhận và live board cập nhật theo mục 5.

### 3.4 Monitoring and Controlling — giám sát/kiểm soát

- [ ] Cập nhật actual start/finish, remaining effort, forecast finish, blocker và next action ít nhất mỗi ngày làm việc cho Active task.
- [ ] Hằng tuần so actual với scope/schedule/cost/quality baseline; không chỉ báo % hoàn thành.
- [ ] Critical path, external dependency và decision aging được review.
- [ ] RAID log và change log có owner, due, status, impact và escalation.
- [ ] Deliverable được quality-control bằng test/inspection/UAT; defect escape và rework được theo dõi.
- [ ] Resource/capacity, vendor performance, stakeholder sentiment và communication effectiveness được review.
- [ ] Forecast/variance có corrective action; không tự đổi baseline để làm chỉ số xanh.
- [ ] Gate review cho Go/Adjust/Stop dùng evidence pack, không dùng status slide thay bằng chứng.

### 3.5 Closing — đóng phase/dự án

- [ ] Customer/Product/Operations chấp nhận deliverables bằng tiêu chí đã duyệt.
- [ ] Open defect/risk/debt được đóng hoặc chuyển giao với owner/due/risk acceptance.
- [ ] Contract/procurement closure, invoice, asset/license/account và vendor access được đối soát.
- [ ] Production handover, on-call, monitoring, backup/restore, DR, support SLA và training hoàn tất.
- [ ] Security/secret/test account cleanup có evidence; không xóa audit/legal-hold data ngoài policy.
- [ ] Final cost/schedule/scope/quality/benefit variance và nguyên nhân được báo cáo.
- [ ] Lessons learned, reusable assets, ADR, runbook và evidence được archive có quyền truy cập.
- [ ] Benefits realization owner, metric, baseline và review date sau dự án được giao cho Operations/Product.
- [ ] Sponsor ký phase/project closure; release team/capacity theo kế hoạch.

## 4. Bảy performance domains — control checklist

| Domain PMBOK 8 | Portsip CC phải kiểm soát | Evidence tối thiểu |
|---|---|---|
| Governance | Authority, gates, decision rights, ethics/compliance, change control, value | Charter, D-010, D-001–D-024, gate minutes, change log |
| Scope | Product boundary, WBS, requirements traceability, acceptance, scope creep | Docs 01/02/13, RTM, signed acceptance |
| Schedule | Dependency network, critical path, milestone, forecast, vendor lead time | Baseline schedule, milestone trend, blocker/decision aging |
| Finance | Budget/funding, estimate basis, forecast, contingency/reserve, TCO/procurement | Cost baseline, actual/forecast, variance and approval |
| Stakeholders | Identification, engagement, communication, adoption, conflict/escalation | Stakeholder register, comms plan, feedback/decision log |
| Resources | Team capacity, roles, skills, equipment/environment, knowledge continuity | RACI, capacity plan, onboarding, backup owner |
| Risk | Threat/opportunity identification, analysis, response, residual acceptance | RAID, threat model, risk burndown, accepted residual risk |

Sáu principle lens được dùng trong review: nhìn hệ thống tổng thể; tập trung giá trị; xây chất lượng vào quy trình; lãnh đạo có trách nhiệm; cân nhắc tính bền vững; tạo đội ngũ được trao quyền trong giới hạn kiểm soát.

## 5. Chuẩn theo dõi từng task

### 5.1 Trường bắt buộc

Mỗi task khi được activate phải có:

```text
ID/WBS:
Title/outcome:
Phase/release/epic:
Status and completion %:
Priority/severity:
Accountable owner:
Assignee:
Required reviewer/approver:
Planned start/finish:
Actual start/finish:
Original estimate / remaining estimate:
Dependencies/blockers and waiting since:
Acceptance criteria / Definition of Done:
Evidence link:
Risk/issue/change-request IDs:
Next action + owner + due:
Last updated by/at:
```

Task thiếu owner, acceptance, dependency hoặc reviewer là `Draft/Not Ready`, không được chuyển In Progress.

### 5.2 Workflow và % hoàn thành

| Status | % chuẩn | Điều kiện |
|---|---:|---|
| Draft / Not Ready | 0% | Chưa đủ DoR hoặc chưa được authorize |
| Ready | 0% | DoR đủ, dependency/gate đạt, assignee/reviewer rõ |
| In Progress — design/contract | 10–25% | Design/contract đang làm hoặc đã review |
| In Progress — implementation | 26–60% | Có artifact chạy được nhưng chưa đủ test |
| Verification | 61–80% | Unit/component/contract/E2E/UAT theo scope đang chạy |
| In Review | 81–90% | Code/doc/evidence hoàn chỉnh, chờ reviewer/approver |
| Done, awaiting acceptance | 90% | Merge/build xong nhưng business/operational acceptance chưa ký |
| Accepted | 100% | Acceptance pass, evidence link, approver/date và handover hoàn tất |
| Blocked | Giữ % đã earned | Ghi blocker, owner, waiting since, next escalation date; không tự tăng % |
| Cancelled | Không tính completed | Ghi reason/change decision; tách khỏi baseline qua approved change |

Không dùng 95% kéo dài. Nếu còn acceptance/evidence, task tối đa 90%. Rework làm cập nhật remaining estimate/forecast; không giảm actual effort đã ghi.

### 5.3 Cập nhật khi task đổi trạng thái

Trong cùng ngày làm việc, assignee hoặc PM phải:

1. cập nhật tracker chính thức; trước khi có tracker, cập nhật [TASKS.md](../TASKS.md);
2. ghi actual start/finish, remaining effort, blocker và next action;
3. gắn PR/build/test/UAT/decision/runbook evidence, không ghi “đã test” không có link;
4. cập nhật risk/issue/change/decision liên quan;
5. chuyển item hoàn tất sang `Done` trong `TASKS.md` theo dạng `- [x] ~~Task~~ (YYYY-MM-DD)`;
6. cập nhật forecast/milestone/epic roll-up nếu task nằm critical path;
7. thông báo audience theo communication plan khi có breach, gate change hoặc release impact.

Một task chỉ là `Accepted/100%` khi người có authority chấp nhận. Assignee không tự vừa làm vừa ký acceptance cho task cần separation-of-duties.

### 5.4 Roll-up tiến độ

- Trước khi estimate baseline: báo `N/A — chưa baseline`, cùng số task theo status; không dùng trung bình đơn giản để tạo % giả.
- Sau baseline: `% WBS = tổng(weight × accepted progress) / tổng weight`, weight dùng approved planned effort/cost; không đổi weight sau khi chậm nếu không có change control.
- Milestone progress phải kèm `planned finish`, `forecast finish`, variance và confidence.
- Nếu dùng Earned Value sau cost baseline: `SPI = EV/PV`, `CPI = EV/AC`; PV hoặc AC bằng 0 thì báo N/A, không chia số 0.
- Báo riêng Discovery evidence, product build và operational readiness; không cộng tài liệu hoàn thành để làm product implementation có vẻ tiến triển.

## 6. Current project control snapshot

Ngày snapshot: `2026-09-12`.

Session control: `002 — In Progress`; base Git reference `session-001`. Registry: [docs/sessions/README.md](sessions/README.md). Provisional synthetic slice `PROD-SYN-001` đã được Owner/user authorize ngày `2026-09-12`; slice này không mở quyền real PortSIP/CRM/IdP integration.

| WBS | Work packages | Authorized state | Status | Progress |
|---|---:|---|---|---:|
| Discovery/governance | D-001–D-024 + kickoff/PortSIP/handover/PMP items | Discovery/PoC only; Adjust direction selected | PMP + kickoff Accepted; D-010 Adjust direction; PortSIP scan 75%; nhiều decision Open/Hypothesis | N/A — final build authorization chưa baseline |
| Gate 0 | G0-01–G0-07 (7) | Discovery scaffold only; product build vẫn blocked | G0-01 Accepted; G0-02 80%; G0-03 90%; G0-05 90%; còn lại Blocked | Chưa baseline; báo theo status |
| Epic A — Platform Kernel | 10 | Blocked by D-010 + Gate 0 | Not Started | 0% |
| Epic B — Authorization | 12 | Blocked by D-010 + decisions | Not Started | 0% |
| Epic C — Config/form/workflow | 14 | Blocked by D-010 + decisions | Not Started | 0% |
| Epic D — PortSIP integration | 10 | PoC evidence allowed; product work blocked | Not Started | 0% |
| Epic E — Inbound/CRM | 10 | PoC evidence allowed; product work blocked | Not Started | 0% |
| Epic F — Outbound | 14 | PoC evidence allowed; real dialing prohibited except approved sandbox test | Not Started | 0% |
| Epic G — SIP trunk Admin | 8 | Read/PoC only until D-011/exact contract; effective writes prohibited | Not Started | 0% |
| Epic H — Supervisor/report/readiness | 8 | Blocked by foundations | Not Started | 0% |
| **Product WBS total** | **93** | D-010 Adjust selected nhưng chưa authorized build | **Not Started** | **0%** |

Current operational detail nằm ở [Current Work Ledger](14-CONG-VIEC-HIEN-TAI.md) và [TASKS.md](../TASKS.md). PM cập nhật snapshot này ở weekly status; Active task cập nhật hằng ngày.

## 7. RAID và change control

### 7.1 Log schema

| Log | ID format | Trường tối thiểu |
|---|---|---|
| Risk | `RISK-nnn` | cause/event/impact, probability 1–5, impact 1–5, score, trigger, response, owner, due, residual risk |
| Issue | `ISSUE-nnn` | observed fact, impact, severity, owner, workaround, target resolution, escalation |
| Assumption | `ASM-nnn` | statement, evidence needed, owner, validation date, impact if false |
| Dependency | `DEP-nnn` | provider/task, needed-by, commitment, health, owner, fallback |
| Change request | `CR-nnn` | reason, scope/schedule/cost/quality/risk impact, options, approver, outcome, baseline updates |
| Decision | D-001–D-024/ADR | question, options, outcome, approver, date, evidence, consequences |

Proposed risk RAG: `1–7 Green`, `8–14 Amber`, `15–25 Red`; Security/Legal/Telephony hard-stop có thể Red bất kể score. Ngưỡng phải được Sponsor/PM phê duyệt.

### 7.2 Integrated change control

1. Người đề xuất tạo `CR-nnn`; không sửa baseline trước approval.
2. PM + Leads đánh giá impact tới value, scope, schedule/critical path, cost, quality, security/compliance, operations, contract và people/adoption.
3. Nêu ít nhất accept/reject/defer/adjust options và recommendation.
4. Change Control Board/Sponsor quyết định theo authority matrix; urgent change vẫn cần retrospective approval/evidence theo policy.
5. Nếu Approved, cập nhật cùng change set: scope/WBS, schedule/cost baseline, decisions/ADR, risk, contract/test/runbook, TASKS/tracker và communication.
6. Verify implementation, benefits/risk outcome và close CR; không coi approval là completion.

## 8. RACI tối thiểu

| Deliverable/decision | Sponsor | PM/Delivery | Product | Architecture/Engineering | Security/Legal | Telephony/Carrier | QA/Ops |
|---|---|---|---|---|---|---|---|
| Charter/funding/D-010 | A | R | C | C | C | C | I |
| Scope/P0/acceptance | C | R | A | C | C | C | C |
| D-023/scaffold | I | C | I | A/R | C | C | C |
| Authorization/data policy | I | C | C | R | A | I | C |
| Outbound compliance/caller ID | I | C | C | C | A | R | C |
| SIP trunk/DID write boundary | I | C | C | R | C | A | C |
| Quality/release readiness | I | C | C | R | C | C | A/R |
| Change baseline | A | R | C | C | C | C | C |
| Project/phase closure | A | R | C | C | C | C | C |

`A` = Accountable, `R` = Responsible, `C` = Consulted, `I` = Informed. Mỗi dòng chỉ có một accountable authority sau khi tên người thật được gắn; bảng role-level không thay named assignment.

## 9. Cadence và báo cáo

| Nhịp | Thành phần | Nội dung bắt buộc | Output |
|---|---|---|---|
| Hằng ngày | Delivery team | Done/today/blocker, task status/remaining, decision needed, safety impact | TASKS/tracker cập nhật |
| 2 lần/tuần Discovery | Decision owners | D-001–D-024 evidence/aging, PoC result, vendor dependency | Decision/RAID updates |
| Hằng tuần | PM + Leads + Product/Ops | Milestone trend, scope/cost/schedule/quality, RAID, change, capacity, 2-week look-ahead | Weekly status |
| Mỗi sprint/increment | Team + stakeholders | Demo accepted outcome, defects, metrics, retro/actions | Acceptance + improvement actions |
| Gate review | Sponsor/owners | Evidence pack, options, risk/TCO/forecast, Go/Adjust/Stop | Signed gate outcome |
| Hằng tháng hoặc theo Steering | Sponsor/SteerCo | Value, forecast, top risks/issues, decisions/escalations, procurement | Steering decision log |

Weekly status template:

```text
Reporting period / PM:
Overall RAG and why:
Outcome/value achieved this period:
Accepted tasks (IDs + evidence):
Active/blocked tasks and forecast:
Milestones: baseline / forecast / variance / confidence:
Scope changes and CR status:
Cost: baseline / actual / forecast / variance:
Quality/security/operations indicators:
Top 5 risks/issues/dependencies with owner/due:
Decisions needed: decision maker / latest-needed date / impact of delay:
Next 2 weeks:
Support/escalation requested:
```

## 10. Dashboard/RAG measures

| Measure | Green | Amber | Red |
|---|---|---|---|
| Critical milestone forecast | On/before baseline | Trễ ≤1 tuần hoặc contingency còn đủ | Trễ >1 tuần hoặc đe dọa gate/go-live |
| Decision aging | Trong SLA đã duyệt | Có nguy cơ vượt SLA | Đã vượt latest-needed date/đang chặn critical path |
| P0/P1 defect | Không open P0; P1 trong SLA | P1 aging/escape tăng | P0 open hoặc security/compliance hard-stop |
| Scope | Không unapproved change | CR đang đánh giá, contingency còn | Unapproved work hoặc baseline không còn khả thi |
| Cost forecast | Trong baseline | Dùng contingency cần PM review | Cần management reserve/rebaseline approval |
| External dependency | Commitment/evidence đúng hạn | Rủi ro trễ có fallback | Trễ và không có fallback/đang chặn gate |
| Operational readiness | Evidence đúng kế hoạch | Một số owner/action chậm | Thiếu on-call/runbook/backup/DR/security sign-off trước release |

Đây là proposed thresholds; sau baseline, PM thay bằng ngưỡng đã ký. Overall RAG không được lấy trung bình: một hard-stop Red làm overall Red.

## 11. PM acceptance checklist cho mỗi task

- [ ] ID khớp WBS/tracker và scope baseline.
- [ ] Gate/dependency đã đạt; không làm work chưa được authorize.
- [ ] Owner, assignee, reviewer/approver, planned dates và estimate rõ.
- [ ] Acceptance/DoD/test/evidence cụ thể và đã pass.
- [ ] Actual start/finish, actual/remaining effort và forecast được cập nhật.
- [ ] Không còn blocker hoặc blocker đã chuyển thành issue có owner/due.
- [ ] Risk/change/decision/document/runbook liên quan đã cập nhật.
- [ ] Deliverable được Product/QA/Ops/Security/Telephony chấp nhận theo RACI.
- [ ] TASKS/tracker chuyển Accepted/Done, có completion date và evidence link.
- [ ] Parent WBS/milestone/cost/resource forecast được roll up.

## 12. Audit rule cho trạng thái hoàn thành

Mỗi tuần PM chọn mẫu ít nhất một task đã báo 100% và truy ngược: task → requirement/scope → PR/artifact → build → test/UAT → approver → release/runbook. Không truy được bằng link trong 15 phút thì task quay về tối đa 90% và tạo action khắc phục documentation/evidence.

Không backdate completion để làm đẹp báo cáo. Sửa lịch sử bằng một entry mới có người sửa, thời gian, lý do và reference; không xóa silently. Khi user báo một task hoàn tất, maintainer cập nhật `TASKS.md` theo format Done và đồng thời kiểm tra acceptance/evidence trước khi roll-up 100%.
