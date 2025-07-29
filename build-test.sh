#!/bin/bash

echo "🎵 MusicWave - Build Test Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check Node.js
print_info "Checking Node.js version..."
node --version
print_status $? "Node.js is installed"

# Check npm
print_info "Checking npm version..."
npm --version
print_status $? "npm is installed"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
    print_status $? "Dependencies installed"
else
    print_info "Dependencies already installed"
fi

# Run build
print_info "Building React application..."
npm run build
print_status $? "React build completed"

# Check build output
if [ -d "build" ]; then
    print_info "Checking build output..."
    BUILD_SIZE=$(du -sh build | cut -f1)
    echo "Build size: $BUILD_SIZE"
    
    # Check if main files exist
    if [ -f "build/index.html" ]; then
        print_status 0 "index.html exists"
    else
        print_status 1 "index.html missing"
    fi
    
    # Check for static assets
    if [ -d "build/static" ]; then
        print_status 0 "Static assets directory exists"
        JS_FILES=$(find build/static/js -name "*.js" | wc -l)
        CSS_FILES=$(find build/static/css -name "*.css" | wc -l)
        echo "JavaScript files: $JS_FILES"
        echo "CSS files: $CSS_FILES"
    else
        print_status 1 "Static assets directory missing"
    fi
else
    print_status 1 "Build directory not found"
fi

# Test with a simple HTTP server if available
if command -v python3 &> /dev/null; then
    print_info "Testing with Python HTTP server..."
    echo "You can test the build by running:"
    echo "cd build && python3 -m http.server 8000"
    echo "Then visit: http://localhost:8000"
elif command -v python &> /dev/null; then
    print_info "Testing with Python HTTP server..."
    echo "You can test the build by running:"
    echo "cd build && python -m SimpleHTTPServer 8000"
    echo "Then visit: http://localhost:8000"
elif command -v npx &> /dev/null; then
    print_info "Testing with npx serve..."
    echo "You can test the build by running:"
    echo "npx serve -s build -l 8000"
    echo "Then visit: http://localhost:8000"
fi

echo ""
echo "🎉 Build test completed successfully!"
echo ""
echo "Next steps for Docker deployment:"
echo "1. Install Docker on your system"
echo "2. Run: docker build -t musicwave:latest ."
echo "3. Run: docker run -d -p 80:80 --name musicwave-app musicwave:latest"
echo "4. Visit: http://localhost"
echo ""
echo "Or use Docker Compose:"
echo "1. Run: docker-compose up -d"
echo "2. Visit: http://localhost or http://localhost:8080"