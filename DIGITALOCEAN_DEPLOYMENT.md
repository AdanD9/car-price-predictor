# 🚀 CarInsight Pro - DigitalOcean Deployment Guide

## 📋 Quick Deployment Steps

### 1. Prepare Repository
Your code is already ready for deployment! The platform includes:
- ✅ **Backend API** - FastAPI with AI model and business features
- ✅ **Frontend Web App** - Next.js with modern UI
- ✅ **Authentication** - Google OAuth and email magic links
- ✅ **Database Models** - User management and business logic

### 2. Deploy to DigitalOcean App Platform

#### **Step 1: Create App**
1. Go to [DigitalOcean Console](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Select "GitHub" as source
4. Choose your repository: `AdanD9/car-price-predictor`
5. Select branch: `main`

#### **Step 2: Configure Services**
DigitalOcean will auto-detect:
- **Frontend** (Next.js) from `/frontend` directory
- **Backend** (Python/FastAPI) from `/backend` directory

#### **Step 3: Set Environment Variables**
Add these environment variables in the DigitalOcean console:

**For Frontend:**
```
NEXTAUTH_URL=${_self.PUBLIC_URL}
NEXT_PUBLIC_API_URL=${backend.PUBLIC_URL}
NEXTAUTH_SECRET=your-random-secret-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
MONGODB_URI=your-mongodb-connection-string
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@carpricepredictor.com
```

**For Backend:**
```
DATABASE_URL=sqlite:///./carinsight.db
CORS_ORIGINS=${frontend.PUBLIC_URL}
VIN_DECODER_API_KEY=your-vin-api-key
```

#### **Step 4: Configure Build Settings**

**Frontend:**
- Build Command: `npm run build`
- Run Command: `npm start`
- Port: `3000`

**Backend:**
- Build Command: `pip install -r requirements.txt`
- Run Command: `uvicorn main:app --host 0.0.0.0 --port 8080`
- Port: `8080`

#### **Step 5: Add Database (Optional)**
1. In App Platform, go to "Database" tab
2. Add PostgreSQL database ($7/month for dev)
3. Update `DATABASE_URL` with the provided connection string

#### **Step 6: Deploy**
1. Review all settings
2. Click "Create Resources"
3. Wait 5-10 minutes for deployment
4. Monitor build logs

## 🔑 Required API Keys

You'll need to obtain these API keys:

### **Google OAuth** (Required for authentication)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized redirect URIs

### **Resend** (Required for email authentication)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from dashboard
3. Verify your sending domain

### **MongoDB** (Required for user sessions)
1. Create account at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get connection string

### **VIN Decoder** (Optional - has free tier)
1. Sign up at [vindecoder.eu](https://vindecoder.eu)
2. Get API key for enhanced VIN lookups

## 💰 Expected Costs

### **Minimal Setup:**
- Frontend: $5/month
- Backend: $12/month
- **Total: $17/month**

### **Recommended Setup:**
- Frontend: $5/month
- Backend: $12/month
- Database: $7/month
- **Total: $24/month**

## 🎯 Features Included

### **Core Services:**
- 💰 **Price Predictions** - Smart estimation algorithm
- 🔍 **VIN Lookup Service** - Decode vehicle information
- 📊 **User Dashboard** - Track usage and history
- 📈 **Market Analytics** - Automotive trends

### **Business Model:**
- **Free Tier**: 3 predictions + 1 VIN lookup/month
- **Pro Tier**: $9.99/month - 100 predictions + 50 VIN lookups
- **Enterprise**: $49.99/month - Unlimited + API access

### **Authentication:**
- Google OAuth one-click sign-in
- Email magic link authentication
- User session management
- Usage tracking and limits

## 🚨 Troubleshooting

### **Build Failures:**
- Check build logs in DigitalOcean console
- Verify all dependencies are listed
- Ensure Python/Node versions are compatible

### **Environment Variables:**
- Double-check variable names (case-sensitive)
- Ensure no trailing spaces
- Use ${service.PUBLIC_URL} for internal references

### **Database Issues:**
- Verify connection string format
- Check database credentials
- Ensure database is accessible

## ✅ Success Checklist

After deployment, verify:
- [ ] Frontend loads at your app URL
- [ ] Backend API responds at `/health`
- [ ] Google OAuth sign-in works
- [ ] Price predictions functional
- [ ] VIN lookup working (if API key provided)
- [ ] User dashboard accessible

## 🔄 Updates

- Push to `main` branch triggers auto-deployment
- Monitor deployment status in DigitalOcean console
- Rollback available if needed

## 🆘 Support

1. Check DigitalOcean build logs
2. Verify environment variables
3. Test API endpoints individually
4. Contact DigitalOcean support if needed

---

**🎉 Your CarInsight Pro platform will be live and ready for users!**

The platform is designed to scale from individual users to enterprise customers with a proven business model and professional-grade features.
