# 🚀 Hair Analysis AI - Cloudflare Deployment Guide

## 📋 Overview

This guide covers deploying the Hair Analysis AI application to Cloudflare Pages with a complete backend infrastructure including Cloudflare Workers, D1 Database, R2 Storage, and KV Store.

## 🏗 Architecture

```
Frontend (Cloudflare Pages)
    ↓ HTTPS/API Calls
Backend API (Cloudflare Workers)
    ├── D1 Database (Image metadata & analysis results)
    ├── R2 Storage (Encrypted image files)
    └── KV Store (User sessions & cache)
```

## 🛠 Prerequisites

1. **Cloudflare Account** with Pages and Workers enabled
2. **Node.js 18+** and **npm** installed
3. **Wrangler CLI** installed globally: `npm install -g wrangler`
4. **Git** access to the repository

## 📦 Step 1: Setup Backend Infrastructure

### 1.1 Install Backend Dependencies

```bash
cd backend
npm install
```

### 1.2 Authenticate Wrangler

```bash
wrangler login
```

### 1.3 Create Required Services

**Create D1 Database:**
```bash
wrangler d1 create hair-analysis-db
# Note the database ID from output
```

**Create R2 Storage Bucket:**
```bash
wrangler r2 bucket create hair-analysis-images
```

**Create KV Namespace:**
```bash
wrangler kv:namespace create SESSIONS
# Note the namespace ID from output
```

### 1.4 Update Configuration

Edit `backend/wrangler.toml` and add the actual IDs:

```toml
[[d1_databases]]
binding = "DB"
database_name = "hair-analysis-db"
database_id = "YOUR_D1_DATABASE_ID_HERE"

[[kv_namespaces]]
binding = "SESSIONS"
id = "YOUR_KV_NAMESPACE_ID_HERE"
```

### 1.5 Run Database Migrations

```bash
npm run migrate:up
```

### 1.6 Deploy Backend

```bash
npm run deploy
```

**Note the Worker URL** from deployment output (e.g., `https://hair-analysis-backend.your-subdomain.workers.dev`)

## 🌐 Step 2: Deploy Frontend

### 2.1 Update Environment Configuration

Edit `.env.production` with your backend Worker URL:

```env
VITE_API_BASE_URL=https://hair-analysis-backend.your-subdomain.workers.dev
```

### 2.2 Build for Production

```bash
cd ..  # Back to root directory
npm run build:production
```

### 2.3 Deploy to Cloudflare Pages

**Option A: Using Wrangler CLI**
```bash
wrangler pages deploy dist --project-name hair-analysis-ai
```

**Option B: Using Cloudflare Dashboard**
1. Go to Cloudflare Dashboard > Pages
2. Click "Create application"
3. Connect your Git repository
4. Set build command: `npm run build:production`
5. Set output directory: `dist`
6. Deploy

## 🔐 Step 3: Configure Environment Variables

### 3.1 Backend Worker Environment Variables

In Cloudflare Dashboard > Workers > your-backend-worker > Settings > Variables:

```
AI_ANALYSIS_API_KEY=your_ai_analysis_api_key_here
ENCRYPTION_KEY=your_32_character_encryption_key_here
JWT_SECRET=your_jwt_secret_for_sessions_here
```

### 3.2 Frontend Pages Environment Variables

In Cloudflare Dashboard > Pages > your-pages-project > Settings > Environment Variables:

**Production:**
```
VITE_API_BASE_URL=https://hair-analysis-backend.your-subdomain.workers.dev
VITE_AI_ANALYSIS_API_KEY=your_frontend_api_key_here
VITE_IMAGE_UPLOAD_API_KEY=your_upload_api_key_here
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
```

## 🔧 Step 4: Configure Custom Domain (Optional)

### 4.1 Frontend Domain

1. In Pages project settings, go to "Custom domains"
2. Add your domain (e.g., `hairanalysis.ai`)
3. Update DNS records as instructed

### 4.2 Backend API Domain

1. In Workers settings, go to "Triggers"
2. Add custom domain (e.g., `api.hairanalysis.ai`)
3. Update frontend `VITE_API_BASE_URL` to use custom domain

## 🧪 Step 5: Testing & Verification

### 5.1 Backend Health Check

Test backend deployment:
```bash
curl https://your-backend-worker.workers.dev/
```

Expected response:
```json
{
  "success": true,
  "message": "Hair Analysis AI Backend API",
  "version": "1.0.0"
}
```

### 5.2 Frontend Access

1. Visit your Pages URL
2. Test image upload functionality
3. Verify backend integration works
4. Check browser console for any errors

### 5.3 Database Verification

Check if tables were created:
```bash
wrangler d1 execute hair-analysis-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## 📊 Step 6: Monitoring & Maintenance

### 6.1 Cloudflare Analytics

- Monitor Pages analytics for frontend usage
- Check Workers analytics for backend performance
- Set up alerts for errors or performance issues

### 6.2 Database Maintenance

**Backup Database:**
```bash
wrangler d1 export hair-analysis-db --output backup.sql
```

**View Usage:**
```bash
wrangler d1 info hair-analysis-db
```

### 6.3 Storage Management

**Monitor R2 Usage:**
```bash
wrangler r2 object list hair-analysis-images
```

## 🔄 Step 7: Updates & Deployment Pipeline

### 7.1 Backend Updates

```bash
cd backend
# Make changes
npm run deploy
```

### 7.2 Frontend Updates

```bash
# Make changes
npm run build:production
wrangler pages deploy dist
```

### 7.3 Automated Deployment (Optional)

Set up GitHub Actions for automatic deployment:

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build:production
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name hair-analysis-ai
```

## 🚨 Troubleshooting

### Common Issues

**Backend Deploy Fails:**
- Check Wrangler authentication: `wrangler whoami`
- Verify database and KV IDs in wrangler.toml
- Check for syntax errors in TypeScript files

**Frontend Build Fails:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`
- Verify environment variables are set

**API Calls Fail:**
- Check CORS configuration in backend
- Verify API URLs in frontend environment variables
- Check browser network tab for specific errors

**Database Connection Issues:**
- Verify D1 database binding name matches code
- Check if migrations ran successfully
- Test with simple SQL query via Wrangler

### Performance Optimization

1. **Enable Cloudflare Caching:**
   - Configure cache rules for static assets
   - Set appropriate TTL for API responses

2. **Optimize Images:**
   - Use Cloudflare Image Optimization
   - Implement WebP conversion in R2

3. **Monitor Performance:**
   - Set up Web Analytics
   - Monitor Core Web Vitals
   - Use Real User Monitoring (RUM)

## 🔒 Security Checklist

- ✅ API keys stored in environment variables (not in code)
- ✅ HTTPS enforced for all communications  
- ✅ CORS properly configured
- ✅ Security headers implemented (_headers file)
- ✅ Input validation on all API endpoints
- ✅ File upload restrictions (size, type, virus scanning)
- ✅ Rate limiting implemented
- ✅ Session tokens properly secured

## 📞 Support

For deployment issues or questions:
1. Check Cloudflare documentation
2. Review application logs in Cloudflare Dashboard
3. Test individual components (DB, API, frontend) separately
4. Verify all environment variables are set correctly

---

**🎉 Congratulations!** Your Hair Analysis AI application is now deployed on Cloudflare with a complete backend infrastructure, ready for production use with scalable storage and secure API management.