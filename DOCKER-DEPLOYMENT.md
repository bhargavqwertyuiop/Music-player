# 🐳 Docker Deployment Guide - MusicWave

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)
```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f musicwave

# Stop the application
docker-compose down
```

**Access your app:** `http://localhost` or `http://localhost:8080`

---

### Option 2: Docker Build & Run
```bash
# Build the Docker image
docker build -t musicwave:latest .

# Run the container
docker run -d \
  --name musicwave-app \
  -p 80:80 \
  -p 8080:80 \
  --restart unless-stopped \
  musicwave:latest

# View logs
docker logs -f musicwave-app

# Stop the container
docker stop musicwave-app
docker rm musicwave-app
```

---

## 🔧 Configuration Options

### Environment Variables
```bash
# Custom port configuration
docker run -d \
  --name musicwave-app \
  -p 3000:80 \
  -e NGINX_HOST=yourdomain.com \
  -e NGINX_PORT=80 \
  musicwave:latest
```

### Volume Mounts
```bash
# Mount custom nginx config
docker run -d \
  --name musicwave-app \
  -p 80:80 \
  -v $(pwd)/custom-nginx.conf:/etc/nginx/nginx.conf:ro \
  -v musicwave-logs:/var/log/nginx \
  musicwave:latest
```

---

## 🌐 Production Deployment

### With Custom Domain
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  musicwave:
    build: .
    container_name: musicwave-prod
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NGINX_HOST=yourdomain.com
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.musicwave.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.musicwave.tls=true"
      - "traefik.http.routers.musicwave.tls.certresolver=letsencrypt"
```

### Behind a Reverse Proxy (Nginx/Apache)
```nginx
# /etc/nginx/sites-available/musicwave
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```bash
# Check application health
curl http://localhost/health

# Expected response: "healthy"
```

### Container Health
```bash
# Check container health status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View health check logs
docker inspect musicwave-app | grep -A 5 -B 5 "Health"
```

### Log Monitoring
```bash
# Real-time logs
docker-compose logs -f musicwave

# Nginx access logs
docker exec musicwave-app tail -f /var/log/nginx/access.log

# Nginx error logs
docker exec musicwave-app tail -f /var/log/nginx/error.log
```

---

## 🔒 Security Features

### Built-in Security Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Non-root User
- Container runs as user `musicwave` (UID: 1001)
- No privileged access required

### Network Security
```bash
# Run with custom network
docker network create musicwave-net
docker run -d \
  --name musicwave-app \
  --network musicwave-net \
  -p 80:80 \
  musicwave:latest
```

---

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy MusicWave
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t musicwave:${{ github.sha }} .
      
      - name: Deploy to production
        run: |
          docker stop musicwave-app || true
          docker rm musicwave-app || true
          docker run -d \
            --name musicwave-app \
            -p 80:80 \
            --restart unless-stopped \
            musicwave:${{ github.sha }}
```

### Docker Hub Deployment
```bash
# Build and tag for Docker Hub
docker build -t yourusername/musicwave:latest .
docker build -t yourusername/musicwave:v1.0.0 .

# Push to Docker Hub
docker push yourusername/musicwave:latest
docker push yourusername/musicwave:v1.0.0

# Deploy from Docker Hub
docker run -d \
  --name musicwave-app \
  -p 80:80 \
  yourusername/musicwave:latest
```

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find what's using port 80
sudo lsof -i :80

# Use alternative port
docker run -d -p 3000:80 musicwave:latest
```

#### Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Build with no cache
docker build --no-cache -t musicwave:latest .

# Check build logs
docker build -t musicwave:latest . --progress=plain
```

#### Container Won't Start
```bash
# Check container logs
docker logs musicwave-app

# Run interactively for debugging
docker run -it --rm musicwave:latest sh

# Check nginx configuration
docker run -it --rm musicwave:latest nginx -t
```

---

## 📈 Performance Optimization

### Multi-stage Build Benefits
- **Build stage:** ~500MB (includes Node.js, build tools)
- **Production stage:** ~25MB (only Nginx + built files)
- **Final image:** Small, secure, fast

### Nginx Optimizations
- Gzip compression enabled
- Static asset caching (1 year)
- HTTP/2 ready
- Security headers included

### Resource Limits
```yaml
# docker-compose.yml with resource limits
services:
  musicwave:
    build: .
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.5'
        reservations:
          memory: 64M
          cpus: '0.25'
```

---

## 🌍 Multi-platform Support

### Build for Multiple Architectures
```bash
# Create builder
docker buildx create --name multiarch --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t yourusername/musicwave:latest \
  --push .
```

### Platform-specific Builds
```bash
# For ARM64 (Apple Silicon, Raspberry Pi)
docker buildx build --platform linux/arm64 -t musicwave:arm64 .

# For AMD64 (Intel/AMD)
docker buildx build --platform linux/amd64 -t musicwave:amd64 .
```

---

## 📋 Quick Reference

### Useful Commands
```bash
# Build and run in one command
docker-compose up --build -d

# Update and restart
docker-compose pull && docker-compose up -d

# Backup container
docker commit musicwave-app musicwave:backup-$(date +%Y%m%d)

# View container stats
docker stats musicwave-app

# Clean up unused resources
docker system prune
```

### Environment URLs
- **Development:** `http://localhost:3000` (React dev server)
- **Local Docker:** `http://localhost:80` or `http://localhost:8080`
- **Production:** `https://yourdomain.com`

---

**🎉 Your MusicWave application is now ready for Docker deployment!**