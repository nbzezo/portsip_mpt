# Database

Baseline: PostgreSQL 18.x. Migration SQL phải bất biến, tăng dần và ghi owner module trong header. Không chạy migration Production từ máy developer.

Scaffold hiện chưa có database credential và chưa chạy migration. Lệnh chính thức được ghi trong `docs/BUILD-PROFILE.md` khi local container runtime sẵn sàng.
