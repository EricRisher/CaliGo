# 1. Base image for installing dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 2. Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Production runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment variable
ENV NODE_ENV=production

# Copy only necessary files for production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Ensure necessary directories are writable
RUN mkdir -p .next/cache && chmod -R 777 .next/cache

# Reduce attack surface by switching to a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
