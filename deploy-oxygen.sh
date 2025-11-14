#!/bin/bash
# Deploy script for Shopify Oxygen
# Run this from the Hydrogen-test directory

set -e

echo "🚀 Building Hydrogen app for Oxygen..."
npm run build

echo "📦 Deploying to Shopify Oxygen..."
npx shopify hydrogen deploy

echo "✅ Deployment complete!"
echo "Visit your Oxygen dashboard to view logs and manage domain settings."
