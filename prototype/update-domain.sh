#!/bin/bash
# Campus Mindspace - Automated Domain Update Script

echo "🌐 Campus Mindspace Domain Update Script"
echo "======================================"

# Check if domain is provided
if [ $# -eq 0 ]; then
    echo "❌ Error: Please provide your domain name"
    echo "Usage: ./update-domain.sh your-domain.com"
    echo ""
    echo "Examples:"
    echo "  ./update-domain.sh campusmindspace.com"
    echo "  ./update-domain.sh my-site.netlify.app"
    echo "  ./update-domain.sh your-username.github.io"
    exit 1
fi

DOMAIN="$1"
echo "🎯 Updating all references to: $DOMAIN"
echo ""

# Backup original files
echo "💾 Creating backup of original files..."
mkdir -p backups
cp index-production.html backups/index-production.html.backup
cp sitemap.xml backups/sitemap.xml.backup
cp robots.txt backups/robots.txt.backup
cp site.webmanifest backups/site.webmanifest.backup
echo "✅ Backup created in backups/ directory"

# Update HTML files
echo "📄 Updating HTML files..."
sed -i "s/your-domain.com/$DOMAIN/g" index-production.html
sed -i "s/your-domain.com/$DOMAIN/g" index.html 2>/dev/null || echo "index.html not found, skipping"

# Update sitemap
echo "🗺️  Updating sitemap.xml..."
sed -i "s/your-domain.com/$DOMAIN/g" sitemap.xml

# Update robots.txt
echo "🤖 Updating robots.txt..."
sed -i "s/your-domain.com/$DOMAIN/g" robots.txt

# Update web manifest
echo "📱 Updating site.webmanifest..."
sed -i "s/your-domain.com/$DOMAIN/g" site.webmanifest

# Update analytics configuration
echo "📊 Updating analytics configuration..."
if [ -f "js/analytics-manager.js" ]; then
    sed -i "s/GA_TRACKING_ID/GA_TRACKING_ID/g" js/analytics-manager.js
    sed -i "s/GTM_CONTAINER_ID/GTM_CONTAINER_ID/g" js/analytics-manager.js
    sed -i "s/HOTJAR_SITE_ID/HOTJAR_SITE_ID/g" js/analytics-manager.js
fi

# Create domain-specific configuration
echo "⚙️  Creating domain-specific configuration..."
cat > domain-config.json << EOF
{
  "domain": "$DOMAIN",
  "updated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "ssl_enabled": true,
  "cdn_enabled": false,
  "analytics": {
    "google_analytics": {
      "enabled": false,
      "tracking_id": "GA_TRACKING_ID"
    },
    "google_tag_manager": {
      "enabled": false,
      "container_id": "GTM_CONTAINER_ID"
    },
    "hotjar": {
      "enabled": false,
      "site_id": "HOTJAR_SITE_ID"
    }
  },
  "performance": {
    "monitoring_enabled": true,
    "error_tracking_enabled": true
  }
}
EOF

# Generate SSL configuration
echo "🔒 Generating SSL configuration..."
cat > ssl-config.txt << EOF
# SSL Configuration for $DOMAIN

## Let's Encrypt Setup (if using VPS)
sudo certbot --apache -d $DOMAIN -d www.$DOMAIN

## Cloudflare Setup (recommended)
1. Add domain to Cloudflare
2. Update nameservers to Cloudflare
3. Enable SSL/TLS encryption mode: "Full (strict)"
4. Enable "Always Use HTTPS"

## SSL Test Commands
curl -I https://$DOMAIN
openssl s_client -connect $DOMAIN:443 -servername $DOMAIN

## SSL Grade Check
https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN
EOF

# Generate DNS configuration
echo "🌐 Generating DNS configuration..."
cat > dns-config.txt << EOF
# DNS Configuration for $DOMAIN

## For Netlify Hosting
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app

## For GitHub Pages
Type: CNAME
Name: www
Value: your-username.github.io

Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153

## For VPS/Shared Hosting
Type: A
Name: @
Value: YOUR_SERVER_IP

Type: A
Name: www
Value: YOUR_SERVER_IP
EOF

# Generate deployment checklist
echo "📋 Generating deployment checklist..."
cat > deployment-checklist-$DOMAIN.md << EOF
# Deployment Checklist for $DOMAIN

## Pre-Deployment
- [ ] Domain registered: $DOMAIN
- [ ] DNS configured (see dns-config.txt)
- [ ] SSL certificate ready (see ssl-config.txt)
- [ ] All files updated with domain references
- [ ] Analytics tracking IDs configured

## Deployment Steps
- [ ] Upload all files to hosting provider
- [ ] Configure domain in hosting panel
- [ ] Set up SSL certificate
- [ ] Test website functionality
- [ ] Verify analytics tracking

## Post-Deployment
- [ ] Test all features
- [ ] Check performance metrics
- [ ] Verify SSL certificate
- [ ] Submit to search engines
- [ ] Set up monitoring alerts

## Testing URLs
- [ ] https://$DOMAIN
- [ ] https://www.$DOMAIN
- [ ] https://$DOMAIN/dashboard.html
- [ ] https://$DOMAIN/settings.html
- [ ] https://$DOMAIN/support.html

Generated: $(date)
EOF

# Verify changes
echo ""
echo "🔍 Verifying changes..."
echo "Updated files:"
grep -l "$DOMAIN" index-production.html sitemap.xml robots.txt site.webmanifest 2>/dev/null | while read file; do
    echo "  ✅ $file"
done

echo ""
echo "📊 Domain update summary:"
echo "  Domain: $DOMAIN"
echo "  Files updated: $(grep -l "$DOMAIN" index-production.html sitemap.xml robots.txt site.webmanifest 2>/dev/null | wc -l)"
echo "  Configuration files created: 4"
echo "  Backup created: backups/ directory"

echo ""
echo "🎉 Domain update complete!"
echo ""
echo "📁 Generated files:"
echo "  - domain-config.json (domain configuration)"
echo "  - ssl-config.txt (SSL setup instructions)"
echo "  - dns-config.txt (DNS configuration)"
echo "  - deployment-checklist-$DOMAIN.md (deployment checklist)"
echo ""
echo "🚀 Next steps:"
echo "  1. Review the generated configuration files"
echo "  2. Configure your DNS settings"
echo "  3. Set up SSL certificate"
echo "  4. Deploy your website"
echo "  5. Test all functionality"
echo ""
echo "📞 Need help? Check DEPLOYMENT-GUIDE.md for detailed instructions"
