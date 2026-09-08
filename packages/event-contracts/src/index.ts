export interface EventEnvelope<TPayload> {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  appTenantId: string;
  correlationId: string;
  causationId?: string;
  payload: TPayload;
}
