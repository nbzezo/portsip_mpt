ARG NODE_IMAGE=node:24.15.0-bookworm-slim
FROM ${NODE_IMAGE}

ARG SERVICE_NAME=fake-service
ENV NODE_ENV=synthetic
ENV SERVICE_NAME=${SERVICE_NAME}

WORKDIR /app
COPY server.mjs ./server.mjs

USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
