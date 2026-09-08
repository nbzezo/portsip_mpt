# PortSIP exact contract, license and sandbox evidence request

- Status: **Prepared — not sent**
- Owner to send: `Echo` using an approved external account
- Required reviewers: Security + Architecture
Decision/work item: `D-002` / `DISC-PS-001`

## 1. Purpose

Request the exact customer-specific evidence needed to decide whether PortSIP PBX, SBC, browser SDK and APIs support the planned Discovery PoCs. Public documentation is reference material only and must not be treated as the deployed contract.

Do not attach passwords, tokens, private keys, production recordings, phone numbers or proprietary binaries to this repository. Store restricted artifacts in the approved evidence store and record only access-controlled references, versions and checksums here.

## 2. Customer deployment and entitlement inventory

Please provide or confirm:

| Item | Required evidence | Response/reference |
|---|---|---|
| PBX | Exact edition, semantic version, build ID, release date and deployment topology | |
| SBC | Exact version/build, topology and compatibility statement for the PBX build | |
| License/order | Order or entitlement reference covering Contact Center, HA, SDK, extensions and concurrent calls | |
| Support | Support tier, case channel, severity/SLA and escalation contact | |
| Lifecycle | Support/EOL dates and recommended compatible upgrade path | |

## 3. Browser SDK and media contract

Please provide:

- exact JavaScript/WebRTC SDK package name, version, distribution channel and SHA-256 checksum;
- compatibility statement for the exact PBX/SBC and supported browser/OS matrix;
- redistribution/deployment rights for the proposed web Agent Desktop;
- official sample/reference for registration, device selection, mute, hold/resume, DTMF, blind transfer, attended transfer and teardown;
- event/state-machine reference, error taxonomy and reconnect/refresh/device-loss behavior;
- supported codecs, headset/device constraints and diagnostic/log collection guidance;
- whether supervisor monitor/whisper/barge is exposed to this SDK and under which role/license.

Restricted SDK binaries remain outside Git. Record their approved evidence-store reference and checksum only.

## 4. REST, WSI and webhook contract

For the exact PBX build, please provide:

1. OpenAPI document and changelog, with version/checksum.
2. WSI endpoint/topic/event schema and compatibility version.
3. Webhook event schema plus authentication, timeout, retry window, deduplication identifier, ordering and replay behavior.
4. API/WSI authentication and service-account lifecycle; token scope/expiry/rotation and clock-skew expectations.
5. Rate limits, concurrency limits and backoff headers/semantics.
6. Call-control create/query/cancel behavior, idempotency/correlation field support and recovery after client timeout/unknown result.
7. CDR and recording availability timing, correction semantics and stable correlation keys across SDK/WSI/webhook/REST/CDR.
8. Error response schemas and retry safety for `4xx`, `5xx`, timeout and partial/unknown outcomes.

## 5. Trunk, DID and routing boundary

Please answer against the exact build and role model:

- CRUD/export schemas and required capabilities for providers/trunks, inbound rules and outbound rules;
- tenant-owned Register/Accept Register objects versus system/shared/IP-based objects;
- whether a tenant rule may reference a System Admin-assigned shared trunk without gaining mutation rights to that trunk;
- create-disabled/update-disabled semantics and read-after-write consistency;
- secret response/update behavior, including update-without-secret and credential rotation;
- registration/status/test endpoint support;
- dependencies and failure behavior when disabling or deleting trunks, DIDs or rules;
- supported snapshot/read-back method and rollback/compensation guidance;
- minimum role that can perform each read, draft/apply, test, activate and rollback action.

## 6. Isolated sandbox request

The PoC requires a non-production environment with:

- no route to production tenants, trunks, DIDs, recordings, CRM or identity data;
- synthetic identities and synthetic call metadata only;
- allowlisted test destinations/numbers and explicit carrier limits;
- least-privilege service accounts separated for read, call control and configuration mutation;
- audit access for API, WSI, webhook, CDR and configuration changes;
- a cleanup/expiry date owned by `Echo` and backed by an approved external account;
- an emergency stop/kill procedure owned by `Echo` + `Sentinel`.

Do not provide credentials in email/chat or this repository. Provide the approved secret-path reference and access procedure.

## 7. Minimum vendor confirmations

Please give a written `Supported`, `Unsupported` or `Supported with constraints` response for:

1. inbound DID → IVR → Queue → browser Agent Desktop with correlated event/CDR/recording reference;
2. manual/click-to-call and preview calling from the browser Agent Desktop;
3. progressive 1:1 with one Ready agent reserved before one call, including timeout reconciliation;
4. tenant-scoped trunk/DID/inbound-outbound rule read and controlled mutation boundaries;
5. exact SDK/API redistribution and commercial entitlement for the intended application model;
6. HA/backup/restore and sizing guidance for the capacity worksheet once supplied.

## 8. Evidence intake checklist

On receipt, `Echo` records:

```text
Vendor case/reference:
Responder and authority:
Received date:
PBX/SBC exact builds:
SDK package/version/checksum and restricted-store reference:
OpenAPI/WSI/webhook version/checksum and restricted-store reference:
License/order reference and reviewed entitlements:
Sandbox ID/owner/expiry and secret-path reference:
Written compatibility/constraint summary:
Unanswered questions with vendor owner/due:
Architecture/Security/Legal review outcome and date:
D-002 recommendation: Go | Adjust | Stop | Remain in verification
```

`D-002` remains in verification until the evidence is reviewed and the exact sandbox contract is proven; receipt alone is not acceptance.
