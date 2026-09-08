# Evidence — DISC-KO-001 Kickoff và phân vai

- Actual start: `2026-09-08`
- Status: `Accepted / 100%`
- Assignee: `Codex implementation agent`
- Accountable: `Project owner/user`
- Approval evidence: chỉ thị người dùng “Bắt đầu ngay” trong Codex task hiện tại

## Named role assignment

| Vai trò | Alias/account | Authority hiện tại |
|---|---|---|
| Sponsor/Project Owner/Product Owner | `Owner` — user của Codex task hiện tại | Phê duyệt Discovery, scope/ưu tiên, residual risk và D-010 |
| PM/Delivery/Documentation | `Ledger` | Duy trì WBS/PMP/decision/evidence/handoff |
| Engineering Lead/Solution Architecture | `Atlas` | Scaffold/ADR/contracts/technical evidence |
| Security/Compliance | `Sentinel` | Hard gate cho auth, secret, PII, recording, outbound và D-010 |
| Telephony/Carrier | `Echo` | Exact contract/license/sandbox, trunk và call behavior |
| DevOps/Infrastructure/SRE | `Forge` | CI, runtime, environment, deployment/operations |
| QA/Ops independent reviewer | `Beacon` | Clean replay, test/readiness acceptance ở execution tách biệt |
| Product/Data/CRM/BA | `Compass` | Requirement, data/KPI/CRM và business acceptance prep |
| Independent contributor/fresh reader | `Scout` | Clean replay, onboarding và handoff validation ở execution tách biệt |

Project Owner đã chỉ thị ngày `2026-09-09` rằng dự án được vận hành/code bằng Codex và cho phép tự đặt alias dễ nhớ. Alias không giả làm tên người thật; quy tắc identity, independent execution và authority nằm tại [Role Registry](../ROLE-REGISTRY.md) và D-024.

## Kickoff outcome

- Discovery start được ủy quyền.
- D-023 được approve có điều kiện cho Discovery scaffold.
- Product build, real call và trunk mutation vẫn chờ D-010 cùng Security/Telephony evidence.
- Repository là tracker tạm thời; `TASKS.md` là live board.

## Acceptance

- Project Owner/user phê duyệt mô hình alias ngày `2026-09-09` qua chỉ thị “Bạn tự đặt tên đi... các vị trí trên đặt tên cho dễ nhớ là được”.
- `DISC-KO-001` Accepted/100%; named assignment đã đủ cho planning/tracking.
- External contract/runtime/sandbox và independent review evidence vẫn là dependency riêng; alias assignment không tự mở side-effect PoC hoặc D-010.
