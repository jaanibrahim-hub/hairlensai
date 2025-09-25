#!/bin/bash

# 🚀 Hair Analysis AI - Cloudflare Deployment Script
set -e

echo "🎯 Hair Analysis AI - Cloudflare Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check if wrangler is installed
if ! command -v npx wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found. Installing...${NC}"
    npm install -g wrangler || npm install wrangler --save-dev
fi

# Check if user is authenticated
echo -e "${BLUE}🔐 Checking Wrangler authentication...${NC}"
if ! npx wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️ Not authenticated with Cloudflare. Please run:${NC}"
    echo "npx wrangler login"
    echo "Then run this script again."
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check complete${NC}"

# Deploy Backend Infrastructure
echo -e "\n${BLUE}🔧 Deploying Backend Infrastructure...${NC}"

cd backend

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
npm install

# Create D1 Database (if it doesn't exist)
echo -e "${BLUE}🗄️ Setting up D1 Database...${NC}"
if ! npx wrangler d1 info hair-analysis-db &> /dev/null; then
    echo -e "${YELLOW}Creating D1 database...${NC}"
    npx wrangler d1 create hair-analysis-db
    echo -e "${YELLOW}⚠️ Please update backend/wrangler.toml with the database ID shown above${NC}"
    read -p "Press Enter after updating wrangler.toml..."
fi

# Create R2 Bucket (if it doesn't exist)
echo -e "${BLUE}🪣 Setting up R2 Storage...${NC}"
if ! npx wrangler r2 bucket list | grep -q "hair-analysis-images"; then
    echo -e "${YELLOW}Creating R2 bucket...${NC}"
    npx wrangler r2 bucket create hair-analysis-images
fi

# Create KV Namespace (if it doesn't exist)
echo -e "${BLUE}🔑 Setting up KV Storage...${NC}"
if ! npx wrangler kv:namespace list | grep -q "SESSIONS"; then
    echo -e "${YELLOW}Creating KV namespace...${NC}"
    npx wrangler kv:namespace create SESSIONS
    echo -e "${YELLOW}⚠️ Please update backend/wrangler.toml with the namespace ID shown above${NC}"
    read -p "Press Enter after updating wrangler.toml..."
fi

# Run database migrations
echo -e "${BLUE}🚀 Running database migrations...${NC}"
npx wrangler d1 migrations apply hair-analysis-db

# Deploy backend worker
echo -e "${BLUE}🚀 Deploying backend worker...${NC}"
npx wrangler deploy

echo -e "${GREEN}✅ Backend deployment complete${NC}"

# Get the worker URL
WORKER_URL=$(npx wrangler deployments list --limit 1 --format json | jq -r '.[0].url' 2>/dev/null || echo "https://hair-analysis-backend.your-subdomain.workers.dev")
echo -e "${GREEN}🔧 Backend API URL: ${WORKER_URL}${NC}"

cd ..

# Deploy Frontend
echo -e "\n${BLUE}🌐 Deploying Frontend...${NC}"

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
npm install

# Update environment variables for production
echo -e "${BLUE}⚙️ Configuring environment variables...${NC}"
cat > .env.production << EOF
VITE_API_BASE_URL=${WORKER_URL}
VITE_AI_ANALYSIS_API_KEY=your_api_key_here
VITE_IMAGE_UPLOAD_API_KEY=your_upload_key_here
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_MAX_IMAGE_SIZE_MB=10
VITE_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
EOF

# Build frontend for production
echo -e "${BLUE}🏗️ Building frontend for production...${NC}"
npm run build:production

# Deploy to Cloudflare Pages
echo -e "${BLUE}🚀 Deploying to Cloudflare Pages...${NC}"
npx wrangler pages deploy dist --project-name hair-analysis-ai --compatibility-date=2024-09-25

# Get the pages URL
PAGES_URL="https://hair-analysis-ai.pages.dev"
echo -e "${GREEN}🌐 Frontend URL: ${PAGES_URL}${NC}"

# Final setup instructions
echo -e "\n${GREEN}🎉 Deployment Complete!${NC}"
echo "=========================================="
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Configure environment variables in Cloudflare Dashboard:"
echo "   - Workers > hair-analysis-backend > Settings > Variables"
echo "   - Pages > hair-analysis-ai > Settings > Environment Variables"
echo ""
echo "2. Set up custom domains (optional):"
echo "   - Add custom domain in Pages settings"
echo "   - Add custom domain in Workers settings"
echo ""
echo "3. Test your deployment:"
echo -e "   - Frontend: ${BLUE}${PAGES_URL}${NC}"
echo -e "   - Backend API: ${BLUE}${WORKER_URL}${NC}"
echo ""
echo -e "${GREEN}✅ Your Hair Analysis AI is now live on Cloudflare!${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: Save these URLs and update your DNS settings if using custom domains${NC}"