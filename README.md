# Car Price Predictor 🚗

An AI-powered car price prediction website that provides instant, accurate car valuations using advanced machine learning. Built with Next.js, FastAPI, and CatBoost ML model.

## 🌟 Features

- **AI-Powered Predictions**: 98.3% accuracy using CatBoost model trained on 87+ features
- **Instant Results**: Get car valuations in seconds
- **Comprehensive Analysis**: Considers vehicle specs, market trends, condition, and regional data
- **User-Friendly Interface**: Clean, responsive design built with Next.js and Tailwind CSS
- **Production Ready**: Docker containerized with SSL, rate limiting, and monitoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Nginx       │    │    Backend      │
│   (Next.js)     │◄──►│  (Reverse Proxy)│◄──►│   (FastAPI)     │
│   Port 3000     │    │   Ports 80/443  │    │   Port 8000     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │   ML Model      │
                                               │  (CatBoost)     │
                                               └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Domain name pointed to your server (for production)
- SSL email for Let's Encrypt certificates

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-price-predictor
   ```

2. **Run development setup**
   ```bash
   chmod +x dev-setup.sh
   ./dev-setup.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Production Deployment

1. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your domain and email
   ```

2. **Deploy to production**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Set up SSL auto-renewal**
   ```bash
   chmod +x setup-ssl-renewal.sh
   ./setup-ssl-renewal.sh
   ```

## 📁 Project Structure

```
car-price-predictor/
├── backend/                 # FastAPI backend
│   ├── main.py             # API endpoints and ML model integration
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile         # Backend container configuration
│   └── catboost_model.cbm # Trained ML model
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── config.ts         # App configuration
│   ├── package.json      # Node.js dependencies
│   └── Dockerfile        # Frontend container configuration
├── docker-compose.yml     # Development containers
├── docker-compose.prod.yml # Production containers
├── nginx.conf            # Nginx configuration
├── deploy.sh            # Production deployment script
├── dev-setup.sh         # Development setup script
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Domain Configuration
DOMAIN=carpricepredictor.com
NEXT_PUBLIC_DOMAIN=carpricepredictor.com

# API Configuration  
NEXT_PUBLIC_API_URL=https://api.carpricepredictor.com
BACKEND_PORT=8000
FRONTEND_PORT=3000

# SSL Configuration
SSL_EMAIL=your-email@example.com
```

### Model Features

The ML model analyzes 87+ features including:

- **Vehicle Information**: Make, model, year, mileage
- **Engine Specifications**: Displacement, horsepower, cylinders, fuel economy
- **Physical Attributes**: Dimensions, seating capacity, legroom
- **Condition Factors**: Accident history, frame damage, previous owners
- **Market Data**: Regional pricing, seasonal trends, listing timing
- **Vehicle History**: Fleet usage, salvage title, theft history

## 🛠️ Manual Setup Steps

### 1. Server Requirements

- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **RAM**: Minimum 2GB, recommended 4GB+
- **Storage**: Minimum 10GB free space
- **Network**: Public IP address with ports 80 and 443 open

### 2. Domain Configuration

1. **Purchase a domain** (e.g., carpricepredictor.com)
2. **Configure DNS records**:
   ```
   A    @              YOUR_SERVER_IP
   A    api            YOUR_SERVER_IP
   CNAME www           carpricepredictor.com
   ```

### 3. Server Setup

1. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Install Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Configure firewall**:
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

### 4. Application Deployment

1. **Upload project files** to your server
2. **Configure environment** variables in `.env`
3. **Run deployment script**:
   ```bash
   ./deploy.sh
   ```

### 5. SSL Certificate Setup

The deployment script automatically:
- Requests SSL certificates from Let's Encrypt
- Configures Nginx with SSL
- Sets up automatic renewal

### 6. Monitoring and Maintenance

**Check service status**:
```bash
docker-compose -f docker-compose.prod.yml ps
```

**View logs**:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

**Update application**:
```bash
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 API Documentation

### Endpoints

- `GET /` - Health check and API information
- `GET /health` - Service health status
- `POST /predict` - Car price prediction
- `GET /models/info` - Model performance metrics

### Example API Usage

```javascript
const response = await fetch('https://api.carpricepredictor.com/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    make_name: 'Toyota',
    model_name: 'Camry',
    year: 2020,
    mileage: 45000,
    // ... additional optional fields
  }),
});

const prediction = await response.json();
console.log(`Predicted price: $${prediction.predicted_price}`);
```

## 🔒 Security Features

- **SSL/TLS encryption** with automatic certificate renewal
- **Rate limiting** to prevent API abuse
- **CORS protection** with domain restrictions
- **Security headers** (XSS protection, content type sniffing prevention)
- **Input validation** and sanitization
- **Container isolation** with Docker

## 🚨 Troubleshooting

### Common Issues

1. **SSL Certificate Issues**:
   ```bash
   # Check certificate status
   docker-compose -f docker-compose.prod.yml run --rm certbot certificates
   
   # Force renewal
   docker-compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
   ```

2. **Service Not Starting**:
   ```bash
   # Check logs
   docker-compose -f docker-compose.prod.yml logs backend
   docker-compose -f docker-compose.prod.yml logs frontend
   ```

3. **Model Loading Issues**:
   - Ensure `catboost_model.cbm` is in the backend directory
   - Check file permissions and size
   - Verify Python dependencies are installed

### Performance Optimization

- **Enable caching** in Nginx for static assets
- **Configure CDN** for global content delivery
- **Monitor resource usage** and scale containers as needed
- **Implement database caching** for frequent predictions

## 📈 Monitoring

### Health Checks

All services include health checks:
- Frontend: HTTP GET to `/`
- Backend: HTTP GET to `/health`
- Automatic restart on failure

### Logs

Access logs with:
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review the API documentation at `/docs`
- Open an issue in the repository

---

**Built with ❤️ using Next.js, FastAPI, and CatBoost ML**
