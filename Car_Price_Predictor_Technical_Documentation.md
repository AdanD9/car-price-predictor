# Car Price Predictor - Technical Documentation Report

## Executive Summary

The Car Price Predictor is a comprehensive AI-powered web application that provides instant, accurate car valuations using advanced machine learning technology. Built with modern web technologies including Next.js, FastAPI, and Docker, the platform delivers 98.3% prediction accuracy through a sophisticated CatBoost machine learning model trained on 87+ vehicle features.

**Key Metrics:**
- **Accuracy**: 98.3% prediction accuracy
- **Performance**: Instant results in seconds
- **Scalability**: Docker containerized architecture
- **Security**: SSL/HTTPS encryption, rate limiting, CORS protection
- **Deployment**: Production-ready on CarUbuntu server (157.245.142.242)

---

## 1. Technical Architecture

### 1.1 System Overview

The Car Price Predictor follows a modern microservices architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Nginx       │    │    Backend      │
│   (Next.js)     │◄──►│  Load Balancer  │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 80/443  │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   SSL/TLS       │    │   ML Model      │
│   & Assets      │    │   Certificates  │    │   (CatBoost)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2 Technology Stack

#### Frontend Technologies
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Build Tool**: Webpack (via Next.js)
- **Package Manager**: npm
- **Authentication**: NextAuth.js with Google OAuth
- **State Management**: React Hooks

#### Backend Technologies
- **Framework**: FastAPI (Python)
- **ML Library**: CatBoost
- **Data Processing**: Pandas, NumPy
- **API Documentation**: OpenAPI/Swagger
- **ASGI Server**: Uvicorn
- **Database**: MongoDB (via Mongoose ODM)

#### Infrastructure & Deployment
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (reverse proxy, load balancer)
- **SSL/TLS**: Let's Encrypt certificates
- **Server**: Ubuntu 25.04 (CarUbuntu - 157.245.142.242)
- **Domain**: carpricepredictor.com
- **API Subdomain**: api.carpricepredictor.com

### 1.3 Database Structure

The application uses MongoDB with the following key collections:

#### User Collection
```typescript
interface UserDocument {
  _id: ObjectId;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  customerId?: string;        // Stripe customer ID
  priceId?: string;          // Stripe price ID
  hasAccess: boolean;        // Subscription access
  createdAt: Date;
  updatedAt: Date;
}
```

#### Session Management
- NextAuth.js handles authentication sessions
- MongoDB adapter for persistent session storage
- Google OAuth integration for social login
- Magic link email authentication support

### 1.4 Data Flow Architecture

```
User Request → Nginx → Frontend (Next.js) → API Call → Backend (FastAPI) → ML Model → Response
     ↓              ↓                ↓              ↓              ↓
SSL/TLS      Load Balance    UI Render    Data Process   Prediction    JSON Response
```

---

## 2. API Endpoints and Functionality

### 2.1 Core API Endpoints

#### Health Check Endpoints
```
GET /
GET /health
```
**Purpose**: Service status monitoring and uptime verification
**Response**: Service status, timestamp, and health metrics

#### Machine Learning Model Endpoints
```
GET /models/info
```
**Purpose**: Retrieve model performance metrics and metadata
**Response**: Model accuracy, training data info, feature importance

#### Price Prediction Endpoint
```
POST /predict
Content-Type: application/json
```

**Request Schema**:
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

**Response Schema**:
```json
{
  "predicted_price": "float",
  "confidence_interval": {
    "lower": "float",
    "upper": "float"
  },
  "model_info": {
    "accuracy": "float",
    "model_version": "string"
  }
}
```

### 2.2 Authentication API

#### NextAuth.js Endpoints
```
GET/POST /api/auth/[...nextauth]
```
**Features**:
- Google OAuth authentication
- Magic link email authentication
- Session management
- CSRF protection
- Secure cookie handling

### 2.3 Payment Processing API

#### Stripe Integration
```
POST /api/stripe/checkout
POST /api/stripe/webhook
```
**Features**:
- Subscription management
- Payment processing
- Webhook signature verification
- Customer portal access

---

## 3. Machine Learning Model Implementation

### 3.1 Model Architecture

**Algorithm**: CatBoost (Gradient Boosting)
**Accuracy**: 98.3%
**Training Features**: 87+ vehicle attributes
**Model File**: `catboost_model.cbm`

### 3.2 Feature Engineering

The model analyzes multiple data categories:

