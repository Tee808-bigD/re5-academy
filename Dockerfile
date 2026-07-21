# RE5 Academy - Full Stack Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install ALL dependencies (including devDependencies needed for build)
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

# Copy source code (including db, server, and config files)
COPY . .

# Build-time arguments for Vite (frontend needs these at build time)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_APP_ID
ARG VITE_KIMI_AUTH_URL
ARG KIMI_OPEN_URL
ARG OWNER_UNION_ID

# Make them available as environment variables during the build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_APP_ID=$VITE_APP_ID
ENV VITE_KIMI_AUTH_URL=$VITE_KIMI_AUTH_URL
ENV KIMI_OPEN_URL=$KIMI_OPEN_URL
ENV OWNER_UNION_ID=$OWNER_UNION_ID

# Build the application (Vite frontend + server)
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/db ./db
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/tsconfig.server.json ./tsconfig.server.json
COPY --from=builder /app/public ./public

# Runtime environment variables (Render injects these at runtime)
ENV NODE_ENV=production
ENV PORT=3000

# Note: VITE_* vars are NOT needed at runtime for the server
# But if your server code reads SUPABASE_URL directly, add:
# ENV SUPABASE_URL=${VITE_SUPABASE_URL}
# ENV SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/boot.js"]
