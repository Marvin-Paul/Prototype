#!/bin/bash
# Campus Mindspace - Final Deployment Package Generator

echo "🚀 Campus Mindspace - Final Deployment Package Generator"
echo "========================================================"

# Configuration
PACKAGE_NAME="campus-mindspace-production"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE_DIR="../$PACKAGE_NAME-$TIMESTAMP"

echo "📦 Creating production deployment package..."
echo "Package name: $PACKAGE_NAME-$TIMESTAMP"
echo ""

# Create package directory
mkdir -p "$PACKAGE_DIR"

# Copy essential files
echo "📄 Copying essential files..."

# Core HTML files
cp index-production.html "$PACKAGE_DIR/index.html"
cp dashboard.html "$PACKAGE_DIR/" 2>/dev/null || echo "dashboard.html not found, skipping"
cp settings.html "$PACKAGE_DIR/" 2>/dev/null || echo "settings.html not found, skipping"
cp support.html "$PACKAGE_DIR/" 2>/dev/null || echo "support.html not found, skipping"
cp admin-login.html "$PACKAGE_DIR/" 2>/dev/null || echo "admin-login.html not found, skipping"
cp admin-dashboard.html "$PACKAGE_DIR/" 2>/dev/null || echo "admin-dashboard.html not found, skipping"

# CSS files
echo "🎨 Copying CSS files..."
cp -r css "$PACKAGE_DIR/"

# JavaScript files
echo "📜 Copying JavaScript files..."
cp -r js "$PACKAGE_DIR/"

# Data files
echo "📊 Copying data files..."
cp -r data "$PACKAGE_DIR/" 2>/dev/null || echo "data directory not found, skipping"

# Configuration files
echo "⚙️  Copying configuration files..."
cp .htaccess "$PACKAGE_DIR/" 2>/dev/null || echo ".htaccess not found, skipping"
cp nginx.conf "$PACKAGE_DIR/" 2>/dev/null || echo "nginx.conf not found, skipping"
cp package.json "$PACKAGE_DIR/"
cp site.webmanifest "$PACKAGE_DIR/"
cp robots.txt "$PACKAGE_DIR/"
cp sitemap.xml "$PACKAGE_DIR/"

# Documentation
echo "📚 Copying documentation..."
cp DEPLOYMENT-GUIDE.md "$PACKAGE_DIR/" 2>/dev/null || echo "DEPLOYMENT-GUIDE.md not found, skipping"
cp DOMAIN-SETUP.md "$PACKAGE_DIR/" 2>/dev/null || echo "DOMAIN-SETUP.md not found, skipping"
cp LAUNCH-STRATEGY.md "$PACKAGE_DIR/" 2>/dev/null || echo "LAUNCH-STRATEGY.md not found, skipping"
cp DEPLOYMENT-CHECKLIST.md "$PACKAGE_DIR/" 2>/dev/null || echo "DEPLOYMENT-CHECKLIST.md not found, skipping"

# Create deployment instructions
echo "📋 Creating deployment instructions..."
cat > "$PACKAGE_DIR/DEPLOYMENT-INSTRUCTIONS.md" << 'EOF'
# 🚀 Campus Mindspace - Deployment Instructions

## Quick Start

