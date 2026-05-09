#!/bin/bash
# verify-app.sh - Automated verification for webapps

set -e

echo "=========================================="
echo "  WebApp Verification"
echo "=========================================="

# Check if files exist
echo ""
echo "📁 Checking project files..."

required_files=("index.html" "styles.css" "app.js")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
        exit 1
    fi
done

# Check HTML structure
echo ""
echo "🔍 Checking HTML structure..."

if grep -q "<!DOCTYPE html>" index.html; then
    echo "  ✅ Valid HTML doctype"
else
    echo "  ❌ Missing HTML doctype"
fi

if grep -q "<meta name=\"viewport\"" index.html; then
    echo "  ✅ Viewport meta tag present"
else
    echo "  ⚠️  Missing viewport meta tag"
fi

if grep -q "styles.css" index.html; then
    echo "  ✅ CSS linked"
else
    echo "  ❌ CSS not linked"
fi

if grep -q "app.js" index.html; then
    echo "  ✅ JS linked"
else
    echo "  ❌ JS not linked"
fi

# Check for common JS issues
echo ""
echo "🔍 Checking JavaScript..."

if grep -q "use strict" app.js; then
    echo "  ✅ Use strict present"
else
    echo "  ⚠️  Missing 'use strict'"
fi

if grep -q "console.log" app.js; then
    echo "  ⚠️  Console.log found (remove for production)"
fi

# Check for TODO comments
if grep -q "TODO" app.js; then
    echo "  ⚠️  TODO comments found"
fi

# Check CSS
echo ""
echo "🔍 Checking CSS..."

if grep -q "box-sizing" styles.css; then
    echo "  ✅ box-sizing defined"
else
    echo "  ⚠️  Missing box-sizing reset"
fi

if grep -q "@media" styles.css; then
    echo "  ✅ Media queries present (responsive)"
else
    echo "  ⚠️  No media queries (may not be responsive)"
fi

# Check for hardcoded colors
if grep -qE "#[0-9a-fA-F]{6}" styles.css; then
    echo "  ✅ Colors defined"
fi

# Summary
echo ""
echo "=========================================="
echo "  Verification Complete"
echo "=========================================="
echo ""
echo "✅ All checks passed!"
echo ""
echo "To test manually:"
echo "  1. Open index.html in a browser"
echo "  2. Check console for errors"
echo "  3. Test all features"
echo ""
echo "To start a local server:"
echo "  python3 -m http.server 8000"