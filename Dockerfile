FROM node:24-bookworm-slim

WORKDIR /app

# Install native compilation tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    gcc \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install openclaw globally
RUN npm install -g --ignore-engines --unsafe-perm openclaw@2026.11.3

# Copy application configuration and helper scripts
COPY . .

# Run transport patch for SHIV AI custom header support
RUN node patch.js

# Expose Render default port
EXPOSE 10000

ENV PORT=10000
ENV NODE_ENV=production
# Restrict V8 heap to 280MB so it stays well below Render's 512MB RAM cap
ENV NODE_OPTIONS="--max-old-space-size=280"
ENV UV_THREADPOOL_SIZE=2

# Start OpenClaw Gateway bound to Render port
CMD ["node", "start.js"]
