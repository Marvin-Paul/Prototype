@echo off
REM Campus Mindspace - Windows Deployment Script

echo 🚀 Campus Mindspace Deployment Script
echo ====================================

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo.
echo What would you like to do?
echo 1) Create deployment package
echo 2) Test locally
echo 3) Check performance
echo 4) Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto create_package
if "%choice%"=="2" goto test_local
if "%choice%"=="3" goto check_performance
if "%choice%"=="4" goto exit
goto invalid

:create_package
echo 📦 Creating deployment package...

REM Create deployment directory
if not exist "..\campus-mindspace-deploy" mkdir "..\campus-mindspace-deploy"

REM Copy all necessary files
xcopy /E /I css "..\campus-mindspace-deploy\css"
xcopy /E /I js "..\campus-mindspace-deploy\js"
xcopy /E /I data "..\campus-mindspace-deploy\data"
copy "index-production.html" "..\campus-mindspace-deploy\index.html"
copy ".htaccess" "..\campus-mindspace-deploy\"
copy "nginx.conf" "..\campus-mindspace-deploy\"
copy "package.json" "..\campus-mindspace-deploy\"
copy "site.webmanifest" "..\campus-mindspace-deploy\"
copy "DEPLOYMENT-GUIDE.md" "..\campus-mindspace-deploy\"

echo ✅ Deployment package created at: ..\campus-mindspace-deploy\
echo 📁 Ready for upload to your hosting provider
goto end

:test_local
echo 🧪 Starting local test server...

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 🐍 Starting Python HTTP server on port 8000...
    echo 🌐 Open http://localhost:8000 in your browser
    python -m http.server 8000
) else (
    echo ❌ Python not found. Please install Python to run local server.
    echo 💡 Alternative: Use Live Server extension in VS Code
)
goto end

:check_performance
echo 📊 Checking performance...

echo 📁 File sizes:
dir /s *.css *.js *.html

echo 🔍 Large files:
for /f "tokens=*" %%i in ('dir /s /b *.css *.js *.html ^| findstr /v ".git"') do (
    for /f "tokens=3" %%j in ('dir "%%i" ^| findstr "%%~nxi"') do (
        if %%j gtr 100000 (
            echo %%i - %%j bytes
        )
    )
)

echo ✅ Performance check complete!
goto end

:invalid
echo ❌ Invalid choice. Please run the script again.
goto end

:exit
echo 👋 Goodbye!
goto end

:end
pause
