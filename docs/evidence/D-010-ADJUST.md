# Evidence — D-010 chọn hướng Adjust

- Date: `2026-09-09`
- Decision: `D-010`
- Outcome direction: `Adjust`
- Approved by: Project Owner/user
- Evidence status: `Direction selected; product build authorization remains conditional`

Project Owner/user chọn phương án **Adjust**: giữ kernel/authorization/voice P0 và role/config templates; chuyển visual/self-service form/workflow builders sang P1. Đây là quyết định định hướng phạm vi; không tự cấp quyền product build trước khi Gate 0, PortSIP evidence, PoC và security/operations acceptance đạt.

## Conditions before build authorization

1. Independent review cho `G0-02`, `G0-03`, `G0-05` và `DISC-HO-001`.
2. CI/provider decision cho `G0-04`.
3. Approved synthetic runtime/isolation cho `G0-06`.
4. Exact PortSIP contract/license/sandbox và PoC cho inbound/outbound/trunk.
5. Security, compliance, data/CRM/IdP và operations evidence.
6. Sponsor re-baseline và signed `D-010` gate outcome sau evidence pack.

ROM direction: `24–26 tuần ±30%`, re-baseline sau Discovery/PoC. Product build authorization: `NOT GRANTED`.
