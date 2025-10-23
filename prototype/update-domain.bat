@echo off
REM Campus Mindspace - Windows Domain Update Script

echo 🌐 Campus Mindspace Domain Update Script
echo ======================================

if "%1"=="" (
    echo ❌ Error: Please provide your domain name
    echo Usage: update-domain.bat your-domain.com
    echo.
    echo Examples:
    echo   update-domain.bat campusmindspace.com
    echo   update-domain.bat my-site.netlify.app
    echo   update-domain.bat your-username.github.io
    pause
    exit /b 1
)

set DOMAIN=%1
echo 🎯 Updating all references to: %DOMAIN%
echo.

REM Create backup directory
if not exist "backups" mkdir "backups"

REM Backup original files
echo 💾 Creating backup of original files...
copy "index-production.html" "backups\index-production.html.backup" >nul
copy "sitemap.xml" "backups\sitemap.xml.backup" >nul
copy "robots.txt" "backups\robots.txt.backup" >nul
copy "site.webmanifest" "backups\site.webmanifest.backup" >nul
echo ✅ Backup created in backups\ directory

REM Update files using PowerShell
echo 📄 Updating HTML files...
powershell -command "(Get-Content 'index-production.html') -replace 'your-domain.com', '%DOMAIN%' | Set-Content 'index-production.html'"

echo 🗺️  Updating sitemap.xml...
powershell -command "(Get-Content 'sitemap.xml') -replace 'your-domain.com', '%DOMAIN%' | Set-Content 'sitemap.xml'"

echo 🤖 Updating robots.txt...
powershell -command "(Get-Content 'robots.txt') -replace 'your-domain.com', '%DOMAIN%' | Set-Content 'robots.txt'"

echo 📱 Updating site.webmanifest...
powershell -command "(Get-Content 'site.webmanifest') -replace 'your-domain.com', '%DOMAIN%' | Set-Content 'site.webmanifest'"

REM Create domain configuration
echo ⚙️  Creating domain-specific configuration...
(
echo {
echo   "domain": "%DOMAIN%",
echo   "updated_at": "%date% %time%",
echo   "ssl_enabled": true,
echo   "cdn_enabled": false,
echo   "analytics": {
echo     "google_analytics": {
echo       "enabled": false,
echo       "tracking_id": "GA_TRACKING_ID"
echo     },
echo     "google_tag_manager": {
echo       "enabled": false,
echo       "container_id": "GTM_CONTAINER_ID"
echo     },
echo     "hotjar": {
echo       "enabled": false,
echo       "site_id": "HOTJAR_SITE_ID"
echo     }
echo   },
echo   "performance": {
echo     "monitoring_enabled": true,
echo     "error_tracking_enabled": true
echo   }
echo }
) > domain-config.json

REM Create SSL configuration
echo 🔒 Generating SSL configuration...
(
echo # SSL Configuration for %DOMAIN%
echo.
echo ## Let's Encrypt Setup ^(if using VPS^)
echo sudo certbot --apache -d %DOMAIN% -d www.%DOMAIN%
echo.
echo ## Cloudflare Setup ^(recommended^)
echo 1. Add domain to Cloudflare
echo 2. Update nameservers to Cloudflare
echo 3. Enable SSL/TLS encryption mode: "Full ^(strict^)"
echo 4. Enable "Always Use HTTPS"
echo.
echo ## SSL Test Commands
echo curl -I https://%DOMAIN%
echo openssl s_client -connect %DOMAIN%:443 -servername %DOMAIN%
echo.
echo ## SSL Grade Check
echo https://www.ssllabs.com/ssltest/analyze.html?d=%DOMAIN%
) > ssl-config.txt

REM Create DNS configuration
echo 🌐 Generating DNS configuration...
(
echo # DNS Configuration for %DOMAIN%
echo.
echo ## For Netlify Hosting
echo Type: A
echo Name: @
echo Value: 75.2.60.5
echo.
echo Type: CNAME
echo Name: www
echo Value: your-site.netlify.app
echo.
echo ## For GitHub Pages
echo Type: CNAME
echo Name: www
echo Value: your-username.github.io
echo.
echo Type: A
echo Name: @
echo Value: 185.199.108.153
echo Value: 185.199.109.153
echo Value: 185.199.110.153
echo Value: 185.199.111.153
echo.
echo ## For VPS/Shared Hosting
echo Type: A
echo Name: @
echo Value: YOUR_SERVER_IP
echo.
echo Type: A
echo Name: www
echo Value: YOUR_SERVER_IP
) > dns-config.txt

echo.
echo 🎉 Domain update complete!
echo.
echo 📁 Generated files:
echo   - domain-config.json ^(domain configuration^)
echo   - ssl-config.txt ^(SSL setup instructions^)
echo   - dns-config.txt ^(DNS configuration^)
echo.
echo 🚀 Next steps:
echo   1. Review the generated configuration files
echo   2. Configure your DNS settings
echo   3. Set up SSL certificate
echo   4. Deploy your website
echo   5. Test all functionality
echo.
echo 📞 Need help? Check DEPLOYMENT-GUIDE.md for detailed instructions

pause
