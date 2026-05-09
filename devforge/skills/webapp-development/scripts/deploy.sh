#!/bin/bash
# deploy.sh - Deploy webapp to various platforms

set -e

PLATFORM="${1:-help}"

echo "=========================================="
echo "  WebApp Deployment"
echo "=========================================="

case "$PLATFORM" in
    github-pages)
        echo "📦 Deploying to GitHub Pages..."
        
        # Check if git is initialized
        if [ ! -d ".git" ]; then
            echo "❌ Not a git repository. Run 'git init' first."
            exit 1
        fi
        
        # Check for remote
        if ! git remote get-url origin &>/dev/null; then
            echo "❌ No remote configured. Add with 'git remote add origin <url>'"
            exit 1
        fi
        
        echo "✅ GitHub Pages deployment ready"
        echo "   Push to main branch with GitHub Actions enabled"
        ;;
        
    netlify)
        echo "📦 Deploying to Netlify..."
        
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        netlify deploy --prod --dir=.
        ;;
        
    vercel)
        echo "📦 Deploying to Vercel..."
        
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        vercel --prod
        ;;
        
    cloudflare)
        echo "📦 Deploying to Cloudflare Pages..."
        
        if ! command -v wrangler &> /dev/null; then
            echo "Installing Wrangler CLI..."
            npm install -g wrangler
        fi
        
        wrangler pages deploy .
        ;;
        
    static)
        echo "📦 Creating static build..."
        
        # Create dist directory
        mkdir -p dist
        
        # Copy files
        cp index.html dist/
        cp styles.css dist/
        cp -r assets dist/ 2>/dev/null || true
        
        echo "✅ Static build created in ./dist"
        ;;
        
    help|*)
        echo ""
        echo "Usage: $0 [platform]"
        echo ""
        echo "Available platforms:"
        echo "  github-pages  - Deploy to GitHub Pages"
        echo "  netlify       - Deploy to Netlify"
        echo "  vercel        - Deploy to Vercel"
        echo "  cloudflare    - Deploy to Cloudflare Pages"
        echo "  static        - Create static build"
        echo ""
        echo "Examples:"
        echo "  $0 github-pages"
        echo "  $0 netlify"
        echo "  $0 vercel"
        echo ""
        ;;
esac

echo ""
echo "Done!"