import { describe, expect, it } from "vitest";

import { HealthController } from "../src/modules/health/health.controller.js";

describe("HealthController", () => {
  it("does not claim readiness before dependencies are configured", () => {
    expect(new HealthController().ready()).toEqual({
      status: "degraded",
      service: "api",
      reason: "dependencies-not-configured",
    });
  });
});
