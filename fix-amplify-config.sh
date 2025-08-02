#!/bin/bash

echo "🔧 TestAce Amplify Configuration Fix"
echo "===================================="

echo ""
echo "Choose your deployment approach:"
echo "1) Simple approach (no monorepo env variable needed)"
echo "2) Monorepo approach (requires AMPLIFY_MONOREPO_APP_ROOT=testace-app)"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo "📝 Setting up simple approach..."
        cp amplify-simple.yml amplify.yml
        echo "✅ amplify.yml updated for simple approach"
        echo ""
        echo "⚠️  IMPORTANT: Remove AMPLIFY_MONOREPO_APP_ROOT from Amplify Console:"
        echo "   1. Go to your Amplify app → App settings → Environment variables"
        echo "   2. Delete AMPLIFY_MONOREPO_APP_ROOT if it exists"
        echo "   3. Save and redeploy"
        ;;
    2)
        echo "📝 Setting up monorepo approach..."
        cp amplify-monorepo.yml amplify.yml
        echo "✅ amplify.yml updated for monorepo approach"
        echo ""
        echo "⚠️  IMPORTANT: Set AMPLIFY_MONOREPO_APP_ROOT in Amplify Console:"
        echo "   1. Go to your Amplify app → App settings → Environment variables"
        echo "   2. Add: AMPLIFY_MONOREPO_APP_ROOT = testace-app"
        echo "   3. Save and redeploy"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again and choose 1 or 2."
        exit 1
        ;;
esac

echo ""
echo "📋 Current amplify.yml content:"
echo "==============================="
cat amplify.yml

echo ""
echo "🚀 Next steps:"
echo "1. Update environment variables in Amplify Console (see instructions above)"
echo "2. Commit and push changes: git add amplify.yml && git commit -m 'Fix Amplify config' && git push"
echo "3. Or trigger manual deployment in Amplify Console"

echo ""
echo "✅ Configuration fix complete!"
