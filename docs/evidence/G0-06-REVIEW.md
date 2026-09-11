# G0-06 reviewer acceptance — synthetic environment

## Review execution

- Review target: commit `c2429d1`
- Runtime project: `portsip-cc-synthetic`
- Execution date: `2026-09-11`
- Scope: local-only synthetic validation; no production credentials, data, routes or external side effects
- Result: **Candidate PASS — independent reviewer sign-off pending**

## Acceptance checks

| Check | Result | Evidence |
| --- | --- | --- |
| Compose configuration | PASS | `docker compose -f infra/local/compose.synthetic.yml config --quiet` |
| Image lock | PASS | PostgreSQL, Redis and Node base resolve to the digests in `infra/local/images.lock.yml` |
| Service health | PASS | PostgreSQL `pg_isready`; Redis `PONG`; fake IdP/PortSIP/CRM `/health` HTTP 200 via container exec |
| Network isolation | PASS | Network `portsip-cc-synthetic` reports `Internal=true`, dedicated `172.18.0.0/16`, all five containers attached only to this network |
| External egress | PASS | HTTPS probe from fake IdP failed with `TypeError` under the internal network |
| Synthetic-only data | PASS | Redis `DBSIZE=0`; PostgreSQL database/user are `portsip_cc_synthetic`/`synthetic_app`; fake metadata reports `synthetic=true`, `sideEffects=false`, `credentials=false` |
| Mount boundary | PASS | Fake services have no mounts; PostgreSQL/Redis use only named synthetic volumes |

## Reviewer sign-off

The implementation execution may not sign its own independent acceptance. Required separate reviewers:

- Sentinel (Security): **PENDING** — account/date/signature not supplied
- Beacon (QA/Ops): **PENDING** — account/date/signature not supplied

Until both reviewers record named acceptance, `G0-06` remains `Blocked` and is capped below `Accepted / 100%`.
