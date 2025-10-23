#!/bin/bash
# Campus Mindspace - Quick Deployment Script

echo "🚀 Campus Mindspace Deployment Script"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to deploy to GitHub Pages
deploy_github() {
    echo "📦 Deploying to GitHub Pages..."
    
    # Check if git is initialized
    if [ ! -d ".git" ]; then
        echo "🔧 Initializing Git repository..."
        git init
        git branch -M main
    fi
    
    # Copy production files
    echo "📋 Preparing production files..."
    cp index-production.html index.html
    
    # Add all files
    git add .
    
    # Commit changes
    git commit -m "Deploy Campus Mindspace to production $(date)"
    
    # Push to GitHub
    echo "⬆️  Pushing to GitHub..."
    git push origin main
    
    echo "✅ Deployment complete!"
    echo "🌐 Your site will be available at: https://yourusername.github.io/campus-mindspace"
}

# Function to create deployment package
create_package() {
    echo "📦 Creating deployment package..."
    
    # Create deployment directory
    mkdir -p ../campus-mindspace-deploy
    
    # Copy all necessary files
    cp -r css ../campus-mindspace-deploy/
    cp -r js ../campus-mindspace-deploy/
    cp -r data ../campus-mindspace-deploy/
    cp index-production.html ../campus-mindspace-deploy/index.html
    cp .htaccess ../campus-mindspace-deploy/
    cp nginx.conf ../campus-mindspace-deploy/
    cp package.json ../campus-mindspace-deploy/
    cp site.webmanifest ../campus-mindspace-deploy/
    cp DEPLOYMENT-GUIDE.md ../campus-mindspace-deploy/
    
    # Create zip file
    cd ../campus-mindspace-deploy
    zip -r campus-mindspace-deploy.zip .
    cd ../prototype
    
    echo "✅ Deployment package created at: ../campus-mindspace-deploy/"
    echo "📁 Zip file: ../campus-mindspace-deploy/campus-mindspace-deploy.zip"
}

# Function to test locally
test_local() {
    echo "🧪 Starting local test server..."
    
    # Check if Python is available
    if command -v python3 &> /dev/null; then
        echo "🐍 Starting Python HTTP server on port 8000..."
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        echo "🐍 Starting Python HTTP server on port 8000..."
        python -m http.server 8000
    else
        echo "❌ Python not found. Please install Python to run local server."
        exit 1
    fi
}

# Function to check performance
check_performance() {
    echo "📊 Checking performance..."
    
    # Check file sizes
    echo "📁 File sizes:"
    find . -name "*.css" -o -name "*.js" -o -name "*.html" | xargs ls -lh
    
    # Check for large files
    echo "🔍 Large files (>100KB):"
    find . -type f -size +100k -not -path "./.git/*" | xargs ls -lh
    
    echo "✅ Performance check complete!"
}

# Main menu
echo ""
echo "What would you like to do?"
echo "1) Deploy to GitHub Pages"
echo "2) Create deployment package"
echo "3) Test locally"
echo "4) Check performance"
echo "5) Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        deploy_github
        ;;
    2)
        create_package
        ;;
    3)
        test_local
        ;;
    4)
        check_performance
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
