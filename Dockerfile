# Use Node.js LTS as base image
FROM node:20-slim AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=base /app/dist ./dist

# Expose port (Astro Node adapter default is 4321, but can be overridden)
EXPOSE 4321

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "./dist/server/entry.mjs"]

