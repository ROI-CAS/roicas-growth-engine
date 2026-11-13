FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:7852dc5a7d72f5fe458a597d690f6c42fbc8e9e26ddfa95f8e6ef552558d9bbf
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund
COPY server.mjs ./server.mjs
COPY pinned-fetch.mjs ./pinned-fetch.mjs
USER pwuser
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
CMD ["node","--max-old-space-size=192","server.mjs"]