#### Vehicle Specifications
- Make and model
- Year of manufacture
- Mileage
- Engine displacement
- Horsepower
- Fuel economy (city/highway)

#### Condition Factors
- Accident history
- Frame damage status
- Number of previous owners
- Maintenance records

#### Market Data
- Regional pricing trends
- Seasonal adjustments
- Supply and demand metrics
- Comparable vehicle analysis

### 3.3 Prediction Pipeline

```python
# Simplified prediction flow
def predict_car_price(vehicle_data):
    # 1. Data preprocessing
    processed_data = preprocess_input(vehicle_data)
    
    # 2. Feature engineering
    features = extract_features(processed_data)
    
    # 3. Model prediction
    prediction = catboost_model.predict(features)
    
    # 4. Confidence interval calculation
    confidence = calculate_confidence_interval(prediction)
    
    return {
        "predicted_price": prediction,
        "confidence_interval": confidence
    }
```

---

## 4. Deployment Architecture

### 4.1 Docker Configuration

#### Production Deployment (`docker-compose.prod.yml`)
```yaml
services:
  backend:
    build: ./backend
    restart: unless-stopped
    environment:
      - PYTHONUNBUFFERED=1
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:8080
    depends_on:
      - backend
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

### 4.2 Nginx Configuration

#### SSL/HTTPS Setup
```nginx
server {
    listen 443 ssl http2;
    server_name carpricepredictor.com;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/live/carpricepredictor.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/live/carpricepredictor.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    
    # Rate limiting
    limit_req zone=general burst=50 nodelay;
}
```

#### Rate Limiting Configuration
```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;
```

### 4.3 SSL Certificate Management

#### Automatic Renewal Setup
```bash
#!/bin/bash
# SSL Certificate Renewal Script
cd /opt/car-price-predictor
docker-compose -f docker-compose.prod.yml run --rm certbot renew
if [ $? -eq 0 ]; then
    docker-compose -f docker-compose.prod.yml restart nginx
fi
```

**Cron Schedule**: Daily certificate check and automatic renewal

---

## 5. Feature Documentation

### 5.1 Core Website Features

#### 5.1.1 AI-Powered Price Prediction
**Location**: Main homepage (`/`)
**Component**: `CarPredictionForm.tsx`

**Features**:
- Instant price predictions
- Confidence interval display
- Advanced options toggle
- Real-time form validation
- Loading states and error handling

**User Flow**:
1. User enters vehicle details (make, model, year, mileage)
2. Optional: Advanced details (engine, fuel economy, condition)
3. Form validation and submission
4. API call to backend prediction service
5. Results display with price range and confidence metrics

#### 5.1.2 VIN Lookup Service
**Location**: `/vin-lookup`
**Component**: `VinLookupForm.tsx`

**Features**:
- 17-character VIN validation
- Automatic vehicle data population
- Integration with NHTSA database
- Error handling for invalid VINs
- Seamless transition to price prediction

#### 5.1.3 Market Statistics Dashboard
**Location**: `/statistics`
**Component**: `StatisticsPreview.tsx`

**Features**:
- Real-time market data
- Price trend analysis
- Regional market insights
- Popular vehicle categories
- Interactive charts and graphs

### 5.2 User Interface Components

#### 5.2.1 Header Navigation
**Component**: `Header.tsx`
**Recent Changes**: Modified "How It Works" to "Pricing"

**Features**:
- Responsive navigation menu
- Mobile hamburger menu
- User authentication status
- Dynamic CTA buttons
- Smooth scroll navigation

#### 5.2.2 Hero Section
**Component**: `Hero.tsx`

**Features**:
- Compelling value proposition
- Call-to-action buttons
- Testimonial avatars
- High-quality imagery
- Mobile-responsive design

#### 5.2.3 Features Grid
**Component**: `FeaturesGrid.tsx`

**Features**:
- AI accuracy highlights
- Speed and convenience benefits
- Security and reliability assurance
- Visual feature icons
- Benefit-focused messaging

### 5.3 Authentication System

#### 5.3.1 User Management
**Technology**: NextAuth.js
**Database**: MongoDB with Mongoose ODM

**Features**:
- Google OAuth integration
- Magic link email authentication
- Secure session management
- User profile management
- Subscription status tracking

#### 5.3.2 Security Implementation
- CSRF protection
- Secure HTTP-only cookies
- JWT token validation
- Rate limiting per user
- Input sanitization

---

## 6. Recent Changes and Implementations

### 6.1 Header Modification (July 29, 2025)

**Change**: Updated navigation link from "How It Works" to "Pricing"
**Files Modified**: `frontend/components/Header.tsx`

**Before**:
```typescript
{
  href: "/#features",
  label: "How It Works",
}
```

**After**:
```typescript
{
  href: "/pricing",
  label: "Pricing",
}
```

**Impact**: Improved user navigation to pricing information and subscription plans

### 6.2 Comprehensive Pricing Page Implementation

**New Page**: `/pricing`
**File**: `frontend/app/pricing/page.tsx`
**Implementation Date**: July 29, 2025

#### 6.2.1 Subscription Tiers

**Basic Plan - $9.99/month**
- 10 car price predictions per month
- Basic VIN lookup
- Standard market data
- Email support
- Mobile app access

**Premium Plan - $24.99/month** (Most Popular)
- Unlimited car price predictions
- Advanced VIN lookup with history
- Detailed market analytics
- Priority email & chat support
- API access (1000 calls/month)
- Export reports to PDF
- Price alerts and notifications

**Enterprise Plan - $99.99/month**
- Unlimited everything
- Bulk processing capabilities
- Custom integrations
- Dedicated account manager
- API access (unlimited)
- White-label solutions
- Advanced analytics dashboard
- 24/7 phone support

#### 6.2.2 Payment Integration Sections

**Stripe Integration**
- Enterprise-grade security
- Credit/debit card processing
- Digital wallet support
- International payment support
- PCI DSS compliance

**PayPal Integration**
- Quick account-based payments
- Buyer protection
- International customer support
- Familiar payment experience
- Secure transaction processing

#### 6.2.3 "Coming Soon" Implementation

**Purpose**: Indicate future payment functionality while maintaining professional appearance

**Implementation**:
- Visual payment buttons with disabled state
- Clear "Coming Soon" overlays
- Consistent warning-colored indicators
- Professional messaging about future availability
- Maintains user engagement and expectation setting

**Code Example**:
```typescript
<div className="relative">
  <button className="btn btn-primary" disabled>
    Start Premium Plan
  </button>
  {comingSoon && (
    <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 rounded-lg">
      <span className="bg-warning text-warning-content px-3 py-1 rounded-full text-sm font-semibold">
        Coming Soon
      </span>
    </div>
  )}
