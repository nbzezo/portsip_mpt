# Evidence — D-010 chọn hướng Adjust

- Date: `2026-09-09`
- Decision: `D-010`
- Outcome direction: `Adjust`
- Approved by: Project Owner/user
- Evidence status: `Provisional synthetic build authorized; real product/integration build remains conditional`

Project Owner/user chọn phương án **Adjust** và ngày `2026-09-12` xác nhận mở **provisional synthetic product build**: giữ kernel/authorization/voice P0 và role/config templates; chuyển visual/self-service form/workflow builders sang P1. Phạm vi provisional chỉ dùng synthetic adapters, không dial/send thật, không production credential/data/route và không tích hợp PortSIP/CRM/IdP thật. Product/integration build chính thức vẫn chờ Gate 0, exact PortSIP evidence, PoC và security/operations acceptance.

## Conditions before build authorization

1. Independent review cho `G0-02`, `G0-03`, `G0-05` và `DISC-HO-001`.
2. CI/provider decision cho `G0-04`.
3. Approved synthetic runtime/isolation cho `G0-06`.
4. Exact PortSIP contract/license/sandbox và PoC cho inbound/outbound/trunk.
5. Security, compliance, data/CRM/IdP và operations evidence.
6. Sponsor re-baseline và signed `D-010` gate outcome sau evidence pack.

ROM direction: `24–26 tuần ±30%`, re-baseline sau Discovery/PoC. Provisional synthetic build: `GRANTED` ngày `2026-09-12`; real product/integration build authorization: `NOT GRANTED`.
