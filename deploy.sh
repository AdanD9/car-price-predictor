#!/bin/bash

# Car Price Predictor Deployment Script
# This script deploys the application to production

set -e

echo "🚀 Starting Car Price Predictor deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
if [ -z "$DOMAIN" ] || [ -z "$SSL_EMAIL" ]; then
    echo "❌ Required environment variables not set. Please check your .env file."
    echo "Required: DOMAIN, SSL_EMAIL"
    exit 1
fi

echo "📦 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "🔧 Creating necessary directories..."
mkdir -p ssl
mkdir -p certbot-webroot

echo "🌐 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🔒 Setting up SSL certificates..."
# First, get certificates
docker-compose -f docker-compose.prod.yml run --rm certbot

# Reload nginx with SSL
docker-compose -f docker-compose.prod.yml restart nginx

echo "🔍 Checking service health..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "⚠️  Frontend health check failed"
fi

if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed"
fi

echo "🎉 Deployment complete!"
echo "🌐 Your site should be available at: https://$DOMAIN"
echo "🔧 API endpoint: https://api.$DOMAIN"

echo ""
echo "📋 Next steps:"
echo "1. Point your domain DNS to this server's IP address"
echo "2. Ensure ports 80 and 443 are open in your firewall"
echo "3. Monitor logs with: docker-compose -f docker-compose.prod.yml logs -f"
echo "4. Set up automatic SSL renewal (see setup-ssl-renewal.sh)"
