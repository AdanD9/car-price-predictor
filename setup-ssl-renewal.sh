#!/bin/bash

# SSL Certificate Renewal Setup Script
# This script sets up automatic SSL certificate renewal

echo "🔒 Setting up SSL certificate auto-renewal..."

# Create renewal script
cat > /etc/cron.daily/ssl-renewal << 'EOF'
#!/bin/bash

# Navigate to project directory
cd /path/to/your/car-price-predictor

# Renew certificates
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# Reload nginx if certificates were renewed
if [ $? -eq 0 ]; then
    docker-compose -f docker-compose.prod.yml restart nginx
    echo "SSL certificates renewed and nginx reloaded"
fi
EOF

# Make the script executable
chmod +x /etc/cron.daily/ssl-renewal

echo "✅ SSL auto-renewal setup complete!"
echo "📅 Certificates will be checked daily and renewed automatically when needed"

# Test the renewal process
echo "🧪 Testing certificate renewal (dry run)..."
docker-compose -f docker-compose.prod.yml run --rm certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo "✅ SSL renewal test successful!"
else
    echo "❌ SSL renewal test failed. Please check your configuration."
fi
