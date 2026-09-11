# Synthetic image/version/checksum policy

- Decision: `D-025`
- Approved direction: Project Owner/user — `2026-09-11`
- Scope: G0-06 local/CI synthetic environment only
- Status: policy approved; Compose scaffold created; digest capture pending stable Docker daemon

## Approved image sources

| Service      | Approved reference                              | Source                  | Rule                                                        |
| ------------ | ----------------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| PostgreSQL   | `postgres:18.0-bookworm` + immutable digest     | Docker Official Image   | Minor version and digest must be locked; never use `latest` |
| Redis        | `redis:8.2.2-bookworm` + immutable digest       | Docker Official Image   | Patch version and digest must be locked; never use `latest` |
| Fake IdP     | Repository-owned service, Node 24 base + digest | Internal synthetic code | No real IdP SDK, tenant or credential                       |
| Fake PortSIP | Repository-owned service, Node 24 base + digest | Internal synthetic code | No vendor binary, real endpoint or real dial                |
| Fake CRM     | Repository-owned service, Node 24 base + digest | Internal synthetic code | Synthetic contacts/cases only                               |

## Checksum and update rules

1. Runtime references use `image:tag@sha256:<digest>`; a tag without a digest is not accepted in CI.
2. `infra/local/images.lock.yml` records image, tag, digest, platform, retrieval date and reviewer.
3. Digest capture uses an approved registry pull and `docker image inspect`; never invent or hand-edit a digest.
4. CI/local verification fails when the resolved digest differs from the lock file.
5. Image updates require a review of release notes, CVE impact, smoke tests and lock-file diff.
6. No `latest`, floating major tags, unreviewed third-party images, host networking, or production secrets.

The Compose scaffold is [compose.synthetic.yml](compose.synthetic.yml). It is intentionally not
runtime-authoritative while `images.lock.yml` has `PENDING_DIGEST_CAPTURE`; replace each `null`
digest only from an approved registry pull, then update the Compose image references to
`tag@sha256:<digest>` in the same reviewed change.

## Required isolation

- Dedicated Compose network with only localhost port bindings.
- Synthetic-only volumes/data; no route to PortSIP, CRM, IdP or production networks.
- No privileged containers or host mounts outside the repository's approved temp data directory.
- Containers must be disposable and have a documented cleanup command.

## Digest capture record

```text
Docker daemon/context:
PostgreSQL resolved digest:
Redis resolved digest:
Fake-service base digest(s):
Platform:
Pulled at:
Reviewer:
Outcome: PASS | NOT PASS | BLOCKED
```
