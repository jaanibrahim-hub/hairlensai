# ⚡ Quick Cloudflare Deployment Setup

## 🚀 Option 1: Automated Script (Recommended)

```bash
# Run the deployment script
./deploy.sh
```

This script will:
- ✅ Check prerequisites (Wrangler CLI)
- ✅ Create D1 database, R2 bucket, and KV namespace
- ✅ Deploy backend Worker
- ✅ Build and deploy frontend to Pages
- ✅ Provide you with live URLs

## 🔧 Option 2: Manual Step-by-Step

### 1. Authenticate with Cloudflare
```bash
npx wrangler login
```

### 2. Deploy Backend
```bash
cd backend
npm install

# Create infrastructure
npx wrangler d1 create hair-analysis-db
npx wrangler r2 bucket create hair-analysis-images
npx wrangler kv:namespace create SESSIONS

# Update backend/wrangler.toml with generated IDs
# Then deploy
npx wrangler d1 migrations apply hair-analysis-db
npx wrangler deploy
```

### 3. Deploy Frontend
```bash
cd ..
npm install
npm run build:production
npx wrangler pages deploy dist --project-name hair-analysis-ai
```

## 🎯 Live URLs After Deployment

- **Frontend**: `https://hair-analysis-ai.pages.dev`
- **Backend API**: `https://hair-analysis-backend.your-subdomain.workers.dev`

## 🔐 Environment Variables to Set

### Backend Worker Variables (Cloudflare Dashboard > Workers > Settings > Variables):
```
AI_ANALYSIS_API_KEY=your_ai_api_key
ENCRYPTION_KEY=32_character_encryption_key
JWT_SECRET=your_jwt_secret_key
```

### Frontend Pages Variables (Cloudflare Dashboard > Pages > Settings > Environment Variables):
```
VITE_API_BASE_URL=https://your-backend-worker-url.workers.dev
VITE_AI_ANALYSIS_API_KEY=your_frontend_api_key
VITE_IMAGE_UPLOAD_API_KEY=your_upload_api_key
```

## 🧪 Test Deployment

After deployment, test these endpoints:
- `https://your-pages-url.pages.dev` (Frontend)
- `https://your-worker-url.workers.dev` (Backend API health check)

## 🔄 Auto-Deploy with GitHub Actions

The repository includes GitHub Actions workflow (`.github/workflows/deploy-cloudflare.yml`) for automatic deployment on every push to main branch.

### Required GitHub Secrets:
```
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
VITE_API_BASE_URL=https://your-backend-url.workers.dev
VITE_AI_ANALYSIS_API_KEY=your_api_key
VITE_IMAGE_UPLOAD_API_KEY=your_upload_key
BACKEND_URL=https://your-backend-url.workers.dev
FRONTEND_URL=https://your-frontend-url.pages.dev
```

## 🆘 Quick Troubleshooting

**Authentication Issues:**
```bash
npx wrangler whoami
# If not logged in: npx wrangler login
```

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build:production
```

**Backend Issues:**
```bash
# Check deployment status
cd backend
npx wrangler deployments list
npx wrangler tail
```

---

🎉 **Your Hair Analysis AI is now ready for Cloudflare deployment!**