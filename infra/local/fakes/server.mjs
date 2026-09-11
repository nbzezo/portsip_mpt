import { createServer } from "node:http";

const service = process.env.FAKE_SERVICE ?? "unknown";
const port = Number(process.env.PORT ?? 8080);

const response = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
};

const server = createServer((req, res) => {
  if (req.url === "/health") {
    return response(res, 200, { ok: true, service, synthetic: true });
  }

  if (req.url === "/metadata") {
    return response(res, 200, {
      service,
      synthetic: true,
      sideEffects: false,
      credentials: false,
    });
  }

  return response(res, 404, { error: "not_found", service, synthetic: true });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`${service} synthetic service listening on ${port}`);
});
