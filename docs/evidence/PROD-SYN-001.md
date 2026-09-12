# Evidence — PROD-SYN-001 provisional synthetic Agent Workspace

- Authorized: Project Owner/user, `2026-09-12`
- Decision boundary: D-010 `Adjust`
- Scope: synthetic Agent Workspace UI and adapter boundary only
- Status: `In Review / 90%`
- Assignee: `Atlas`
- Required reviewers: `Sentinel` + `Beacon`

## Guardrails

- No PortSIP, CRM or IdP production endpoint.
- No real dial/send, trunk/DID mutation or production credential/data.
- Fake adapters must remain replaceable behind typed boundaries.
- Real integration remains blocked on `DISC-PS-001`, Gate 0 and final D-010 authorization.

## Acceptance

- [x] Agent Workspace shell renders synthetic service state.
- [x] Call actions are visibly disabled and explain synthetic-only mode.
- [x] No external side effect is reachable from the slice.
- [x] Unit/build checks pass (`CI=true; pnpm run check`).
- [ ] Sentinel and Beacon review from a separate execution.

## Implementation evidence

- `apps/web/src/app/app.tsx` renders the synthetic environment status cards and disabled agent controls.
- Quality gate on `2026-09-12`: format, lint, typecheck, unit tests (2/2), architecture checks and production build PASS.
- Remaining acceptance is limited to independent reviewer sign-off.
