# Parallel delivery roadmap — synthetic product and PortSIP integration

## Objective

Build the product frame, business workflows and CRM against stable contracts and synthetic adapters while the PortSIP exact contract, license and sandbox are obtained in parallel. PortSIP integration is a replaceable adapter track, not a prerequisite for the synthetic product shell.

## Now — parallel tracks

| Track | Scope | Status | Owner | Dependency |
|---|---|---|---|---|
| Product foundation | Agent Workspace, authorization contracts, configuration lifecycle and CRM domain/workflows using synthetic adapters | Ready/In Review | `Atlas` | D-010 provisional synthetic authorization; no real side effects |
| Synthetic runtime | PostgreSQL, Redis, fake IdP/PortSIP/CRM, isolation and deterministic health/reset | Candidate PASS / reviewer pending | `Forge` | `Sentinel` + `Beacon` sign-off |
| PortSIP discovery | Exact PBX/SBC build, license/order, browser SDK, REST/WSI/webhook and sandbox evidence | Verification / 75% | `Echo` | Approved external account and vendor response |
| Architecture/security review | D-016–D-022 baseline, dependency boundaries and reviewer acceptance | In Review | `Atlas` | `Sentinel` + `Compass` + `Beacon` |

## Integration seam

- Product code consumes typed ports/contracts, never vendor DTOs directly.
- Fake adapters are the default for local development and CI.
- A real PortSIP adapter may be enabled only after exact contract/sandbox evidence and final approval.
- Real dial/send, trunk/DID mutation, production credentials and production data remain prohibited.
- Contract mismatches are handled by adapter conformance tests and versioned capability flags, not by weakening core invariants.

## Exit criteria for real integration

1. `DISC-PS-001` exact evidence received and reviewed.
2. `G0-02`, `G0-03`, `G0-05`, `G0-06` independent acceptance complete.
3. PortSIP PoC proves event/CDR/recording correlation and failure reconciliation in an isolated sandbox.
4. Security, compliance, data/CRM and operations sign-offs recorded.
5. Owner signs final D-010 authorization.
