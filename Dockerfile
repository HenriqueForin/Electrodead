FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY frontend/package*.json ./frontend/
RUN npm --prefix frontend ci && npm cache clean --force

COPY frontend ./frontend
RUN npm run build:frontend


FROM nginx:1.27-alpine AS frontend

RUN apk add --no-cache curl

COPY infra/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=5 \
  CMD curl -f http://localhost/health || exit 1


FROM node:20-alpine AS backend

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node src ./src
COPY --chown=node:node scripts ./scripts

USER node

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["sh", "-c", "npm run db:wait && npm run db:migrate && npm run admin:create && npm start"]