</div>
```

### 6.3 Additional Pricing Page Features

#### 6.3.1 FAQ Section
- Comprehensive pricing questions
- Plan change policies
- Free trial information
- Payment method details
- Cancellation policies

#### 6.3.2 Call-to-Action Section
- Compelling final conversion opportunity
- Free trial promotion
- Trust-building messaging
- "Coming Soon" status for trial signup

---

## 7. File Structure and Organization

### 7.1 Project Structure
```
car-price-predictor/
├── backend/                    # FastAPI backend
│   ├── main.py                # API endpoints and ML integration
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend container
│   └── data_service.py       # Data processing utilities
├── frontend/                  # Next.js frontend
│   ├── app/                  # Next.js app directory
│   │   ├── pricing/          # NEW: Pricing page
│   │   │   └── page.tsx      # Pricing page implementation
│   │   ├── api/              # API routes
│   │   ├── page.tsx          # Homepage
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   │   ├── Header.tsx        # MODIFIED: Navigation header
│   │   ├── Hero.tsx          # Landing page hero
│   │   ├── CarPredictionForm.tsx  # Main prediction interface
│   │   ├── FeaturesGrid.tsx  # Feature showcase
│   │   └── Footer.tsx        # Site footer
│   ├── config.ts            # App configuration
│   └── package.json         # Dependencies
├── docker-compose.prod.yml    # Production containers
├── nginx.conf               # Nginx configuration
└── deploy.sh               # Deployment script
```

### 7.2 Component Organization

#### 7.2.1 Layout Components
- `Header.tsx`: Navigation and branding
- `Footer.tsx`: Site footer with links
- `LayoutClient.tsx`: Client-side providers

#### 7.2.2 Feature Components
- `CarPredictionForm.tsx`: Main prediction interface
- `Hero.tsx`: Landing page hero section
- `FeaturesGrid.tsx`: Feature highlights
- `StatisticsPreview.tsx`: Market data display
- `FAQ.tsx`: Frequently asked questions

#### 7.2.3 Authentication Components
- `ButtonSignin.tsx`: Authentication button
- `UserMenu.tsx`: User account menu
- NextAuth.js configuration in `/api/auth/`

---

## 8. Configuration and Environment Setup

### 8.1 Environment Variables

#### Frontend Configuration
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://backend:8080
NEXTAUTH_URL=https://carpricepredictor.com
NEXTAUTH_SECRET=<secure-secret>
GOOGLE_CLIENT_ID=<google-oauth-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
MONGODB_URI=<mongodb-connection-string>
```

