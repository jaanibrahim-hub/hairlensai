#!/bin/bash

# Hair Analysis AI Backend Setup Script
echo "🚀 Setting up Hair Analysis AI Backend..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Check if wrangler is installed globally
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check Wrangler authentication
echo "🔐 Checking Wrangler authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "⚠️ Wrangler is not authenticated. Please run 'wrangler login' first."
else
    echo "✅ Wrangler is authenticated"
fi

echo "✅ Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'wrangler login' if not already authenticated"
echo "2. Create D1 database: wrangler d1 create hair-analysis-db"
echo "3. Create R2 bucket: wrangler r2 bucket create hair-analysis-images"
echo "4. Create KV namespace: wrangler kv:namespace create SESSIONS"
echo "5. Update wrangler.toml with actual database IDs"
echo "6. Run migrations: npm run migrate:up"
echo "7. Deploy: npm run deploy"