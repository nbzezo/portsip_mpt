ARG NODE_IMAGE=node:24.15.0-bookworm-slim@sha256:4e6b70dd6cbfc88c8157ba19aa3d9f9cce6ba4703576d55459e45efcbc9c5f5d
FROM ${NODE_IMAGE}

ARG SERVICE_NAME=fake-service
ENV NODE_ENV=synthetic
ENV SERVICE_NAME=${SERVICE_NAME}

WORKDIR /app
COPY server.mjs ./server.mjs

USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