### Option 1: Netlify (Recommended - 5 minutes)
1. Go to [netlify.com](https://netlify.com)
2. Drag this entire folder to the deploy area
3. Your site is live! 🎉

### Option 2: GitHub Pages (10 minutes)
1. Create a new GitHub repository
2. Upload all files from this package
3. Go to Settings → Pages
4. Select "Deploy from a branch" → "main"
5. Your site is live! 🎉

### Option 3: VPS/Shared Hosting (30 minutes)
1. Upload all files to your web server
2. Configure your domain DNS
3. Set up SSL certificate
4. Your site is live! 🎉

## Important Files

- `index.html` - Main website file
- `css/` - All stylesheets
- `js/` - All JavaScript files
- `data/` - Application data
- `.htaccess` - Apache configuration
- `nginx.conf` - Nginx configuration
- `robots.txt` - SEO configuration
- `sitemap.xml` - Site structure
- `site.webmanifest` - PWA configuration

## Domain Setup

1. Run `update-domain.sh your-domain.com` to update all domain references
2. Configure DNS records (see DOMAIN-SETUP.md)
3. Set up SSL certificate
4. Test your website

## Post-Deployment

1. Test all functionality
2. Check performance metrics
3. Verify analytics tracking
4. Monitor for any issues

## Support

- Check DEPLOYMENT-GUIDE.md for detailed instructions
- Review LAUNCH-STRATEGY.md for launch planning
- Use DEPLOYMENT-CHECKLIST.md for verification

Good luck with your launch! 🎊
EOF

# Create package info
echo "📊 Creating package information..."
cat > "$PACKAGE_DIR/PACKAGE-INFO.txt" << EOF
Campus Mindspace - Production Deployment Package
Generated: $(date)
Package: $PACKAGE_NAME-$TIMESTAMP

Files included:
- HTML files: $(find "$PACKAGE_DIR" -name "*.html" | wc -l)
- CSS files: $(find "$PACKAGE_DIR" -name "*.css" | wc -l)
- JavaScript files: $(find "$PACKAGE_DIR" -name "*.js" | wc -l)
- Configuration files: $(find "$PACKAGE_DIR" -name "*.conf" -o -name ".htaccess" -o -name "*.json" -o -name "*.xml" -o -name "*.txt" | wc -l)

Total size: $(du -sh "$PACKAGE_DIR" | cut -f1)

Features:
✅ SEO Optimized
✅ Performance Optimized
✅ Analytics Ready
✅ Security Hardened
✅ Mobile Responsive
✅ PWA Ready
✅ Monitoring Enabled

Ready for deployment! 🚀
EOF

# Create zip file
echo "📦 Creating zip file..."
cd "$PACKAGE_DIR/.."
zip -r "$PACKAGE_NAME-$TIMESTAMP.zip" "$PACKAGE_NAME-$TIMESTAMP" -x "*.DS_Store" "*.git*" "node_modules/*"
cd - > /dev/null

# Generate deployment summary
echo ""
echo "🎉 Deployment package created successfully!"
echo "=========================================="
echo ""
echo "📁 Package location: $PACKAGE_DIR"
echo "📦 Zip file: $PACKAGE_DIR/../$PACKAGE_NAME-$TIMESTAMP.zip"
echo ""
echo "📊 Package contents:"
echo "  HTML files: $(find "$PACKAGE_DIR" -name "*.html" | wc -l)"
echo "  CSS files: $(find "$PACKAGE_DIR" -name "*.css" | wc -l)"
echo "  JavaScript files: $(find "$PACKAGE_DIR" -name "*.js" | wc -l)"
echo "  Configuration files: $(find "$PACKAGE_DIR" -name "*.conf" -o -name ".htaccess" -o -name "*.json" -o -name "*.xml" -o -name "*.txt" | wc -l)"
echo "  Total size: $(du -sh "$PACKAGE_DIR" | cut -f1)"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Choose your hosting provider"
echo "2. Upload the zip file or folder contents"
echo "3. Configure your domain"
echo "4. Set up SSL certificate"
echo "5. Test your website"
echo "6. Launch! 🎊"
echo ""
echo "📚 Documentation included:"
echo "  - DEPLOYMENT-INSTRUCTIONS.md (Quick start guide)"
echo "  - DEPLOYMENT-GUIDE.md (Detailed hosting guide)"
echo "  - DOMAIN-SETUP.md (Domain configuration)"
echo "  - LAUNCH-STRATEGY.md (Launch planning)"
echo "  - DEPLOYMENT-CHECKLIST.md (Verification checklist)"
echo ""
echo "🎯 Your Campus Mindspace is ready to help students worldwide! 🌍"
