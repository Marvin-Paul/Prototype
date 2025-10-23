@echo off
REM Campus Mindspace - Windows Final Deployment Package Generator

echo 🚀 Campus Mindspace - Final Deployment Package Generator
echo ========================================================

set PACKAGE_NAME=campus-mindspace-production
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "TIMESTAMP=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"
set "PACKAGE_DIR=..\%PACKAGE_NAME%-%TIMESTAMP%"

echo 📦 Creating production deployment package...
echo Package name: %PACKAGE_NAME%-%TIMESTAMP%
echo.

REM Create package directory
if not exist "%PACKAGE_DIR%" mkdir "%PACKAGE_DIR%"

echo 📄 Copying essential files...

REM Copy HTML files
copy "index-production.html" "%PACKAGE_DIR%\index.html" >nul
if exist "dashboard.html" copy "dashboard.html" "%PACKAGE_DIR%\" >nul
if exist "settings.html" copy "settings.html" "%PACKAGE_DIR%\" >nul
if exist "support.html" copy "support.html" "%PACKAGE_DIR%\" >nul
if exist "admin-login.html" copy "admin-login.html" "%PACKAGE_DIR%\" >nul
if exist "admin-dashboard.html" copy "admin-dashboard.html" "%PACKAGE_DIR%\" >nul

echo 🎨 Copying CSS files...
xcopy /E /I css "%PACKAGE_DIR%\css" >nul

echo 📜 Copying JavaScript files...
xcopy /E /I js "%PACKAGE_DIR%\js" >nul

echo 📊 Copying data files...
if exist "data" xcopy /E /I data "%PACKAGE_DIR%\data" >nul

echo ⚙️  Copying configuration files...
if exist ".htaccess" copy ".htaccess" "%PACKAGE_DIR%\" >nul
if exist "nginx.conf" copy "nginx.conf" "%PACKAGE_DIR%\" >nul
copy "package.json" "%PACKAGE_DIR%\" >nul
copy "site.webmanifest" "%PACKAGE_DIR%\" >nul
copy "robots.txt" "%PACKAGE_DIR%\" >nul
copy "sitemap.xml" "%PACKAGE_DIR%\" >nul

echo 📚 Copying documentation...
if exist "DEPLOYMENT-GUIDE.md" copy "DEPLOYMENT-GUIDE.md" "%PACKAGE_DIR%\" >nul
if exist "DOMAIN-SETUP.md" copy "DOMAIN-SETUP.md" "%PACKAGE_DIR%\" >nul
if exist "LAUNCH-STRATEGY.md" copy "LAUNCH-STRATEGY.md" "%PACKAGE_DIR%\" >nul
if exist "DEPLOYMENT-CHECKLIST.md" copy "DEPLOYMENT-CHECKLIST.md" "%PACKAGE_DIR%\" >nul

echo 📋 Creating deployment instructions...
(
echo # 🚀 Campus Mindspace - Deployment Instructions
echo.
echo ## Quick Start
echo.
echo ### Option 1: Netlify ^(Recommended - 5 minutes^)
echo 1. Go to [netlify.com](https://netlify.com^)
echo 2. Drag this entire folder to the deploy area
echo 3. Your site is live! 🎉
echo.
echo ### Option 2: GitHub Pages ^(10 minutes^)
echo 1. Create a new GitHub repository
echo 2. Upload all files from this package
echo 3. Go to Settings → Pages
echo 4. Select "Deploy from a branch" → "main"
echo 5. Your site is live! 🎉
echo.
echo ### Option 3: VPS/Shared Hosting ^(30 minutes^)
echo 1. Upload all files to your web server
echo 2. Configure your domain DNS
echo 3. Set up SSL certificate
echo 4. Your site is live! 🎉
echo.
echo ## Important Files
echo.
echo - `index.html` - Main website file
echo - `css/` - All stylesheets
echo - `js/` - All JavaScript files
echo - `data/` - Application data
echo - `.htaccess` - Apache configuration
echo - `nginx.conf` - Nginx configuration
echo - `robots.txt` - SEO configuration
echo - `sitemap.xml` - Site structure
echo - `site.webmanifest` - PWA configuration
echo.
echo ## Domain Setup
echo.
echo 1. Run `update-domain.bat your-domain.com` to update all domain references
echo 2. Configure DNS records ^(see DOMAIN-SETUP.md^)
echo 3. Set up SSL certificate
echo 4. Test your website
echo.
echo ## Post-Deployment
echo.
echo 1. Test all functionality
echo 2. Check performance metrics
echo 3. Verify analytics tracking
echo 4. Monitor for any issues
echo.
echo ## Support
echo.
echo - Check DEPLOYMENT-GUIDE.md for detailed instructions
echo - Review LAUNCH-STRATEGY.md for launch planning
echo - Use DEPLOYMENT-CHECKLIST.md for verification
echo.
echo Good luck with your launch! 🎊
) > "%PACKAGE_DIR%\DEPLOYMENT-INSTRUCTIONS.md"

echo 📊 Creating package information...
(
echo Campus Mindspace - Production Deployment Package
echo Generated: %date% %time%
echo Package: %PACKAGE_NAME%-%TIMESTAMP%
echo.
echo Features:
echo ✅ SEO Optimized
echo ✅ Performance Optimized
echo ✅ Analytics Ready
echo ✅ Security Hardened
echo ✅ Mobile Responsive
echo ✅ PWA Ready
echo ✅ Monitoring Enabled
echo.
echo Ready for deployment! 🚀
) > "%PACKAGE_DIR%\PACKAGE-INFO.txt"

echo 📦 Creating zip file...
cd "%PACKAGE_DIR%\.."
powershell -command "Compress-Archive -Path '%PACKAGE_NAME%-%TIMESTAMP%' -DestinationPath '%PACKAGE_NAME%-%TIMESTAMP%.zip' -Force"
cd - >nul

echo.
echo 🎉 Deployment package created successfully!
echo ==========================================
echo.
echo 📁 Package location: %PACKAGE_DIR%
echo 📦 Zip file: %PACKAGE_DIR%\..\%PACKAGE_NAME%-%TIMESTAMP%.zip
echo.
echo 🚀 Ready for deployment!
echo.
echo Next steps:
echo 1. Choose your hosting provider
echo 2. Upload the zip file or folder contents
echo 3. Configure your domain
echo 4. Set up SSL certificate
echo 5. Test your website
echo 6. Launch! 🎊
echo.
echo 📚 Documentation included:
echo   - DEPLOYMENT-INSTRUCTIONS.md ^(Quick start guide^)
echo   - DEPLOYMENT-GUIDE.md ^(Detailed hosting guide^)
echo   - DOMAIN-SETUP.md ^(Domain configuration^)
echo   - LAUNCH-STRATEGY.md ^(Launch planning^)
echo   - DEPLOYMENT-CHECKLIST.md ^(Verification checklist^)
echo.
echo 🎯 Your Campus Mindspace is ready to help students worldwide! 🌍

pause
