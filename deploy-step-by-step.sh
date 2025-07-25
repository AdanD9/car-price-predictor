#!/bin/bash

# CarInsight Pro - Step-by-Step Deployment Script
# This script deploys the application step by step to avoid SSL issues

set -e

echo "🚀 CarInsight Pro - Step-by-Step Deployment"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)
print_status "Server IP: $SERVER_IP"

# Check if domains point to this server
print_status "Checking DNS configuration..."

DOMAIN_IP=$(dig +short carpricepredictor.com | tail -n1)
API_DOMAIN_IP=$(dig +short api.carpricepredictor.com | tail -n1)

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    print_warning "carpricepredictor.com does not point to this server"
    print_warning "Current: $DOMAIN_IP, Expected: $SERVER_IP"
    echo "Please update your DNS records before continuing."
    read -p "Press Enter when DNS is configured correctly..."
fi

if [ "$API_DOMAIN_IP" != "$SERVER_IP" ]; then
    print_warning "api.carpricepredictor.com does not point to this server"
    print_warning "Current: $API_DOMAIN_IP, Expected: $SERVER_IP"
    echo "Please update your DNS records before continuing."
    read -p "Press Enter when DNS is configured correctly..."
fi

# Step 1: Deploy with HTTP only
print_status "Step 1: Deploying with HTTP only (no SSL)..."

# Stop any existing containers
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.http.yml down 2>/dev/null || true

# Create certbot webroot directory
mkdir -p certbot-webroot

# Build and start HTTP-only version
print_status "Building Docker images..."
docker-compose -f docker-compose.http.yml build

print_status "Starting services..."
docker-compose -f docker-compose.http.yml up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
print_status "Checking service health..."

# Check backend
if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    print_success "Backend is running"
else
    print_error "Backend is not responding"
    docker-compose -f docker-compose.http.yml logs backend
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_success "Frontend is running"
else
    print_error "Frontend is not responding"
    docker-compose -f docker-compose.http.yml logs frontend
    exit 1
fi

# Check nginx
if curl -f http://localhost:80 >/dev/null 2>&1; then
    print_success "Nginx is running"
else
    print_error "Nginx is not responding"
    docker-compose -f docker-compose.http.yml logs nginx
    exit 1
fi

print_success "All services are running!"

# Test domain access
print_status "Testing domain access..."
if curl -f "http://carpricepredictor.com" >/dev/null 2>&1; then
    print_success "Main domain is accessible"
else
    print_warning "Main domain is not accessible yet (DNS propagation may take time)"
fi

if curl -f "http://api.carpricepredictor.com/health" >/dev/null 2>&1; then
    print_success "API domain is accessible"
else
    print_warning "API domain is not accessible yet (DNS propagation may take time)"
fi

# Step 2: Get SSL certificates
print_status "Step 2: Requesting SSL certificates..."

# Request certificates using standalone certbot
docker run --rm \
    -v "$(pwd)/ssl:/etc/letsencrypt" \
    -v "$(pwd)/certbot-webroot:/var/www/certbot" \
    -p 80:80 \
    --name certbot-standalone \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@carpricepredictor.com \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d carpricepredictor.com \
    -d api.carpricepredictor.com

if [ $? -eq 0 ]; then
    print_success "SSL certificates obtained successfully!"
    
    # Step 3: Deploy with HTTPS
    print_status "Step 3: Deploying with HTTPS..."
    
    # Stop HTTP-only version
    docker-compose -f docker-compose.http.yml down
    
    # Start HTTPS version
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "HTTPS deployment complete!"
    
    # Final verification
    print_status "Final verification..."
    sleep 30
    
    if curl -f "https://carpricepredictor.com" >/dev/null 2>&1; then
        print_success "HTTPS main domain is working!"
    else
        print_warning "HTTPS main domain not accessible yet"
    fi
    
    if curl -f "https://api.carpricepredictor.com/health" >/dev/null 2>&1; then
        print_success "HTTPS API domain is working!"
    else
        print_warning "HTTPS API domain not accessible yet"
    fi
    
else
    print_error "SSL certificate generation failed"
    print_warning "Continuing with HTTP-only deployment"
    print_warning "You can try SSL setup again later when DNS is fully propagated"
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "Your CarInsight Pro platform is now running:"
echo "• Main site: http://carpricepredictor.com (or https if SSL worked)"
echo "• API: http://api.carpricepredictor.com (or https if SSL worked)"
echo "• Server IP: $SERVER_IP"
echo ""
echo "To check status: docker-compose ps"
echo "To view logs: docker-compose logs [service-name]"
echo ""

print_success "Deployment completed successfully! 🚀"
