export type ConfigurationRisk =
  "operator-safe" | "approval-required" | "system-only";

export interface ConfigurationDefinition {
  key: string;
  version: number;
  owner: string;
  risk: ConfigurationRisk;
  secret: boolean;
}
