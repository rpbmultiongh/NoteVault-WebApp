#!/bin/bash
# setup-project.sh - Creates initial webapp project structure

set -e

PROJECT_NAME="${1:-my-webapp}"
OUTPUT_DIR="$(pwd)/$PROJECT_NAME"

echo "=========================================="
echo "  Setting up webapp: $PROJECT_NAME"
echo "=========================================="

# Create project directory
mkdir -p "$OUTPUT_DIR"
cd "$OUTPUT_DIR"

echo "📁 Creating project structure..."

# Create HTML
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My WebApp</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Welcome to My WebApp</h1>
        <p>Start building your app here.</p>
    </div>
    <script src="app.js"></script>
</body>
</html>
EOF

# Create CSS
cat > styles.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f5f5;
    color: #333;
    line-height: 1.6;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
}
EOF

# Create JS
cat > app.js << 'EOF'
// Main application entry point
(function() {
    'use strict';
    
    console.log('App initialized');
    
    // Add your code here
    function init() {
        // Initialize app
    }
    
    init();
})();
EOF

# Create SPEC.md template
cat > SPEC.md << 'EOF'
# Project Specification

## Overview
- **Project Name:** PROJECT_NAME
- **Type:** Web Application
- **Core Functionality:** Describe what the app does

## UI/UX Specification

### Layout
- Main container: max-width 1200px, centered
- Responsive breakpoints: 768px, 1024px

### Visual Design
- **Colors:** 
  - Primary: #2c3e50
  - Secondary: #3498db
  - Background: #f5f5f5
- **Typography:** 
  - Headings: System fonts
  - Body: 16px base

### Components
- List components here

## Functionality

### Features
1. Feature 1 - Description
2. Feature 2 - Description

### Data Storage
- localStorage / IndexedDB

## Acceptance Criteria
- [ ] Feature 1 works
- [ ] Feature 2 works
- [ ] Responsive on mobile
EOF

# Replace placeholder in SPEC.md
sed -i "s/PROJECT_NAME/$PROJECT_NAME/g" SPEC.md

echo "✅ Project created at: $OUTPUT_DIR"
echo ""
echo "Files created:"
echo "  - index.html"
echo "  - styles.css"
echo "  - app.js"
echo "  - SPEC.md"
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_NAME"
echo "  2. Open index.html in browser to test"
echo "  3. Edit SPEC.md to define your requirements"