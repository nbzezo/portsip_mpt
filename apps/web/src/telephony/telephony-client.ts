export type RegistrationState =
  "idle" | "registering" | "registered" | "failed";

export interface TelephonyClient {
  readonly registrationState: RegistrationState;
  register(): Promise<void>;
  unregister(): Promise<void>;
}

export class DisabledTelephonyClient implements TelephonyClient {
  readonly registrationState = "idle";

  register(): Promise<void> {
    return Promise.reject(
      new Error("PortSIP SDK is not configured in the Discovery scaffold"),
    );
  }

  unregister(): Promise<void> {
    return Promise.resolve();
  }
}
