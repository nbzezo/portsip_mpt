import { describe, expect, it } from "vitest";

describe("worker bootstrap", () => {
  it("keeps production side effects disabled in the scaffold", () => {
    expect(process.env.PORTSIP_REAL_SIDE_EFFECTS).not.toBe("enabled");
  });
});
