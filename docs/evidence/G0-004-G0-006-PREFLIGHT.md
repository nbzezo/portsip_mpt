# Evidence — G0-04/G0-06 environment preflight

- Date: `2026-09-09`
- Executor: Codex implementation agent
- Scope: read-only local environment/repository inspection
- Status: diagnostic evidence only; `G0-04` and `G0-06` remain `Blocked / 0%`

## Observed state

| Check | Result | Consequence |
|---|---|---|
| Git branch | `main` | Local branch exists |
| Git remote | `origin=https://github.com/nbzezo/portsip_mpt.git`; `main` pushed successfully | GitHub is the selected CI hosting target; remote now has the submitted branch |
| Repository CI definition | `.github/workflows/ci.yml` pushed with `main` | Hosted pipeline still needs first run result and branch-protection configuration |
| CI runtime marker | None present in the current shell | Current execution is not evidence from a CI runner |
| Docker CLI/daemon | PASS when Docker Desktop is running — Docker Desktop 29.7.2; `docker info` via `desktop-linux`; `hello-world` ran successfully | Container runtime is available; daemon was not stable for digest capture in the latest attempt; synthetic image/policy/service setup is still required |
| Synthetic Compose/fake services | PASS — `docker compose ... config --quiet` and `node --check infra/local/fakes/server.mjs` | Scaffold is structurally valid; no container was started; digest lock, runtime replay and isolation evidence remain open |
| Runtime replay | PASS — all 5 Compose services healthy; fake `/health` HTTP 200, Redis `PONG`, PostgreSQL `pg_isready` accepting connections via `docker exec` | Local-only synthetic runtime; host port forwarding unavailable in terminal session; reviewer/isolation sign-off remains open |
| Podman CLI | Not found | No approved alternative container runtime available |
| nerdctl CLI | Not found | No containerd CLI fallback available |

No remote call, provider mutation, container installation or external resource creation was performed.

## G0-04 conclusion

`G0-04` remains blocked at partial progress. `Forge`, `Atlas` and `Beacon` are assigned under D-024. Before it can become `Ready`, they must provide:

- successful first hosted run against the selected GitHub repository;
- branch-protection/reviewer and artifact-retention requirements;
- approved runner/secret model and dependency-cache policy;
- confirmation that the `G0-02` dependency has reached the required state.

Preparing a local YAML file without those decisions would not prove hosted CI or protected-branch enforcement and must not be reported as progress.

## G0-06 conclusion

`G0-06` remains blocked at partial progress. Docker runtime is now verified; `Forge`, `Sentinel` and `Beacon` are assigned under D-024. Before it can become `Ready`, they must provide:

- pinned image/checksum policy and approved Docker runtime configuration;
- pinned PostgreSQL/Redis/fake IdP/fake PortSIP/fake CRM image or build policy;
- network isolation, synthetic-only data and secret policy;
- deterministic start/health/reset/cleanup acceptance;
- confirmation that no route or credential can reach Production.

Runtime replay was explicitly authorized by the Project Owner for local-only synthetic validation; no production credentials, data or routes were used.

## Next review

- Owner: Project Owner + Engineering Lead
- Due/escalation: `2026-09-10`
- Evidence needed: named assignments and approved provider/runtime decision recorded in the ledger before either item changes from `Blocked` to `Ready`.
