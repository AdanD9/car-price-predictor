# Car Price Predictor Deployment Checklist 📋

Use this checklist to ensure a successful deployment to carpricepredictor.com.

## Pre-Deployment Requirements ✅

### Domain and Hosting
- [ ] Domain purchased (carpricepredictor.com)
- [ ] Server/VPS provisioned with public IP
- [ ] DNS records configured:
  - [ ] A record: @ → Server IP
  - [ ] A record: api → Server IP  
  - [ ] CNAME record: www → carpricepredictor.com
- [ ] Firewall configured (ports 22, 80, 443 open)

### Server Setup
- [ ] Ubuntu 20.04+ or compatible Linux OS installed
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] User added to docker group
- [ ] Minimum 2GB RAM, 10GB storage available

### Code and Configuration
- [ ] Project files uploaded to server
- [ ] `.env` file created from `.env.example`
- [ ] Domain and email configured in `.env`
- [ ] ML model file (`catboost_model.cbm`) present in backend directory

## Deployment Steps 🚀

### 1. Initial Setup
- [ ] SSH into server
- [ ] Navigate to project directory
- [ ] Verify all files are present
- [ ] Check `.env` configuration

### 2. Build and Deploy
- [ ] Run `./deploy.sh` script
- [ ] Monitor build process for errors
- [ ] Verify all containers start successfully
- [ ] Check service health endpoints

### 3. SSL Configuration
- [ ] SSL certificates obtained from Let's Encrypt
- [ ] HTTPS redirects working
- [ ] SSL auto-renewal configured
- [ ] Test certificate renewal (dry run)

### 4. DNS Propagation
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Test domain resolution from multiple locations
- [ ] Verify both www and non-www versions work

## Post-Deployment Verification ✅

### Website Functionality
- [ ] Main website loads at https://carpricepredictor.com
- [ ] Car prediction form is functional
- [ ] API endpoints respond correctly
- [ ] All pages load without errors
- [ ] Mobile responsiveness works

### Performance and Security
- [ ] SSL certificate valid and secure
- [ ] Security headers present
- [ ] Rate limiting functional
- [ ] CORS policies working
- [ ] Page load times acceptable (<3 seconds)

### API Testing
- [ ] GET https://api.carpricepredictor.com/ returns API info
- [ ] GET https://api.carpricepredictor.com/health returns healthy status
- [ ] POST https://api.carpricepredictor.com/predict accepts car data
- [ ] Predictions return reasonable values
- [ ] Error handling works for invalid inputs

### Monitoring Setup
- [ ] Health checks functioning
- [ ] Log aggregation working
- [ ] Container restart policies active
- [ ] Backup procedures documented

## Manual Configuration Steps 🔧

### 1. Domain Registrar Settings
```
DNS Records to Add:
Type    Name    Value               TTL
A       @       YOUR_SERVER_IP      300
A       api     YOUR_SERVER_IP      300
CNAME   www     carpricepredictor.com   300
```

### 2. Server Commands
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. Environment Configuration
```bash
# Copy and edit environment file
cp .env.example .env
nano .env

# Required variables:
DOMAIN=carpricepredictor.com
SSL_EMAIL=your-email@example.com
```

### 4. Deployment Commands
```bash
# Make scripts executable
chmod +x deploy.sh
chmod +x setup-ssl-renewal.sh

# Deploy application
./deploy.sh

# Setup SSL renewal
./setup-ssl-renewal.sh
```

## Troubleshooting Common Issues 🔧

### SSL Certificate Problems
```bash
# Check certificate status
docker-compose -f docker-compose.prod.yml run --rm certbot certificates

# Manual certificate request
docker-compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email YOUR_EMAIL --agree-tos --no-eff-email -d carpricepredictor.com -d api.carpricepredictor.com
```

### Service Issues
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### DNS Issues
```bash
# Check DNS resolution
nslookup carpricepredictor.com
dig carpricepredictor.com

# Test from different locations
# Use online tools like whatsmydns.net
```

## Maintenance Tasks 📅

### Daily
- [ ] Monitor service health
- [ ] Check error logs
- [ ] Verify SSL certificate status

### Weekly  
- [ ] Review performance metrics
- [ ] Check disk space usage
- [ ] Update security patches

### Monthly
- [ ] Test backup and restore procedures
- [ ] Review and rotate logs
- [ ] Update dependencies if needed

## Emergency Procedures 🚨

### Service Down
1. Check container status: `docker-compose -f docker-compose.prod.yml ps`
2. View logs: `docker-compose -f docker-compose.prod.yml logs`
3. Restart services: `docker-compose -f docker-compose.prod.yml restart`
4. If needed, rebuild: `docker-compose -f docker-compose.prod.yml up -d --build`

### SSL Certificate Expired
1. Force renewal: `docker-compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal`
2. Restart nginx: `docker-compose -f docker-compose.prod.yml restart nginx`

### High Traffic/DDoS
1. Check rate limiting logs
2. Adjust rate limits in nginx.conf if needed
3. Consider implementing additional DDoS protection

## Success Criteria ✨

Deployment is successful when:
- [ ] Website loads at https://carpricepredictor.com
- [ ] Car price predictions work correctly
- [ ] SSL certificate is valid and auto-renewing
- [ ] All health checks pass
- [ ] Performance is acceptable
- [ ] Security headers are present
- [ ] Monitoring is functional

## Contact Information 📞

For deployment support:
- Technical documentation: README.md
- API documentation: https://api.carpricepredictor.com/docs
- Health status: https://api.carpricepredictor.com/health

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Server IP**: ___________  
**SSL Certificate Expiry**: ___________
