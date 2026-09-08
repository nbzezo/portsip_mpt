import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "@portsip-cc/api-contracts";

@Controller("health")
export class HealthController {
  @Get("live")
  live(): HealthResponse {
    return { status: "ok", service: "api" };
  }

  @Get("ready")
  ready(): HealthResponse {
    return {
      status: "degraded",
      service: "api",
      reason: "dependencies-not-configured",
    };
  }
}
