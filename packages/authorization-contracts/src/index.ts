export interface AuthorizationDecision {
  allowed: boolean;
  reason: string;
  policyVersion: string;
  obligations: readonly string[];
}
