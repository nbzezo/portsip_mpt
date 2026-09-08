const shutdown = (): void => {
  process.exitCode = 0;
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

console.info(
  JSON.stringify({ level: "info", service: "worker", status: "started" }),
);
