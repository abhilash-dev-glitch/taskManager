# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install server dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Install client dependencies and build
WORKDIR /app/client
RUN npm ci --only=production && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/server /app/server
COPY --from=builder /app/client/build /app/client/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Create logs directory
RUN mkdir -p /app/logs

WORKDIR /app/server

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