#### Backend Configuration
```bash
PYTHONUNBUFFERED=1
DATABASE_URL=sqlite:///./carinsight.db
CORS_ORIGINS=https://carpricepredictor.com
VIN_DECODER_API_KEY=<vin-api-key>
VIN_DECODER_BASE_URL=https://api.vindecoder.eu/3.2
```

### 8.2 SSL/HTTPS Configuration

#### Domain Setup
- **Primary Domain**: carpricepredictor.com
- **API Subdomain**: api.carpricepredictor.com
- **SSL Provider**: Let's Encrypt
- **Certificate Renewal**: Automated daily checks

#### Security Headers
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
```

---

## 9. Performance and Monitoring

### 9.1 Health Checks

#### Container Health Monitoring
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

#### Service Status Endpoints
- Backend: `/health`
- Frontend: Health check via curl
- Database: Connection monitoring

### 9.2 Rate Limiting

#### API Protection
- General requests: 30 requests/second
- API endpoints: 10 requests/second
- Burst allowance: 50 requests
- IP-based limiting

### 9.3 Performance Optimization

#### Frontend Optimizations
- Next.js automatic code splitting
- Image optimization with Next.js Image component
- Static asset caching
- Gzip compression via Nginx

#### Backend Optimizations
- FastAPI async request handling
- Efficient ML model loading
- Response caching for static data
- Database connection pooling

---

## 10. Future Development Roadmap

### 10.1 Payment System Integration

#### Phase 1: Stripe Implementation
- Complete Stripe checkout integration
- Subscription management
- Customer portal
- Webhook processing

#### Phase 2: PayPal Integration
- PayPal payment processing
- Alternative payment methods
- International payment support
- Subscription billing

### 10.2 Feature Enhancements

#### Advanced Analytics
- Detailed market trend analysis
- Predictive market insights
- Custom reporting tools
- Data export capabilities

#### API Development
- Public API for developers
- Rate limiting per subscription tier
- API documentation portal
- SDK development

#### Mobile Application
- React Native mobile app
- Offline prediction capabilities
- Push notifications
- Camera-based VIN scanning

### 10.3 Infrastructure Improvements

#### Scalability Enhancements
- Kubernetes deployment
- Auto-scaling capabilities
- Load balancer optimization
- CDN integration

#### Monitoring and Analytics
- Application performance monitoring
- User behavior analytics
- Error tracking and reporting
- Business intelligence dashboard

---

## 11. Security Considerations

### 11.1 Data Protection

#### User Data Security
- Encrypted data transmission (HTTPS)
- Secure password hashing
- PII data protection
- GDPR compliance measures

#### API Security
- Rate limiting protection
- CORS policy enforcement
- Input validation and sanitization
- SQL injection prevention

### 11.2 Infrastructure Security

#### Server Security
- Regular security updates
- Firewall configuration
- SSH key authentication
- Fail2ban intrusion prevention

#### Container Security
- Minimal base images
- Non-root user execution
- Security scanning
- Dependency vulnerability checks

---

## 12. Conclusion

The Car Price Predictor represents a sophisticated, production-ready web application that successfully combines cutting-edge machine learning with modern web technologies. The recent implementation of the comprehensive pricing page and payment integration preparations positions the platform for successful monetization while maintaining the high-quality user experience that drives the core prediction functionality.

**Key Achievements:**
- ✅ 98.3% ML model accuracy
- ✅ Production deployment on CarUbuntu server
- ✅ Comprehensive pricing page implementation
- ✅ SSL/HTTPS security implementation
- ✅ Scalable Docker architecture
- ✅ Professional payment integration preparation

**Technical Excellence:**
- Modern TypeScript/React frontend
- High-performance FastAPI backend
- Robust Docker containerization
- Enterprise-grade security measures
- Comprehensive monitoring and health checks

The platform is well-positioned for continued growth and feature expansion, with a solid technical foundation that supports both current functionality and future enhancements.

---

*Document Version: 1.0*  
*Last Updated: July 29, 2025*  
*Prepared for: Technical Stakeholders and Business Decision-Makers*
