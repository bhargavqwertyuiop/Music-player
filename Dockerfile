# Multi-stage build for React Music Player
# Stage 1: Build the React application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code
COPY public/ ./public/
COPY src/ ./src/

# Build the application
RUN npm run build

# Stage 2: Production server with Nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create a non-root user for security
RUN addgroup -g 1001 -S musicwave && \
    adduser -S musicwave -u 1001 -G musicwave

# Set permissions
RUN chown -R musicwave:musicwave /usr/share/nginx/html && \
    chown -R musicwave:musicwave /var/cache/nginx && \
    chown -R musicwave:musicwave /var/log/nginx && \
    chown -R musicwave:musicwave /etc/nginx/conf.d

# Switch to non-root user
USER musicwave

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]