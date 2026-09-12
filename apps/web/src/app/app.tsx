export function App(): React.JSX.Element {
  const services = [
    {
      name: "Fake IdP",
      status: "Healthy",
      detail: "Synthetic identity provider",
    },
    { name: "Fake PortSIP", status: "Healthy", detail: "No real dial/send" },
    { name: "Fake CRM", status: "Healthy", detail: "Synthetic contacts only" },
    {
      name: "PostgreSQL",
      status: "Healthy",
      detail: "Synthetic workspace store",
    },
    { name: "Redis", status: "Healthy", detail: "Ephemeral synthetic cache" },
  ];

  return (
    <main
      style={{
        fontFamily: "system-ui",
        margin: "0 auto",
        maxWidth: 960,
        padding: 32,
      }}
    >
      <header
        style={{ display: "flex", justifyContent: "space-between", gap: 24 }}
      >
        <div>
          <p style={{ color: "#64748b", margin: 0 }}>
            PORTSIP CC / AGENT WORKSPACE
          </p>
          <h1 style={{ margin: "8px 0" }}>Synthetic workspace</h1>
          <p style={{ color: "#475569", marginTop: 0 }}>
            Provisional build — all integrations are synthetic and side-effect
            free.
          </p>
        </div>
        <span
          style={{
            alignSelf: "flex-start",
            background: "#dcfce7",
            borderRadius: 999,
            color: "#166534",
            padding: "8px 12px",
          }}
        >
          Synthetic mode
        </span>
      </header>

      <section aria-labelledby="services-heading">
        <h2 id="services-heading">Environment status</h2>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {services.map((service) => (
            <article
              key={service.name}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong>{service.name}</strong>
                <span style={{ color: "#15803d", fontSize: 14 }}>
                  ● {service.status}
                </span>
              </div>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 0 }}>
                {service.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="actions-heading" style={{ marginTop: 32 }}>
        <h2 id="actions-heading">Agent controls</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button disabled type="button">
            Start call
          </button>
          <button disabled type="button">
            Transfer
          </button>
          <button disabled type="button">
            Update trunk
          </button>
        </div>
        <p style={{ color: "#92400e", fontSize: 14 }}>
          Call, transfer and trunk actions are disabled until exact PortSIP
          contract, sandbox and final D-010 authorization are approved.
        </p>
      </section>
    </main>
  );
}
