# Technical Specifications 📋

## System Architecture

### Overview
The Car Price Predictor is a full-stack web application built with modern technologies and deployed using containerization for scalability and reliability.

### Technology Stack

#### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS + DaisyUI
- **Language**: TypeScript
- **Build Tool**: Webpack (via Next.js)
- **Package Manager**: npm

#### Backend
- **Framework**: FastAPI (Python)
- **ML Library**: CatBoost
- **Data Processing**: Pandas, NumPy
- **API Documentation**: OpenAPI/Swagger
- **ASGI Server**: Uvicorn

#### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **Process Management**: Docker Swarm ready

### Machine Learning Model

#### Model Details
- **Algorithm**: CatBoost Regressor
- **Training Data**: 2.8M+ car listings
- **Features**: 87 engineered features
- **Performance**: 98.3% R² accuracy, $1,146 MAE
- **Model Size**: ~50MB serialized

#### Feature Categories
1. **Vehicle Specifications** (15 features)
   - Make, model, year, mileage
   - Engine displacement, horsepower, cylinders
   - Fuel economy (city/highway)
   - Physical dimensions

2. **Market Data** (25 features)
   - Regional pricing trends
   - Seasonal adjustments
   - Days on market
   - Dealer vs private sale

3. **Condition Factors** (20 features)
   - Accident history
   - Frame damage
   - Previous owners
   - Title issues (salvage, theft)

4. **Derived Features** (27 features)
   - Age calculations
   - Mileage per year
   - Power-to-weight ratios
   - Luxury brand indicators

## API Specifications

### Endpoints

#### Health Check
```
GET /
GET /health
```
**Response**: Service status and uptime

#### Model Information
```
GET /models/info
```
**Response**: Model performance metrics and metadata

#### Price Prediction
```
POST /predict
Content-Type: application/json
```

**Request Body**:
```json
{
  "make_name": "string",
  "model_name": "string", 
  "year": "integer (2001-2025)",
  "mileage": "integer (0-200000)",
  "engine_displacement": "integer (700-8400, optional)",
  "horsepower": "integer (55-1001, optional)",
  "city_fuel_economy": "float (7-127, optional)",
  "highway_fuel_economy": "float (10-127, optional)",
  "has_accidents": "boolean (optional)",
  "frame_damaged": "boolean (optional)",
  "owner_count": "integer (1-19, optional)"
}
```

**Response**:
```json
{
  "predicted_price": "float",
  "confidence_interval": {
    "lower": "float",
    "upper": "float", 
    "confidence_level": "float"
  },
  "model_info": {
    "model_type": "string",
    "r2_score": "float",
    "mae": "float",
    "rmse": "float"
  }
}
```

### Rate Limiting
- **General requests**: 30 requests/second per IP
- **API predictions**: 10 requests/second per IP
- **Burst allowance**: 50 requests for general, 20 for API

### Error Handling
- **400**: Bad Request (invalid input data)
- **422**: Validation Error (missing required fields)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error
- **503**: Service Unavailable (model not loaded)

## Security Specifications

### SSL/TLS Configuration
- **Protocols**: TLS 1.2, TLS 1.3
- **Cipher Suites**: ECDHE-RSA-AES256-GCM-SHA512, DHE-RSA-AES256-GCM-SHA512
- **Certificate**: Let's Encrypt wildcard certificate
- **HSTS**: Enabled with 1-year max-age

### Security Headers
```
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self' http: https: data: blob: 'unsafe-inline'
```

### CORS Policy
- **Allowed Origins**: https://carpricepredictor.com
- **Allowed Methods**: GET, POST, OPTIONS
- **Allowed Headers**: Origin, X-Requested-With, Content-Type, Accept, Authorization

## Performance Specifications

### Response Times
- **Static pages**: <500ms
- **API predictions**: <2 seconds
- **Model loading**: <10 seconds (startup)

### Throughput
- **Concurrent users**: 1000+
- **Predictions per second**: 100+
- **Uptime target**: 99.9%

### Resource Requirements

#### Minimum (Development)
- **CPU**: 2 cores
- **RAM**: 2GB
- **Storage**: 5GB
- **Network**: 10 Mbps

#### Recommended (Production)
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **Network**: 100 Mbps

#### Scaling (High Traffic)
- **CPU**: 8+ cores
- **RAM**: 16GB+
- **Storage**: 100GB+ SSD
- **Network**: 1 Gbps
- **Load Balancer**: Multiple instances

## Deployment Specifications

### Container Configuration

#### Frontend Container
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Backend Container
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

#### Required
- `DOMAIN`: Primary domain name
- `SSL_EMAIL`: Email for SSL certificates
- `NEXT_PUBLIC_API_URL`: API endpoint URL

#### Optional
- `NODE_ENV`: Environment (development/production)
- `PYTHONUNBUFFERED`: Python output buffering
- `BACKEND_PORT`: Backend service port
- `FRONTEND_PORT`: Frontend service port

### Health Checks
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Monitoring and Logging

### Application Logs
- **Format**: JSON structured logging
- **Levels**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Rotation**: Daily, 30-day retention
- **Location**: `/var/log/car-predictor/`

### Metrics Collection
- **Response times**: P50, P95, P99 percentiles
- **Error rates**: 4xx, 5xx responses
- **Throughput**: Requests per second
- **Resource usage**: CPU, memory, disk

### Alerting Thresholds
- **Response time**: >5 seconds
- **Error rate**: >5%
- **CPU usage**: >80%
- **Memory usage**: >90%
- **Disk usage**: >85%

## Backup and Recovery

### Data Backup
- **Model files**: Daily backup to cloud storage
- **Configuration**: Version controlled in Git
- **SSL certificates**: Automated backup with renewal

### Recovery Procedures
- **RTO** (Recovery Time Objective): 15 minutes
- **RPO** (Recovery Point Objective): 24 hours
- **Disaster recovery**: Multi-region deployment ready

## Compliance and Standards

### Web Standards
- **HTML5**: Semantic markup
- **CSS3**: Modern styling features
- **ES2020**: JavaScript standard
- **WCAG 2.1**: Accessibility guidelines (Level AA)

### API Standards
- **REST**: RESTful API design
- **OpenAPI 3.0**: API documentation
- **JSON**: Data exchange format
- **HTTP/2**: Protocol support

### Security Standards
- **OWASP**: Top 10 security practices
- **GDPR**: Privacy compliance ready
- **SOC 2**: Security framework compatible

## Development Workflow

### Code Quality
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates

### Testing Strategy
- **Unit tests**: Jest + React Testing Library
- **Integration tests**: API endpoint testing
- **E2E tests**: Playwright (recommended)
- **Load testing**: Artillery or k6

### CI/CD Pipeline
```yaml
stages:
  - lint
  - test
  - build
  - security-scan
  - deploy
```

## Browser Support

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Support
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Samsung Internet**: 14+

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-22  
**Next Review**: 2025-04-22
