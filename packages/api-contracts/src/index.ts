export interface HealthResponse {
  status: "ok" | "degraded";
  service: "api" | "worker";
  reason?: string;
}
