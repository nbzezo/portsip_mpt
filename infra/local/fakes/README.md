# Repository-owned fake services

The same minimal Node service is built three times by Compose with `FAKE_SERVICE=idp|portsip|crm`.
It exposes only `/health` and `/metadata`, returns synthetic metadata, and has no credentials,
vendor SDK, network side effect, dial/send operation, or production route.

The Node base image must be pinned by digest in `infra/local/images.lock.yml` before a runtime
replay. Do not add real provider behavior to these fakes; contract-specific behavior belongs in
PoC fixtures and tests.
